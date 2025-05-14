import {BrowserRouter, Routes, Route} from 'react-router-dom'

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/loginPage';
import { AuthProvider } from './context/AuthContext';

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/Publicaciones' element={<h1>Publicaciones</h1>}/>
        <Route path='/add-publicacion' element={<h1>new publication</h1>}/>
        <Route path='/profile' element={<h1>profile</h1>}/>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App