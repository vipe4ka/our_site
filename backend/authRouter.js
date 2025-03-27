import { Router } from "express";
import { AuthController } from "./authController.js";
export const router = new Router();
const controller = new AuthController();

router.post("/registration", controller.registration)
router.post("/login", controller.login)
router.get("/users", controller.getUser)