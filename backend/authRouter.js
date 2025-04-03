import { Router } from "express";
import { Controller } from "./authController.js";
export const routerAuth = new Router();
export const routerUser = new Router();
const controller = new Controller();

routerAuth.post("/registration", controller.registration)
routerAuth.post("/login", controller.login)

routerUser.get("/:user", controller.getUser)
