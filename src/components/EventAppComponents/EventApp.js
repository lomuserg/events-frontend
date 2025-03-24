import { useState } from "react";
import { Calendar, Bell, Megaphone, Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import styles from "./EventApp.module.css"; // Подключаем CSS-модуль

export default function EventApp({ setIsLoggedIn }) { // Принимаем setIsLoggedIn
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    navigate("/"); // Перенаправляем на Welcome
  };

  return (
    <div className={`${styles.appContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
            <Megaphone size={20} />  Мероприятия
          </button>

          <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
            <Calendar size={20} />  Календарь
          </button>

          <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
            <Bell size={20} />  Уведомления
          </button>
        </nav>

        <button className={`${styles.navItem} ${styles.themeToggle} ${isDarkMode ? styles.darkMode : styles.lightMode}`} onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? "Светлая тема" : "Тёмная тема"}
        </button>

        {/* Кнопка выхода */}
        <button className={`${styles.navItem} ${styles.logoutButton}`} onClick={handleLogout}>
          <LogOut size={20} /> Выход
        </button>

      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <h2 className={styles.mainTitle}>Главная</h2>
        <div className={`${styles.cardContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 1</div>
          <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 2</div>
          <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 3</div>
          <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 4</div>
        </div>
      </main>
    </div>
  );
}
