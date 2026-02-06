async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  return await res.json();
}

function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}

function hasTag(item, tag) {
  if (!tag) return true;
  return (item.tags || []).map(norm).includes(norm(tag));
}

function containsText(item, q) {
  if (!q) return true;
  const hay = [
    item.name, item.title, item.desc, item.venue, item.year,
    ...(item.tags || [])
  ].map(x => norm(x)).join(" ");
  return hay.includes(norm(q));
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function renderBadges(tags = []) {
  if (!tags.length) return "";
  return `<div class="badges">${tags.map(t => `<span class="badge">${t}</span>`).join("")}</div>`;
}