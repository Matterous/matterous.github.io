async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url, { cache: "no-cache" });
  el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("[data-include='nav']", "/partials/nav.html");
  await loadPartial("[data-include='footer']", "/partials/footer.html");

  // Mobile nav toggle
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
});