import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getAuthToken, request } from "../helpers/axios_helper.js";

import PublicLayout from "../layout/app/PublicLayout/PublicLayout.jsx";
import PrivateLayout from "../layout/app/PrivateLayout/PrivateLayout.jsx";

import AuthPage from "../pages/AuthPage/AuthPage.jsx";
import EventApp from "./MainRouter.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getAuthToken());
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
      alert(error.response?.data || "Неизвестная ошибка");
    }
  };

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.sub, exp: payload.exp };
    } catch (e) {
      console.error("Token decoding failed:", e);
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const verifyToken = useCallback(() => {
    const token = getAuthToken();
    if (!token) return handleLogout();

    const decoded = decodeToken(token);
    if (!decoded) return handleLogout();

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) return handleLogout();

    setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  useEffect(() => {
    if (isLoggedIn) fetchUserData();
    setLoading(false);
  }, [isLoggedIn]);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route 
            path="/" 
            element={
              !isLoggedIn 
                ? <AuthPage onLogin={verifyToken} /> 
                : <Navigate to="/main" />
            }
          />
        </Route>

        <Route element={<PrivateLayout user={user} logout={handleLogout} />}>
          <Route 
            path="/main/*" 
            element={
              isLoggedIn 
                ? <EventApp user={user} /> 
                : <Navigate to="/" />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
