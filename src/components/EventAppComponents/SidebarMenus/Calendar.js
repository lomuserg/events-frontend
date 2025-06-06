import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

import appStyles from "../EventApp.module.css";
import eventStyles from "../SidebarMenus/styles/EventList.module.css";

export default function Calendar({ isDarkMode }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const truncateText = (text, maxLength = 15) => {
    return text && text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };

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
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("Вы не авторизованы");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8080/main/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки мероприятий:", err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Календарь</h2>

      <div className={`${eventStyles.eventListContainer} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        {events.length === 0 ? (
          <p>У вас пока нет созданных мероприятий.</p>
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              to={`/main/events/${event.id}/view`}
              className={eventStyles.eventCardLink}
            >
              <div
                className={`${eventStyles.eventCard} ${
                  event.userEventRole === 'ORGANIZER'
                    ? eventStyles.organizerCard
                    : eventStyles.participantCard
                }`}
              >
                <div className={eventStyles.cardContent}>
                  <h3>{truncateText(event.title, 23)}</h3>

                  {event.eventDateTime && (
                    <p>
                      <strong>Дата:</strong> {formatDate(event.eventDateTime)}
                    </p>
                  )}

                  <p><strong>Место:</strong> {truncateText(event.location, 20)}</p>
                  <p><strong>Описание:</strong> {truncateText(event.description, 15)}</p>
                  <p>
                    <strong>Категория:</strong>{" "}
                    {event.eventCategory 
                      ? EVENT_CATEGORIES[event.eventCategory] || event.eventCategory 
                      : "Не указано"}
                  </p>
                  <p>
                    Вы:{" "}
                    {event.userEventRole === 'ORGANIZER'
                      ? 'Организатор'
                      : event.userEventRole === 'PARTICIPANT'
                        ? 'Участник'
                        : 'Неизвестно'}
                  </p>
                </div>

                {event.userEventRole === 'ORGANIZER' && (
                  <Link
                    to={`/main/events/${event.id}/edit`}
                    className={eventStyles.editButtonInsideCard}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={eventStyles.editButton}
                      type="button"
                    >
                      Редактировать
                    </button>
                  </Link>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}