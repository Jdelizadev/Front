import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register/>} />

        {/* Ruta principal (después del login)<Route path="/dashboard" element={<DashboardScreen />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
