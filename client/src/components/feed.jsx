import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { userAuth } from "../context/AuthContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import socket from "../socket"; // <--- Importa tu instancia de socket.io-client

const Feed = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const { user } = userAuth();

  // Cargar publicaciones iniciales
  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const res = await axios.get("/publicaciones");
        setPublicaciones(res.data);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      }
    };

    fetchPublicaciones();
  }, []);

  // Socket.IO: escuchar publicaciones nuevas en tiempo real
  useEffect(() => {
    const onNuevaPublicacion = (newPub) => {
      setPublicaciones((prev) => [newPub, ...prev]);
    };

    socket.on("nueva-publicacion", onNuevaPublicacion);

    // Limpieza
    return () => socket.off("nueva-publicacion", onNuevaPublicacion);
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.post(`/publicaciones/${id}/like`);
      // Recargar publicaciones (opcional: puedes hacerlo más eficiente)
      const res = await axios.get("/publicaciones");
      setPublicaciones(res.data);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 px-4">
      {publicaciones.length === 0 && (
        <p className="text-center text-gray-500">No hay publicaciones disponibles.</p>
      )}

      {publicaciones.map((pub) => {
        const yaDioLike = pub.likes?.includes(user._id);

        return (
          <div
            key={pub._id}
            className="bg-white shadow-md rounded-2xl p-4 mb-6 border border-gray-200"
          >
            {/* Header con imagen y nombre del usuario */}
            <div className="flex items-center mb-3">
              <img
                src={pub.user.imagenPerfil || "/img/default-profile.png"}
                alt="Perfil"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-semibold text-black">{pub.user.username}</p>
                <p className="text-xs text-gray-400">
                  {new Date(pub.fechaCreacion).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Título y contenido */}
            {pub.titulo && <h3 className="text-lg font-bold mb-1 text-black">{pub.titulo}</h3>}
            {pub.contenido && <p className="text-gray-700 mb-3">{pub.contenido}</p>}

            {/* Multimedia */}
            {pub.multimedia?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {pub.multimedia.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`media-${idx}`}
                    className="w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}

            {/* Hashtags */}
            {pub.hashtags?.length > 0 && (
              <div className="flex flex-wrap gap-2 text-sm text-blue-600 mb-2">
                {pub.hashtags.map((tag, idx) => (
                  <span key={idx} className="hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Botón de Like */}
            <button
              onClick={() => handleLike(pub._id)}
              className={`flex items-center gap-1 text-sm font-medium ${
                yaDioLike ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              {yaDioLike ? <FaHeart /> : <FaRegHeart />}
              {pub.likes?.length || 0}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Feed;