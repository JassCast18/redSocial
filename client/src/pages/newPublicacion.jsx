
// src/pages/NewPublicacion.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const newPublicacion = () => {
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [privacidad, setPrivacidad] = useState("publico");
    const [imagen, setImagen] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = async () => {
        if (!imagen) return "";

        const formData = new FormData();
        formData.append("file", imagen);
        formData.append("upload_preset", "tu_preset"); // tu upload preset de Cloudinary

        const res = await axios.post("https://api.cloudinary.com/v1_1/tu_usuario/image/upload", formData);
        return res.data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const imageUrl = await handleImageUpload();

            const response = await axios.post(
                "/api/publicaciones",
                {
                    titulo,
                    contenido,
                    multimedia: imageUrl ? [imageUrl] : [],
                    hashtags: hashtags.split(",").map(tag => tag.trim()),
                    menciones: [], // puedes agregar lógica para esto
                    privacidad
                },
                {
                    withCredentials: true
                }
            );

            console.log("Publicación creada:", response.data);
            navigate("/");
        } catch (error) {
            console.error("Error al crear publicación:", error.response?.data || error.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Crear Publicación</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Título (opcional)"
                    className="w-full p-2 border rounded"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                    placeholder="¿Qué estás pensando?"
                    className="w-full p-2 border rounded resize-none h-28"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Hashtags separados por coma (ej: #programación,#js)"
                    className="w-full p-2 border rounded"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                />

                <div>
                    <label className="block mb-1">Imagen (opcional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                    />
                </div>

                <div>
                    <label className="block mb-1">Privacidad:</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={privacidad}
                        onChange={(e) => setPrivacidad(e.target.value)}
                    >
                        <option value="publico">Público</option>
                        <option value="soloAmigos">Solo amigos</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Publicar
                </button>
            </form>
        </div>
    );
};

export default newPublicacion;
