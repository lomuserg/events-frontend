import { Routes, Route } from "react-router-dom";
import WelcomeEvents from "../features/events/pages/WelcomePage/WelcomePage";
import Events from "../features/events/pages/MenuPages/EventsPage/EventsPage";
import Calendar from "../features/events/pages/MenuPages/CalendarPage/CalendarPage";
import Notifications from "../features/events/pages/MenuPages/NotificationsPage/NotificationsPage";
import CreateEvent from "../features/events/pages/CreateEventPage/CreateEventPage";
import EditEvent from "../features/events/pages/EditEventPage/EditEventPage";
import ViewEvent from "../features/events/pages/ViewEventPage/ViewEventPage";

export default function MainRouter({ user }) {
  return (
    <Routes>
      <Route path="/" element={<WelcomeEvents />} />
      <Route path="/events" element={<Events />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/events/:id/edit" element={<EditEvent />} />
      <Route path="/events/:id/view" element={<ViewEvent />} />
    </Routes>
  );
}
