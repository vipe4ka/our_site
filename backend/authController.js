import { dbController } from "./dbController.js";

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

        // Добавляем пользователя в базу
        await dbController.addNewUser(username, email, password);
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
        const token = Math.random() * 10000;
        this.tokenMap.set(username, token);
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