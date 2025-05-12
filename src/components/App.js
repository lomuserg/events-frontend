import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken, request } from "./helpers/axios_helper";
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
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await request.get("/user");
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("Неизвестная ошибка");
      }
    }
  };
  

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
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);


  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
    setLoading(false); 
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
              <Route path="/" element={isLoggedIn ? <Navigate to="/main/*" /> : <AuthPage onLogin={verifyToken} />} />
              <Route path="/main/*" element={isLoggedIn ? <EventApp user={user} /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
