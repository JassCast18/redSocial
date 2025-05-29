// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";

const homePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white px-4">
            <div className="bg-white text-gray-900 p-8 rounded-3xl shadow-xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                
                <div className="space-y-6">
                    <h1 className="text-4xl font-bold">Bienvenido a <span className="text-blue-600">RedSocial</span></h1>
                    <p className="text-lg">
                        Conéctate con amigos, comparte tus pensamientos y mantente al día con lo que importa.
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>

                <div className="hidden md:block">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png"
                        alt="Social Media"
                        className="w-full max-w-sm mx-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default homePage;
