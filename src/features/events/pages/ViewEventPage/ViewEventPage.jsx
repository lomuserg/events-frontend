import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventForm from "../../components/EventForm/EventForm.jsx";
import { getEvent } from "../../api/EventsApi.jsx";
import "./ViewEventPage.module.css";

export default function ViewEventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvent(id).then(setEvent);
  }, [id]);

  if (!event) return <p>Загрузка...</p>;

  return <EventForm mode="view" initialData={event} />;
}
