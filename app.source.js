const SYSTEM_ID = "__PK_SYSTEM_ID__";

const API_BASE = "https://api.pluralkit.me/v2";

async function loadSystem() {
  try {
    const res = await fetch(`${API_BASE}/systems/${SYSTEM_ID}`);
    const sys = await res.json();
    renderSystem(sys);
  } catch (err) {
    document.getElementById("system-header").innerHTML =
      `<div class="loading">Couldn't load system info.</div>`;
  }
}

function renderSystem(sys) {
  const header = document.getElementById("system-header");
  const bannerHtml = sys.banner
    ? `<img class="banner-img" src="${sys.banner}" alt="">`
    : "";

  header.innerHTML = `
    ${bannerHtml}
    <div class="header-content">
      ${sys.avatar_url ? `<img class="sys-avatar" src="${sys.avatar_url}" alt="">` : ""}
      <div>
        <h1 class="sys-name">${escapeHtml(sys.name || "System")}</h1>
        ${sys.description ? `<p class="sys-desc">${escapeHtml(sys.description)}</p>` : ""}
      </div>
    </div>
  `;
}

async function loadMembers() {
  try {
    const res = await fetch(`${API_BASE}/systems/${SYSTEM_ID}/fronters`);

    if (res.status === 204) {
      renderMembers([]);
      return;
    }

    const data = await res.json();
    renderMembers(data.members || []);
  } catch (err) {
    document.getElementById("alters").innerHTML =
      `<div class="loading">Couldn't load current front.</div>`;
  }
}

function renderMembers(members) {
  const container = document.getElementById("alters");
  container.innerHTML = "";

  if (!members || members.length === 0) {
    container.innerHTML = `<div class="loading">No one is currently marked as fronting.</div>`;
    return;
  }

  members.forEach(m => {
    const card = document.createElement("div");
    card.className = "alter-card";
    card.innerHTML = `
      <img src="${m.avatar_url || ""}" alt="">
      <div>
        <h3>${escapeHtml(m.display_name || m.name)} ${m.pronouns ? `<span class="pronouns">(${escapeHtml(m.pronouns)})</span>` : ""}</h3>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadSystem();
loadMembers();
