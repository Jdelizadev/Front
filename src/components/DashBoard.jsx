import React from 'react';
import { UpcomingAppointments } from './UpcomingAppointments'
import { WeeklyAvailability } from './WeeklyAvailability';   
// Lo crearías después
import './Dashboard.css'; // Importa tus estilos
import { capitalizeName } from './Tools';

const DashBoard = () => {
  // Simulación de datos del usuario
  const n = localStorage.getItem('userName');
  const userName = capitalizeName(n)


  return (
    <div className="dashboard-container">
      {/* 1. Barra Lateral - Sidebar */}
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">👋 Hola, {userName}</h2>
        
        {/* Enlaces de Navegación */}
        <nav className="sidebar-nav">
          <button className="nav-item active">📅 Mis Citas</button>
          <button className="nav-item">⚙️ Configuración</button>
          <button className="nav-item logout">🚪 Cerrar Sesión</button>
        </nav>

        {/* Botón de Acción Principal */}
        <button className="new-appointment-btn">
          ✨ Agendar Nueva Cita
        </button>
      </aside>

      {/* 2. Área de Contenido Principal */}
      <main className="dashboard-content">
        <h1>Panel Principal de Citas</h1>
        
        <div className="content-grid">
          
          {/* Tarjeta 1: Próximas Citas (Componente que usará tu JWT) */}
          <section className="card appointments-section">
            <h2 className="section-title">Próximas Citas Propias</h2>
           <UpcomingAppointments />
          </section>

          {/* Tarjeta 2: Disponibilidad Semanal */}
          <section className="card availability-section">
            <h2 className="section-title">Disponibilidad de la Semana</h2>
          <WeeklyAvailability />
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