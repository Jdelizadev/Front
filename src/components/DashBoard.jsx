import React, { useRef, useMemo } from 'react';
// Asegúrate de que los componentes UpcomingAppointments y WeeklyAvailability
// estén envueltos en React.forwardRef en sus respectivos archivos.
import { UpcomingAppointments } from './UpcomingAppointments'
import { WeeklyAvailability } from './WeeklyAvailability'; 
import './Dashboard.css'; // Importa tus estilos
import { capitalizeName } from './Tools';

const DashBoard = () => {
    // Simulación de datos del usuario
    const n = localStorage.getItem('userName');
    const userName = capitalizeName(n);

    // 1. Crear Referencias para las funciones de recarga de los hijos
    const weeklyAvailabilityRef = useRef(null);
    const upcomingAppointmentsRef = useRef(null);
    
    // 2. Definir la Función Global de Sincronización (Mediador)
    const handleGlobalDataChange = async () => {
        console.log("-> Sincronización global iniciada (Agenda/Citas).");
        
        // Ejecutar las funciones de recarga expuestas por los componentes hijos
        const reloadWeekly = weeklyAvailabilityRef.current 
            ? weeklyAvailabilityRef.current() 
            : Promise.resolve();
            
        const reloadAppointments = upcomingAppointmentsRef.current 
            ? upcomingAppointmentsRef.current() 
            : Promise.resolve();
        
        // Esperar a que ambas recargas (API calls) terminen
        await Promise.all([reloadWeekly, reloadAppointments]);
        
        console.log("-> Sincronización completa.");
    };

    return (
        <div className="dashboard-container">
            {/* 1. Barra Lateral - Sidebar */}
            <aside className="dashboard-sidebar">
                <h2 className="sidebar-title">👋 Hola, {userName}</h2>
                
                <nav className="sidebar-nav">
                    <button className="nav-item active">📅 Mis Citas</button>
                    <button className="nav-item">⚙️ Configuración</button>
                    <button className="nav-item logout">🚪 Cerrar Sesión</button>
                </nav>

                <button className="new-appointment-btn">
                    ✨ Agendar Nueva Cita
                </button>
            </aside>

            {/* 2. Área de Contenido Principal */}
            <main className="dashboard-content">
                <h1>Panel Principal de Citas</h1>
                
                <div className="content-grid">
                    
                    {/* Tarjeta 1: Próximas Citas */}
                    <section className="card appointments-section">
                        <h2 className="section-title">Próximas Citas</h2>
                        {/* 💡 CLAVE: Pasamos la función de sincronización y la Ref al componente */}
                        <UpcomingAppointments 
                            onAppointmentChange={handleGlobalDataChange} 
                            ref={upcomingAppointmentsRef}
                        />
                    </section>

                    {/* Tarjeta 2: Disponibilidad Semanal */}
                    <section className="card availability-section">
                        <h2 className="section-title">Disponibilidad de la Semana</h2>
                        {/* 💡 CLAVE: Pasamos la función de sincronización y la Ref al componente */}
                        <WeeklyAvailability 
                            onAppointmentChange={handleGlobalDataChange} 
                            ref={weeklyAvailabilityRef}
                        />
                    </section>
                    
                    {/* Tarjeta 3: Historial / Mensajes */}
                    <section className="card history-section">
                        <h2 className="section-title">Historial de Citas</h2>
                        <p>Aquí irá la lista de tus citas pasadas.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export { DashBoard };