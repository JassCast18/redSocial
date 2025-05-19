import { useForm } from 'react-hook-form';
import { userAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudinary } from '../context/cloudinary';

function RegisterPage() {

    const { register, handleSubmit, formState: {
        errors
    } } = useForm();
    const { signup, isAuthenticated } = userAuth();
    const navigation = useNavigate();
    const { image, loading, uploadImage } = useCloudinary();

    useEffect(() => {
        if (isAuthenticated) navigation('/profile');
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
         imagenPerfil: image, // opcional
    };
    signup(userData);
});


    return (
        <div className="bg-zinc-800 max-w-md p-10 roudend-md">
            <form onSubmit={onSubmit}>
                <input type="text"
                    {...register("username", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='username'
                />
                <input type="email"
                    {...register("email", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='email'
                />
                <input type="password"
                    {...register("password", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='password'
                />
                <input type="text"
                    {...register("nombre", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='nombre'
                />
                <input type="text"
                    {...register("apellido", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='apellido'
                />
                <input type="date"
                    {...register("fechaNacimiento", { required: true })}
                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                    placeholder='fechaNacimiento'
                />
                <div>
                    <input type="file" onChange={uploadImage} />

                    {loading && <p>Loading...</p>}
                    {image && <img src={image} alt="Uploaded" style={{ width: '200px' }} />}
                </div>

                <button type="submit">
                    Register
                </button>
            </form>


        </div>
    )
}

export default RegisterPage