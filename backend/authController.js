import { dbController } from "./dbController.js";
import bcrypt from "bcrypt";

// Количество раундов соления
const saltRounds = 10;

// Хэшируем пароль
async function hashPassword(password) {
    //const salt = await bcrypt.genSalt(saltRounds); генерируемая соль
    const fixedSalt = "$2b$10$nO.MCzIxejS/BjWqpnN5ou"; //фикисрованная соль
    const hashedPassword = await bcrypt.hash(password, fixedSalt);
    return hashedPassword;
}

export class AuthController {
    tokenMap = new Map();
    dbConnection = null;

    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    // Регистрация
    async registration(req, res) {
        const {email, password, username} = req.body;
        // Ищем есть ли пользователь с такой почтой
        const findUser = await dbController.userExistsByEmail(email);
        if (findUser !== 0) {
            return res.status(400).json({message: "Данная почта уже занята"});
        }

        // Ищем есть ли пользователь с таким логином
        const isNotUniqueName = await dbController.uniqueNickname(username);
        if (isNotUniqueName) {
            return res.status(400).json({message: "Логин занят"});
        }

        // Хэш-пароль
        const hashedPassword = await hashPassword(password);
        // Добавляем пользователя в базу
        await dbController.addNewUser(username, email, hashedPassword);
        return res.json({message: "Пользователь зарегистрирован"});
    }

    // Вход
    async login(req, res) {
        const {email, password} = req.body;
        // Ищем есть ли пользователь с такой почтой
        const findUser = await dbController.userExistsByEmail(email);
        if (findUser === 0) {
            return res.status(400).json({message: "Неверная почта или пароль"});
        }
        // Хэш-пароль
        const hashedPassword = await hashPassword(password);
        const result = await dbController.authenticateUser(email, hashedPassword);
        if (result === 0) {
            return res.status(400).json({message: "Неверная почта или пароль"});
        }

        const token = Math.random() * 10000;
        return res.json({
            message: "Вход успешный",
            token
        });
    }

    async getUser(req, res) {
        const {username, token} = req.body;
        //if (this.tokenMap.get(username) !== Number(token)) {
            //return res.status(400).json({message: "Неверный токен"});
        //}
        res.json({"ee":"ТОКЕН"});
    }

}