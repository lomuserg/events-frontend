import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Bell, Megaphone, LogOut } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ handleLogout, onWidthChange }) {
  const sidebarRef = useRef(null);
  const [width, setWidth] = useState(220);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (onWidthChange) onWidthChange(width);
  }, [width, onWidthChange]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 80 && newWidth <= 220) {
          setWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const isCollapsed = width < 150;

  return (
    <aside
      ref={sidebarRef}
      className={styles.sidebar}
      style={{ width }}
    >
      <div className={styles.nav}>
        <Link
          to="/main/events"
          className={`${styles.navItem} ${isCollapsed ? styles.collapsed : ''}`}
        >
          <Megaphone size={20} />
          <span>Мероприятия</span>
        </Link>

        <Link
          to="/main/calendar"
          className={`${styles.navItem} ${isCollapsed ? styles.collapsed : ''}`}
        >
          <Calendar size={20} />
          <span>Календарь</span>
        </Link>

        <Link
          to="/main/notifications"
          className={`${styles.navItem} ${isCollapsed ? styles.collapsed : ''}`}
        >
          <Bell size={20} />
          <span>Уведомления</span>
        </Link>
      </div>

      <div className={styles.bottomButtons}>
        <button
          className={`${styles.logoutButton} ${isCollapsed ? styles.collapsed : ''}`}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Выход</span>
        </button>
      </div>

      <div
        className={styles.resizer}
        onMouseDown={() => setIsResizing(true)}
      ></div>
    </aside>
  );
}
