// src/components/Register.jsx
import { Link , useNavigate  } from 'react-router-dom';
import { useState} from 'react';
import './StylesLoginAndRegister.css'; // Asegúrate de que la ruta sea correcta
const API_REGISTER_URL = import.meta.env.VITE_API_URL + '/auth/register'

const Register = () => {
    // Estados para los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        console.log(API_REGISTER_URL)
        try {
            const data = await fetch(API_REGISTER_URL, {
                method: 'POST', 
                headers: {
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    name, 
                    email, 
                    password
                })
            })

            if (!data.ok) {
                const errorResponse = await data.json();
                setError(errorResponse.message || `Error al registrar: Código ${data.status}. Verifica tu API.`);
                return;
            }

            const response = await data.json();
            console.log("Registro exitoso:", response);
            
            // 2. LÓGICA CLAVE: LIMPIAR LOS DATOS AL TENER ÉXITO
            setName('');
            setEmail('');
            setPassword('');
            setFechaNacimiento('');
            
            // Mostrar mensaje de éxito
            setMessage('¡Registro completado! Ya puedes iniciar sesión!');
            navigate('/', { replace: true})

        } catch (error) {
            console.error('Error de red o en la solicitud:', error);
            setError('No se pudo conectar al servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        // 1. Contenedor principal que centra todo
        <div className="register-page-container">
            
            {/* 2. El ícono que va en el fondo */}
            <div className="gender-icon-background"></div>

            {/* 3. La tarjeta que contiene el formulario */}
            <div className="register-card">
                <h1 className="main-title">
                    Crear una cuenta nueva para empezar a agendar
                </h1>

                <form className="register-form" onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    <div className="form-group">
                        <label className="input-label" htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label" htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label" htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="input-label" htmlFor="birthdate">Fecha de Nacimiento</label>
                        <input
                            type="date" // Usar type="date" es más práctico
                            id="birthdate"
                            className="input-field"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="register-button">
                        Registrarse
                    </button>
                </form>

                <p className="login-text">
                    ¿Ya estás registrado? <Link to="/">Accede</Link>
                </p>
            </div>
        </div>
    );
};

export  { Register };