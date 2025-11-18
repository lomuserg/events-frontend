import { Outlet } from "react-router-dom";
import Sidebar from "../../sidebar/Sidebar";
import styles from "./PrivateLayout.module.css";
import Header from '../../EventsHeader/EventsHeader';

export default function PrivateLayout({ user, logout }) {
  return (
    <div className={styles.appContainer}>
      <Header user={user} />

      <Sidebar handleLogout={logout} />

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
