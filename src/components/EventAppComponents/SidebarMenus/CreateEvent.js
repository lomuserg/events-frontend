import React, { useState } from 'react';
import axios from 'axios';
import baseStyles  from '../EventApp.module.css';
import formStyles  from '../SidebarMenus/styles/CreateEvent.module.css'

export default function CreateEvent({ isDarkMode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('TECH'); // Пример категории

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Вы не авторизованы");
      return;
    }

    const eventDto = {
      title,
      description,
      eventDateTime,
      location,
      eventCategory
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/main/events',
        eventDto,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      alert("Мероприятие создано!");
      console.log(response.data);
    } catch (error) {
      console.error("Ошибка создания мероприятия:", error);
      if (error.response) {
        alert(`Ошибка: ${error.response.data}`);
      }
    }
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Создать мероприятие</h2>
      <div className={styles.formWrapper}>
        <form className={styles.createEventForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="eventName">Название мероприятия:</label>
            <input
              id="eventName"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
              placeholder="Введите название"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventDate">Дата и время:</label>
            <input
              id="eventDate"
              type="datetime-local"
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
              className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventDescription">Описание:</label>
            <textarea
              id="eventDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.textarea} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
              placeholder="Введите описание мероприятия"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventLocation">Локация:</label>
            <input
              id="eventLocation"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
              placeholder="Где будет проходить?"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventCategory">Категория:</label>
            <select
              id="eventCategory"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className={`${styles.input} ${isDarkMode ? styles.darkMode : styles.lightMode}`}
            >
              <option value="TECH">TECH</option>
              <option value="SPORT">SPORT</option>
              <option value="ART">ART</option>
              <option value="MUSIC">MUSIC</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={`${styles.submitButton} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
