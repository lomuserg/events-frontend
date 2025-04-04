import { Link } from "react-router-dom";
import { Calendar, Bell, Megaphone, Sun, Moon, LogOut } from "lucide-react";
import styles from "./EventApp.module.css";

export default function Sidebar({ isDarkMode, toggleTheme, handleLogout }) {
  return (
    <aside className={`${styles.sidebar} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <nav className={styles.nav}>
        <Link to="/main/events" className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          <Megaphone size={20} /> Мероприятия
        </Link>
        <Link to="/main/calendar" className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          <Calendar size={20} /> Календарь
        </Link>
        <Link to="/main/notifications" className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          <Bell size={20} /> Уведомления
        </Link>
      </nav>

      <div className={styles.bottomButtons}>
        <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`} onClick={toggleTheme}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? "Светлая тема" : "Тёмная тема"}
        </button>
        <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`} onClick={handleLogout}>
          <LogOut size={20} /> Выход
        </button>
      </div>
    </aside>
  );
}
