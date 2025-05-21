// src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const profilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/api/profile", {
                    withCredentials: true // si usas cookies para el JWT
                });
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    if (!user) return <div>Cargando perfil...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
                <img
                    src={user.imagenPerfil}
                    alt="Imagen de perfil"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-4"
                />
                <h2 className="text-2xl font-semibold">{user.username}</h2>
                <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-bold mb-2">Información Personal</h3>
                <p><strong>Nombre:</strong> {user.infoPersonal?.nombre} {user.infoPersonal?.apellido}</p>
                <p><strong>Fecha de nacimiento:</strong> {new Date(user.infoPersonal?.fechaNacimiento).toLocaleDateString()}</p>
                <p><strong>Sexo:</strong> {user.infoPersonal?.sexo}</p>
                <p><strong>Dirección:</strong> {user.infoPersonal?.direccion}</p>
            </div>

            <div className="mt-4">
                <p><strong>Seguidores:</strong> {user.seguidores}</p>
                <p><strong>Seguidos:</strong> {user.seguidos}</p>
            </div>

            <div className="mt-4 text-sm text-gray-400">
                <p>Creado: {new Date(user.createdAt).toLocaleString()}</p>
                <p>Última actualización: {new Date(user.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default profilePage;
