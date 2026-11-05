import { useEffect, useState } from "react";
import { readPolar, writePolar } from "../utils";
import StatCard from "../components/StatCard";

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

export default function ModulePage({ title }) {
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
