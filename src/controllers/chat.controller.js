import mongoose from "mongoose";
import Chat from '../models/chat.model.js';
import { io } from '../index.js'; // Asegúrate de exportar io en index.js

// Obtener el chat entre 2 usuarios (o crearlo si no existe)
export const getOrCreateChat = async (req, res) => {
  try {
    const userId = String(req.user._id || req.user.id);
    const otherUserId = String(req.params.otherUserId);

    console.log("userId:", userId, "otherUserId:", otherUserId);

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (userId === otherUserId) {
      return res.status(400).json({ message: "No puedes chatear contigo mismo" });
    }

    // Busca chat existente
    let chat = await Chat.findOne({
      participantes: { $all: [userId, otherUserId], $size: 2 }
    });

    if (!chat) {
      // Crea el chat con dos participantes correctos
      chat = await Chat.create({
        participantes: [userId, otherUserId],
        mensajes: []
      });
    }

    chat = await chat.populate("participantes", "username imagenPerfil");

    res.json(chat);
  } catch (err) {
    console.error("Error en getOrCreateChat:", err);
    res.status(500).json({ message: "Error al obtener o crear chat", error: err.message });
  }
};
// Enviar mensaje (REST endpoint)
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { chatId } = req.params;
    const { contenido } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat no encontrado" });

    const mensaje = { usuario_id: userId, contenido };
    chat.mensajes.push(mensaje);
    chat.ultima_actividad = Date.now();
    await chat.save();

    // Populate el último mensaje para enviar info completa
    const fullMsg = await Chat.findById(chatId)
      .populate('mensajes.usuario_id', 'username imagenPerfil')
      .then(c => c.mensajes[c.mensajes.length - 1]);

    // Emitir evento en tiempo real a ambos usuarios
    chat.participantes.forEach(part => {
      io.to(part.toString()).emit('nuevo-mensaje', {
        chatId: chat._id,
        mensaje: fullMsg,
      });
    });

    res.json(fullMsg);
  } catch (err) {
    console.error("Error en sendMessage:", err);
    res.status(500).json({ message: "Error al enviar el mensaje", error: err.message });
  }
};

// Obtener todos los chats de un usuario
export const getMyChats = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    // Busca todos los chats donde el usuario participa
    const chats = await Chat.find({
      participantes: userId
    })
      .populate("participantes", "username imagenPerfil")
      .populate("mensajes.usuario_id", "username imagenPerfil")
      .sort({ ultima_actividad: -1 });

    res.json(chats);
  } catch (err) {
    console.error("Error en getMyChats:", err);
    res.status(500).json({ message: "Error al obtener los chats", error: err.message });
  }
};