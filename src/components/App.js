import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken, request} from "./helpers/axios_helper";
import logo from '../logo.svg';
import styles from './App.css';

import Header from './Header.js';
import EventHeader from './EventAppComponents/EventHeader.js';
import EventApp from './EventAppComponents/EventApp';
import AuthPage from './AuthComponents/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!getAuthToken();
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub,
        exp: payload.exp
      };
    } catch (e) {
      console.error("Token decoding failed:", e);
      return null;
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await request.get("/user"); // API для получения данных пользователя
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Ошибка получения данных пользователя:", error);
      handleLogout();
    }
  }, []);

  const verifyToken = useCallback(() => {
    const token = getAuthToken();
    if (!token) {
      handleLogout();
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      handleLogout();
      return;
    }

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      handleLogout();
    } else {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, [fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return (
    <Router>
      <div className={`${styles.App} ${isLoggedIn ? styles.darkMode : styles.mode}`}>
        {isLoggedIn ? <EventHeader user={user} /> : <Header pageTitle="Frontend authenticated with JWT" logoSrc={logo} />}

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
              <Route path="/" element={
                isLoggedIn ? <Navigate to="/events" /> : <AuthPage onLogin={verifyToken} />
              } />
              <Route path="/events" element={
                isLoggedIn ? <EventApp user={user} /> : <Navigate to="/" />
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
