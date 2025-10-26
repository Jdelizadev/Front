import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Styles.css'; // Importa los estilos CSS

const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  // Estados para el email y la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estado opcional para manejar errores
  const [error, setError] = useState('');

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto de recargar la página

    // Validación simple
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }

    // Aquí es donde harías la llamada a tu backend
    // Por ejemplo, usando 'fetch' o 'axios'
    console.log('Intentando iniciar sesión con:', { email, password });
    

    // Limpiar campos después del intento (opcional)
    // setEmail('');
    // setPassword('');
    // setError(''); 
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Inicia sesión para ver tus citas</h2>
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="tu.email@ejemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); // Limpia el error al empezar a escribir
            }}
            
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(''); // Limpia el error al empezar a escribir
            }}
          />
        </div>
        
        <button type="submit" className="login-button">
          Iniciar Sesión
        </button>

        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;