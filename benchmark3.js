const records = [];
for (let i = 0; i < 100000; i++) {
  records.push({
    id: i,
    name: `Name ${i}`,
    description: `Description for record ${i} with some extra text`,
    owner: `Owner ${i % 10}`,
    status: i % 2 === 0 ? "ACTIVE" : "PENDING",
    createdAt: new Date().toISOString()
  });
}

const config = {
  fields: [["name", "Record Name"], ["description", "Description"], ["owner", "Owner"]],
  statuses: ["ACTIVE", "PENDING", "COMPLETED"]
};

const search = "extra text";
const statusFilter = "ACTIVE"; // Use a specific filter to test short-circuiting

// Approach with fixes
console.time("Fix Approach");
const searchLower = search ? search.toLowerCase() : "";
const filteredFix = records.filter(record => {
  if (statusFilter !== "ALL" && record.status !== statusFilter) return false;
  if (!searchLower) return true;
  return config.fields.some(([key]) =>
    String(record[key] ?? "").toLowerCase().includes(searchLower)
  );
});
console.timeEnd("Fix Approach");
