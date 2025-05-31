import { BrowserRouter, Routes, Route } from 'react-router-dom'

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/loginPage';
import PublicacionPage from './pages/publicacionPage';
import NewPublicacion from './pages/newPublicacion';
import ProfilePage from './pages/profilePage';
import HomePage from './pages/homePage';
import FeedPage from './pages/feedPage';
import NotificacionesPage from './pages/notificacionesPage';
import MensajesPage from "./pages/MensajesPage";
import ChatPage from "./pages/chatPage";

import ProtectedRouted from './protectedRouted';
import ProtectedLayout from './components/protectedLayoud';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />


          <Route element={<ProtectedRouted />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path='/notificaciones' element={<NotificacionesPage />} />
              <Route path='/Publicaciones' element={<PublicacionPage />} />
              <Route path='/publicacion/:id' element={<PublicacionPage />} />
              <Route path='/add-publicacion' element={<NewPublicacion />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path="/mensajes" element={<MensajesPage />} />
<Route path="/chat/:otherUserId" element={<ChatPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App