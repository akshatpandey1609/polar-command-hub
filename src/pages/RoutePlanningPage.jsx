import { useState } from "react";
import { writePolar } from "../utils";

export default function RoutePlanningPage() {
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
