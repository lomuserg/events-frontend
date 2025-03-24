import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState} from "react";
import logo from '../logo.svg';
import styles from './App.css';

import Header from './Header.js';
import EventHeader from './EventAppComponents/EventHeader.js';
import EventApp from './EventAppComponents/EventApp';
import AuthPage from './AuthComponents/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("token") ? true : false;
  });

  // Функция выхода
  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    setIsLoggedIn(false); // Обновляем состояние
  };

  return (
    <Router>
      <div className={`${styles.App} ${isLoggedIn ? styles.darkMode : styles.mode}`}>
        {isLoggedIn ? <EventHeader /> : <Header pageTitle="Frontend authenticated with JWT" logoSrc={logo} />}

        <div className={styles.appContainer}>
          <div className={styles.sidebar}>
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <button onClick={() => setIsLoggedIn(true)}>Login</button>
            )}
          </div>
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/events" element={isLoggedIn ? <EventApp setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
