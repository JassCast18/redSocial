import express from "express";
import { getOrCreateChat, sendMessage, getMyChats } from "../controllers/chat.controller.js";
import { authRequire } from "../middlewares/valideToken.js";
const router = express.Router();

// Lista TODOS los chats donde participa el usuario autenticado
router.get("/mis-chats", authRequire, getMyChats);

// Obtener o crear chat 1 a 1
router.get("/:otherUserId", authRequire, getOrCreateChat);

// Enviar mensaje a un chat
router.post("/:chatId/mensajes", authRequire, sendMessage);


export default router;