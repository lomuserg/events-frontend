import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

import appStyles from "../EventApp.module.css";
import eventStyles from "../SidebarMenus/styles/EventList.module.css"; 

export default function Calendar({ isDarkMode }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Календарь</h2>

      <div className={`${eventStyles.eventListContainer} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        {events.length === 0 ? (
          <p>У вас пока нет созданных мероприятий.</p>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className={`${eventStyles.eventCard} ${
              event.userEventRole === 'ORGANIZER' 
                ? eventStyles.organizerCard 
                : eventStyles.participantCard
              }`}>
              <h3>{event.title}</h3>

              {event.eventDateTime && (
                (() => {
                  const [year, month, day, hour, minute] = event.eventDateTime;
                  const date = new Date(year, month - 1, day, hour, minute);
                  return <p><strong>Дата:</strong> {date.toLocaleString()}</p>;
                })()
              )}

              <p><strong>Место:</strong> {event.location}</p>
              <p><strong>Категория:</strong> {event.eventCategory}</p>
              <p><strong>Описание:</strong> {event.description}</p>

              <p>
                Вы:{" "}
                {event.userEventRole === 'ORGANIZER' 
                  ? 'Организатор' 
                  : event.userEventRole === 'PARTICIPANT' 
                    ? 'Участник' 
                    : 'Неизвестно'}
              </p>

              {event.userEventRole === 'ORGANIZER' && (
                <Link to={`/main/events/${event.id}/edit`} className={eventStyles.editButton}>
                  Редактировать
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}