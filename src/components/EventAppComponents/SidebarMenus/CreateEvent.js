import React, { useState } from 'react';
import axios from 'axios';

import appStyles from '../EventApp.module.css';
import formStyles from '../SidebarMenus/styles/CreateEvent.module.css';
import MapInput from '../Maps/MapInput';

export default function CreateEvent({ isDarkMode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventCategory, setEventCategory] = useState('CONFERENCE');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Вы не авторизованы");
      setLoading(false);
      return;
    }

    const eventDto = {
      title,
      description,
      eventDateTime,
      location: coordinates || "55.753215, 37.622415",
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
        alert(`Ошибка: ${error.response.data.message || "Не удалось создать мероприятие"}`);
      } else {
        alert("Не удалось отправить запрос. Проверьте подключение.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Создать мероприятие</h2>

      <div className={`${formStyles.createEventFormWrapper} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        <form onSubmit={handleSubmit}>
          <div className={formStyles.formGroup}>
            <label htmlFor="title">Название мероприятия:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={formStyles.input}
              placeholder="Введите название"
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="description">Описание:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={formStyles.textarea}
              placeholder="Введите описание мероприятия"
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="eventDateTime">Дата и время:</label>
            <input
              id="eventDateTime"
              type="datetime-local"
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
              className={formStyles.input}
              required
            />
          </div>

         <MapInput 
            onLocationChange={setCoordinates}
            initialCoords={coordinates ? coordinates.split(',').map(Number) : undefined}
          />

          {coordinates && (
            <div className={formStyles.formGroup}>
              <input
                value={coordinates}
                readOnly
                className={formStyles.input}
              />
            </div>
          )}

          <div className={formStyles.formGroup}>
            <label htmlFor="eventCategory">Категория:</label>
            <select
              id="eventCategory"
              value={eventCategory}
              onChange={(e) => setEventCategory(e.target.value)}
              className={`${formStyles.select} ${formStyles.input}`}
              required
            >
              <option value="">Выберите категорию</option>
              <option value="CONFERENCE">Конференция</option>
              <option value="WORKSHOP">Мастер-класс</option>
              <option value="MEETUP">Встреча</option>
              <option value="SEMINAR">Семинар</option>
              <option value="WEBINAR">Вебинар</option>
              <option value="HACKATHON">Хакатон</option>
              <option value="TRAINING">Обучение</option>
            </select>
          </div>

          <div className={formStyles.formGroup}>
            <button
              type="submit"
              className={formStyles.submitButton}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}