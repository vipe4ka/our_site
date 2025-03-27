import express from "express";
import { router } from "./authRouter.js";
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", router);

const start = () => {
    try {
        // TODO: Конектимся к базе..
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (e) {
        console.log(e);
    }
};
start();
