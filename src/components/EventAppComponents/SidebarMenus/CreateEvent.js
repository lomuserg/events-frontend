import React from 'react';
import appStyles from '../EventApp.module.css';
import styles from '../SidebarMenus/styles/CreateEvent.module.css';

export default function CreateEvent({ isDarkMode }) {
  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Создать мероприятие</h2>

      <div className={`${styles.createEventFormWrapper} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название мероприятия:</label>
            <input
              id="title"
              type="text"
              autoComplete="off"
              className={styles.input}
              placeholder="Введите название"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="Введите описание мероприятия"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventDateTime">Дата и время:</label>
            <input
              id="eventDateTime"
              type="datetime-local"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Место проведения:</label>
            <input
              id="location"
              type="text"
              className={styles.input}
              placeholder="Введите место"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="eventCategory">Категория:</label>
            <select id="eventCategory" className={styles.input} required>
              <option value="">Выберите категорию</option>
              <option value="CONFERENCE">Конференция</option>
              <option value="WORKSHOP">Мастер-класс</option>
              <option value="MEETUP">Митап</option>
              <option value="CONCERT">Концерт</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <button type="submit" className={styles.submitButton}>
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
