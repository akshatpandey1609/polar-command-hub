import { useEffect, useMemo, useState } from "react";
import { readPolar, writePolar } from "../utils";
import StatCard from "../components/StatCard";

export default function CargoPage() {
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
