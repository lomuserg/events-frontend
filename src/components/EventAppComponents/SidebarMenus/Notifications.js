import React from 'react';
import styles from '../EventApp.module.css';

export default function Notifications({ isDarkMode }) {
  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Уведомления</h2>
      <div className={`${styles.cardContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Уведомление 1</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Уведомление 2</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Уведомление 3</div>
        <div className={`${styles.card} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>Уведомление 4</div>
      </div>
    </div>
  );
}
