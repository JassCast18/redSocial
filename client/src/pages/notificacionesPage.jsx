import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const NotificacionesPage = () => {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get("/notificaciones");
        if (res.data.success) {
          setNotificaciones(res.data.data.notificaciones);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString();

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">🔔 Notificaciones</h1>

      {notificaciones.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {notificaciones.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-lg border shadow-sm ${
                notif.visto ? "bg-white" : "bg-blue-50"
              } hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={notif.usuario_origen_id.imagenPerfil || "/default.jpg"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-800">{notif.mensaje}</p>

                  {notif.publicacion_id && (
                    <Link
                      to={`/publicacion/${notif.publicacion_id._id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Ver publicación: {notif.publicacion_id.titulo}
                    </Link>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    {formatearFecha(notif.fecha)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificacionesPage;
