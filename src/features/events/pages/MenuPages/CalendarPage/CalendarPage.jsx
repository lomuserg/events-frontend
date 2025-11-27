import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import appStyles from "./CalendarPage.module.css";

export default function CalendarPage() {
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
          headers: { Authorization: `Bearer ${token}` },
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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const formatDate = (isoString) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(isoString));

  const truncateText = (text, maxLength = 15) =>
    text && text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Календарь</h2>

      <div className={appStyles.eventListContainer}>
        {events.length === 0 ? (
          <p>Нет мероприятий.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`${appStyles.eventCard} ${
                event.userEventRole === "ORGANIZER"
                  ? appStyles.organizerCard
                  : event.userEventRole === "PARTICIPANT"
                  ? appStyles.participantCard
                  : ""
              }`}
            >
              <Link
                to={`/main/events/${event.id}/view`}
                className={appStyles.eventCardLink}
              >
                <div className={appStyles.cardContent}>
                  <h3>{truncateText(event.title, 23)}</h3>
                  {event.eventDateTime && (
                    <p>
                      <strong>Дата:</strong> {formatDate(event.eventDateTime)}
                    </p>
                  )}
                  <p>
                    <strong>Место:</strong> {truncateText(event.location, 20)}
                  </p>
                  <p>
                    <strong>Описание:</strong> {truncateText(event.description, 15)}
                  </p>
                  <p>
                    Вы:{" "}
                    {event.userEventRole === "ORGANIZER"
                      ? "Организатор"
                      : event.userEventRole === "PARTICIPANT"
                      ? "Участник"
                      : "Неизвестно"}
                  </p>
                </div>
              </Link>

              {event.userEventRole === "ORGANIZER" && (
                <Link
                  to={`/main/events/${event.id}/edit`}
                  className={appStyles.editButtonInsideCard}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className={appStyles.editButton} type="button">
                    Редактировать
                  </button>
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
