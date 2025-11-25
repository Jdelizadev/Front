import React, { useRef, useCallback, useState } from 'react';
import { UpcomingAppointments } from './UpcomingAppointments';
import { WeeklyAvailability } from './WeeklyAvailability'; 
import './DashBoard.css';
import { capitalizeName } from './Tools';
import { useNavigate } from 'react-router-dom';

// Definición de las posibles vistas
const VIEWS = {
    MAIN: 'main',
    SCHEDULE: 'schedule'
};

const DashBoard = () => {

    const navigate = useNavigate()
    // Simulación de datos del usuario
    const n = localStorage.getItem('userName');
    const userN = capitalizeName(n);
    const userName = userN.split(' ')[0]

    // 💡 CLAVE: Estado para controlar la vista actual
    const [activeView, setActiveView] = useState(VIEWS.MAIN);

    // 1. Crear Referencias para las funciones de recarga de los hijos
    const weeklyAvailabilityRef = useRef(null);
    const upcomingAppointmentsRef = useRef(null);
    
    // 2. Definir la Función Global de Sincronización (Mediador)
    const handleGlobalDataChange = useCallback(async () => {
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
        
        // Si agendamos una cita, volvemos a la vista principal
        if (activeView === VIEWS.SCHEDULE) {
            setActiveView(VIEWS.MAIN);
        }
        
        console.log("-> Sincronización completa.");
    }, [activeView]);

    // Función para cambiar de vista a Agendar Cita
    const handleNavigateToSchedule = () => {
        setActiveView(VIEWS.SCHEDULE);
    };

    const logout = () => {
        navigate('/', {replace: true})
    }

    // Función para volver a la vista principal
    const handleNavigateToMain = () => {
        setActiveView(VIEWS.MAIN);
    };

    // --- Contenido de las Vistas ---

    const MainDashboardView = (
        <div className="content-grid">
            {/* Tarjeta 1: Próximas Citas */}
            <section className="card appointments-section">
                <h2 className="section-title">Próximas Citas</h2>
                <UpcomingAppointments 
                    onAppointmentChange={handleGlobalDataChange} 
                    ref={upcomingAppointmentsRef}
                />
            </section>

            {/* Tarjeta 2: Historial / Mensajes (Ahora ocupa el espacio derecho) */}
            <section className="card history-section-right">
                <h2 className="section-title">Historial de Citas</h2>
                <p>Aquí irá la lista de tus citas pasadas.</p>
            </section>

            {/* NOTA: WeeklyAvailability ya no está aquí */}
        </div>
    );

    const ScheduleView = (
        <section className="card full-width-schedule">
            <h2 className="section-title">📅 Agendar Nueva Cita</h2>
            <WeeklyAvailability 
                onAppointmentChange={handleGlobalDataChange} 
                ref={weeklyAvailabilityRef}
            />
        </section>
    );


    return (
        <div className="dashboard-container">
            {/* 1. Barra Lateral - Sidebar */}
            <aside className="dashboard-sidebar">
                <div style={{ paddingLeft: '10px' }}>
                    <h2 className="sidebar-title">👋 Hola, {userName}</h2>
                </div>
                
                <nav className="sidebar-nav">
                    {/* Opción 1: Mis Citas (Home) */}
                    <button 
                        className={`nav-item ${activeView === VIEWS.MAIN ? 'active' : ''}`}
                        onClick={handleNavigateToMain}
                    >
                        📅 Mis Citas
                    </button>
                    
                    {/* ✅ Opción 2: Agendar Nueva Cita (Navega a la otra vista) */}
                    <button 
                        className={`nav-item nav-item-schedule ${activeView === VIEWS.SCHEDULE ? 'active' : ''}`}
                        onClick={handleNavigateToSchedule}
                    >
                        ✨ Agendar Nueva Cita
                    </button>
                    
                    {/* Otras Opciones */}
                    <button className="nav-item">⚙️ Configuración</button>
                    <button onClick={logout} className="nav-item logout">🚪 Cerrar Sesión</button>
                </nav>
            </aside>

            {/* 2. Área de Contenido Principal */}
            <main className="dashboard-content">
                <h1>Panel Principal de Citas</h1>
                
                {/* Renderizado condicional de la vista */}
                {activeView === VIEWS.MAIN ? MainDashboardView : ScheduleView}
            </main>
        </div>
    );
};

export { DashBoard };