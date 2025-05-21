import { useForm } from 'react-hook-form';
import { userAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudinary } from '../context/cloudinary';

function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: RegisterErrors } = userAuth();
    const navigation = useNavigate();
    const { image, loading, uploadImage } = useCloudinary();

    useEffect(() => {
        if (isAuthenticated) navigation('/feed');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        const userData = {
            username: values.username,
            email: values.email,
            password: values.password,
            infoPersonal: {
                nombre: values.nombre,
                apellido: values.apellido,
                fechaNacimiento: values.fechaNacimiento,
            },
            imagenPerfil: image,
        };
        signup(userData);
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Crea tu cuenta</h2>

                {RegisterErrors.length > 0 && (
                    <div className="mb-4">
                        {RegisterErrors.map((error, i) => (
                            <p className="bg-red-100 text-red-600 p-2 rounded-md text-sm mb-2" key={i}>
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="text"
                        {...register("username", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Username"
                    />
                    {errors.username && <p className="text-red-500 text-sm">Username es requerido</p>}

                    <input
                        type="email"
                        {...register("email", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">Email es requerido</p>}

                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Contraseña"
                    />
                    {errors.password && <p className="text-red-500 text-sm">Contraseña es requerida</p>}

                    <input
                        type="text"
                        {...register("nombre", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Nombre"
                    />
                    {errors.nombre && <p className="text-red-500 text-sm">Nombre es requerido</p>}

                    <input
                        type="text"
                        {...register("apellido", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Apellido"
                    />
                    {errors.apellido && <p className="text-red-500 text-sm">Apellido es requerido</p>}

                    <input
                        type="date"
                        {...register("fechaNacimiento", { required: true })}
                        className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.fechaNacimiento && <p className="text-red-500 text-sm">Fecha de nacimiento requerida</p>}

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Imagen de perfil (opcional)</label>
                        <input
                            type="file"
                            onChange={uploadImage}
                            className="w-full bg-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                        />
                        {loading && <p className="text-blue-600 mt-2 text-sm">Subiendo imagen...</p>}
                        {image && (
                            <img
                                src={image}
                                alt="Uploaded"
                                className="w-24 h-24 rounded-full mt-4 object-cover border-2 border-purple-500"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white font-semibold py-2 rounded-md hover:bg-purple-700 transition duration-200"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
