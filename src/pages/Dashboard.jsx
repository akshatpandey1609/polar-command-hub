import { usePolarData } from "../utils";
import StatCard from "../components/StatCard";
import StatusRow from "../components/StatusRow";

export default function Dashboard() {
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
