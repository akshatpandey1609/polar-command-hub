import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import Login from "./Login";
import "./App.css";


function readPolar(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writePolar(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("polar-data-change"));
}

function usePolarData(key, fallback = []) {
  const [data, setData] = useState(() => readPolar(key, fallback));

  useEffect(() => {
    const refresh = () => setData(readPolar(key, fallback));
    window.addEventListener("polar-data-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("polar-data-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [key]);

  return data;
}

function seedPolarDemoData() {
  const demo = {
    polarExpeditions: [
      { id: 1, name: "POLAR-2026-A", mission: "Antarctic Research Mission", location: "Antarctica", status: "ACTIVE" },
      { id: 2, name: "POLAR-2026-B", mission: "Arctic Ocean Survey", location: "Arctic Ocean", status: "TRANSIT" },
    ],
    polarCargo: [
      { id: 101, cargoName: "Arctic Medical Supplies", quantity: "25 crates", origin: "Research Depot", destination: "Antarctica Base", status: "IN TRANSIT", createdAt: new Date().toLocaleString() },
    ],
    polarRoutes: [
      { id: 201, name: "Antarctic Base Route", origin: "Research Depot", destination: "Antarctica Base", distance: "1200 km", status: "ACTIVE" },
    ],
    polarInventory: [
      { id: 301, name: "Snow Vehicle", category: "Transport Equipment", location: "Antarctica Base", status: "IN USE" },
    ],
    polarPersonnel: [
      { id: 401, name: "Command Operator", role: "Field Researcher", expedition: "POLAR-2026-A", status: "ACTIVE" },
    ],
    polarMovement: [
      { id: 501, subject: "Supply Convoy", location: "Antarctica Base", coordinates: "-75.2500, 0.0000", status: "MOVING" },
    ],
    polarEmergencies: [
      { id: 601, incident: "Severe Weather Alert", location: "Sector Alpha", severity: "HIGH", status: "OPEN" },
    ],
    polarAI: [
      { id: 701, request: "Weather Risk Analysis", source: "Live Expedition Data", priority: "HIGH", status: "QUEUED" },
    ],
    polarReports: [
      { id: 801, name: "Expedition Status Report", type: "Operations", period: "September 2026", status: "DRAFT" },
    ],
    polarNotifications: [
      { id: 901, title: "Weather Alert", message: "Severe weather detected", audience: "All Expedition Teams", status: "NEW" },
    ],
    polarAdmin: [
      { id: 1001, name: "Command Operator", role: "Operations Admin", access: "Full Access", status: "ACTIVE" },
    ],
    polarSettings: [
      { id: 1101, name: "Telemetry Refresh", value: "30 seconds", description: "Live tracking refresh interval", status: "ACTIVE" },
    ],
  };

  Object.entries(demo).forEach(([key, value]) => {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
}

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
function CargoPage() {
  const [cargo, setCargo] = useState(() => readPolar("polarCargo", []));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const emptyForm = {
    cargoName: "",
    quantity: "",
    origin: "",
    destination: "",
    status: "IN TRANSIT",
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const refresh = () => setCargo(readPolar("polarCargo", []));
    window.addEventListener("polar-data-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("polar-data-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  function persist(data) {
    setCargo(data);
    writePolar("polarCargo", data);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function saveCargo(e) {
    e.preventDefault();
    if (!form.cargoName.trim() || !form.quantity || !form.origin.trim() || !form.destination.trim()) {
      alert("Please fill all cargo fields.");
      return;
    }

    const record = {
      id: editingId || Date.now(),
      ...form,
      createdAt: editingId
        ? cargo.find(item => item.id === editingId)?.createdAt
        : new Date().toLocaleString(),
    };

    persist(
      editingId
        ? cargo.map(item => item.id === editingId ? record : item)
        : [...cargo, record]
    );
    resetForm();
    setShowForm(false);
  }

  function editCargo(item) {
    setForm({
      cargoName: item.cargoName || "",
      quantity: item.quantity || "",
      origin: item.origin || "",
      destination: item.destination || "",
      status: item.status || "IN TRANSIT",
    });
    setEditingId(item.id);
    setShowForm(true);
  }

  function deleteCargo(id) {
    if (!window.confirm("Delete this cargo record?")) return;
    persist(cargo.filter(item => item.id !== id));
  }

  function cycleStatus(item) {
    const statuses = ["PLANNED", "IN TRANSIT", "DELIVERED", "DELAYED"];
    const index = statuses.indexOf(item.status);
    const next = statuses[(index + 1) % statuses.length];
    persist(cargo.map(row => row.id === item.id ? { ...row, status: next } : row));
  }

  const filteredCargo = useMemo(() => cargo.filter(item => {
    const needle = search.toLowerCase();
    const matchesSearch = [item.cargoName, item.quantity, item.origin, item.destination, item.status]
      .some(value => String(value || "").toLowerCase().includes(needle));
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [cargo, search, statusFilter]);

  const inTransit = cargo.filter(item => item.status === "IN TRANSIT").length;
  const delivered = cargo.filter(item => item.status === "DELIVERED").length;
  const delayed = cargo.filter(item => item.status === "DELAYED").length;

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">POLAR LOGISTICS</p>
          <h2>Cargo & Logistics</h2>
          <p>Track shipments, update cargo status and manage logistics records.</p>
        </div>
        <button className="primary-btn" onClick={() => {
          if (showForm) resetForm();
          setShowForm(v => !v);
        }}>
          {showForm ? "Close Form" : "+ New Cargo"}
        </button>
      </section>

      <section className="stats-grid">
        <StatCard title="Total Cargo" value={String(cargo.length).padStart(2, "0")} icon="📦" />
        <StatCard title="In Transit" value={String(inTransit).padStart(2, "0")} icon="🚚" />
        <StatCard title="Delivered" value={String(delivered).padStart(2, "0")} icon="✓" />
        <StatCard title="Delayed" value={String(delayed).padStart(2, "0")} icon="⚠️" />
      </section>

      {showForm && (
        <section className="panel">
          <div className="panel-header">
            <h3>{editingId ? "Edit Cargo Record" : "Create New Cargo"}</h3>
            <span>{editingId ? "EDIT MODE" : "NEW RECORD"}</span>
          </div>
          <form onSubmit={saveCargo}>
            <div className="form-grid">
              <input placeholder="Cargo Name" value={form.cargoName}
                onChange={e => setForm({ ...form, cargoName: e.target.value })} required />
              <input type="number" min="1" placeholder="Quantity" value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })} required />
              <input placeholder="Origin" value={form.origin}
                onChange={e => setForm({ ...form, origin: e.target.value })} required />
              <input placeholder="Destination" value={form.destination}
                onChange={e => setForm({ ...form, destination: e.target.value })} required />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>PLANNED</option>
                <option>IN TRANSIT</option>
                <option>DELIVERED</option>
                <option>DELAYED</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">{editingId ? "Update Cargo" : "Save Cargo"}</button>
              <button type="button" className="secondary-btn" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h3>Cargo Records</h3>
          <span>{filteredCargo.length} / {cargo.length}</span>
        </div>

        <div style={{ marginBottom: "18px", display: "grid", gridTemplateColumns: "1fr 180px", gap: "10px" }}>
          <input placeholder="Search cargo, origin, destination..." value={search} onChange={e => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option>PLANNED</option>
            <option>IN TRANSIT</option>
            <option>DELIVERED</option>
            <option>DELAYED</option>
          </select>
        </div>

        {filteredCargo.length === 0 ? (
          <p className="empty-state">
            {cargo.length === 0 ? 'No cargo records yet. Click "+ New Cargo" to add one.' : "No cargo matches your search/filter."}
          </p>
        ) : (
          <div className="expedition-list">
            {filteredCargo.map(item => (
              <div className="expedition" key={item.id}>
                <div className="exp-icon">📦</div>
                <div className="exp-info">
                  <strong>{item.cargoName}</strong>
                  <span>{item.origin} → {item.destination}</span>
                  <small>Quantity: {item.quantity} • Created: {item.createdAt || "—"}</small>
                </div>
                <button className="secondary-btn" onClick={() => cycleStatus(item)}>{item.status}</button>
                <button className="secondary-btn" onClick={() => editCargo(item)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteCargo(item.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <h3>Logistics Controls</h3>
          <span>LIVE</span>
        </div>
        <p className="empty-state">Status button dabakar cargo ko next stage par move karo. Changes dashboard ke live counters ke saath automatically sync honge.</p>
      </section>
    </div>
  );
}

function Dashboard() {
  const expeditions = usePolarData("polarExpeditions", [
    { id: 1, name: "POLAR-2026-A", mission: "Antarctic Research Mission", location: "Antarctica", status: "ACTIVE" },
    { id: 2, name: "POLAR-2026-B", mission: "Arctic Ocean Survey", location: "Arctic Ocean", status: "TRANSIT" },
  ]);
  const cargo = usePolarData("polarCargo", []);
  const routes = usePolarData("polarRoutes", []);
  const inventory = usePolarData("polarInventory", []);
  const personnel = usePolarData("polarPersonnel", []);
  const movement = usePolarData("polarMovement", []);
  const emergencies = usePolarData("polarEmergencies", []);

  const activeExpeditions = expeditions.filter(x => ["ACTIVE", "TRANSIT"].includes(x.status)).length;
  const openAlerts = emergencies.filter(x => !["RESOLVED", "CLOSED"].includes(x.status)).length;
  const liveTracking = movement.filter(x => ["MOVING", "STATIONARY"].includes(x.status)).length;
  const trackedAssets = inventory.length + cargo.length;

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">POLAR OPERATIONS</p>
          <h2>Expedition Command Dashboard</h2>
          <p>Centralized monitoring and management for polar research operations.</p><div className="mission-status">● LIVE DATA CONNECTED</div>
        </div>
        <button className="primary-btn" onClick={() => window.dispatchEvent(new CustomEvent("polar-quick-action", { detail: "Expeditions" }))}>
          + New Expedition
        </button>
      </section>

      <section className="stats-grid">
        <StatCard title="Active Expeditions" value={String(activeExpeditions).padStart(2, "0")} icon="🚢" />
        <StatCard title="Assets / Cargo" value={String(trackedAssets)} icon="📦" />
        <StatCard title="Live Telemetry" value={String(liveTracking).padStart(2, "0")} icon="📡" />
        <StatCard title="Open Alerts" value={String(openAlerts).padStart(2, "0")} icon="⚠️" />
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <h3>Expedition Overview</h3>
            <span>{expeditions.length} Total</span>
          </div>
          {expeditions.slice(0, 5).map(item => (
            <div className="expedition" key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.mission} • {item.location}</span>
              <b>{item.status}</b>
            </div>
          ))}
          {expeditions.length === 0 && <p className="empty-state">No expedition records yet.</p>}
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Operational Status</h3>
            <span>LIVE</span>
          </div>
          <StatusRow label="Cargo Records" value={String(cargo.length)} />
          <StatusRow label="Saved Routes" value={String(routes.length)} />
          <StatusRow label="Personnel" value={String(personnel.length)} />
          <StatusRow label="Inventory Assets" value={String(inventory.length)} />
          <StatusRow label="Open Alerts" value={String(openAlerts)} />
        </div>
      </section>

      <section className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <h3>Quick Actions</h3>
          <span>COMMAND</span>
        </div>
        <div className="stats-grid">
          <button className="primary-btn" onClick={() => window.dispatchEvent(new CustomEvent("polar-quick-action", { detail: "Cargo & Logistics" }))}>
            📦 Manage Cargo
          </button>
          <button className="primary-btn" onClick={() => window.dispatchEvent(new CustomEvent("polar-quick-action", { detail: "Route Planning" }))}>
            🗺️ Plan Route
          </button>
          <button className="primary-btn" onClick={() => window.dispatchEvent(new CustomEvent("polar-quick-action", { detail: "Emergency Center" }))}>
            🚨 Emergency Center
          </button>
          <button className="primary-btn" onClick={() => window.dispatchEvent(new CustomEvent("polar-quick-action", { detail: "Reports & Analytics" }))}>
            📊 Open Reports
          </button>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="status-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
function ExpeditionsPage() {
  const [expeditions, setExpeditions] = useState(() => {
    const saved = localStorage.getItem("polarExpeditions");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "POLAR-2026-A",
            mission: "Antarctic Research Mission",
            location: "Antarctica",
            status: "ACTIVE",
          },
          {
            id: 2,
            name: "POLAR-2026-B",
            mission: "Arctic Ocean Survey",
            location: "Arctic Ocean",
            status: "TRANSIT",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mission: "",
    location: "",
    status: "PLANNED",
  });

  function saveExpeditions(data) {
    setExpeditions(data);
    writePolar("polarExpeditions", data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.mission || !form.location) {
      alert("Please fill all fields.");
      return;
    }

    const newExpedition = {
      id: Date.now(),
      ...form,
    };

    saveExpeditions([
      ...expeditions,
      newExpedition,
    ]);

    setForm({
      name: "",
      mission: "",
      location: "",
      status: "PLANNED",
    });

    setShowForm(false);
  }

  function deleteExpedition(id) {
    const updated = expeditions.filter(
      (item) => item.id !== id
    );

    saveExpeditions(updated);
  }

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">POLAR OPERATIONS</p>

          <h2>Expedition Management</h2>

          <p>
            Create, monitor and manage polar research
            expeditions.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + New Expedition
        </button>
      </section>

      {showForm && (
        <div className="panel">
          <h3>Create New Expedition</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                placeholder="Expedition ID"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Mission Name"
                value={form.mission}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mission: e.target.value,
                  })
                }
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({
                    ...form,
                    location: e.target.value,
                  })
                }
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option value="PLANNED">PLANNED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="TRANSIT">TRANSIT</option>
                <option value="COMPLETED">
                  COMPLETED
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Save Expedition
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h3>All Expeditions</h3>

          <span>
            {expeditions.length} Expeditions
          </span>
        </div>

        <div className="expedition-list">
          {expeditions.map((item) => (
            <div
              className="expedition"
              key={item.id}
            >
              <div className="exp-icon">❄</div>

              <div className="exp-info">
                <strong>{item.name}</strong>

                <span>{item.mission}</span>

                <small>{item.location}</small>
              </div>

              <span className="badge">
                {item.status}
              </span>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteExpedition(item.id)
                }
              >
                Delete
              </button>
            </div>
          ))}

          {expeditions.length === 0 && (
            <p>No expeditions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
function RoutePlanningPage() {
  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem("polarRoutes");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Antarctic Base Route",
            start: "McMurdo Station",
            destination: "South Pole",
            distance: "1,600 km",
            status: "ACTIVE",
          },
        ];
  });

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    start: "",
    destination: "",
    distance: "",
    status: "PLANNED",
  });

  function saveRoutes(data) {
    setRoutes(data);

    writePolar("polarRoutes", data);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.name ||
      !form.start ||
      !form.destination ||
      !form.distance
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newRoute = {
      id: Date.now(),
      ...form,
    };

    saveRoutes([...routes, newRoute]);

    setForm({
      name: "",
      start: "",
      destination: "",
      distance: "",
      status: "PLANNED",
    });

    setShowForm(false);
  }

  function deleteRoute(id) {
    const updated = routes.filter(
      (route) => route.id !== id
    );

    saveRoutes(updated);
  }

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">POLAR NAVIGATION</p>

          <h2>Route Planning</h2>

          <p>
            Plan and manage routes for polar
            expeditions.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowForm(true)}
        >
          + New Route
        </button>
      </section>

      {showForm && (
        <div className="panel">
          <h3>Create New Route</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                placeholder="Route Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <input
                placeholder="Start Point"
                value={form.start}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start: e.target.value,
                  })
                }
              />

              <input
                placeholder="Destination"
                value={form.destination}
                onChange={(e) =>
                  setForm({
                    ...form,
                    destination: e.target.value,
                  })
                }
              />

              <input
                placeholder="Distance (e.g. 500 km)"
                value={form.distance}
                onChange={(e) =>
                  setForm({
                    ...form,
                    distance: e.target.value,
                  })
                }
              />

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
              >
                <option value="PLANNED">
                  PLANNED
                </option>

                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="primary-btn"
              >
                Save Route
              </button>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <h3>Saved Routes</h3>

          <span>
            {routes.length} Routes
          </span>
        </div>

        {routes.map((route) => (
          <div
            className="expedition"
            key={route.id}
          >
            <div className="exp-icon">
              🗺️
            </div>

            <div className="exp-info">
              <strong>{route.name}</strong>

              <span>
                {route.start} → {route.destination}
              </span>

              <small>
                Distance: {route.distance}
              </small>
            </div>

            <span className="badge">
              {route.status}
            </span>

            <button
              className="delete-btn"
              onClick={() =>
                deleteRoute(route.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
const MODULE_CONFIG = {
  "Inventory & Assets": {
    eyebrow: "POLAR ASSET CONTROL",
    description: "Track equipment, supplies and operational assets.",
    storage: "polarInventory",
    fields: [
      ["name", "Asset / Item Name"],
      ["category", "Category"],
      ["location", "Current Location"],
    ],
    statuses: ["AVAILABLE", "IN USE", "MAINTENANCE", "LOST"],
    icon: "📦",
  },
  Personnel: {
    eyebrow: "POLAR PERSONNEL",
    description: "Manage deployed personnel and operational assignments.",
    storage: "polarPersonnel",
    fields: [
      ["name", "Full Name"],
      ["role", "Role / Position"],
      ["expedition", "Expedition"],
    ],
    statuses: ["ACTIVE", "STANDBY", "ON LEAVE", "COMPLETED"],
    icon: "👤",
  },
  "Movement Tracking": {
    eyebrow: "POLAR TRACKING",
    description: "Record and monitor the movement of teams, vehicles and assets.",
    storage: "polarMovement",
    fields: [
      ["subject", "Vehicle / Team / Asset"],
      ["location", "Current Location"],
      ["coordinates", "Coordinates"],
    ],
    statuses: ["MOVING", "STATIONARY", "ARRIVED", "OFFLINE"],
    icon: "📍",
  },
  "Emergency Center": {
    eyebrow: "POLAR SAFETY",
    description: "Log incidents and track emergency response actions.",
    storage: "polarEmergencies",
    fields: [
      ["incident", "Incident"],
      ["location", "Location"],
      ["severity", "Severity"],
    ],
    statuses: ["OPEN", "RESPONDING", "RESOLVED", "CLOSED"],
    icon: "🚨",
  },
  "AI Intelligence": {
    eyebrow: "POLAR INTELLIGENCE",
    description: "Capture intelligence requests and operational analysis tasks.",
    storage: "polarAI",
    fields: [
      ["request", "Analysis Request"],
      ["source", "Data Source"],
      ["priority", "Priority"],
    ],
    statuses: ["QUEUED", "ANALYZING", "COMPLETED", "REVIEW"],
    icon: "🤖",
  },
  "Reports & Analytics": {
    eyebrow: "POLAR ANALYTICS",
    description: "Create and track operational reports and analytical summaries.",
    storage: "polarReports",
    fields: [
      ["name", "Report Name"],
      ["type", "Report Type"],
      ["period", "Reporting Period"],
    ],
    statuses: ["DRAFT", "GENERATING", "READY", "ARCHIVED"],
    icon: "📊",
  },
  Notifications: {
    eyebrow: "POLAR COMMS",
    description: "Create and manage operational notifications.",
    storage: "polarNotifications",
    fields: [
      ["title", "Notification Title"],
      ["message", "Message"],
      ["audience", "Audience"],
    ],
    statuses: ["NEW", "SENT", "ACKNOWLEDGED", "ARCHIVED"],
    icon: "🔔",
  },
  "Admin Panel": {
    eyebrow: "POLAR ADMINISTRATION",
    description: "Manage command-center users, roles and access records.",
    storage: "polarAdmin",
    fields: [
      ["name", "User Name"],
      ["role", "Role"],
      ["access", "Access Level"],
    ],
    statuses: ["ACTIVE", "SUSPENDED", "PENDING", "DISABLED"],
    icon: "🛡️",
  },
  Settings: {
    eyebrow: "POLAR CONFIGURATION",
    description: "Manage command-center configuration values.",
    storage: "polarSettings",
    fields: [
      ["name", "Setting Name"],
      ["value", "Setting Value"],
      ["description", "Description"],
    ],
    statuses: ["ACTIVE", "PENDING", "DISABLED"],
    icon: "⚙️",
  },
};

function ModulePage({ title }) {
  const config = MODULE_CONFIG[title] || {
    eyebrow: "POLAR OPERATIONS",
    description: `${title} module of the Polar Command Center.`,
    storage: `polar-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    fields: [["name", "Record Name"], ["description", "Description"], ["owner", "Owner"]],
    statuses: ["ACTIVE", "PENDING", "COMPLETED"],
    icon: "◈",
  };

  const emptyForm = Object.fromEntries(config.fields.map(([key]) => [key, ""]));
  const [records, setRecords] = useState(() => readPolar(config.storage, []));
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm, status: config.statuses[0] });

  useEffect(() => {
    const refresh = () => setRecords(readPolar(config.storage, []));
    window.addEventListener("polar-data-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("polar-data-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [config.storage]);

  function persist(data) {
    setRecords(data);
    writePolar(config.storage, data);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, status: config.statuses[0] });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const missing = config.fields.some(([key]) => !String(form[key] || "").trim());
    if (missing) return alert("Please fill all fields.");

    const record = {
      id: editingId || Date.now(),
      ...form,
      createdAt: editingId
        ? records.find(r => r.id === editingId)?.createdAt
        : new Date().toLocaleString(),
    };

    persist(editingId
      ? records.map(r => r.id === editingId ? record : r)
      : [...records, record]
    );
    resetForm();
    setShowForm(false);
  }

  function editRecord(record) {
    const values = Object.fromEntries(config.fields.map(([key]) => [key, record[key] || ""]));
    setForm({ ...values, status: record.status || config.statuses[0] });
    setEditingId(record.id);
    setShowForm(true);
  }

  function deleteRecord(id) {
    if (!window.confirm("Delete this record?")) return;
    persist(records.filter(record => record.id !== id));
  }

  function cycleStatus(record) {
    const index = config.statuses.indexOf(record.status);
    const next = config.statuses[(index + 1) % config.statuses.length];
    persist(records.map(r => r.id === record.id ? { ...r, status: next } : r));
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = Object.values(record).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    );
    return matchesSearch && (statusFilter === "ALL" || record.status === statusFilter);
  });

  const activeCount = records.filter(r => r.status === config.statuses[0]).length;
  const otherCount = records.length - activeCount;

  return (
    <div className="content">
      <section className="welcome">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h2>{title}</h2>
          <p>{config.description}</p>
        </div>
        <button className="primary-btn" onClick={() => {
          if (showForm) resetForm();
          setShowForm(v => !v);
        }}>
          {showForm ? "Close Form" : "+ New Record"}
        </button>
      </section>

      <section className="stats-grid">
        <StatCard title="Total Records" value={String(records.length).padStart(2, "0")} icon={config.icon} />
        <StatCard title="Active" value={String(activeCount).padStart(2, "0")} icon="✓" />
        <StatCard title="Other Status" value={String(otherCount).padStart(2, "0")} icon="◷" />
        <StatCard title="System Status" value="ONLINE" icon="●" />
      </section>

      {showForm && (
        <section className="panel">
          <div className="panel-header">
            <h3>{editingId ? "Edit Record" : "Create New Record"}</h3>
            <span>{title}</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {config.fields.map(([key, label]) => (
                <input
                  key={key}
                  placeholder={label}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  required
                />
              ))}
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                {config.statuses.map(status => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Record" : "Save Record"}
              </button>
              <button type="button" className="secondary-btn" onClick={() => {
                resetForm();
                setShowForm(false);
              }}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h3>{title} Records</h3>
          <span>{filteredRecords.length} / {records.length}</span>
        </div>

        <div style={{ marginBottom: "18px", display: "grid", gridTemplateColumns: "1fr 180px", gap: "10px" }}>
          <input
            placeholder={`Search ${title}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            {config.statuses.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>

        {filteredRecords.length === 0 ? (
          <p className="empty-state">
            {records.length === 0
              ? `No ${title.toLowerCase()} records yet. Click "+ New Record" to add one.`
              : "No records match your search/filter."}
          </p>
        ) : (
          <div className="expedition-list">
            {filteredRecords.map(record => (
              <div className="expedition" key={record.id}>
                <div className="exp-icon">{config.icon}</div>
                <div className="exp-info">
                  <strong>{String(record[config.fields[0][0]] || "Untitled")}</strong>
                  <span>
                    {config.fields.slice(1).map(([key]) => record[key]).filter(Boolean).join(" • ")}
                  </span>
                  <small>Created: {record.createdAt || "—"}</small>
                </div>
                <button className="secondary-btn" onClick={() => cycleStatus(record)}>
                  {record.status}
                </button>
                <button className="secondary-btn" onClick={() => editRecord(record)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteRecord(record.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel" style={{ marginTop: "20px" }}>
        <div className="panel-header">
          <h3>Operational Controls</h3>
          <span>READY</span>
        </div>
        <p className="empty-state">
          Status button ko tap karke record ko next operational state mein move karo.
          Changes automatically dashboard aur dusre connected views mein sync honge.
        </p>
      </section>
    </div>
  );
}

export default App;