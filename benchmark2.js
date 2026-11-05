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

// Old approach
console.time("Old Approach");
const filteredOld = records.filter(record => {
  const matchesSearch = Object.values(record).some(value =>
    String(value).toLowerCase().includes(search.toLowerCase())
  );
  return matchesSearch && (statusFilter === "ALL" || record.status === statusFilter);
});
console.timeEnd("Old Approach");

// New approach
console.time("New Approach");
const searchLower = search.toLowerCase();
const filteredNew = records.filter(record => {
  if (statusFilter !== "ALL" && record.status !== statusFilter) return false;
  if (!search) return true;
  return config.fields.some(([key]) =>
    String(record[key] || "").toLowerCase().includes(searchLower)
  );
});
console.timeEnd("New Approach");

console.log("Old count:", filteredOld.length);
console.log("New count:", filteredNew.length);
