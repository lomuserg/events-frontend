import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import appStyles from "./CalendarPage.module.css";

export default function CalendarPage({ isDarkMode }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const truncateText = (text, maxLength = 15) =>
    text && text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  const EVENT_CATEGORIES = {
    CONFERENCE: "Конференция",
    WORKSHOP: "Мастер-класс",
    MEETUP: "Встреча",
    SEMINAR: "Семинар",
    WEBINAR: "Вебинар",
    HACKATHON: "Хакатон",
    TRAINING: "Обучение",
  };

  const getCategoryKeys = () => Object.keys(EVENT_CATEGORIES);

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

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const parseDate = (isoString) => new Date(isoString).toISOString().split("T")[0];

  const filteredEvents = events
    .filter((event) => {
      const eventDate = parseDate(event.eventDateTime);
      if (filterDate && eventDate !== filterDate) return false;
      if (filterCategory && event.eventCategory !== filterCategory) return false;
      if (
        filterLocation &&
        !event.location.toLowerCase().includes(filterLocation.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => a.location.localeCompare(b.location));

  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Календарь</h2>

      <div className={appStyles.filterBar}>
        <div className={appStyles.filterGroup}>
          <label>
            Фильтр по дате:
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </label>
        </div>

        <div className={appStyles.filterGroup}>
          <label>
            Фильтр по категории:
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {getCategoryKeys().map((key) => (
                <option key={key} value={key}>
                  {EVENT_CATEGORIES[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={appStyles.filterGroup}>
          <label>
            Фильтр по месту:
            <input
              type="text"
              placeholder="Введите место..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div
        className={`${appStyles.eventListContainer} ${
          isDarkMode ? appStyles.darkMode : appStyles.lightMode
        }`}
      >
        {filteredEvents.length === 0 ? (
          <p>Нет мероприятий по заданным критериям.</p>
        ) : (
          filteredEvents.map((event) => (
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
                    <strong>Категория:</strong>{" "}
                    {EVENT_CATEGORIES[event.eventCategory] ||
                      event.eventCategory ||
                      "Не указано"}
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