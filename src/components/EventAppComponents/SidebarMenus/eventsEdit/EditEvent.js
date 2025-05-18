import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import appStyles from '../../EventApp.module.css';
import formStyles from '../styles/CreateEvent.module.css';

export default function EditEvent({ isDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('CONFERENCE');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          alert("Вы не авторизованы");
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:8080/main/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const event = response.data;

        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setEventCategory(event.eventCategory || 'CONFERENCE');

        const date = new Date(event.eventDateTime);
        const formattedDate = date.toISOString().slice(0, 16);
        setEventDateTime(formattedDate);

      } catch (error) {
        console.error("Ошибка загрузки мероприятия:", error);
        alert("Не удалось загрузить данные мероприятия");
        navigate("/events");
      }
    };

    fetchEvent();
  }, [id, navigate]);

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
      location,
      eventCategory
    };

    try {
      await axios.put(
        `http://localhost:8080/main/events/${id}`,
        eventDto,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      alert("Мероприятие успешно обновлено!");
      navigate(`/main/calendar`);
    } catch (error) {
      console.error("Ошибка редактирования мероприятия:", error);
      if (error.response) {
        alert(`Ошибка: ${error.response.data.message || "Не удалось обновить мероприятие"}`);
      } else {
        alert("Не удалось отправить запрос. Проверьте подключение.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Вы уверены, что хотите удалить это мероприятие?");
    if (!confirmed) return;

    setDeleting(true);
    const token = localStorage.getItem("auth_token");

    try {
      await axios.delete(`http://localhost:8080/main/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Мероприятие удалено");
      navigate("/main/calendar");
    } catch (error) {
      console.error("Ошибка удаления мероприятия:", error);
      alert("Не удалось удалить мероприятие");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>{title}</h2>

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

          <div className={formStyles.formGroup}>
            <label htmlFor="location">Место проведения:</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${formStyles.input} ${formStyles.locationInput}`}
              placeholder="Введите место"
              required
            />
          </div>

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
              {loading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>

        <div className={formStyles.formGroup}>
          <button
            onClick={handleDelete}
            className={formStyles.deleteButton}
            disabled={deleting}
          >
            {deleting ? "Удаление..." : "Удалить мероприятие"}
          </button>
        </div>
      </div>
    </div>
  );
}
