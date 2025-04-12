import React from "react";
import styles from "./EventApp.module.css"; // Импортируем стили

export default function WelcomeEvents() {
  return (
    <div className={styles.mainContent}>
      <h2 className={styles.mainTitle}>Добро пожаловать!</h2>
    </div>
  );
}
