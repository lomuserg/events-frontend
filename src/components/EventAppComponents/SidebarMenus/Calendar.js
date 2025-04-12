// Calendar.js
import React from 'react';
import styles from '../EventApp.module.css';

export default function Calendar({ isDarkMode }) {
  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Календарь</h2>
      <div className={`${styles.cardContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 1</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 2</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 3</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Мероприятие 4</div>
        {/* Добавьте остальные мероприятия по необходимости */}
      </div>
    </div>
  );
}
