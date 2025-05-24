import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useCloudinary } from "../context/cloudinary"; // Asegúrate de que esta ruta es correcta

function CreatePostForm({ onPostCreated }) {
  const [form, setForm] = useState({
    titulo: "",
    contenido: "",
    multimedia: [],
    hashtags: "",
    menciones: [],
    privacidad: "publico",
  });

  const { image, loading, uploadImage } = useCloudinary();

  // Actualizar el campo multimedia cuando la imagen de Cloudinary se suba exitosamente
  useEffect(() => {
    if (image) {
      setForm(prev => ({
        ...prev,
        multimedia: [...prev.multimedia, image]
      }));
    }
  }, [image]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");

      const response = await axios.post("http://localhost:4000/api/publicaciones", {
        ...form,
        hashtags: form.hashtags.split(",").map(tag => tag.trim()),
        //menciones: form.menciones.split(",").map(m => m.trim()),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });

      alert("Publicación creada exitosamente");

      setForm({
        titulo: "",
        contenido: "",
        multimedia: [],
        hashtags: "",
        menciones: [],
        privacidad: "publico",
      });

      onPostCreated && onPostCreated(response.data);
    } catch (err) {
      alert("Error al crear publicación");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <input
        type="text"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="w-full p-2 border mb-2 rounded bg-white text-black"
      />

      <textarea
        name="contenido"
        value={form.contenido}
        onChange={handleChange}
        placeholder="¿Qué estás pensando?"
        className="w-full p-2 border mb-2 rounded bg-white text-black"
      />

      <input
        type="file"
        onChange={uploadImage}
        className="w-full p-2 border mb-2 rounded bg-white text-black"
        accept="image/*"
      />

      {loading && <p className="text-gray-500">Subiendo imagen...</p>}

      {form.multimedia.length > 0 && (
        <div className="mb-2">
          <p className="text-sm text-gray-700">Previsualización:</p>
          {form.multimedia.map((url, idx) => (
            <img key={idx} src={url} alt={`Imagen ${idx}`} className="max-w-full h-auto rounded mb-1" />
          ))}
        </div>
      )}

      <input
        type="text"
        name="hashtags"
        value={form.hashtags}
        onChange={handleChange}
        placeholder="#hashtags (separados por comas)"
        className="w-full p-2 border mb-2 rounded bg-white text-black"
      />

      <input
        type="text"
        name="menciones"
        value={form.menciones}
        onChange={handleChange}
        placeholder="@menciones (separados por comas)"
        className="w-full p-2 border mb-2 rounded bg-white text-black"
      />

      <select
        name="privacidad"
        value={form.privacidad}
        onChange={handleChange}
        className="w-full p-2 border mb-2 rounded bg-white text-black"
      >
        <option value="publico">Público</option>
        <option value="privado">Privado</option>
      </select>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        Publicar
      </button>
    </form>
  );
}

export default CreatePostForm;
