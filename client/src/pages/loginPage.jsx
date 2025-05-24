import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { loginSchema } from "../schemas/auth";
import { Card, Message, Button, Input, Label } from "../components/ui";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    await signin(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="App Logo" className="mx-auto w-20 h-20 mb-3 rounded-full shadow-md" />
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido de nuevo</h1>
          <p className="text-gray-500 text-sm mt-1">Inicia sesión para continuar</p>
        </div>

        {loginErrors.length > 0 &&
          loginErrors.map((error, idx) => (
            <Message key={idx} message={error} variant="error" />
          ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox text-blue-500" /> Recordarme
            </label>
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">O continúa con</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="hover:bg-red-100">Google</Button>
            <Button variant="outline" className="hover:bg-blue-100">Facebook</Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline font-medium">
            Regístrate
          </Link>
        </p>
      </Card>
    </div>
  );
}
