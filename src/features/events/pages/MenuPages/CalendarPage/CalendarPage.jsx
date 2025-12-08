import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import appStyles from "./CalendarPage.module.css";
import FiltersPopup from "../../../../../layout/menuItems/FiltersPopup/FiltersPopup";

export default function CalendarPage({ sidebarWidth = 0 }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleFilters = () => setFiltersOpen(!filtersOpen);

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
        setFilteredEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки мероприятий:", err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let tempEvents = [...events];

    if (roleFilter !== "ALL") tempEvents = tempEvents.filter(e => e.userEventRole === roleFilter);

    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase();
      tempEvents = tempEvents.filter(
        e => e.title.toLowerCase().includes(searchLower) || e.description.toLowerCase().includes(searchLower)
      );
    }

    tempEvents.sort((a, b) => {
      const dateA = new Date(a.eventDateTime);
      const dateB = new Date(b.eventDateTime);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEvents(tempEvents);
  }, [roleFilter, searchText, sortOrder, events]);

  const formatDate = isoString =>
    new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
      .format(new Date(isoString));

  const truncateText = (text, maxLength = 15) => text && text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  if (loading) return <div className={appStyles.mainContent}>Загрузка...</div>;
  if (error) return <div className={appStyles.mainContent}>{error}</div>;

  return (
    <div className={appStyles.mainContent} style={{ paddingLeft: sidebarWidth, position: "relative" }}>
      <h2 className={appStyles.mainTitle}>Календарь</h2>

      <FiltersPopup
        filtersOpen={filtersOpen}
        toggleFilters={toggleFilters}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <div className={appStyles.eventListContainer}>
        {filteredEvents.length === 0 ? (
          <div className={appStyles.emptyBlock}>
            <p className={appStyles.noEvents}>Нет мероприятий</p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className={`${appStyles.eventCard} ${event.userEventRole === "ORGANIZER" ? appStyles.organizerCard : event.userEventRole === "PARTICIPANT" ? appStyles.participantCard : ""}`}>
              <Link to={`/main/events/${event.id}/view`} className={appStyles.eventCardLink}>
                <div className={appStyles.cardContent}>
                  <h3>{truncateText(event.title, 23)}</h3>
                  {event.eventDateTime && <p><strong>Дата:</strong> {formatDate(event.eventDateTime)}</p>}
                  <p><strong>Место:</strong> {truncateText(event.location, 20)}</p>
                  <p><strong>Описание:</strong> {truncateText(event.description, 15)}</p>
                  <p>Вы: {event.userEventRole === "ORGANIZER" ? "Организатор" : event.userEventRole === "PARTICIPANT" ? "Участник" : "Неизвестно"}</p>
                </div>
              </Link>
              {event.userEventRole === "ORGANIZER" && (
                <Link to={`/main/events/${event.id}/edit`} className={appStyles.editButtonInsideCard} onClick={e => e.stopPropagation()}>
                  <button className={appStyles.editButton} type="button">Редактировать</button>
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
