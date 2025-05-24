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
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl p-6">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="App Logo" className="mx-auto w-16 h-16 mb-2" />
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="text-gray-500">Log in to connect with your friends</p>
        </div>

        {loginErrors.length > 0 &&
          loginErrors.map((error, idx) => (
            <Message key={idx} message={error} variant="error" />
          ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email:</Label>
            <Input
              id="email"
              type="email"
              placeholder="youremail@domain.tld"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password:</Label>
            <Input
              id="password"
              type="password"
              placeholder="Write your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-sky-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">or continue with</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline">Google</Button>
            <Button variant="outline">Facebook</Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-sky-500 hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}


export default loginPage