const fallbackProjects = [
  { id: "nexus", title: "Nexus Intelligence", category: "AI / Analytics Platform", year: "2026", description: "A unified intelligence workspace that transforms operational data into clear, actionable decisions. Built for speed, security, and real-time collaboration.", tags: ["React", "AI/ML", "Cloud"] },
  { id: "pulse", title: "Pulse Mobile", category: "Health & Wellness App", year: "2025", description: "A focused wellness companion that turns complex health signals into simple daily routines and meaningful progress insights.", tags: ["Mobile", "Product Design", "Health"] },
  { id: "atlas", title: "Atlas Operations", category: "Enterprise Software", year: "2025", description: "An operations control system that brings assets, teams, and workflows into one dependable digital environment.", tags: ["SaaS", "Automation", "UX"] }
];
const fallbackArticles = [
  { id: "ai-products", title: "Designing AI products people can trust", category: "ARTIFICIAL INTELLIGENCE", date: "FEB 18, 2026", read: "6 MIN READ", content: "Trustworthy AI starts before the first model is deployed. It begins with clear boundaries, understandable interfaces, responsible data practices, and systems that give people control over important decisions." },
  { id: "product-speed", title: "Why software speed is a business advantage", category: "ENGINEERING", date: "JAN 30, 2026", read: "5 MIN READ", content: "Software performance is not only a technical metric. Fast systems reduce friction, increase adoption, improve reliability, and give teams more room to respond to changing needs." },
  { id: "human-tech", title: "Building technology that feels human", category: "PRODUCT DESIGN", date: "JAN 12, 2026", read: "4 MIN READ", content: "The strongest products reduce cognitive load. Human-centered technology makes priorities visible, keeps users oriented, and replaces unnecessary complexity with intentional simplicity." }
];

let activeType = "projects";
let selectedId = null;
let projects = read("manutech_projects", fallbackProjects);
let articles = read("manutech_articles", fallbackArticles);

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function getItems() { return activeType === "projects" ? projects : articles; }
function keyForType() { return activeType === "projects" ? "manutech_projects" : "manutech_articles"; }
function save() {
  localStorage.setItem(keyForType(), JSON.stringify(getItems()));
  document.getElementById("studio-status").textContent = "Saved. Changes appear on the public website.";
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[char]);
}
function renderList() {
  const list = document.getElementById("item-list");
  const items = getItems();
  list.innerHTML = items.map(item => `<button class="item-button ${item.id === selectedId ? "active" : ""}" data-id="${item.id}">${escapeHtml(item.title)}<span>${escapeHtml(item.category || item.year || "")}</span></button>`).join("");
  list.querySelectorAll("button").forEach(button => button.addEventListener("click", () => { selectedId = button.dataset.id; render(); }));
}
function renderEditor() {
  const item = getItems().find(entry => entry.id === selectedId) || getItems()[0];
  selectedId = item?.id || null;
  const editor = document.getElementById("editor");
  if (!item) { editor.innerHTML = `<p>No content yet. Create a new item.</p>`; return; }
  if (activeType === "projects") {
    editor.innerHTML = `<label>Title<input name="title" value="${escapeHtml(item.title)}"></label><label>Category<input name="category" value="${escapeHtml(item.category)}"></label><label>Year<input name="year" value="${escapeHtml(item.year)}"></label><label>Description<textarea name="description">${escapeHtml(item.description)}</textarea></label><label>Tags (comma separated)<input name="tags" value="${escapeHtml(item.tags.join(", "))}"></label><div class="editor-actions"><button class="button button-primary" id="save-item">Save changes</button><button class="button delete-button" id="delete-item">Delete</button></div>`;
  } else {
    editor.innerHTML = `<label>Title<input name="title" value="${escapeHtml(item.title)}"></label><label>Category<input name="category" value="${escapeHtml(item.category)}"></label><label>Date<input name="date" value="${escapeHtml(item.date)}"></label><label>Reading time<input name="read" value="${escapeHtml(item.read || "")}"></label><label>Article content<textarea name="content">${escapeHtml(item.content)}</textarea></label><div class="editor-actions"><button class="button button-primary" id="save-item">Save changes</button><button class="button delete-button" id="delete-item">Delete</button></div>`;
  }
  document.getElementById("save-item").addEventListener("click", () => {
    const values = {};
    editor.querySelectorAll("input, textarea").forEach(field => values[field.name] = field.value.trim());
    if (!values.title) return;
    const items = getItems();
    const index = items.findIndex(entry => entry.id === selectedId);
    if (activeType === "projects") values.tags = values.tags.split(",").map(tag => tag.trim()).filter(Boolean);
    if (index >= 0) items[index] = { ...items[index], ...values };
    save();
    render();
  });
  document.getElementById("delete-item").addEventListener("click", () => {
    if (!confirm("Delete this content item?")) return;
    const items = getItems();
    const index = items.findIndex(entry => entry.id === selectedId);
    if (index >= 0) items.splice(index, 1);
    selectedId = items[0]?.id || null;
    save();
    render();
  });
}
function render() { renderList(); renderEditor(); }

document.querySelectorAll(".studio-tabs button").forEach(button => button.addEventListener("click", () => {
  activeType = button.dataset.tab;
  selectedId = null;
  document.querySelectorAll(".studio-tabs button").forEach(tab => tab.classList.toggle("active", tab === button));
  render();
}));
document.getElementById("new-item").addEventListener("click", () => {
  const item = activeType === "projects"
    ? { id: `project-${Date.now()}`, title: "Untitled Project", category: "New Category", year: String(new Date().getFullYear()), description: "Add a clear description of this project and its impact.", tags: ["Technology"] }
    : { id: `article-${Date.now()}`, title: "Untitled Article", category: "FIELD NOTES", date: new Date().toLocaleDateString("en-US", { month:"short", day:"2-digit", year:"numeric" }).toUpperCase(), read: "5 MIN READ", content: "Write the article content here." };
  getItems().push(item);
  selectedId = item.id;
  save();
  render();
});
render();
