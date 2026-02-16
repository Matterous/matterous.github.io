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

async function loadWeeklyNews() {
  const elRange   = document.getElementById("weekly-range");
  const elPreface = document.getElementById("weekly-preface");
  const elList    = document.getElementById("weekly-list");
  const section   = document.getElementById("weekly-news");

  if (!section || !elPreface || !elList) return;

  try {
    const res = await fetch("/assets/data/weekly_news.json", { cache: "no-store" });
    if (!res.ok) throw new Error("weekly_news.json not found");
    const data = await res.json();

    elRange.textContent = `${data.week_start} - ${data.week_end}`;

    // Preface (top story)
    const top = data.top_story;
    elPreface.innerHTML = `
      <div class="weekly__img">
        <img src="${top.image}" alt="${escapeHtml(top.title)}">
      </div>
      <div class="weekly__prefaceBody">
        <h3 class="weekly__prefaceTitle"><a href="${top.url}" target="_blank" rel="noopener">${escapeHtml(top.title)}</a></h3>
        <div class="weekly__prefaceMeta">Impact score: ${top.impact_score} • Source: ${escapeHtml(top.source)} • ${escapeHtml(top.date)}</div>
        <p class="weekly__prefaceDesc">${escapeHtml(top.summary)}</p>
      </div>
    `;

    // Ranked list
    const items = data.ranked.slice(0, 10);
    elList.innerHTML = items.map((it, idx) => `
      <div class="weekly__item">
        <div class="weekly__itemTop">
          <div class="weekly__itemTitle">${idx+1}. <a href="${it.url}" target="_blank" rel="noopener">${escapeHtml(it.title)}</a></div>
          <div class="weekly__itemMeta">${escapeHtml(it.source)} • ${escapeHtml(it.date)} • score ${it.impact_score}</div>
        </div>
        <p class="weekly__itemDesc">${escapeHtml(it.summary)}</p>
      </div>
    `).join("");

  } catch (e) {
    // If no file yet, hide section to keep homepage clean
    section.style.display = "none";
  }
}

// safe minimal HTML escape
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

document.addEventListener("DOMContentLoaded", loadWeeklyNews);