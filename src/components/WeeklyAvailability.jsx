// WeeklyAvailability.jsx (Código Completo y Funcional)

import React, { useState, useEffect } from 'react';
import './WeeklyAvailability.css';

// URL actualizada
const API_AVAILABILITY_URL = 'https://api-expressjs-production.up.railway.app/api/availability/semana'; 

const dayMap = {
    0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb'
};

const WeeklyAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);

    // --- LÓGICA DE FETCH (LO QUE FALTABA) ---
    useEffect(() => {
        const token = localStorage.getItem('jwt'); // Asegúrate de que esta es la clave que usas
        
        if (!token) {
            setError("No se encontró token de autenticación. Por favor, inicia sesión de nuevo.");
            setIsLoading(false);
            return;
        }

        const fetchAvailability = async () => {
            try {
                const response = await fetch(API_AVAILABILITY_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Incluir el JWT
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                         // Podrías forzar el logout o redireccionar al login aquí
                        setError("Sesión expirada. Por favor, vuelve a iniciar sesión.");
                    } else {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                }

                const data = await response.json();
                setAvailability(data);
                
            } catch (err) {
                console.error("Error al cargar disponibilidad:", err);
                setError(`Error al cargar la disponibilidad: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailability();
    }, []); 
    // ------------------------------------------

    if (isLoading) return <div className="availability-loading">Cargando disponibilidad... ⏳</div>;
    if (error) return <div className="availability-error">❌ {error}</div>;
    if (availability.length === 0) return <div className="availability-none">No hay datos de disponibilidad para esta semana.</div>;

    const toggleDay = (dateString) => {
        setExpandedDay(expandedDay === dateString ? null : dateString);
    };

    const formatBlockTime = (isoString) => {
        // Formatea HH:MM, asumiendo que el backend envía la hora deseada en la porción UTC
        return isoString.split('T')[1].substring(0, 5); 
    };


    return (
        <div className="weekly-availability-container">
            {availability.map((dayData) => {
                const date = new Date(dayData.date);
                // El método getDay() de JS devuelve 0 para Domingo, 1 para Lunes, etc.
                const dayName = dayMap[date.getDay()]; 
                const dateKey = dayData.date;
                const isExpanded = expandedDay === dateKey;
                const statusClass = dayData.totalHoursAvailable > 0 ? 'available' : 'booked';

                // Si el día es Domingo (0), lo saltamos ya que el backend solo calcula Lunes-Sábado
                if (date.getDay() === 0) return null; 

                return (
                    <div key={dateKey} className="day-summary-card">
                        
                        <button 
                            className={`day-toggle-btn ${statusClass}`} 
                            onClick={() => toggleDay(dateKey)}
                            disabled={dayData.totalHoursAvailable === 0}
                        >
                            <div className="day-info">
                                <span className="day-name">{dayName} - {date.getDate()}</span>
                                <span className="available-count">
                                    **{dayData.totalHoursAvailable}** {dayData.totalHoursAvailable === 1 ? 'hora' : 'horas'} disponibles
                                </span>
                            </div>
                            {dayData.totalHoursAvailable > 0 && <span>{isExpanded ? '▲' : '▼'}</span>}
                        </button>

                        {/* Contenido Expandido: Horarios Específicos */}
                        {isExpanded && dayData.availableBlocks.length > 0 && (
                            <div className="available-blocks-list">
                                {dayData.availableBlocks.map((block, index) => (
                                    <div key={index} className="time-block-item">
                                        {formatBlockTime(block.startTime)} - {formatBlockTime(block.endTime)}
                                        <button className="schedule-btn">Agendar</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export { WeeklyAvailability };