import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import appStyles from '../../EventApp.module.css';
import formStyles from '../styles/CreateEvent.module.css';

export default function EditEvent({ isDarkMode }) {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('CONFERENCE');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantLogin, setParticipantLogin] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const userDto = JSON.parse(localStorage.getItem("user"));
  const currentUserLogin = userDto?.login;

useEffect(() => {
  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Вы не авторизованы");
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:8080/main/events/${eventId}`, {
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
      setEventDateTime(event.eventDateTime);

      if (event.participantsLogins) {
        setParticipants(event.participantsLogins);
      }

    } catch (error) {
      console.error("Ошибка загрузки мероприятия:", error);
      alert("Не удалось загрузить данные мероприятия");
      navigate("/events");
    }
  };

  fetchEvent();
}, [eventId, navigate]);

const handleAddParticipant = async () => {
    const login = participantLogin.trim();
    if (!login) {
      alert("Введите логин пользователя");
      return;
    }

    if (participants.includes(login)) {
      alert("Пользователь уже добавлен");
      return;
    }

    setIsAdding(true);
    const token = localStorage.getItem("auth_token");

    try {
      const response = await axios.post(
        `http://localhost:8080/main/participants`,
        { login,
          eventId,
          eventDateTime
         },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const addedUserLogin = response.data.login;
      setParticipants([...participants, addedUserLogin]);
      setParticipantLogin('');
      alert(`Пользователь "${addedUserLogin}" успешно добавлен`);
    } catch (error) {
      console.error("Ошибка добавления участника:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Не удалось добавить участника");
      }
    } finally {
      setIsAdding(false);
    }
  };

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
        `http://localhost:8080/main/events/${eventId}`,
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
      navigate(`/main/events/${eventId}/edit`);
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
      await axios.delete(`http://localhost:8080/main/events/${eventId}`, {
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

  const handleRemoveParticipant = async (login) => {
  const confirmed = window.confirm(`Вы уверены, что хотите удалить ${login} из мероприятия?`);
  if (!confirmed) return;

  const token = localStorage.getItem("auth_token");
  try {
    await axios.delete(
      `http://localhost:8080/main/participants/${eventId}/${login}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    setParticipants(participants.filter(p => p !== login));
    alert(`Пользователь "${login}" успешно удален`);
  } catch (error) {
    console.error("Ошибка при удалении участника:", error);
    alert("Не удалось удалить участника");
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

          <div className={`${formStyles.participantSidebar} ${isDarkMode ? formStyles.darkMode : formStyles.lightMode}`}>
            <h4>Участники</h4>
            <div className={formStyles.addParticipant}>
              <input
                id="participantLogin"
                type="text"
                value={participantLogin}
                onChange={(e) => setParticipantLogin(e.target.value)}
                className={formStyles.input}
                placeholder="Логин участника"
              />
              <button
                onClick={handleAddParticipant}
                disabled={isAdding}
                className={formStyles.addButton}
              >
                {isAdding ? "Добавление..." : "+"}
              </button>
            </div>

            {participants.length > 0 && (
              <ul className={formStyles.participantList}>
                {participants.map((login, index) => (
                  <li key={index} className={formStyles.participantItem}>
                    {login}
                    {login === currentUserLogin ? (
                      <span style={{ marginLeft: '8px', color: '#facc15' }}>👑</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(login)}
                        className={formStyles.removeButton}
                        disabled={isAdding}
                      >
                        ✕
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {participants.length === 0 && (
              <p className={formStyles.noParticipants}>Нет участников</p>
            )}
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
