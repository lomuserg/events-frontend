import React from "react";
import styles from "./EventApp.module.css";

export default function EventHeader({ user }) {
  return (
    <header className={styles.eventHeader}>
      <h1 className={styles.title}>
        <img
          src={`${process.env.PUBLIC_URL}/EVENTS_LOGO3.png`}
          alt="Главная"
          className={styles.iconMenu}
        />
        Events {user && `| ${user.firstName}`}
      </h1>
    </header>
  );
}