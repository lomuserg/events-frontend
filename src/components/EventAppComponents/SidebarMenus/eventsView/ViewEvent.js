import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import appStyles from '../../EventApp.module.css';
import formStyles from '../styles/CreateEvent.module.css';

export default function ViewEvent({ isDarkMode }) {
  const { id: eventId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDateTime, setEventDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setEventCategory(event.eventCategory || '');
        setEventDateTime(event.eventDateTime);

        if (event.participantsLogins) {
          setParticipants(event.participantsLogins);
        }
      } catch (error) {
        console.error("Ошибка загрузки мероприятия:", error);
        alert("Не удалось загрузить данные мероприятия");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

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
        { login, eventId },
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

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>{title}</h2>
      <div className={`${formStyles.createEventFormWrapper} ${isDarkMode ? formStyles.darkMode : formStyles.lightMode}`}>
        <div className={formStyles.formGroup}>
          <label>Название мероприятия:</label>
          <p>{title}</p>
        </div>
        <div className={formStyles.formGroup}>
          <label>Описание:</label>
          <p>{description}</p>
        </div>
        <div className={formStyles.formGroup}>
          <label>Дата и время:</label>
          <p>{eventDateTime}</p>
        </div>
        <div className={formStyles.formGroup}>
          <label>Место проведения:</label>
          <p>{location}</p>
        </div>
        <div className={formStyles.formGroup}>
          <label>Категория:</label>
          <p>{eventCategory}</p>
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
                  {login === currentUserLogin && (
                    <span style={{ marginLeft: '8px', color: '#facc15' }}>👑</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {participants.length === 0 && (
            <p className={formStyles.noParticipants}>Нет участников</p>
          )}
        </div>
      </div>
    </div>
  );
}