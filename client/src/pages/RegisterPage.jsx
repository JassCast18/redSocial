import {useForm} from 'react-hook-form';
import { userAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    const {register, handleSubmit, formState:{
        errors
    }} = useForm();
    const {signup, isAuthenticated} = userAuth();
    const navigation = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigation('/profile');
    }, [isAuthenticated]);

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    });

  return (
    <div className="bg-zinc-800 max-w-md p-10 roudend-md">
        <form onSubmit={onSubmit}>
            <input type="text" 
                {... register("username",{required:true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='username'
            />
            <input type="email" 
                {... register("email",{required: true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='email'
            />
            <input type="password" 
                {... register("password", {required: true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='password'
            />
            <input type="text" 
                {... register("nombre", {required: true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='nombre'
            />
             <input type="text" 
                {... register("Apellido", {required: true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='Apellido'
            />
            <input type="date" 
                {... register("fechaNacimiento", {required: true})}
                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                placeholder='fechaNacimiento'
            />
            <button type="submit">
                Register
            </button>
        </form>


    </div>
  )
}

export default RegisterPage