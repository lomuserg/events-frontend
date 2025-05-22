import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pen } from 'lucide-react';

import styles from '../SidebarMenus/styles/Events.module.css';
import appStyles from '../EventApp.module.css';

export default function Events({ isDarkMode }) {
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8080/main/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const events = response.data;

        const now = new Date();
        const upcomingEvents = events
          .filter(event => new Date(event.eventDateTime) > now)
          .sort((a, b) => new Date(a.eventDateTime) - new Date(b.eventDateTime));

        if (upcomingEvents.length > 0) {
          setNearestEvent(upcomingEvents[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Ошибка загрузки ближайшего мероприятия:", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Мероприятия</h2>

      <div className={`${styles.createEventFormWrapper} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        <div className={styles.centeredBlockWrapper}>
          <div className={styles.createEventButton}>
            <Link to="/main/create-event">
              <button className={styles.navItem}>
                <Pen size={28} /> Создать мероприятие
              </button>
            </Link>
          </div>

          <div className={styles.footerCardWrapper}>
            {loading ? (
              <div>Загрузка...</div>
            ) : nearestEvent ? (
              <div className={`${styles.card} ${isDarkMode ? styles.darkModeCard : styles.lightModeCard}`}>
                <h4>Ближайшее мероприятие: {nearestEvent.title}</h4>
                <p><strong>Дата:</strong> {formatDate(nearestEvent.eventDateTime)}</p>
                <p><strong>Место:</strong> {nearestEvent.location}</p>
                <p><strong>Описание:</strong> {nearestEvent.description}</p>
                {nearestEvent.userEventRole === 'ORGANIZER' && (
                  <Link to={`/main/events/${nearestEvent.id}/edit`} className={styles.editButton}>
                    Редактировать
                  </Link>
                )}
              </div>
            ) : (
              <div className={`${styles.card} ${isDarkMode ? styles.darkModeCard : styles.lightModeCard}`}>
                Нет предстоящих мероприятий
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}