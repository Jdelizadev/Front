import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles.css'; // Reutilizamos los estilos oscuros del login

const Register = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estado para manejar mensajes (errores o éxito)
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el recargo de la página

    // Validación simple
    if (!name || !email || !password) {
      setMessage('Por favor, completa todos los campos.');
      setIsError(true);
      return;
    }
    
    // Validar longitud de la contraseña (ejemplo)
    if (password.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      setIsError(true);
      return;
    }

    setMessage(''); // Limpiar mensajes
    setIsError(false);
    
    // Aquí harías la llamada a tu backend para crear la cuenta
    console.log('Intentando registrar usuario con:', { name, email, password });
     
    try {
      const data = await fetch(API_BASE_URL, {
        method: POST, 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      })

      const response = await data.json()
      
    } catch (error) {
      
    }

    // Ejemplo de mensaje de éxito simulado
    setMessage('Registro exitoso. ¡Bienvenido!');
    // Limpiar campos después del intento (opcional)
    // setName('');
    // setEmail('');
    // setPassword('');
  };

  return (
    <div className="login-container"> {/* Reutilizamos el contenedor oscuro */}
      <form className="login-form" onSubmit={handleSubmit}> {/* Reutilizamos el estilo del formulario */}
        <h2 className="login-title">Crear Cuenta de Paciente</h2>
        
        {/* Muestra el mensaje condicionalmente */}
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}
        
        <div className="form-group">
          <label htmlFor="name">Nombre Completo</label>
          <input
            type="text"
            id="name"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setMessage(''); 
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="tu.email@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage('');
            }}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setMessage(''); 
            }}
          />
        </div>
        
        <button type="submit" className="login-button">
          Registrarse
        </button>

        <p className="register-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;