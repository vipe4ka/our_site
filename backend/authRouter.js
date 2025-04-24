import { Router } from "express";
import { Controller } from "./authController.js";
import { dbController } from "./dbController.js";
export const routerAuth = new Router();
export const routerUser = new Router();
const controller = new Controller();

// Ловим исключение и отправляем их дальше
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Проверяем имя
const checkUsername = (fn) => async (req, res, next) => {
    try {
        const { user } = req.params;
        const isExistsName = await dbController.uniqueNickname(user);
        
        if (!isExistsName) {
            return res.status(400).json({ message: "Такого пользователя нет" });
        }
        
        // Вызываем следующий middleware/обработчик
        return fn(req, res, next);
    } catch (err) {
        next(err);
    }
};

routerAuth.post("/registration", catchAsync(controller.registration))
routerAuth.post("/login", catchAsync(controller.login))

routerUser.get("/getUsers", catchAsync(controller.getUsers))
routerUser.get("/:user", checkUsername(controller.getUser))
routerUser.post("/:user/loadFile", checkUsername(controller.loadFile))
routerUser.delete("/:user/deleteFile", checkUsername(controller.deleteFile))
routerUser.put("/:user/changeFileVisibility", checkUsername(controller.changeFileVisibility))
routerUser.post("/:user/downloadFile", checkUsername(controller.downloadFile))
