import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from '../EventApp.module.css';
import listStyles from '../SidebarMenus/styles/EventList.module.css';

export default function Notifications({ isDarkMode }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/main/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNotifications(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки уведомлений:', err);
      setError('Не удалось загрузить уведомления');
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      await axios.patch(
        `http://localhost:8080/main/notifications/${id}/read`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      alert('Не удалось пометить как прочитанное');
      console.error('Ошибка отметки как прочитанного:', err);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <p>Загрузка уведомлений...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Уведомления</h2>

      {notifications.length === 0 ? (
        <p>Нет уведомлений</p>
      ) : (
        <div
          className={`${listStyles.cardContainer} ${
            isDarkMode ? listStyles.darkMode : listStyles.lightMode
          }`}
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${listStyles.card} ${
                isDarkMode ? listStyles.darkMode : listStyles.lightMode
              }`}
              style={{
                width: '90%',
                borderLeft: `6px solid ${notification.read ? '#10b981' : '#f97316'}`,
                marginBottom: '16px',
              }}
            >
              <h3 style={{ marginBottom: '6px' }}>{notification.title}</h3>
              <p>
                <strong>Название:</strong> {notification.message}
              </p>
              
              <p>
                <strong>Дата:</strong> {formatDate(notification.createdAt)}
              </p>
              <p>
                <strong>Статус:</strong>{' '}
                {notification.read ? 'Прочитано' : 'Не прочитано'}
              </p>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className={listStyles.markReadButton}
                >
                  Пометить как прочитанное
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}