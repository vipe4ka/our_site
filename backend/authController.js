import { dbController } from "./dbController.js";
import archiver from "archiver";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получение текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Количество раундов соления
const saltRounds = 10;

// Хэшируем пароль
async function hashPassword(password) {
    // Генерируемая соль
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export class Controller {
    tokenMap = new Map();
    dbConnection = null;
    seckret_key = "your_secret_key";

    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        // Привязываем контекст this к методу login
        this.login = this.login.bind(this);
        this.getUser = this.getUser.bind(this);
        this.registration = this.registration.bind(this);
        this.loadFile = this.loadFile.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.changeFileVisibility = this.changeFileVisibility.bind(this);
        this.downloadFile = this.downloadFile.bind(this);
    }
    
    generateToken(username) {
        const payload = { username };
        const secretKey = process.env.JWT_SECRET_KEY || this.seckret_key; // ключ для подписи токенов
        const options = { expiresIn: '1h' }; // срок действия токена (в данном случае 1 час)
      
        return jwt.sign(payload, secretKey, options);
    }

    checkToken(authHeader, user) {
        if(!authHeader)
            return null;
        const token = authHeader && authHeader.split(' ')[1];
        if (token === "null")
            return null;
        
        try {
            const decoded = jwt.verify(token, this.seckret_key);
            if (decoded.username === user) {
                return {result: true};
            }
            return {result: false};
        } catch (error) {
            return {result: false, error};
        }
    }

    // Регистрация
    async registration(req, res) {
        const {email, password, username} = req.body;
        // Ищем есть ли пользователь с такой почтой
        const findUser = await dbController.userByEmail(email);
        if (findUser) {
            return res.status(400).json({message: "Данная почта уже занята"});
        }

        // Ищем есть ли пользователь с таким логином
        const isNotUniqueName = await dbController.uniqueNickname(username);
        if (isNotUniqueName) {
            return res.status(400).json({message: "Логин занят"});
        }

        // Генерируем JWT-токен
        const token = this.generateToken(username);

        // Хэш-пароль
        const hashedPassword = await hashPassword(password);
        // Добавляем пользователя в базу
        await dbController.addNewUser(username, email, hashedPassword);

        return res.json({message: "Пользователь зарегистрирован", token});
    }

    // Вход
    async login(req, res) {
        const {email, password} = req.body;
        // Ищем есть ли пользователь с такой почтой
        const user = await dbController.userByEmail(email);
        if (!user) {
            return res.status(400).json({message: "Неверная почта или пароль"});
        }
        // Хэш-пароль
        const hashPassword = await dbController.authenticateUser(email);
        const isValid = await bcrypt.compare(password, hashPassword);
        if (!isValid) {
            return res.status(400).json({message: "Неверная почта или пароль"});
        }

        // Генерируем JWT-токен
        const token = this.generateToken(user);
        return res.json({
            message: "Вход успешный",
            user,
            token
        });
    }

    // Даем определенный доступ к странице пользователя
    async getUser(req, res) {
        const { user } = req.params;
        const authHeader = req.headers["authorization"];
        
        const authResult = this.checkToken(authHeader, user);
    
        if (authResult === null) {
            const files = await dbController.getUserFiles(user);
            return res.status(200).send({ message: "Только чтение, ты не авторизован", isItYou: false, files});
        } 
        if (authResult.result) {
            const files = await dbController.getUserFiles(user, true);
            return res.status(200).send({ message: "Это ты тот самый", isItYou: true, files});
        }
        const files = await dbController.getUserFiles(user);
        if (authResult.error) {
            return res.status(500).send({ error: authResult.error});    
        }
        return res.status(200).send({ message: "Ты не тот самый, смотри", isItYou: false, files});
    };

    async checkUserToWorkWithFile(req, res, fileOperation) {
        const { user } = req.params;
        const authHeader = req.headers["authorization"];
        const result = this.checkToken(authHeader, user);
    
        if (result === null) {
            return res.status(401).send({ message: "Нет токена" });
        }
        if (!result) {
            return res.status(403).send({ message: "Это не ты тот самый"});
        }

        return fileOperation(user);
    }
    
    // Загружаем файл пользователя
    async loadFile(req, res) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        const fileLoadFunc = (user) => {
            // Получаем файл из поля 'file'
            const file = req.files.file;
            const fixedName = Buffer.from(file.name, 'binary').toString('utf8')
            // Каталог пользователя
            const userPath = path.join(__dirname, `uploads/${user}`);
            if (!fs.existsSync(userPath)) {
                try {
                    fs.mkdirSync(userPath);
                    console.log("Каталог успешно создан.");
                } catch (err) {
                    console.error("Ошибка при создании каталога:", err);
                    return res.status(500).send(err);
                }
            }
            // Сохраняем файл в директорию 'uploads'
            const pathToMoveFile = path.join(userPath, `${fixedName}`);
            file.mv(pathToMoveFile, async (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                await dbController.addNewFileToUser(fixedName, user);
                return res.status(200).send({ message: "Ты ты тот самый, молодец. Файл загружен"});
            });
        }
        return this.checkUserToWorkWithFile(req, res, fileLoadFunc);
    };

    // Загружаем файл пользователя
    async deleteFile(req, res) {
        const fileDeleteFunc = () => {
            // Получаем id файла
            const fileId = req.query.fileId;
            const file_name = dbController.deleteFileFromUser(fileId);            
            // Удаляем файл по имени...
            return res.status(200).send({ message: "Файл удален"});
        }
        return this.checkUserToWorkWithFile(req, res, fileDeleteFunc);
    }

    // Меняем видимость файла пользователя
    async changeFileVisibility(req, res) {
        const fileChangeVisibilityFunc = async () => {
            // Получаем id файла
            const fileId = req.query.fileId;
            const newVisibilityStatus = req.query.newVisibilityStatus;
            await dbController.changeFileVisibility(fileId, newVisibilityStatus);            
            return res.status(200).send({ message: "У файла изменена видимость"});
        }
        return this.checkUserToWorkWithFile(req, res, fileChangeVisibilityFunc);
    }

    // Возвращаем список всех пользователей
    async getUsers(req, res) {
        const users = await dbController.getAllUsernamesWithFilecounts();
        return res.status(200).send({ users });
    };

    // Отправляем файл на скачивание
    async downloadFile(req, res, next) {    
        const { user } = req.params;
        const authResult = this.checkToken(req.headers?.authorization, user);
        const withInvisible = authResult?.result ?? false;
        // Получаем id файлов
        let fileIdes = JSON.parse(req.body.fileIdes);
        fileIdes = Array.isArray(fileIdes) ? fileIdes : 
        fileIdes ? [fileIdes] : [];
        if (!fileIdes.length) {
            return res.status(400).json({ message: "Не указаны ID файлов" });
        }
        
        const filenames = await dbController.getUserFiles(user, withInvisible, fileIdes);
        if (!filenames.length) {
            return res.status(404).json({ message: "Файлы не найдены" });
        }

        // Проверяем существование файлов
        const filePaths = filenames.map(fileRow => {
            const filePath = path.join(__dirname, 'uploads', user, fileRow.file_name);
            return { path: filePath, name: fileRow.original_name || fileRow.file_name };
        });

        // Если один файл - скачиваем его
        if (filePaths.length === 1) {
            return res.download(filePaths[0].path, filePaths[0].name);
        }

        // Если несколько файлов - создаём ZIP-архив
        const archive = archiver('zip');

        res.attachment('files.zip');
        archive.pipe(res);

        filePaths.forEach(file => {
            archive.file(file.path, { name: file.name });
        });

        await archive.finalize();
    }
}