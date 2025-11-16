import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// Asegúrate de importar los mismos estilos del registro
import './StylesLoginAndRegister.css'; 

const API_LOGIN_URL = import.meta.env.VITE_API_URL + '/auth/login' 

const Login = () => {
  const navigate = useNavigate()

  // Estados para el email y la contraseña (esto no cambia)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // La función handleSubmit tampoco necesita cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }
    console.log('Intentando iniciar sesión con:', { email, password });
    setError(''); 

    try {
      const data = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (data.status == 400) {
        setError('Usuario no registrado');
        return;
      }
      const response = await data.json()
      console.log(response)
      const { token, userName, userID } = response
      console.log(token, userName, userID)

            setEmail('');
            setPassword('');
      localStorage.setItem('jwt', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userID', userID);
      navigate('/dashboard', { replace: true})                  

    } catch (error) {
      console.log(error)
      setError(error)
    }
  };

  return (
    // 1. Usa el contenedor principal de la página
    <div className="register-page-container">
      
      {/* 2. Añade el ícono de fondo */}
      <div className="gender-icon-background"></div>

      {/* 3. Envuelve el formulario en la tarjeta principal */}
      <div className="register-card">
        <h1 className="text">Aquí comienza tu lugar seguro <br/> Agenda tu cita</h1>
        <h1 className=".main-title">Accede</h1>

        {/* 4. Usa la clase del título principal */}
        <p className="text">Inicia sesión para continuar</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <div className="form-group">
            {/* 5. Usa las clases correctas para label e input */}
            <label className="input-label" htmlFor="email">Email</label>
            <input
              className="input-field"
              type='text'
              id="email"
              placeholder="tu.email@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>
          
          <div className="form-group">
            {/* 5. Usa las clases correctas para label e input */}
            <label className="input-label" htmlFor="password">Contraseña</label>
            <input
              className="input-field"
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>
          
          {/* 6. Usa la misma clase del botón de registro */}
          <button type="submit" className="register-button">
            Iniciar Sesión
          </button>

          {/* 7. Usa la misma clase para el texto del enlace */}
          <p className="login-text">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export { Login };