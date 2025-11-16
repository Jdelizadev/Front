import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Register } from './components/Register.jsx'
import { Login } from './components/Login.jsx'
import { DashBoard } from './components/DashBoard.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path='*' element={<p>Not found</p>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
