import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './NotificationsPage.module.css';

export default function NotificationsPage({ sidebarWidth = 0 }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const NOTIFICATION_TYPES = {
    INVITE: 'Приглашение',
    REMIND: 'Напоминание',
    DELETE: 'Отмена мероприятия',
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Вы не авторизованы');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8080/main/notifications', {
        headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
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

  const formatDate = (isoString) =>
    new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className={styles.mainContent}>Загрузка уведомлений...</div>;
  if (error) return <div className={styles.mainContent} style={{ color: 'red' }}>{error}</div>;

  return (
    <div className={styles.mainContent} style={{ paddingLeft: sidebarWidth }}>
      <h2 className={styles.mainTitle}>Уведомления</h2>

      {notifications.length === 0 ? (
        <p>Нет уведомлений</p>
      ) : (
        <div className={styles.cardContainer}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={styles.card}
              style={{ borderLeft: `6px solid ${notification.read ? '#10b981' : '#f97316'}` }}
            >
              <h3>{NOTIFICATION_TYPES[notification.type] || notification.type}</h3>
              <p><strong>Мероприятие:</strong> {notification.message}</p>
              <p><strong>Дата:</strong> {formatDate(notification.createdAt)}</p>
              <p><strong>Статус:</strong> {notification.read ? 'Прочитано' : 'Не прочитано'}</p>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className={styles.markReadButton}
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
