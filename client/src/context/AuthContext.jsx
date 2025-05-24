import { createContext, useContext, useState, useEffect } from 'react';
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const userAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  const signup = async (userData) => {
    try {
      const res = await registerRequest(userData);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors([error.response?.data?.message || 'Error al registrarse']);
    }
  };

  const login = async (userData) => {
    try {
      const res = await loginRequest(userData);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors([error.response?.data?.message || 'Error al iniciar sesión']);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkLogin = async () => {
    const token = Cookies.get('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }
    try {
      const res = await verifyTokenRequest(token);
      if (!res.data) return setIsAuthenticated(false);
      setIsAuthenticated(true);
      setUser(res.data);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      const timeout = setTimeout(() => {
        setErrors([]);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [errors]);

  return (
    <AuthContext.Provider value={{
      user,
      signup,
      login,
      logout,
      isAuthenticated,
      errors
    }}>
      {children}
    </AuthContext.Provider>
  );
}
