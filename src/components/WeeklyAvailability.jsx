import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Clock, Calendar, CheckCircle, XCircle, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import './WeeklyAvailability.css'; 

// URL para obtener la disponibilidad semanal
const API_AVAILABILITY_URL = 'https://api-expressjs-production.up.railway.app/api/availability/semana'; 
// URL para crear la reserva
const API_RESERVATION_URL = 'https://api-expressjs-production.up.railway.app/api/reservations'; 

const dayMap = { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' };

// 🔑 CLAVE: Usamos React.forwardRef para exponer la función de recarga
const WeeklyAvailability = React.forwardRef(({ onAppointmentChange }, ref) => {
    const [availability, setAvailability] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [reservationStatus, setReservationStatus] = useState({ show: false, message: '', type: '' });

    // --- 1. Fetch de Disponibilidad (Expuesta) ---
    const fetchAvailability = async () => {
        const token = localStorage.getItem('jwt') || "FAKE_TOKEN_FOR_DEMO"; 
        
        if (!token || token === "FAKE_TOKEN_FOR_DEMO") {
            setError("No se encontró token de autenticación.");
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await fetch(API_AVAILABILITY_URL, {
                method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) {
                 if (response.status === 401) { throw new Error("Sesión expirada."); } 
                 else { throw new Error(`Error HTTP: ${response.status}`); }
            }
            const data = await response.json();
            setAvailability(data);
        } catch (err) {
            setError(`Error al cargar la disponibilidad: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // 🔑 CLAVE: Exponer fetchAvailability al componente DashBoard
    useImperativeHandle(ref, () => fetchAvailability, [fetchAvailability]);

    useEffect(() => {
        fetchAvailability();
    }, []); 

    // --- 2. Manejo de Agendamiento (Notifica la Recarga) ---
    const handleSchedule = async (date, timeBlockId) => {
        setReservationStatus({ show: true, message: 'Agendando cita...', type: 'loading' });
        const token = localStorage.getItem('jwt') || "FAKE_TOKEN_FOR_DEMO";
        const userID = localStorage.getItem('userID')

        try {
            const response = await fetch(API_RESERVATION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ date: date, timeBlockId: timeBlockId, userId: userID })
            });

            if (!response.ok) {
                let errorMessage = `No se pudo agendar (HTTP: ${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) { }
                throw new Error(errorMessage);
            }

            setReservationStatus({ show: true, message: '¡Cita agendada con éxito!', type: 'success' });
            
            // 🔑 CLAVE: Notificar al padre (DashBoard) que se ha creado una cita.
            if (onAppointmentChange) {
                await onAppointmentChange(); 
            } else {
                // Fallback: Recargar solo esta vista si no está sincronizado
                await fetchAvailability(); 
            }

        } catch (err) {
            setReservationStatus({ show: true, message: `Error al agendar: ${err.message}`, type: 'error' });
        } finally {
            setTimeout(() => setReservationStatus({ show: false, message: '', type: '' }), 5000);
        }
    };
    
    // --- 3. Funciones de Utilidad (formatBlockTime, StatusMessage, etc.) ---
    const toggleDay = (dateString) => { setExpandedDay(expandedDay === dateString ? null : dateString); };

    const formatBlockTime = (timeString) => {
        if (typeof timeString === 'string' && timeString.length >= 5) {
            return timeString.substring(0, 5);
        }
        return 'N/A';
    };

    const StatusMessage = ({ status }) => {
        if (!status.show) return null;
        let classes, Icon;
        if (status.type === 'loading') { classes = "status-loading text-gray-800"; Icon = Clock; } 
        else if (status.type === 'success') { classes = "status-success"; Icon = CheckCircle; } 
        else if (status.type === 'error') { classes = "status-error"; Icon = XCircle; }

        return (
            <div className={`status-message p-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 text-white ${classes}`}>
                {status.type === 'loading' ? (<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>) : (<Icon className="w-6 h-6" />)}
                <span>{status.message}</span>
            </div>
        );
    };

    // --- 4. Renderizado ---
    if (isLoading) return (<div className="availability-loading">Cargando disponibilidad... ⏳</div>);
    if (error) return (<div className="availability-error">❌ {error}</div>);
    
    const availableDays = availability.filter(day => day.dayOfWeek !== 0); 
    
    if (availableDays.length === 0) return (<div className="availability-none">No hay datos de disponibilidad para esta semana.</div>);
    
    return (
        <>
            <StatusMessage status={reservationStatus} />
            <div className="weekly-availability-container">
                <h1 className="main-title">
                    <Calendar size={24} style={{ marginRight: '10px' }} />
                    Agenda Semanal
                </h1>

                {availableDays.map((dayData) => {
                    const date = new Date(dayData.date + 'T00:00:00'); 
                    const dayName = dayMap[date.getDay()] || 'N/A'; 
                    const dateKey = dayData.date;
                    const isExpanded = expandedDay === dateKey;
                    const totalAvailable = dayData.totalHoursAvailable || 0; 
                    const statusClass = totalAvailable > 0 ? 'available' : 'booked';
                    const IconComponent = totalAvailable > 0 ? (isExpanded ? ChevronUp : ChevronDown) : Clock;

                    return (
                        <div key={dateKey} className="day-summary-card">
                            <button 
                                className={`day-toggle-btn ${statusClass}`} 
                                onClick={() => toggleDay(dateKey)}
                                disabled={totalAvailable === 0}
                            >
                                <div className="day-info">
                                    <span className="day-name">{dayName} - {date.getDate()}/{date.getMonth() + 1}</span>
                                    <span className="available-count"><strong>{totalAvailable}</strong> {totalAvailable === 1 ? 'hora' : 'horas'} disponibles</span>
                                </div>
                                <IconComponent size={20} />
                            </button>

                            {isExpanded && totalAvailable > 0 && (
                                <div className="available-blocks-list">
                                    {dayData.availableBlocks.map((block) => (
                                        <div key={block.timeBlockId} className="time-block-item">
                                            <span>{formatBlockTime(block.startTime)} - {formatBlockTime(block.endTime)}</span>
                                            <button 
                                                className="schedule-btn"
                                                onClick={() => handleSchedule(dayData.date, block.timeBlockId)}
                                            >
                                                Agendar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
});

export { WeeklyAvailability };