import { dbController } from "./dbController.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    }
    
    generateToken(username) {
        const payload = { username };
        const secretKey = process.env.JWT_SECRET_KEY || this.seckret_key; // ключ для подписи токенов
        const options = { expiresIn: '1h' }; // срок действия токена (в данном случае 1 час)
      
        return jwt.sign(payload, secretKey, options);
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
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token === "null")
            return res.status(200).send({ message: "Только чтение, ты не авторизован", isItYou: false });
    
        try {
            const decoded = jwt.verify(token, this.seckret_key);
            if (decoded.username === user) {
                return res.status(200).send({ message: "Это ты тот самый", isItYou: true});
            }
            return res.status(200).send({ message: "Ты не тот самый, смотри", isItYou: false});
        } catch (error) {
            return res.status(403).send({ error: 'Invalid or expired token' });
        }
    };
}