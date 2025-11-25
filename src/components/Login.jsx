import { Link, useNavigate } from 'react-router-dom';
import { useReducer } from 'react';
import './StylesLoginAndRegister.css'; 

const API_LOGIN_URL = import.meta.env.VITE_API_URL + '/auth/login' 

const Login = () => {
  const navigate = useNavigate()

  const [state, dispatch] = useReducer(reducer, initialState)

  const {email, password, error, message} = state

  //action methods

  const setError = (payload) => {
    dispatch({type: Error, payload: payload})
  }

  const setSuccess = (payload, {token, userName, userID}) => {
    dispatch({type: Success, payload: payload})

      localStorage.setItem('jwt', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userID', userID);
      navigate('/dashboard', { replace: true})
  }

  const setEmail = ({target: {value}}) => {
    dispatch({ type: Email, payload: value})
  }

  const setPassword = ({target: {value}}) => {
    dispatch({ type: Password, payload: value})
  }

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

        if (!data.ok) {
          const errorResponse = await data.json().catch(() => ({ message: 'Error desconocido' }));

          const errorMessage = errorResponse.message || (data.status === 400 ? 'Usuario o contraseña incorrectos.' : `Error: ${data.status}`);

          setError(errorMessage);
          return;
        }
      const response = await data.json()
    
      setSuccess('Bienvenido',response)

    } catch (error) {
      console.log(error)
      setError(error)
    }
  };

  return (
    <div className="register-page-container">
      
      <div className="gender-icon-background"></div>

      <div className="register-card">
        <p id='here'>Aquí comienza tu lugar seguro <br/></p>

        <p id='main-title' className="text">Inicia sesión para continuar</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          
          <div className="form-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              className="input-field"
              type='text'
              id="email"
              placeholder="tu.email@ejemplo.com"
              value={email}
              onChange={setEmail}
            />
          </div>
          
          <div className="form-group">
            <label className="input-label" htmlFor="password">Contraseña</label>
            <input
              className="input-field"
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={setPassword}
            />
          </div>
          
          <button type="submit" className="register-button">
            Iniciar Sesión
          </button>

          <p className="login-text">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export { Login };

const initialState = {
  email: '',
  password: '',
  error: '',
  message: '',
  succes: false
}

const actionTypes = {
    Error : 'Error',
    Email: 'Email',
    Password: 'Password',
    Message: 'Message',
    Success: 'Succes'
} 

const { Error, Email, Password, Message, Success } = actionTypes

const reduceObject = (state, payload) => ({
  [Error]: {
    ...state,
    error: payload
  },
  [Email]: {
    ...state,
    error: '',
    email: payload
  },
  [Password]: {
    ...state,
    error: '',
    password: payload
  },
  [Success]: {
    ...state,
    email: '',
    password: '',
    message: payload,
    succes: true
  } 
})

const reducer = (state,{type, payload}) => {
  return reduceObject(state, payload)[type] || state
}