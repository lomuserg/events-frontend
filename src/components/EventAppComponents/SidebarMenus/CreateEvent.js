// CreateEvent.js
import React from 'react';
import styles from '../EventApp.module.css';

export default function CreateEvent({ isDarkMode }) {
  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Создать мероприятие</h2>
      <form className={styles.createEventForm}>
        <div className={styles.formGroup}>
          <label htmlFor="eventName">Название мероприятия:</label>
          <input
            id="eventName"
            type="text"
            className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
            placeholder="Введите название"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="eventDate">Дата мероприятия:</label>
          <input
            id="eventDate"
            type="date"
            className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="eventDescription">Описание:</label>
          <textarea
            id="eventDescription"
            className={`${styles.textarea} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
            placeholder="Введите описание мероприятия"
          />
        </div>

        <div className={styles.formGroup}>
          <button type="submit" className={`${styles.submitButton} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
