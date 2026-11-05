import { useState, useEffect } from "react";

export function readPolar(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback ;
  }
}

export function writePolar(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("polar-data-change"));
}

export function usePolarData(key, fallback = []) {
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

export function seedPolarDemoData() {
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
