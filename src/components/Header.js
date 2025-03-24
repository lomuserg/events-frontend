import React from "react";
import styles from "./EventAppComponents/EventApp.module.css"; // Подключаем стили EventApp

export default function Header({ pageTitle, logoSrc }) {
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
