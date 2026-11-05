const { performance } = require('perf_hooks');

// Generate mock data
const cargo = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  cargoName: `Cargo ${i}`,
  quantity: i * 10,
  origin: `Origin ${i % 100}`,
  destination: `Destination ${i % 100}`,
  status: ["PLANNED", "IN TRANSIT", "DELIVERED", "DELAYED"][i % 4]
}));

const search = "Cargo 9999";
const statusFilter = "DELIVERED";

function originalFilter() {
  return cargo.filter(item => {
    const needle = search.toLowerCase();
    const matchesSearch = [item.cargoName, item.quantity, item.origin, item.destination, item.status]
      .some(value => String(value || "").toLowerCase().includes(needle));
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
}

function optimizedFilter() {
  const needle = search.toLowerCase();
  return cargo.filter(item => {
    const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
    if (!matchesStatus) return false;

    if (!needle) return true;

    return String(item.cargoName || "").toLowerCase().includes(needle) ||
           String(item.quantity || "").toLowerCase().includes(needle) ||
           String(item.origin || "").toLowerCase().includes(needle) ||
           String(item.destination || "").toLowerCase().includes(needle) ||
           String(item.status || "").toLowerCase().includes(needle);
  });
}

// Warm up
for(let i = 0; i < 10; i++) {
  originalFilter();
  optimizedFilter();
}

let start = performance.now();
for (let i = 0; i < 100; i++) originalFilter();
let end = performance.now();
console.log("Original:", end - start, "ms");

start = performance.now();
for (let i = 0; i < 100; i++) optimizedFilter();
end = performance.now();
console.log("Optimized:", end - start, "ms");
