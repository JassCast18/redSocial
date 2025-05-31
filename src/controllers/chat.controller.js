import Chat from '../models/chat.model.js';
import { io } from '../index.js'; // Asegúrate de exportar io en index.js

// Obtener el chat entre 2 usuarios (o crearlo si no existe)
export const getOrCreateChat = async (req, res) => {
  const { userId } = req.user;
  const { otherUserId } = req.params;
  let chat = await Chat.findOne({
    participantes: { $all: [userId, otherUserId], $size: 2 }
  }).populate('participantes', 'username imagenPerfil')
    .populate('mensajes.usuario_id', 'username imagenPerfil');

  if (!chat) {
    chat = await Chat.create({ participantes: [userId, otherUserId], mensajes: [] });
    chat = await Chat.findById(chat._id)
      .populate('participantes', 'username imagenPerfil');
  }
  res.json(chat);
};

// Enviar mensaje (REST endpoint)
export const sendMessage = async (req, res) => {
  const { userId } = req.user;
  const { chatId } = req.params;
  const { contenido } = req.body;

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
};

export const getMyChats = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    // Busca todos los chats donde el usuario participa
    const chats = await Chat.find({
      participantes: userId
    })
      .populate("participantes", "username imagenPerfil")
      .populate("mensajes.usuario_id", "username imagenPerfil")
      .sort({ ultima_actividad: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los chats", error: err.message });
  }
};