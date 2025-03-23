import express from "express";
import path from "path";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 5000;

// API маршрут для проверки пароля
app.post('/api/check-password', (req, res) => {
    // Логика проверки пароля
    if (req.body.password) {
        res.status(200).send({ success: true });
    }
    else {
        res.status(401).send({ success: false });
    }
});
// Для всех остальных маршрутов возвращаем
app.get('*', (req, res) => {
    res.send('Hello World!');
});
// Обработка маршрута '/'
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const start = () => {
    try {
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
