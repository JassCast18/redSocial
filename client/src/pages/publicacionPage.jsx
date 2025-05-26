import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { userAuth } from "../context/AuthContext";

const publicacionPage = () => {
  const { id } = useParams(); // toma el ID de la URL
  const navigate = useNavigate();
  const { user } = userAuth();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const res = await axios.get(`/publicaciones/${id}`);
        setPub(res.data);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
      setLoading(false);
    };
    fetchPublicacion();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.post(`/publicaciones/${id}/like`);
      const res = await axios.get(`/publicaciones/${id}`);
      setPub(res.data);
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando publicación...</div>;
  if (!pub) return <div className="p-8 text-center text-red-500">Publicación no encontrada.</div>;

  const likes = pub.metricas?.likes || [];
  const yaDioLike = likes.some(
    (like) =>
      like === user._id ||
      (typeof like === "object" && (like._id === user._id || like._id?.toString() === user._id))
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <button
        className="mb-4 text-blue-500 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
      <div className="flex items-center mb-3">
        <img
          src={pub.user.imagenPerfil || "/img/default-profile.png"}
          alt="Perfil"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <div>
          <p className="font-semibold text-black">{pub.user.username}</p>
          <p className="text-xs text-gray-400">
            {pub.createdAt ? new Date(pub.createdAt).toLocaleString() : "Sin fecha"}
          </p>
        </div>
      </div>

      {pub.titulo && <h3 className="text-lg font-bold mb-1 text-black">{pub.titulo}</h3>}
      {pub.contenido && <p className="text-gray-700 mb-3">{pub.contenido}</p>}

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

      {pub.hashtags?.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm text-blue-600 mb-2">
          {pub.hashtags.map((tag, idx) => (
            <span key={idx} className="hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-sm font-medium ${
          yaDioLike ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        {yaDioLike ? <FaHeart /> : <FaRegHeart />}
        {likes.length}
      </button>
    </div>
  );
};

export default publicacionPage;