import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/loginPage';
import PublicacionPage from './pages/publicacionPage';
import NewPublicacion from './pages/newPublicacion';
import ProfilePage from './pages/profilePage';
import HomePage from './pages/homePage';

import ProtectedRouted from './protectedRouted';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<ProtectedRouted/>}>
            <Route path='/Publicaciones' element={<PublicacionPage />} />
            <Route path='/Publicaciones/:id' element={<NewPublicacion />} />
            <Route path='/add-publicacion' element={<NewPublicacion />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App