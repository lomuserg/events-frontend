import React from 'react';
import { Link } from 'react-router-dom';
import { Pen } from 'lucide-react';
import styles from '../SidebarMenus/styles/Events.module.css';
import appStyles from '../EventApp.module.css';

export default function Events({ isDarkMode }) {
  return (
    <div className={appStyles.mainContent}>
      <h2 className={appStyles.mainTitle}>Мероприятия</h2>

      <div className={`${styles.createEventFormWrapper} ${isDarkMode ? appStyles.darkMode : appStyles.lightMode}`}>
        <div className={styles.centeredBlockWrapper}>
          <div className={styles.createEventButton}>
            <Link to="/main/create-event">
              <button className={styles.navItem}>
                <Pen size={28} /> Создать мероприятие
              </button>
            </Link>
          </div>

          <div className={styles.footerCardWrapper}>
            <div 
              className={`${styles.card} 
                ${isDarkMode ? styles.darkModeCard : styles.lightModeCard}`}
            >
              Ближайшее мероприятие
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}