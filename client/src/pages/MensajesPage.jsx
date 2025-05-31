import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { userAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import socket from "../socket";

const MensajesPage = () => {
  const { user } = userAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) socket.emit("join", user._id);
  }, [user]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("/chat/mis-chats");
        setChats(res.data);
      } catch (err) {
        setChats([]);
      }
      setLoading(false);
    };
    fetchChats();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando chats...</div>;
  if (!chats.length) return <div className="p-8 text-center text-gray-500">No tienes chats aún.</div>;

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-white text-gray-500 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Tus Chats</h2>
      <ul>
        {chats.map(chat => {
          const otro = chat.participantes.find(u => u._id !== user._id);
          const ultimoMsg = chat.mensajes.length
            ? chat.mensajes[chat.mensajes.length - 1]
            : null;
          return (
            <li key={chat._id} className="mb-4 border-b pb-3 flex items-center">
              {/* El enlace va a /chat/:otherUserId */}
              <Link to={`/chat/${otro._id}`} className="flex items-center w-full hover:bg-blue-50 rounded px-2 py-1">
                <img
                  src={otro.imagenPerfil || "/img/default-profile.png"}
                  alt={otro.username}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold">{otro.username}</div>
                  <div className="text-xs text-gray-500 truncate max-w-xs">
                    {ultimoMsg
                      ? (ultimoMsg.usuario_id === user._id ? "Tú: " : "")
                        + ultimoMsg.contenido
                      : "Sin mensajes aún"}
                  </div>
                </div>
                {ultimoMsg && (
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(ultimoMsg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MensajesPage;