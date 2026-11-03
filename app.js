const defaultProjects = [
  { id: "nexus", title: "Nexus Intelligence", category: "AI / Analytics Platform", year: "2026", description: "A unified intelligence workspace that transforms operational data into clear, actionable decisions. Built for speed, security, and real-time collaboration.", tags: ["React", "AI/ML", "Cloud"] },
  { id: "pulse", title: "Pulse Mobile", category: "Health & Wellness App", year: "2025", description: "A focused wellness companion that turns complex health signals into simple daily routines and meaningful progress insights.", tags: ["Mobile", "Product Design", "Health"] },
  { id: "atlas", title: "Atlas Operations", category: "Enterprise Software", year: "2025", description: "An operations control system that brings assets, teams, and workflows into one dependable digital environment.", tags: ["SaaS", "Automation", "UX"] }
];

const defaultArticles = [
  { id: "ai-products", title: "Designing AI products people can trust", category: "ARTIFICIAL INTELLIGENCE", date: "FEB 18, 2026", read: "6 MIN READ", content: "Trustworthy AI starts before the first model is deployed. It begins with clear boundaries, understandable interfaces, responsible data practices, and systems that give people control over important decisions." },
  { id: "product-speed", title: "Why software speed is a business advantage", category: "ENGINEERING", date: "JAN 30, 2026", read: "5 MIN READ", content: "Software performance is not only a technical metric. Fast systems reduce friction, increase adoption, improve reliability, and give teams more room to respond to changing needs." },
  { id: "human-tech", title: "Building technology that feels human", category: "PRODUCT DESIGN", date: "JAN 12, 2026", read: "4 MIN READ", content: "The strongest products reduce cognitive load. Human-centered technology makes priorities visible, keeps users oriented, and replaces unnecessary complexity with intentional simplicity." }
];

function getStored(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

const projects = getStored("manutech_projects", defaultProjects);
const articles = getStored("manutech_articles", defaultArticles);

function projectCard(project, index) {
  return `<article class="project-card reveal" data-project="${project.id}" tabindex="0" role="button" aria-label="View ${project.title}">
    <div class="project-image">
      <div class="mockup"><div class="mockup-bar"><i></i><i></i><i></i></div><div class="mockup-screen"><div class="mockup-nav"></div><div class="mockup-content"><div class="chart"></div></div></div></div>
    </div>
    <div class="project-meta"><div><h3>${project.title}</h3><p>${project.category} &nbsp; / &nbsp; ${project.year}</p></div><span class="project-arrow">↗</span></div>
  </article>`;
}

function articleCard(article) {
  return `<article class="article-card reveal" data-article="${article.id}" tabindex="0" role="button" aria-label="Read ${article.title}">
    <div class="article-cover"></div>
    <div class="article-content"><span class="article-tag">${article.category}</span><h3>${article.title}</h3><div class="article-footer"><span>${article.date}</span><span>${article.read || "5 MIN READ"}</span></div></div>
  </article>`;
}

document.getElementById("project-grid").innerHTML = projects.map(projectCard).join("");
document.getElementById("article-grid").innerHTML = articles.map(articleCard).join("");
document.getElementById("year").textContent = new Date().getFullYear();

const modal = document.getElementById("detail-modal");
const modalContent = document.getElementById("modal-content");

function openProject(id) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  modalContent.innerHTML = `<div class="modal-hero"><span class="article-tag">${project.category} / ${project.year}</span><h2>${project.title}</h2></div><div class="modal-body"><p>${project.description}</p><div class="modal-tags">${project.tags.map(tag => `<span>${tag}</span>`).join("")}</div></div>`;
  modal.showModal();
}

function openArticle(id) {
  const article = articles.find(item => item.id === id);
  if (!article) return;
  modalContent.innerHTML = `<div class="modal-hero"><span class="article-tag">${article.category} / ${article.date}</span><h2>${article.title}</h2></div><div class="modal-body"><p>${article.content}</p><a class="text-link" href="#contact">Discuss your project <span>↗</span></a></div>`;
  modal.showModal();
}

document.addEventListener("click", event => {
  const project = event.target.closest("[data-project]");
  const article = event.target.closest("[data-article]");
  if (project) openProject(project.dataset.project);
  if (article) openArticle(article.dataset.article);
});

document.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-project], [data-article]")) {
    event.preventDefault();
    event.target.click();
  }
});

document.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", event => {
  if (event.target === modal) modal.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.addEventListener("click", event => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Project inquiry: ${data.get("type")}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nProject type: ${data.get("type")}\n\n${data.get("message")}`);
  contactForm.querySelector(".form-status").textContent = "Your inquiry is ready. Opening your email app...";
  window.location.href = `mailto:hello@manutech.io?subject=${subject}&body=${body}`;
});
