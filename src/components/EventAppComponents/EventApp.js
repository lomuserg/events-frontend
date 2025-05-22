import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthHeader } from "../helpers/axios_helper";

import { Routes, Route } from 'react-router-dom';
import Events from '../EventAppComponents/SidebarMenus/Events'; 
import Calendar from '../EventAppComponents/SidebarMenus/Calendar'; 
import Notifications from "./SidebarMenus/Notifications";
import CreateEvent from "./SidebarMenus/CreateEvent";
import EditEvent from "./SidebarMenus/eventsEdit/EditEvent";
import ViewEvent from "./SidebarMenus/eventsView/ViewEvent";
import WelcomeEvents from "./WelcomeEvents"; 
import Sidebar from "./SidebarEvents";
import styles from "./EventApp.module.css";

export default function EventApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    setAuthHeader(null);
    localStorage.removeItem("auth_token");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className={`${styles.appContainer} ${isDarkMode ? styles.darkMode : styles.lightMode}`}>
      <Sidebar 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        handleLogout={handleLogout} 
      />
  
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/*" element={<WelcomeEvents />} />
          <Route path="/events" element={<Events isDarkMode={isDarkMode} />} />
          <Route path="/calendar" element={<Calendar isDarkMode={isDarkMode} />} />
          <Route path="/notifications" element={<Notifications isDarkMode={isDarkMode} />} />
          <Route path="/create-event" element={<CreateEvent isDarkMode={isDarkMode} />} />
          <Route path="/events/:id/edit" element={<EditEvent isDarkMode={isDarkMode} />} />
          <Route path="/events/:id/view" element={<ViewEvent isDarkMode={isDarkMode} />} />
        </Routes>
      </div>
    </div>
  );
}
