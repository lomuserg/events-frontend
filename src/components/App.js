import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import logo from '../logo.svg';
import './App.css';

import Header from './Header.js';
import EventHeader from './EventAppComponents/EventHeader.js';
import EventApp from './EventAppComponents/EventApp';
import AuthPage from './AuthComponents/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className={`App ${isLoggedIn ? "event-mode" : "auth-mode"}`}>
        {isLoggedIn ? <EventHeader /> : <Header pageTitle="Frontend authenticated with JWT" logoSrc={logo} />}

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <Routes>
                <Route path="/" element={<AuthPage setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/events" element={isLoggedIn ? <EventApp /> : <Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
