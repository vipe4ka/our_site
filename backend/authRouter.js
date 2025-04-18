import { Router } from "express";
import { Controller } from "./authController.js";
export const routerAuth = new Router();
export const routerUser = new Router();
const controller = new Controller();

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

routerAuth.post("/registration", catchAsync(controller.registration))
routerAuth.post("/login", catchAsync(controller.login))

routerUser.get("/getUsers", catchAsync(controller.getUsers))
routerUser.get("/:user", catchAsync(controller.getUser))
routerUser.post("/:user/loadFile", catchAsync(controller.loadFile))
routerUser.delete("/:user/deleteFile", catchAsync(controller.deleteFile))
routerUser.put("/:user/changeFileVisibility", catchAsync(controller.changeFileVisibility))
