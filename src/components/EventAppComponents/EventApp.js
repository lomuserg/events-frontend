import { useState } from "react";
import { Calendar, Bell, Megaphone, Sun, Moon } from "lucide-react";

import './EventApp.css';

export default function EventApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>

        <h1 className="title">
          <img src={`${process.env.PUBLIC_URL}/EVENTS_LOGO3.png`} alt="Главная" className="iconMenu" />
          Events
        </h1>

        <nav className="nav">
          <button className={`nav-item ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Megaphone size={20} />  Мероприятия
          </button>

          <button className={`nav-item ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Calendar size={20} />  Календарь
          </button>

          <button className={`nav-item ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Bell size={20} />  Уведомления
          </button>
        </nav>

        <button className={`nav-item theme-toggle ${isDarkMode ? 'dark-mode' : 'light-mode'}`} onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? "Светлая тема" : "Тёмная тема"}
        </button>

      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="main-title">Главная</h2>
        <div className={`card-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <div className={`card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Мероприятие 1</div>
          <div className={`card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Мероприятие 2</div>
          <div className={`card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Мероприятие 3</div>
          <div className={`card ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>Мероприятие 4</div>
        </div>
      </main>

    </div>
  );
}
