import { Outlet } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import styles from "./PrivateLayout.module.css";
import Header from '../../EventsHeader/EventsHeader';
import { useState } from "react";

export default function PrivateLayout({ user, logout }) {
  const [sidebarWidth, setSidebarWidth] = useState(220);

  return (
    <div className={styles.appContainer}>
      <Header user={user} />

      <Sidebar handleLogout={logout} onWidthChange={setSidebarWidth} />

      <main
        className={styles.mainContent}
        style={{ marginLeft: sidebarWidth, transition: 'margin-left 0.2s ease' }}
      >
        <Outlet />
      </main>
    </div>
  );
}
