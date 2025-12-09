import EventForm from "../../components/EventForm/EventForm.jsx";
import { createEvent } from "../../../../features/events/api/EventsApi.jsx";
import "./CreateEventPage.module.css";

export default function CreateEventPage() {
  const handleSubmit = async (data) => {
    try {
      await createEvent(data);
      alert("Мероприятие создано!");
    } catch (err) {
      alert("Ошибка создания");
    }
  };

  return <EventForm mode="create" onSubmit={handleSubmit} />;
}
