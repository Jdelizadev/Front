import React, { useState, useEffect, useImperativeHandle, useCallback } from 'react';
import { XCircle, Calendar, Clock, Loader } from 'lucide-react';
import './Appointments.css'; // Mantenemos tu CSS original

// Obtener el ID del usuario y configurar URLs
const userID = localStorage.getItem('userID'); 
const API_URL = import.meta.env.VITE_API_URL + `/users/${userID}/appointments`; 
const API_RESERVATION_URL = import.meta.env.VITE_API_URL + '/reservations'; 

const UpcomingAppointments = React.forwardRef(({ onAppointmentChange }, ref) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ show: false, message: '', type: '' });
    // Eliminamos el estado: [confirmCancelId, setConfirmCancelId]

    // --- Funciones de Utilidad ---
    const formatTime = (timeBlockStart) => {
        try {
            const date = new Date(`2000-01-01T${timeBlockStart}`);
            return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {console.log(e); return 'N/A'; }
    };

    /**
     * ✅ FIX DE FECHA MANTENIDO: Extrae solo la parte de la fecha y usa T12:00:00.
     */
    const formatDate = (dateString, options) => {
        if (!dateString || typeof dateString !== 'string') {
            return 'N/A';
        }
        
        try {
            // Extraer solo la parte de la fecha antes de la 'T'
            const datePart = dateString.split('T')[0]; 

            // Construir la fecha con el FIX del mediodía para prevenir retroceso por UTC
            const safeDate = new Date(datePart + 'T12:00:00'); 
            
            if (isNaN(safeDate.getTime())) {
                return 'N/A'; 
            }
            return safeDate.toLocaleDateString('es-ES', options);
        } catch (e) {
            console.log(e)
            return 'N/A';
        }
    };

    const StatusMessage = ({ status }) => {
        if (!status.show) return null;
        let classes, Icon;
        // NOTA: Se usan clases genéricas, el estilo final dependerá de Appointments.css
        if (status.type === 'loading') { classes = "status-loading text-gray-800"; Icon = Loader; } 
        else if (status.type === 'success') { classes = "status-success"; Icon = XCircle; } 
        else if (status.type === 'error') { classes = "status-error"; Icon = XCircle; }

        return (
            <div className={`status-message fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 text-white ${classes}`}>
                {status.type === 'loading' ? (<Icon className="w-5 h-5 animate-spin" />) : (<Icon className="w-6 h-6" />)}
                <span>{status.message}</span>
            </div>
        );
    };

    const fetchAppointments = useCallback(async () => {
        const token = localStorage.getItem('jwt'); 
        
        if (!userID || isNaN(parseInt(userID, 10)) || !token) {
             setError("ID de usuario no válido o sin autenticación.");
             setIsLoading(false);
             return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setAppointments(data); 
            
        } catch (err) {
            setError(`Error al cargar las citas: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [userID]);
    
    // Exponer fetchAppointments al componente DashBoard
    useImperativeHandle(ref, () => fetchAppointments, [fetchAppointments]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);


    /**
     * ✅ DEVOLUCIÓN DE window.confirm
     */
    const handleCancel = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) { 
            return; 
        }
        
        setStatusMessage({ show: true, message: 'Cancelando cita...', type: 'loading' });
        const token = localStorage.getItem('jwt'); 

        try {
            const response = await fetch(`${API_RESERVATION_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, },
            });

            if (response.status === 204) {
                setStatusMessage({ show: true, message: 'Cita cancelada con éxito.', type: 'success' });
                
                if (onAppointmentChange) {
                    await onAppointmentChange(); 
                } else {
                    await fetchAppointments(); 
                }
            } else if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message || `No se pudo cancelar (HTTP: ${response.status})`);
            }

        } catch (err) {
            setStatusMessage({ show: true, message: `Error al cancelar: ${err.message}`, type: 'error' });
        } finally {
            setTimeout(() => setStatusMessage({ show: false, message: '', type: '' }), 5000);
        }
    };


    // --- 3. Renderizado ---
    if (isLoading) { /* ... */ } // Renderizado de carga

    if (error) { /* ... */ } // Renderizado de error

    if (appointments.length === 0) {
        return <div className="no-appointments">No tienes citas próximas. ¡Agenda una!</div>;
    }

    return (
        <>
            <StatusMessage status={statusMessage} />
            <div className="upcoming-appointments-container">
                <h2 className="main-title">
                     <Calendar size={24} style={{ marginRight: '10px' }} />
                     Tus Próximas Citas
                </h2>

                <div className="upcoming-list">
                    {appointments.map((cita) => (
                        <div key={cita.id} className="appointment-item">
                            
                            <div className="appointment-date">
                                <span className="day">{formatDate(cita.date, { day: 'numeric' })}</span>
                                <span className="month">{formatDate(cita.date, { month: 'short' })}</span>
                            </div>

                            <div className="appointment-details">
                                {/* #{cita.id} */}
                                <h3>Cita: </h3>
                                <p><Clock size={14} style={{ marginRight: '5px' }} /> Hora: {formatTime(cita.timeBlock.startTime)}</p> 
                                <p className="status-confirmada">Confirmada</p> 
                            </div>

                            <button 
                                className="cancel-btn"
                                onClick={() => handleCancel(cita.id)} // Usamos la función original que llama a window.confirm
                                title="Cancelar Cita"
                            >
                                <XCircle size={24} />
                                <span className="cancel-text">Cancelar</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
});

export { UpcomingAppointments };