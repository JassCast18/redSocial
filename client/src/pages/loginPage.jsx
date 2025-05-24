import { useForm } from 'react-hook-form';
import { userAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, isAuthenticated, errors: loginErrors } = userAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/feed');
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (data) => {
    login(data);
  });

  return (
    <div className="bg-zinc-800 max-w-md p-10 mx-auto rounded-lg shadow-lg mt-10">
      <h2 className="text-white text-3xl font-bold mb-6 text-center">Iniciar Sesión</h2>

      {loginErrors.map((error, i) => (
        <div className="bg-red-500 text-white p-2 rounded mb-2 text-center" key={i}>
          {error}
        </div>
      ))}

      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Correo electrónico"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md placeholder-gray-400"
        />
        {errors.email && <p className="text-red-400 text-sm">Email es obligatorio</p>}

        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Contraseña"
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md placeholder-gray-400"
        />
        {errors.password && <p className="text-red-400 text-sm">Contraseña es obligatoria</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
