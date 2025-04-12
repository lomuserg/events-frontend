// Events.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../EventApp.module.css';

export default function Events({ isDarkMode }) {
  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Мероприятия</h2>
      <div className={`${styles.cardContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>

      <div className={styles.createEventButton}>
        <Link to="/main/create-event">
          <button className={`${styles.navItem} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
            Создать мероприятие
          </button>
        </Link>

      </div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
          Ближайшее мероприятие
        </div>
      </div>

     
    </div>
  );
}
