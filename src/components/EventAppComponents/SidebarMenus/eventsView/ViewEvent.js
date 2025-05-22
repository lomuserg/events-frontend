import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
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
  const [userEventRole, setUserEventRole] = useState(null);

  const userDto = JSON.parse(localStorage.getItem("user"));
  const currentUserLogin = userDto?.login;

  const EVENT_CATEGORIES = {
    CONFERENCE: "Конференция",
    WORKSHOP: "Мастер-класс",
    MEETUP: "Встреча",
    SEMINAR: "Семинар",
    WEBINAR: "Вебинар",
    HACKATHON: "Хакатон",
    TRAINING: "Обучение"
  };

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
        setUserEventRole(event.userEventRole);

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
          <p>
            <strong>Категория:</strong>{" "}
            {eventCategory 
              ? EVENT_CATEGORIES[eventCategory] || eventCategory 
              : "Не указано"}
          </p>
        </div>

        <div className={`${formStyles.participantSidebar} ${isDarkMode ? formStyles.darkMode : formStyles.lightMode}`}>
          <h4>Участники</h4>
          {participants.length > 0 ? (
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
          ) : (
            <p className={formStyles.noParticipants}>Нет участников</p>
          )}
        </div>
        {userEventRole === 'ORGANIZER' && (
          <div className={formStyles.formGroup}>
            <Link to={`/main/events/${eventId}/edit`} className={formStyles.editButton}>
              Редактировать
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}