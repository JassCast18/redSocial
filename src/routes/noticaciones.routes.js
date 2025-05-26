import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificacion.controller.js";
import { authRequire } from '../middlewares/valideToken.js';

const router = Router();

// Obtener notificaciones del usuario autenticado
router.get("/notificaciones", authRequire, getNotifications);

// Marcar una notificación como leída
router.patch("/notificaciones/:id/read", authRequire, markAsRead);

// Marcar todas como leídas
router.patch("/notificaciones/read-all", authRequire, markAllAsRead);

// Eliminar una notificación
router.delete("/notificaciones/:id", authRequire, deleteNotification);

export default router;