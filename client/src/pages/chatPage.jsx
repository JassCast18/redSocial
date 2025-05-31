import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import socket from "../socket";
import { userAuth } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";

const ChatPage = () => {
  const { user } = userAuth();
  const { otherUserId } = useParams();
  const [chat, setChat] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (user) socket.emit("join", user._id);
  }, [user]);

  // Obtener o crear chat entre user y otherUserId
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`/chat/${otherUserId}`);
        setChat(res.data);
      } catch {
        setChat(null);
      }
      setLoading(false);
    };
    fetchChat();
  }, [otherUserId]);

  useEffect(() => {
    const handleNuevoMensaje = ({ chatId, mensaje: msg }) => {
      if (chat && chat._id === chatId) {
        setChat((prev) => ({
          ...prev,
          mensajes: [...prev.mensajes, msg]
        }));
      }
    };
    socket.on("nuevo-mensaje", handleNuevoMensaje);
    return () => socket.off("nuevo-mensaje", handleNuevoMensaje);
  }, [chat]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.mensajes]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    await axios.post(`/chat/${chat._id}/mensajes`, { contenido: mensaje });
    setMensaje("");
  };

  if (loading) return <div className="p-8 text-center">Cargando chat...</div>;
  if (!chat) return <div className="p-8 text-center text-red-500">No se encontró el chat.</div>;

  // El otro usuario en el chat
  const otro = chat.participantes.find(u => u._id !== user._id);

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow mt-6">
      <div className="flex items-center mb-4">
        <Link to="/mensajes" className="mr-3 text-blue-600 hover:underline">&larr; Volver</Link>
        <img
          src={otro.imagenPerfil || "/img/default-profile.png"}
          alt={otro.username}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <span className="font-semibold text-lg">{otro.username}</span>
      </div>
      <div className="h-80 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {chat.mensajes.map((m, idx) => (
          <div
            key={m._id || idx}
            className={`mb-2 flex ${m.usuario_id._id === user._id ? "justify-end" : "justify-start"}`}>
            <div className={`px-3 py-2 rounded-lg ${m.usuario_id._id === user._id ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              <span className="block text-xs">{m.usuario_id.username}</span>
              <span>{m.contenido}</span>
            </div>
          </div>
        ))}
        <div ref={chatBottomRef}></div>
      </div>
      <form onSubmit={handleEnviar} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 bg-white text-black"
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatPage;