// ===============================================
// DASHBOARD LOGIC — demo only, no real backend.
// Reads the logged-in user from sessionStorage
// (set by login.js on successful sign-in) and
// renders everything else from mock data below.
// ===============================================

document.addEventListener("DOMContentLoaded", () => {

  // ---------- AUTH GUARD ----------
  // If nobody is logged in (sessionStorage empty), bounce back to login.
  // Comment this block out while you're just previewing the dashboard.
  const currentUser = JSON.parse(sessionStorage.getItem("hrme_currentUser") || "null");
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  // ---------- AVATAR HELPER ----------
  const avatarColors = ["#1e3a8a", "#2563eb", "#0f766e", "#b45309", "#7c3aed", "#0891b2"];

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  }

  function colorFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  }

  function makeAvatarEl(tagName, className, name) {
    const el = document.createElement(tagName);
    el.className = className;
    el.textContent = initials(name);
    el.style.background = colorFor(name);
    return el;
  }

  // ---------- WELCOME / TOPBAR ----------
  document.getElementById("welcomeName").textContent = currentUser.name.split(" ")[0];
  document.getElementById("topbarName").textContent = currentUser.name;
  const topbarAvatar = document.getElementById("topbarAvatar");
  topbarAvatar.textContent = initials(currentUser.name);
  topbarAvatar.style.background = colorFor(currentUser.name);

  // ---------- STAT RINGS ----------
  document.querySelectorAll(".stat-ring").forEach((ring) => {
    const percent = Number(ring.dataset.percent || 60);
    const circle = ring.querySelector(".ring-fill");
    const circumference = 2 * Math.PI * 28; // r = 28
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
  });

  // ---------- MOCK DATA ----------
  const interviews = [
    { name: "Albert Flores", role: "Product Designer", time: "10:00–10:40" },
    { name: "Ralph Edwards", role: "UI Designer", time: "10:00–10:40" },
  ];

  const stages = [
    { label: "New Applied", value: 60 },
    { label: "Screening", value: 45 },
    { label: "First Test", value: 100, active: true },
    { label: "Interview", value: 35 },
    { label: "Hired", value: 20 },
    { label: "Onboard", value: 12 },
  ];

  const candidates = [
    {
      name: "Albert Flores",
      stage: "Hired",
      date: "06/16/2023",
      location: "Abuja",
      job: "Product Designer",
      team: "Development",
      type: "Remote/Hybrid",
    },
    {
      name: "Jenny Wilson",
      stage: "Interview",
      date: "06/19/2023",
      location: "Lagos",
      job: "Accountant",
      team: "Accounting",
      type: "Hybrid",
    },
    {
      name: "Ralph Edwards",
      stage: "First Test",
      date: "06/20/2023",
      location: "Ibadan",
      job: "UI Designer",
      team: "Development",
      type: "Remote",
    },
  ];

  const inactiveCandidates = []; // none yet — table will show an empty state

  // ---------- RENDER: UPCOMING INTERVIEWS ----------
  const interviewList = document.getElementById("interviewList");
  interviews.forEach((iv) => {
    const li = document.createElement("li");
    li.className = "interview-item";

    const avatar = makeAvatarEl("span", "interview-avatar", iv.name);

    const info = document.createElement("div");
    info.className = "interview-info";
    info.innerHTML = `<p class="interview-name">${iv.name}</p><p class="interview-role">${iv.role}</p>`;

    const time = document.createElement("span");
    time.className = "interview-time";
    time.textContent = iv.time;

    li.append(avatar, info, time);
    interviewList.appendChild(li);
  });

  // ---------- RENDER: CANDIDATE PER STAGE CHART ----------
  const chartEl = document.getElementById("stageChart");
  const maxValue = Math.max(...stages.map((s) => s.value));

  stages.forEach((stage) => {
    const col = document.createElement("div");
    col.className = "bar-col";

    const heightPct = (stage.value / maxValue) * 100;

    const bar = document.createElement("div");
    bar.className = "bar" + (stage.active ? " active" : "");
    bar.style.height = `${heightPct}%`;
    if (stage.active) {
      const val = document.createElement("span");
      val.className = "bar-value";
      val.textContent = stage.value;
      bar.appendChild(val);
    }

    const label = document.createElement("span");
    label.className = "bar-label";
    label.textContent = stage.label;

    col.append(bar, label);
    chartEl.appendChild(col);
  });

  // ---------- RENDER: CANDIDATES TABLE ----------
  const stageClassMap = {
    "Hired": "hired",
    "Interview": "interview",
    "First Test": "first-test",
    "Screening": "screening",
    "New Applied": "new-applied",
    "Onboard": "onboard",
    "Rejected": "rejected",
  };

  const tbody = document.getElementById("candidatesTableBody");

  function renderRows(list) {
    tbody.innerHTML = "";

    if (list.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 9;
      td.style.textAlign = "center";
      td.style.color = "#9ca3af";
      td.style.padding = "24px 10px";
      td.textContent = "No candidates in this view yet.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    list.forEach((c) => {
      const tr = document.createElement("tr");

      const tdCheck = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      tdCheck.appendChild(checkbox);

      const tdCandidate = document.createElement("td");
      const wrap = document.createElement("div");
      wrap.className = "candidate-cell";
      const avatar = makeAvatarEl("span", "candidate-avatar", c.name);
      const nameSpan = document.createElement("span");
      nameSpan.textContent = c.name;
      wrap.append(avatar, nameSpan);
      tdCandidate.appendChild(wrap);

      const tdStage = document.createElement("td");
      const stageClass = stageClassMap[c.stage] || "new-applied";
      tdStage.innerHTML = `<span class="stage-pill"><span class="stage-dot ${stageClass}"></span>${c.stage}</span>`;

      const tdDate = document.createElement("td");
      tdDate.textContent = c.date;

      const tdLocation = document.createElement("td");
      tdLocation.textContent = c.location;

      const tdJob = document.createElement("td");
      tdJob.textContent = c.job;

      const tdTeam = document.createElement("td");
      tdTeam.textContent = c.team;

      const tdType = document.createElement("td");
      tdType.textContent = c.type;

      const tdMenu = document.createElement("td");
      const menuBtn = document.createElement("button");
      menuBtn.className = "row-menu-btn";
      menuBtn.textContent = "⋮";
      menuBtn.setAttribute("aria-label", `More actions for ${c.name}`);
      tdMenu.appendChild(menuBtn);

      tr.append(tdCheck, tdCandidate, tdStage, tdDate, tdLocation, tdJob, tdTeam, tdType, tdMenu);
      tbody.appendChild(tr);
    });
  }

  // ---------- TAB COUNTS ----------
  const qualifiedCandidates = candidates.filter((c) => c.stage === "Hired" || c.stage === "Interview" || c.stage === "First Test");
  document.getElementById("countAll").textContent = candidates.length;
  document.getElementById("countQualified").textContent = qualifiedCandidates.length;
  document.getElementById("countInactive").textContent = inactiveCandidates.length;

  renderRows(candidates);

  // ---------- TAB SWITCHING ----------
  const tabs = document.querySelectorAll(".table-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const key = tab.dataset.tab;
      if (key === "all") renderRows(candidates);
      if (key === "qualified") renderRows(qualifiedCandidates);
      if (key === "inactive") renderRows(inactiveCandidates);
    });
  });

  // ---------- SELECT ALL CHECKBOX ----------
  const selectAll = document.getElementById("selectAll");
  selectAll.addEventListener("change", () => {
    tbody.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = selectAll.checked;
    });
  });

  // ---------- LOG OUT ----------
  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("hrme_currentUser");
    window.location.href = "login.html";
  });

});