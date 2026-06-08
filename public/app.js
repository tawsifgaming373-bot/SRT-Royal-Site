/* ─────────────────────────────────────────────
   SRT ROYAL — PREMIUM FRONTEND APP.JS
   Updated with 6 new features by Sr. Tawsif:
   1) Profile photo upload/change
   2) Name, company, phone edit
   3) Hire request history
   4) Unique client ID card
   5) Member since date
   6) Project status badges (CEO dropdown + client badge)
───────────────────────────────────────────── */

/* ─── EMAILJS INIT ─── */
if (typeof emailjs !== "undefined") {
  emailjs.init("Sbry3VTtnXv382hZ_");
}

/* ─── HELPERS ─── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const API_BASE = "";
const TOKEN_KEY = "srt_token";
const USER_KEY  = "srt_user";

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearAuth = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); };
const getUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); } catch { return null; } };
const setUser = (u) => localStorage.setItem(USER_KEY, JSON.stringify(u));

function showMsg(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  el.classList.toggle("form-error", isError);
  el.classList.toggle("form-success", !isError);
}
function hideMsg(el) { el?.classList.add("hidden"); }

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

/* ─── Status badge helper ─── */
function statusBadge(status) {
  const map = {
    pending: { color: "#f59e0b", label: "⏳ Pending" },
    active:  { color: "#3b82f6", label: "🔵 Active" },
    done:    { color: "#22c55e", label: "✅ Done" },
  };
  const s = map[status] || map.pending;
  return `<span class="status-badge" style="background:${s.color}22;color:${s.color};border:1px solid ${s.color}44;">${s.label}</span>`;
}

/* ─────────────────────────────────────────────
   NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */
const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  navbar?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

/* ─────────────────────────────────────────────
   MOBILE MENU
───────────────────────────────────────────── */
const hamburger = $("#hamburger");
const navLinks  = $("#navLinks");

hamburger?.addEventListener("click", () => {
  const open = navLinks?.classList.toggle("open");
  hamburger.classList.toggle("active", !!open);
  hamburger.setAttribute("aria-expanded", String(!!open));
});

$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    hamburger?.classList.remove("active");
    hamburger?.setAttribute("aria-expanded", "false");
  });
});

/* ─────────────────────────────────────────────
   ACTIVE NAV LINK ON SCROLL
───────────────────────────────────────────── */
const sections = $$("section[id]");
const navItems = $$(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top && window.scrollY < top + sec.offsetHeight) {
      current = sec.id;
    }
  });
  navItems.forEach((l) => {
    l.classList.toggle("active", l.getAttribute("href") === `#${current}`);
  });
}, { passive: true });

/* ─────────────────────────────────────────────
   SCROLL REVEAL ANIMATION
───────────────────────────────────────────── */
const revealEls = $$(".reveal, .hiw-card, .designer-card, .testimonial-card, .hero-stat");
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 60);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => { el.classList.add("reveal"); revealObs.observe(el); });

/* ─────────────────────────────────────────────
   HIRE REQUEST FORM
───────────────────────────────────────────── */
const hireForm = $("#hireForm");

hireForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btn       = $("#hireSubmitBtn");
  const btnText   = btn?.querySelector(".btn-text");
  const btnLoad   = btn?.querySelector(".btn-loading");
  const successEl = $("#hireSuccess");
  const errorEl   = $("#hireError");

  hideMsg(successEl); hideMsg(errorEl);

  const data = {
    projectTitle: $("#projectTitle")?.value.trim(),
    projectDesc:  $("#projectDesc")?.value.trim(),
    budget:       $("#projectBudget")?.value,
    timeline:     $("#projectTimeline")?.value,
    designStyle:  $("#designStyle")?.value || "Not specified",
    name:         $("#clientName")?.value.trim(),
    email:        $("#clientEmail")?.value.trim(),
    whatsapp:     $("#clientWhatsapp")?.value.trim() || "Not provided",
  };

  const required = ["projectTitle","projectDesc","budget","timeline","name","email"];
  for (const k of required) {
    if (!data[k]) {
      showMsg(errorEl, "❌ Please fill in all required fields.", true);
      return;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showMsg(errorEl, "❌ Please enter a valid email address.", true);
    return;
  }

  btn.disabled = true;
  btnText?.classList.add("hidden");
  btnLoad?.classList.remove("hidden");

  try {
    if (typeof emailjs !== "undefined") {
      await emailjs.send("service_g2090y4", "template_eyd4am8", {
        name:         data.name,
        email:        data.email,
        whatsapp:     data.whatsapp,
        projectTitle: data.projectTitle,
        budget:       data.budget,
        timeline:     data.timeline,
        designStyle:  data.designStyle,
        message:      data.projectDesc,
      });
    }

    try {
      await fetch(`${API_BASE}/api/hire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify(data),
      });
    } catch (_) {}

    showMsg(successEl, "✅ Request received! We'll be in touch within 24 hours.");
    hireForm.reset();
  } catch (err) {
    console.error("Hire form error:", err);
    showMsg(errorEl, "❌ Something went wrong. Please try WhatsApp instead.", true);
  } finally {
    btn.disabled = false;
    btnText?.classList.remove("hidden");
    btnLoad?.classList.add("hidden");
  }
});

/* ─────────────────────────────────────────────
   AUTH TABS
───────────────────────────────────────────── */
const tabSignin  = $("#tabSignin");
const tabSignup  = $("#tabSignup");
const signinForm = $("#signinForm");
const signupForm = $("#signupForm");

function switchTab(which) {
  const signin = which === "signin";
  tabSignin?.classList.toggle("active", signin);
  tabSignup?.classList.toggle("active", !signin);
  signinForm?.classList.toggle("hidden", !signin);
  signupForm?.classList.toggle("hidden",  signin);
}
tabSignin?.addEventListener("click", () => switchTab("signin"));
tabSignup?.addEventListener("click", () => switchTab("signup"));

/* ─────────────────────────────────────────────
   AUTH — LOGIN
───────────────────────────────────────────── */
$("#loginBtn")?.addEventListener("click", async () => {
  const email = $("#loginEmail")?.value.trim();
  const pass  = $("#loginPassword")?.value;
  const errEl = $("#loginError");
  hideMsg(errEl);

  if (!email || !pass) return showMsg(errEl, "Please enter email and password.", true);

  const btn = $("#loginBtn");
  btn.disabled = true; const original = btn.textContent; btn.textContent = "Signing in…";

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid credentials");

    setToken(data.token);
    setUser(data.user || { email });
    await loadFullProfile();
    updateAuthUI();
    document.getElementById("profile-section")?.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showMsg(errEl, err.message || "Login failed.", true);
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
});

/* ─────────────────────────────────────────────
   AUTH — SIGNUP
───────────────────────────────────────────── */
$("#signupBtn")?.addEventListener("click", async () => {
  const name    = $("#signupName")?.value.trim();
  const email   = $("#signupEmail")?.value.trim();
  const company = $("#signupCompany")?.value.trim();
  const phone   = $("#signupPhone")?.value.trim();
  const pass    = $("#signupPassword")?.value;
  const errEl   = $("#signupError");
  hideMsg(errEl);

  if (!name || !email || !pass) return showMsg(errEl, "Name, email and password are required.", true);
  if (pass.length < 6) return showMsg(errEl, "Password must be at least 6 characters.", true);

  const btn = $("#signupBtn");
  btn.disabled = true; const original = btn.textContent; btn.textContent = "Creating account…";

  try {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, company, phone, password: pass }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");

    setToken(data.token);
    setUser(data.user || { name, email, company, phone });
    await loadFullProfile();
    updateAuthUI();
    document.getElementById("profile-section")?.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showMsg(errEl, err.message || "Signup failed.", true);
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
});

/* ─────────────────────────────────────────────
   LOAD FULL PROFILE FROM SERVER
   (gets user + hireRequests from /api/me)
───────────────────────────────────────────── */
async function loadFullProfile() {
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.user) setUser(data.user);
    // Save hire requests in memory for rendering
    window._srtHireRequests = data.hireRequests || [];
  } catch (_) {}
}

/* ─────────────────────────────────────────────
   FEATURE 1: PHOTO UPLOAD
───────────────────────────────────────────── */
async function uploadPhoto(file) {
  const token = getToken();
  if (!token || !file) return null;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch(`${API_BASE}/api/user/upload-photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    if (data.user) setUser(data.user);
    return data.photoUrl;
  } catch (err) {
    alert("Photo upload failed: " + err.message);
    return null;
  }
}

/* ─────────────────────────────────────────────
   FEATURE 2: PROFILE EDIT (name, company, phone)
───────────────────────────────────────────── */
async function saveProfileEdit(name, company, phone) {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE}/api/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, company, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");
    if (data.user) setUser(data.user);
    return true;
  } catch (err) {
    alert("Profile update failed: " + err.message);
    return false;
  }
}

/* ─────────────────────────────────────────────
   FEATURE 6: CEO — Change project status
───────────────────────────────────────────── */
async function updateHireStatus(requestId, newStatus) {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/api/admin/hire/${requestId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Status update failed");
    return data.request;
  } catch (err) {
    alert("Status update failed: " + err.message);
    return null;
  }
}

/* ─────────────────────────────────────────────
   RENDER PROFILE: CLIENT VIEW
───────────────────────────────────────────── */
function renderClientProfile(user, hireRequests) {
  const profileContent = $("#profileContent");
  if (!profileContent) return;

  // Feature 5: Member since date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  // Feature 3: Hire request history table rows
  let requestsHtml = "";
  if (hireRequests && hireRequests.length > 0) {
    const rows = hireRequests.map(r => `
      <tr>
        <td>${escapeHtml(r.projectTitle || "—")}</td>
        <td>${escapeHtml(r.budget || "—")}</td>
        <td>${escapeHtml(r.timeline || "—")}</td>
        <td>${statusBadge(r.status || "pending")}</td>
        <td style="color:var(--text-muted);font-size:.8rem;">${new Date(r.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join("");
    requestsHtml = `
      <div class="profile-requests">
        <h4 class="profile-sub-title">📋 My Hire Requests</h4>
        <div class="table-wrap">
          <table class="requests-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Budget</th>
                <th>Timeline</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  } else {
    requestsHtml = `
      <div class="profile-requests">
        <h4 class="profile-sub-title">📋 My Hire Requests</h4>
        <p class="text-muted" style="text-align:center;padding:20px 0;">
          No hire requests yet. <a href="#hire" class="text-gold">Submit one now →</a>
        </p>
      </div>
    `;
  }

  profileContent.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header">
      <!-- Feature 1: Profile photo with upload button -->
      <div class="profile-avatar-wrap" id="profileAvatarWrap">
        ${user.photoUrl
          ? `<img src="${escapeHtml(user.photoUrl)}" alt="Profile" class="profile-photo" id="profilePhotoImg"/>`
          : `<div class="profile-avatar" id="profileAvatarInitial">${(user.name || user.email || "?").charAt(0).toUpperCase()}</div>`
        }
        <label class="photo-upload-btn" title="Change photo">
          📷
          <input type="file" id="photoFileInput" accept="image/*" style="display:none;"/>
        </label>
      </div>
      <div>
        <h3 id="displayName">Welcome, ${escapeHtml(user.name || "Client")}</h3>
        <p class="text-muted">${escapeHtml(user.email || "")}</p>
        ${user.company ? `<p class="text-muted" id="displayCompany">🏢 ${escapeHtml(user.company)}</p>` : ""}
        ${user.phone ? `<p class="text-muted" id="displayPhone">📞 ${escapeHtml(user.phone)}</p>` : ""}
        <!-- Feature 4 & 5: Client ID + Member Since -->
        <p class="client-id-badge" id="displayClientId">🆔 ${escapeHtml(user.clientId || "—")}</p>
        <p class="member-since">📅 Member since ${memberSince}</p>
      </div>
    </div>

    <!-- Feature 2: Edit Profile Form -->
    <div class="profile-edit-wrap" id="profileEditWrap" style="display:none;">
      <h4 class="profile-sub-title">✏️ Edit Profile</h4>
      <div class="form-row-two">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="editName" value="${escapeHtml(user.name || "")}" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" id="editCompany" value="${escapeHtml(user.company || "")}" class="form-input"/>
        </div>
      </div>
      <div class="form-group">
        <label>Phone</label>
        <input type="text" id="editPhone" value="${escapeHtml(user.phone || "")}" class="form-input"/>
      </div>
      <div style="display:flex;gap:12px;margin-top:8px;">
        <button class="btn btn-gold" id="saveProfileBtn">💾 Save Changes</button>
        <button class="btn btn-outline" id="cancelEditBtn">Cancel</button>
      </div>
      <p class="form-success hidden" id="editSuccess">✅ Profile updated!</p>
    </div>

    <!-- Action Buttons -->
    <div class="profile-actions">
      <a href="#hire" class="btn btn-gold">+ New Hire Request</a>
      <button class="btn btn-outline" id="editProfileBtn">✏️ Edit Profile</button>
      <button class="btn btn-outline" id="logoutBtn">Sign Out</button>
    </div>

    <!-- Feature 3: Hire Request History -->
    ${requestsHtml}

    <!-- Feature 4 & 5: ID Card -->
    <div class="id-card-section">
      <h4 class="profile-sub-title">🆔 Your Client ID Card</h4>
      <div class="id-card">
        <div class="id-card-header">
          <span class="id-card-brand">SRT <span class="logo-accent">Royal</span></span>
          <span class="id-card-type">CLIENT</span>
        </div>
        <div class="id-card-body">
          <div class="id-card-photo-wrap">
            ${user.photoUrl
              ? `<img src="${escapeHtml(user.photoUrl)}" alt="Profile" class="id-card-photo"/>`
              : `<div class="id-card-photo-placeholder">${(user.name || "?").charAt(0).toUpperCase()}</div>`
            }
          </div>
          <div class="id-card-info">
            <h3 class="id-card-name">${escapeHtml(user.name || "—")}</h3>
            <p class="id-card-role">${user.role || "Client"}</p>
            ${user.company ? `<p class="id-card-company">🏢 ${escapeHtml(user.company)}</p>` : ""}
            <div class="id-card-id">${escapeHtml(user.clientId || "—")}</div>
            <p class="id-card-since">Member since ${memberSince}</p>
          </div>
        </div>
        <div class="id-card-footer">
          <span class="id-card-status-dot"></span>
          <span>Active Member</span>
        </div>
      </div>
    </div>
  `;

  /* ── Event Listeners for Client Profile ── */

  // Feature 1: Photo upload
  $("#photoFileInput")?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const label = $(".photo-upload-btn");
    if (label) label.textContent = "⏳";
    const photoUrl = await uploadPhoto(file);
    if (photoUrl) {
      updateAuthUI(); // re-render profile with new photo
    }
    if (label) label.textContent = "📷";
  });

  // Feature 2: Edit toggle
  $("#editProfileBtn")?.addEventListener("click", () => {
    $("#profileEditWrap").style.display = "block";
    $("#editProfileBtn").style.display = "none";
  });

  $("#cancelEditBtn")?.addEventListener("click", () => {
    $("#profileEditWrap").style.display = "none";
    $("#editProfileBtn").style.display = "";
  });

  $("#saveProfileBtn")?.addEventListener("click", async () => {
    const name    = $("#editName")?.value.trim();
    const company = $("#editCompany")?.value.trim();
    const phone   = $("#editPhone")?.value.trim();

    if (!name) { alert("Name cannot be empty."); return; }

    const btn = $("#saveProfileBtn");
    btn.disabled = true; btn.textContent = "Saving…";

    const ok = await saveProfileEdit(name, company, phone);
    btn.disabled = false; btn.textContent = "💾 Save Changes";

    if (ok) {
      showMsg($("#editSuccess"), "✅ Profile updated!");
      setTimeout(() => {
        updateAuthUI();
      }, 800);
    }
  });

  // Logout
  $("#logoutBtn")?.addEventListener("click", () => {
    clearAuth();
    window._srtHireRequests = [];
    updateAuthUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ─────────────────────────────────────────────
   RENDER PROFILE: CEO / ADMIN VIEW
───────────────────────────────────────────── */
async function renderCEOProfile(user) {
  const profileContent = $("#profileContent");
  if (!profileContent) return;

  profileContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar ceo-avatar">👑</div>
      <div>
        <h3>CEO Dashboard</h3>
        <p class="text-muted">${escapeHtml(user.email)}</p>
        <p class="client-id-badge">🆔 ${escapeHtml(user.clientId || "SRT-CEO-0001")}</p>
      </div>
    </div>
    <div class="profile-actions">
      <button class="btn btn-outline" id="logoutBtn">Sign Out</button>
    </div>
    <div id="adminClientsWrap">
      <h4 class="profile-sub-title">👥 All Clients</h4>
      <p class="text-muted" id="adminLoadingMsg">Loading clients…</p>
    </div>
    <div id="adminRequestsWrap" style="margin-top:32px;">
      <h4 class="profile-sub-title">📋 All Hire Requests</h4>
      <p class="text-muted" id="adminReqLoadingMsg">Loading requests…</p>
    </div>
  `;

  $("#logoutBtn")?.addEventListener("click", () => {
    clearAuth();
    window._srtHireRequests = [];
    updateAuthUI();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Load clients
  try {
    const res = await fetch(`${API_BASE}/api/admin/clients`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    const clients = data.clients || [];

    const clientsHtml = clients.length === 0
      ? `<p class="text-muted">No clients yet.</p>`
      : `<div class="table-wrap"><table class="requests-table">
          <thead><tr><th>Name</th><th>Email</th><th>Client ID</th><th>Joined</th><th>Requests</th></tr></thead>
          <tbody>${clients.map(c => `
            <tr>
              <td>${escapeHtml(c.name)}</td>
              <td>${escapeHtml(c.email)}</td>
              <td><span class="client-id-badge">${escapeHtml(c.clientId)}</span></td>
              <td>${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
              <td>${(c.requests || []).length}</td>
            </tr>
          `).join("")}</tbody>
        </table></div>`;

    const wrap = $("#adminClientsWrap");
    if (wrap) wrap.innerHTML = `<h4 class="profile-sub-title">👥 All Clients (${clients.length})</h4>${clientsHtml}`;
  } catch (_) {
    const wrap = $("#adminClientsWrap");
    if (wrap) wrap.innerHTML = `<h4 class="profile-sub-title">👥 Clients</h4><p class="text-muted">Could not load clients.</p>`;
  }

  // Load all hire requests (for CEO)
  try {
    const res = await fetch(`${API_BASE}/api/admin/hire-requests`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    const requests = data.hireRequests || [];

    const reqHtml = requests.length === 0
      ? `<p class="text-muted">No hire requests yet.</p>`
      : `<div class="table-wrap"><table class="requests-table">
          <thead><tr><th>Project</th><th>Client</th><th>Budget</th><th>Status</th><th>Change Status</th></tr></thead>
          <tbody>${requests.map(r => `
            <tr id="req-row-${r.id}">
              <td>${escapeHtml(r.projectTitle || "—")}</td>
              <td>${escapeHtml(r.name || "—")}</td>
              <td>${escapeHtml(r.budget || "—")}</td>
              <td id="req-status-${r.id}">${statusBadge(r.status)}</td>
              <td>
                <!-- Feature 6: CEO status dropdown -->
                <select class="status-select" data-id="${r.id}">
                  <option value="pending" ${r.status === "pending" ? "selected" : ""}>⏳ Pending</option>
                  <option value="active"  ${r.status === "active"  ? "selected" : ""}>🔵 Active</option>
                  <option value="done"    ${r.status === "done"    ? "selected" : ""}>✅ Done</option>
                </select>
              </td>
            </tr>
          `).join("")}</tbody>
        </table></div>`;

    const wrap = $("#adminRequestsWrap");
    if (wrap) wrap.innerHTML = `<h4 class="profile-sub-title">📋 All Hire Requests (${requests.length})</h4>${reqHtml}`;

    // Attach status change listeners
    $$(".status-select").forEach(select => {
      select.addEventListener("change", async (e) => {
        const requestId = select.dataset.id;
        const newStatus = select.value;
        select.disabled = true;
        const updated = await updateHireStatus(requestId, newStatus);
        select.disabled = false;
        if (updated) {
          const statusCell = $(`#req-status-${requestId}`);
          if (statusCell) statusCell.innerHTML = statusBadge(updated.status);
        }
      });
    });
  } catch (_) {
    const wrap = $("#adminRequestsWrap");
    if (wrap) wrap.innerHTML = `<h4 class="profile-sub-title">📋 Hire Requests</h4><p class="text-muted">Could not load requests.</p>`;
  }
}

/* ─────────────────────────────────────────────
   AUTH UI — main toggle function
───────────────────────────────────────────── */
const navAuthLink    = $("#navAuthLink");
const navProfileLink = $("#navProfileLink");
const authSection    = $("#auth-section");
const profileSection = $("#profile-section");

function updateAuthUI() {
  const user = getUser();
  const loggedIn = !!getToken() && !!user;

  navAuthLink?.classList.toggle("hidden", loggedIn);
  navProfileLink?.classList.toggle("hidden", !loggedIn);
  authSection?.classList.toggle("hidden", loggedIn);
  profileSection?.classList.toggle("hidden", !loggedIn);

  if (loggedIn) {
    if (user.role === "CEO") {
      renderCEOProfile(user);
    } else {
      const hireRequests = window._srtHireRequests || [];
      renderClientProfile(user, hireRequests);
    }
  }
}

/* ─── Auto-login on page load ─── */
(async () => {
  if (getToken()) {
    await loadFullProfile();
    updateAuthUI();
  }
})();

/* ─────────────────────────────────────────────
   STAR PICKER + REVIEW SUBMIT
───────────────────────────────────────────── */
const starPicker = $("#starPicker");
let selectedStars = 5;

if (starPicker) {
  const stars = $$(".rstar", starPicker);
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedStars = Number(star.dataset.v);
      stars.forEach((s) => {
        s.classList.toggle("active", Number(s.dataset.v) <= selectedStars);
      });
    });
    star.addEventListener("mouseenter", () => {
      const v = Number(star.dataset.v);
      stars.forEach((s) => s.classList.toggle("hover", Number(s.dataset.v) <= v));
    });
    star.addEventListener("mouseleave", () => {
      stars.forEach((s) => s.classList.remove("hover"));
    });
  });
}

$("#submitReviewBtn")?.addEventListener("click", async () => {
  const name    = $("#rName")?.value.trim();
  const role    = $("#rRole")?.value.trim();
  const text    = $("#rText")?.value.trim();
  const successEl = $("#reviewSuccess");
  hideMsg(successEl);

  if (!name || !text) {
    alert("Please add your name and review text.");
    return;
  }

  const btn = $("#submitReviewBtn");
  btn.disabled = true; const original = btn.textContent; btn.textContent = "Submitting…";

  try {
    try {
      await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({ name, role, text, rating: selectedStars }),
      });
    } catch (_) {}

    const list = $("#testimonialsList");
    if (list) {
      const card = document.createElement("div");
      card.className = "testimonial-card reveal visible";
      card.innerHTML = `
        <div class="tcard-top">
          <div class="tcard-stars">${"★".repeat(selectedStars)}${"☆".repeat(5 - selectedStars)}</div>
        </div>
        <p class="tcard-text">${escapeHtml(text)}</p>
        <div class="tcard-author">
          <div class="tcard-avatar">${name.charAt(0).toUpperCase()}</div>
          <div>
            <strong>${escapeHtml(name)}</strong>
            <span>${escapeHtml(role || "Client")}</span>
          </div>
        </div>
      `;
      list.prepend(card);
    }

    showMsg(successEl, "✅ Thank you for your review!");
    $("#rName").value = ""; $("#rRole").value = ""; $("#rText").value = "";
  } catch (err) {
    console.error(err);
    alert("Could not submit review. Please try again.");
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
});

/* ─────────────────────────────────────────────
   BACK TO TOP BUTTON
───────────────────────────────────────────── */
const backTop = document.createElement("button");
backTop.className = "back-top";
backTop.setAttribute("aria-label", "Back to top");
backTop.innerHTML = "↑";
document.body.appendChild(backTop);

window.addEventListener("scroll", () => {
  backTop.classList.toggle("show", window.scrollY > 500);
}, { passive: true });

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─────────────────────────────────────────────
   PRELOADER FADE
───────────────────────────────────────────── */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

console.log("%cSRT ROYAL — Premium Frontend Experience", "color:#FFD700;font-size:16px;font-weight:bold;");
console.log("%cDesigned & Developed by Sr. Tawsif", "color:#888;font-size:12px;");
