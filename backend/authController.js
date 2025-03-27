export class AuthController {
    
    tokenMap = new Map();

    async registration(req, res) {
        const {username, password} = req.body;
        // TODO: Ищем есть ли такой пользователь в базе
        const candidate = false;//findUser(username)
        if (candidate) {
            return res.status(400).json({message: "Пользователь с таким именем уже существует"});
        }
        // TODO: Добавляем пользователя в базу
        return res.json({message: "Пользователь зарегистрирован"});
    }

    async login(req, res) {
        const {username, password} = req.body;
        // TODO: Ищем есть ли такой пользователь в базе
        const candidate = {password: true};//findUser(username)
        if (candidate && password !== candidate.password && false) {
            return res.status(400).json({message: "Неверный логин или пароль"});
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
        if (this.tokenMap.get(username) !== Number(token)) {
            return res.status(400).json({message: "Неверный токен"});
        }
        res.json({"ee":"ТОКЕН"});
    }

}