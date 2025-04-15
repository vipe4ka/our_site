import express from "express";
import fileUpload from "express-fileupload";
import { routerAuth, routerUser } from "./authRouter.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 5000;//8000

app.use(express.json());
// Настройка CORS
app.use(cors({
    origin: "http://localhost:3000", // Домен, с которого разрешен доступ
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
    allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
    credentials: true // Разрешает передачу куки и авторизационных данных
}));
app.use(fileUpload());
app.use("/auth", routerAuth);
app.use("/user", routerUser);
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ error: "Ошибка базы данных" });
});

const start = async () => {
    try {
        console.log("Подключение к базе данных успешно!");
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
