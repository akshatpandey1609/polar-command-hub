import { useState } from "react";
import { writePolar } from "../utils";

export default function ExpeditionsPage() {
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
