import {BrowserRouter, Routes, Route} from 'react-router-dom'


function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Home Page</h1>}/>
        <Route path='/login' element={<h1>Login</h1>}/>
        <Route path='/register' element={<h1>Register</h1>}/>
        <Route path='/Publicaciones' element={<h1>Publicaciones</h1>}/>
        <Route path='/add-publicacion' element={<h1>new publication</h1>}/>
        <Route path='/profile' element={<h1>profile</h1>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App