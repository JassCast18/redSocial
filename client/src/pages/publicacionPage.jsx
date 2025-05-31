import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { userAuth } from "../context/AuthContext";

const PublicacionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = userAuth();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  // NUEVO ESTADO PARA COMENTARIOS
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [loadingComentarios, setLoadingComentarios] = useState(true);

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

  // Cargar comentarios
  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await axios.get(`/publicaciones/${id}/comentarios`);
        setComentarios(res.data);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
      setLoadingComentarios(false);
    };
    fetchComentarios();
  }, [id]);

  // Handler para crear un nuevo comentario
  const handleComentar = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    try {
      const res = await axios.post(
        `/publicaciones/${id}/comentarios`,
        { contenido: nuevoComentario }
      );
      setComentarios([res.data, ...comentarios]);
      setNuevoComentario("");
    } catch (error) {
      alert("No se pudo publicar el comentario");
    }
  };

  // Likes igual que antes...
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

      {/* Mostrar datos de la publicación */}
      <div className="mb-4">
        <div className="flex items-center mb-3">
          <img
            src={pub.user?.imagenPerfil || "/img/default-profile.png"}
            alt="Perfil"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold text-black">{pub.user?.username}</p>
            <p className="text-xs text-gray-400">
              {pub.createdAt ? new Date(pub.createdAt).toLocaleString() : "Sin fecha"}
            </p>
          </div>
        </div>
        {pub.titulo && (
          <h2 className="text-xl font-bold mb-2 text-black">{pub.titulo}</h2>
        )}
        {pub.contenido && (
          <p className="mb-4 text-gray-800">{pub.contenido}</p>
        )}
        {pub.multimedia?.length > 0 && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
      </div>

      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-sm font-medium ${
          yaDioLike ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        {yaDioLike ? <FaHeart /> : <FaRegHeart />}
        {likes.length}
      </button>
      
      {/* SECCIÓN DE COMENTARIOS */}
      <section className="mt-8">
        <h4 className="text-lg font-semibold mb-2 text-blue-600">Comentarios</h4>
        <form onSubmit={handleComentar} className="mb-4 flex gap-2">
          <input
  type="text"
  className="flex-1 border rounded px-2 py-1 bg-white text-black placeholder-gray-400"
  value={nuevoComentario}
  placeholder="Escribe un comentario..."
  onChange={e => setNuevoComentario(e.target.value)}
/>
          <button
            type="submit"
            className="bg-blue-500 text-black px-3 py-1 rounded hover:bg-blue-600"
          >
            Comentar
          </button>
        </form>
        {loadingComentarios ? (
          <div>Cargando comentarios...</div>
        ) : comentarios.length === 0 ? (
          <div className="text-blue-600">No hay comentarios todavía.</div>
        ) : (
          <ul>
            {comentarios.map(com => (
              <li key={com._id} className="mb-3 border-b pb-2">
                <div className="flex items-center mb-1">
                  <img
                    src={com.user.imagenPerfil || "/img/default-profile.png"}
                    alt="Perfil"
                    className="w-7 h-7 rounded-full object-cover mr-2"
                  />
                  <span className="font-semibold text-blue-900">{com.user.username}</span>
                  <span className="ml-2 text-xs text-blue-600">
                    {new Date(com.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="ml-9 text-blue-900">{com.contenido}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PublicacionPage;