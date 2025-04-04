import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthHeader } from "../helpers/axios_helper";

import Sidebar from "./Sidebar";
import styles from "./EventApp.module.css";

export default function EventApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    setAuthHeader(null);
    localStorage.removeItem("auth_token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={`${styles.appContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        handleLogout={handleLogout} 
      />

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
