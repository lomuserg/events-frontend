import React, { useState, useEffect } from "react";
import { EVENT_CATEGORIES } from "../model/Categories.jsx";
import { getEvent, updateEvent, deleteEvent, addParticipant, removeParticipant } from "../../api/EventsApi.jsx";
import { useNavigate } from "react-router-dom";
import "./EventForm.model.css";

export default function EventForm({ mode, initialData = {}, onSubmit: onSubmitProp }) {
  const navigate = useNavigate();
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isCreate = mode === "create";

  const userDto = JSON.parse(localStorage.getItem("user"));
  const currentUserLogin = userDto?.login;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("CONFERENCE");
  const [participants, setParticipants] = useState([]);
  const [participantName, setParticipantName] = useState("");

    useEffect(() => {
    if (isEdit || isView) {
        if (!initialData.id) return;

        const fetchEvent = async () => {
        try {
            const event = await getEvent(initialData.id);
            setTitle(event.title);
            setDescription(event.description);
            setEventDateTime(event.eventDateTime);
            setLocation(event.location);
            setEventCategory(event.eventCategory);
            setParticipants(event.participantsLogins || []);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки мероприятия");
        }
        };

        fetchEvent();
    }
    }, [initialData, isEdit, isView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    const data = { title, description, eventDateTime, location, eventCategory };

    if (isEdit) {
      try {
        const updated = await updateEvent(initialData.id, data);
        setTitle(updated.title);
        setDescription(updated.description);
        setEventDateTime(updated.eventDateTime);
        setLocation(updated.location);
        setEventCategory(updated.eventCategory);
        setParticipants(updated.participantsLogins || []);
        if (onSubmitProp) onSubmitProp(updated);
        alert("Изменения сохранены!");
      } catch {
        alert("Ошибка обновления");
      }
    }

    if (isCreate && onSubmitProp) {
      onSubmitProp(data);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Удалить мероприятие?")) return;

    try {
      await deleteEvent(initialData.id);
      alert("Мероприятие удалено");
      navigate(-1);
    } catch {
      alert("Ошибка удаления мероприятия");
    }
  };

    const handleAddParticipant = async () => {
    if (!participantName.trim()) return;

    try {
        await addParticipant(initialData.id, participantName);
        setParticipants(prev => [...prev, participantName]);
        setParticipantName("");
    } catch {
        alert("Ошибка добавления участника");
    }
    };

  const handleRemoveParticipant = async (name) => {
    if (name === currentUserLogin) return;

    try {
      await removeParticipant(initialData.id, name);
      setParticipants(prev => prev.filter(p => p !== name));
    } catch {
      alert("Ошибка удаления участника");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="createEventFormWrapper">
      <div className="formGroup">
        <label>Название</label>
        {isView ? <p>{title}</p> : <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />}
      </div>

      <div className="formGroup">
        <label>Описание</label>
        {isView ? <p>{description}</p> : <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />}
      </div>

      <div className="formGroup">
        <label>Дата и время</label>
        {isView ? <p>{eventDateTime}</p> : <input className="input" type="datetime-local" value={eventDateTime} onChange={(e) => setEventDateTime(e.target.value)} required />}
      </div>

      <div className="formGroup">
        <label>Место проведения</label>
        {isView ? <p>{location}</p> : <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} required />}
      </div>

      <div className="formGroup">
        <label>Категория</label>
        {isView ? <p>{EVENT_CATEGORIES[eventCategory]}</p> : (
          <select className="select" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
            {Object.entries(EVENT_CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        )}
      </div>

      {(isEdit || isView) && (
        <div className="participantsSection">
          <h3>Участники</h3>

          {isEdit && (
            <div className="addParticipant">
              <input
                className="input"
                placeholder="Имя участника"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
              <button type="button" className="addButton" onClick={handleAddParticipant}>Добавить</button>
            </div>
          )}

          {participants.length ? (
            <ul className="participantList">
              {participants.map(p => (
                <li key={p} className="participantItem">
                  {p === currentUserLogin ? `Вы (${currentUserLogin})` : p}
                  {isEdit && p !== currentUserLogin && (
                    <button type="button" className="removeButton" onClick={() => handleRemoveParticipant(p)}>✕</button>
                  )}
                </li>
              ))}
            </ul>
          ) : <p className="noParticipants">Нет участников</p>}

          {isEdit && (
            <button type="button" className="deleteButton" onClick={handleDelete}>
              Удалить мероприятие
            </button>
          )}

        </div>
      )}

      {!isView && (
        <button type="submit" className="submitButton">
          {isCreate ? "Создать мероприятие" : "Сохранить изменения"}
        </button>
      )}
    </form>
  );
}
