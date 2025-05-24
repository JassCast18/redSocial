// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { userAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = userAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/feed">RedSocial</Link>
      </div>

      <div className="flex gap-4 items-center">
        <Link to="/notificaciones" className="hover:underline">🔔</Link>
        <Link to="/mensajes" className="hover:underline">💬</Link>
        <Link to="/profile" className="hover:underline">👤 {user?.username}</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
