import { Routes, Route } from "react-router-dom";
import WelcomeEvents from "../components/EventAppComponents/WelcomeEvents";
import Events from "../components/EventAppComponents/SidebarMenus/Events";
import Calendar from "../components/EventAppComponents/SidebarMenus/Calendar";
import Notifications from "../components/EventAppComponents/SidebarMenus/Notifications";
import CreateEvent from "../components/EventAppComponents/SidebarMenus/CreateEvent";
import EditEvent from "../components/EventAppComponents/SidebarMenus/eventsEdit/EditEvent";
import ViewEvent from "../components/EventAppComponents/SidebarMenus/eventsView/ViewEvent";

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
