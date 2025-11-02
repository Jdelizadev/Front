import React, { useState, useEffect } from 'react';
import './Appointments.css';

const API_URL = 'https://api-expressjs-production.up.railway.app/api/users/2/appointments'; 

const UpcomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (Tu lógica de obtención de token y fetch se mantiene igual)
    const token = localStorage.getItem('jwt'); 
    
    if (!token) {
      setError("No se encontró token de autenticación. Por favor, inicia sesión de nuevo.");
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      // ... (El bloque try/catch/finally se mantiene igual)
      try {
          const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, 
            },
          });

          if (!response.ok) {
              if (response.status === 401) {
                  setError("Sesión expirada o token inválido. Por favor, vuelve a iniciar sesión.");
              } else {
                  const errorData = await response.json();
                  throw new Error(errorData.message || `Error HTTP: ${response.status}`);
              }
          }

          const data = await response.json();
          setAppointments(data); 
          
      } catch (err) {
          console.error("Error al cargar citas:", err);
          setError(`Error al cargar las citas: ${err.message}`);
      } finally {
          setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // --- Lógica de Renderizado ---
  if (isLoading) {
    return <div className="loading-state">Cargando tus citas... ⏳</div>;
  }

  if (error) {
    return <div className="error-state">❌ {error}</div>;
  }

  if (appointments.length === 0) {
    return <div className="no-appointments">No tienes citas próximas. ¡Agenda una!</div>;
  }

  return (
    <div className="upcoming-list">
      {appointments.map((cita) => (
        <div key={cita.id} className="appointment-item">
          <div className="appointment-date">
            {/* USANDO cita.date para extraer día y mes */}
            <span className="day">{new Date(cita.date).toLocaleDateString('es-ES', { day: 'numeric' })}</span>
            <span className="month">{new Date(cita.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
          </div>
          <div className="appointment-details">
            {/* DATO INVENTADO O HARDCODEADO */}
            <h3>Servicio de Cita #{cita.id}</h3>
            {/* DATO INVENTADO O HARDCODEADO */}
            <p>Con: *Insertar nombre del Dr*</p> 
            {/* USANDO cita.timeBlock.startTime para la hora */}
            <p>Hora: {new Date(cita.timeBlock.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p> 
            {/* DATO INVENTADO O HARDCODEADO */}
            <p className="status-confirmada">Confirmada</p> 
          </div>
        </div>
      ))}
    </div>
  );
};

export  { UpcomingAppointments };