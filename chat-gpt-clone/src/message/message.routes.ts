import { Router } from "express";
import { sendMessage } from "./message.controllers.js";
import { requiredAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/send/:convId").post(requiredAuth, sendMessage)

export default router;