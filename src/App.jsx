import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import Login from "./Login";
import "./App.css";

import { seedPolarDemoData } from "./utils";

import Dashboard from "./pages/Dashboard";
import ExpeditionsPage from "./pages/ExpeditionsPage";
import RoutePlanningPage from "./pages/RoutePlanningPage";
import CargoPage from "./pages/CargoPage";
import ModulePage from "./pages/ModulePage";

function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    seedPolarDemoData();
    window.dispatchEvent(new Event("polar-data-change"));
  }, []);

  useEffect(() => {
    const goToModule = (event) => {
      if (event.detail) setActive(event.detail);
    };
    window.addEventListener("polar-quick-action", goToModule);
    return () => window.removeEventListener("polar-quick-action", goToModule);
  }, []);

  function handleLogin(loggedInUser) {
    setUser(loggedInUser);
  }

  function handleLogout() {
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const menu = [
    "Dashboard",
    "Expeditions",
    "Route Planning",
    "Cargo & Logistics",
    "Inventory & Assets",
    "Personnel",
    "Movement Tracking",
    "Emergency Center",
    "AI Intelligence",
    "Reports & Analytics",
    "Notifications",
    "Admin Panel",
    "Settings",
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <h2>POLAR</h2>
          <span>COMMAND CENTER</span>
        </div>

        <div className="mission-status">
          ● SYSTEM OPERATIONAL
        </div>

        <nav>
          {menu.map((item) => (
            <button
              key={item}
              className={
                active === item
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p>OPERATIONS / {active.toUpperCase()}</p>
            <h1>{active}</h1>
          </div>

          <div className="user">
            <strong>{user.role}</strong>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>
{active === "Dashboard" ? (
  <Dashboard />
) : active === "Expeditions" ? (
  <ExpeditionsPage />
) : active === "Route Planning" ? (
  <RoutePlanningPage />
) : active === "Cargo & Logistics" ? (
  <CargoPage />
) : (
  <ModulePage title={active} />
)}
      </main>
    </div>
  );
}

export default App;
