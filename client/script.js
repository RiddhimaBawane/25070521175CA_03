const API_BASE = (window.location.origin.includes("localhost:3000") || window.location.origin.includes("127.0.0.1:3000")) ? "" : "http://localhost:3000";

let filter = "All";

// User ka text safe banane ke liye (koi HTML/script chalne se rokta hai)
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

async function load() {
  const res = await fetch(API_BASE + "/api/items");
  let items = await res.json();
  if (filter !== "All") items = items.filter(i => i.type === filter);

  const list = document.getElementById("list");
  if (items.length === 0) {
    list.innerHTML = '<div class="empty">Abhi koi post nahi hai.</div>';
    return;
  }

  list.innerHTML = items.map(i => `
    <div class="card ${i.returned ? "returned" : ""}">
      <div class="top">
        <strong>${esc(i.name)}</strong>
        <div class="badge-group">
          ${i.returned ? '<span class="badge badge-returned">Returned</span>' : ""}
          <span class="badge ${esc(i.type)}">${esc(i.type)}</span>
        </div>
      </div>
      <div class="meta-row">
        <span class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          ${esc(i.location)}
        </span>
        <span class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          ${esc(i.contact)}
        </span>
      </div>
      ${i.description ? `<div class="description-text">${esc(i.description)}</div>` : ""}
      <div class="actions">
        <button class="btn-toggle" onclick="toggle('${i._id}', ${!i.returned})">
          ${i.returned ? "Undo" : "Mark returned"}
        </button>
        <button class="btn-del" onclick="removeItem('${i._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

async function toggle(id, value) {
  await fetch(API_BASE + "/api/items/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returned: value })
  });
  load();
}

async function removeItem(id) {
  if (!confirm("Delete this post?")) return;
  await fetch(API_BASE + "/api/items/" + id, { method: "DELETE" });
  load();
}

document.getElementById("form").onsubmit = async (e) => {
  e.preventDefault();
  await fetch(API_BASE + "/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: document.getElementById("type").value,
      name: document.getElementById("name").value,
      location: document.getElementById("location").value,
      contact: document.getElementById("contact").value,
      description: document.getElementById("description").value
    })
  });
  e.target.reset();
  load();
};

document.querySelectorAll(".filters button").forEach(b => {
  b.onclick = () => {
    filter = b.dataset.f;
    document.querySelectorAll(".filters button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    load();
  };
});

load();
