import { useEffect, useState } from "react";
import axios from "../api/axios"; // Usa tu instancia configurada
import { useParams, Link } from "react-router-dom";
import { userAuth } from "../context/AuthContext";

const ProfilePage = () => {
    const { id } = useParams(); // Si usas /profile/:id, si no omítelo
    const { user: currentUser } = userAuth(); // Tu usuario logueado (del context)
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Si tienes perfil propio: /api/profile
                // Si es por ID: /api/users/:id
                const endpoint = id ? `/users/${id}` : "/profile";
                const res = await axios.get(endpoint, {
                    withCredentials: true
                });
                setUser(res.data);
            } catch (err) {
                setUser(null);
                console.error(err);
            }
        };
        fetchProfile();
    }, [id]);

    if (!user) return <div className="p-8 text-center">Cargando perfil...</div>;

    // Si visitas tu propio perfil, currentUser._id === user._id
    const isOwnProfile = currentUser && user._id === currentUser._id;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
                <img
                    src={user.imagenPerfil || "/img/default-profile.png"}
                    alt="Imagen de perfil"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                />
                <h2 className="text-2xl font-semibold text-blue-900">{user.username}</h2>
                <p className="text-blue-900">{user.email}</p>
                {!isOwnProfile && (
                    <Link
                        to={`/chat/${user._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-blue-900 px-3 py-1 rounded mt-3"
                    >
                        Enviar mensaje
                    </Link>
                )}
            </div>

         <div className="mt-6 border-t pt-4 rounded-lg text-black">
  <h3 className="text-xl font-bold mb-2 text-blue-900">Información Personal</h3>
  <p><strong>Nombre:</strong> {user.infoPersonal?.nombre || "-"} {user.infoPersonal?.apellido || ""}</p>
  <p><strong>Fecha de nacimiento:</strong> 
    {user.infoPersonal?.fechaNacimiento 
      ? new Date(user.infoPersonal.fechaNacimiento).toLocaleDateString()
      : "-"}
  </p>
  <p><strong>Sexo:</strong> {user.infoPersonal?.sexo || "-"}</p>
  <p><strong>Dirección:</strong> {user.infoPersonal?.direccion || "-"}</p>
</div>

<div className="mt-4 text-black">
  <p><strong>Seguidores:</strong> {user.seguidores?.length ?? 0}</p>
  <p><strong>Seguidos:</strong> {user.seguidos?.length ?? 0}</p>
</div>

<div className="mt-4 text-sm text-gray-400">
  <p>Creado: {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</p>
  <p>Última actualización: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}</p>
</div>
        </div>
    );
};

export default ProfilePage;