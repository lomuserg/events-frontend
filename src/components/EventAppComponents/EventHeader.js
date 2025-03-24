import React from "react";
import styles from "./EventApp.module.css"; // Убедись, что CSS-модуль подключён

export default function EventHeader() {
  return (
    <header className={styles.eventHeader}>
      <h1 className={styles.title}>
        <img
          src={`${process.env.PUBLIC_URL}/EVENTS_LOGO3.png`}
          alt="Главная"
          className={styles.iconMenu}
        />
        Events
      </h1>
    </header>
  );
}
