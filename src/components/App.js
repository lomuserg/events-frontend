import { useState } from "react";
import logo from '../logo.svg';
import './App.css';

import Header from './Header.js'; // Обычный хедер
import EventHeader from './EventAppComponents/EventHeader.js'; // Хедер для EventApp
import AppContent from './AppContent.js';
import EventApp from './EventAppComponents/EventApp'; // Подключаем EventApp

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Отслеживаем авторизацию

  return (
    <div className="App">
      {isLoggedIn ? <EventHeader /> : <Header pageTitle="Frontend authenticated with JWT" logoSrc={logo} />}
      
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            {isLoggedIn ? <EventApp /> : <AppContent setIsLoggedIn={setIsLoggedIn} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
