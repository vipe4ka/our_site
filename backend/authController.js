import { dbController } from "./dbController.js";
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
    }
    
    generateToken(username) {
        const payload = { username };
        const secretKey = process.env.JWT_SECRET_KEY || this.seckret_key; // ключ для подписи токенов
        const options = { expiresIn: '1h' }; // срок действия токена (в данном случае 1 час)
      
        return jwt.sign(payload, secretKey, options);
    }

    checkToken(authHeader, user) {
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token === "null")
            return null;
        try {
            const decoded = jwt.verify(token, this.seckret_key);
            if (decoded.username === user) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
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
        // Ищем есть ли пользователь с таким логином
        const isExistsName = await dbController.uniqueNickname(user);
        if (!isExistsName) {
            return res.status(400).json({message: "Такого пользователя нет"});
        }
        const authHeader = req.headers["authorization"];
        
        const authResult = this.checkToken(authHeader, user);
    
        if (authResult === null) {
            const files = await dbController.getUserFiles(user, true);
            return res.status(200).send({ message: "Только чтение, ты не авторизован", isItYou: false, files});
        } 
        if (authResult) {
            const files = await dbController.getUserFiles(user, true);
            return res.status(200).send({ message: "Это ты тот самый", isItYou: true, files});
        }
        const files = await dbController.getUserFiles(user, true);
        return res.status(200).send({ message: "Ты не тот самый, смотри", isItYou: false, files});
    };

    // Загружаем файл пользователя
    async loadFile(req, res) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
        const { user } = req.params;
        // Ищем есть ли пользователь с таким логином
        const isExistsName = await dbController.uniqueNickname(user);
        if (!isExistsName) {
            return res.status(400).json({message: "Такого пользователя нет"});
        }
        const authHeader = req.headers["authorization"];
        const result = this.checkToken(authHeader, user);
    
        if (result === null) {
            return res.status(400).send({ message: "Нет токена" });
        }
        if (!result) {
            return res.status(400).send({ message: "Это не ты тот самый"});
        }
    
        // Получаем файл из поля 'file'
        const file = req.files.file;
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
        const pathToMoveFile = path.join(userPath, `${file.name}`);
        file.mv(pathToMoveFile, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            await dbController.addNewFileToUser(file.name, user);
            return res.status(200).send({ message: "Ты ты тот самый, молодец. Файл загружен"});
        });
    };

    // Возвращаем список всех пользователей
    async getUsers(req, res) {
        const users = await dbController.getAllUsernames();
        return res.status(200).send({ users: users.map(user => user.nickname)});
    };
}