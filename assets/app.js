const APPLY_EMAIL = "admisiones@ccoc.club"; // TODO: cambia al dominio real

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

function setNavOpen(isOpen) {
  const navPanel = qs("[data-nav-panel]");
  const navToggle = qs("[data-nav-toggle]");
  const shell = qs("[data-shell]");

  if (!navPanel || !navToggle || !shell) return;

  document.body.classList.toggle("nav-open", isOpen);
  navPanel.classList.toggle("is-open", isOpen);
  navPanel.setAttribute("aria-hidden", String(!isOpen));
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

function initNav() {
  const navToggle = qs("[data-nav-toggle]");
  const navLinks = qsa("[data-nav-link]");

  if (!navToggle) return;

  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    setNavOpen(!isOpen);
  });

  navLinks.forEach((a) => {
    a.addEventListener("click", () => setNavOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNavOpen(false);
  });
}

function initReveal() {
  const nodes = qsa("[data-reveal]");
  if (!nodes.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  nodes.forEach((n) => io.observe(n));
}

function encodeMailto(body) {
  return encodeURIComponent(body).replace(/%20/g, "+");
}

function initApplyForm() {
  const form = qs("[data-apply-form]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const role = String(data.get("role") || "").trim();
    const company = String(data.get("company") || "").trim();
    const email = String(data.get("email") || "").trim();
    const why = String(data.get("why") || "").trim();

    const subject = `[CCOC] Solicitud de admisión — ${name || "Candidato/a"}`;
    const body = [
      "Solicitud de admisión (CCOC)",
      "",
      `Nombre: ${name}`,
      `Cargo: ${role}`,
      `Compañía: ${company}`,
      `Email: ${email}`,
      "",
      "Intención / transformación:",
      why,
      "",
      "--",
      "Enviado desde el landing (mailto).",
    ].join("\n");

    const mailto = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeMailto(body)}`;
    window.location.href = mailto;
  });
}

initNav();
initReveal();
initApplyForm();

