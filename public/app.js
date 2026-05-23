/* ─────────────────────────────────────────────
   SRT ROYAL — PREMIUM FRONTEND APP.JS
   Synced with index.html + style.css
   Features: Navbar, Mobile menu, Scroll reveal,
   Hire form (EmailJS), Auth (JWT), Reviews,
   Profile, Back-to-top, Smooth UX
───────────────────────────────────────────── */

/* ─── EMAILJS INIT ─── */
if (typeof emailjs !== "undefined") {
  emailjs.init("Sbry3VTtnXv382hZ_");
}

/* ─── HELPERS ─── */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const API_BASE = ""; // same origin Express server (e.g. "" or "http://localhost:3000")
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

// ✅ নতুন কোড (Line 57-77)
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    
    // শুধুমাত্র অ্যাঙ্করলিংক (#দিয়ে শুরু) এর জন্য
    if (href && href.startsWith("#")) {
      e.preventDefault();
      
      const targetId = href.substring(1);
      const targetSection = $(`#${targetId}`);
      
      if (targetSection) {
        // সব সেকশন লুকান
        $$("section[id]").forEach(sec => {
          sec.style.opacity = "0";
          sec.style.pointerEvents = "none";
          setTimeout(() => sec.style.display = "none", 300);
        });
        
        // টার্গেট সেকশন দেখান
        setTimeout(() => {
          targetSection.style.display = "block";
          targetSection.style.opacity = "1";
          targetSection.style.pointerEvents = "auto";
          targetSection.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
    
    // মোবাইল মেনু বন্ধ করুন
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

// Hire form submit handler
document.addEventListener("DOMContentLoaded", () => {
  const hireForm = document.getElementById("hireForm");
  const successMsg = document.getElementById("hireSuccess");
  const errorMsg = document.getElementById("hireError");

  if (hireForm) {
    hireForm.addEventListener("submit", function(e) {
      e.preventDefault();

      // EmailJS ব্যবহার করলে:
      emailjs.sendForm("your_service_id", "your_template_id", this)
        .then(() => {
          successMsg.classList.remove("hidden");
          errorMsg.classList.add("hidden");
          hireForm.reset();
        })
        .catch(() => {
          errorMsg.classList.remove("hidden");
          successMsg.classList.add("hidden");
        });
    });
  }
});


/* ─────────────────────────────────────────────
   AUTH TABS (Sign In / Sign Up)
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
    updateAuthUI();
    document.getElementById("profile-section")?.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    showMsg(errEl, err.message || "Signup failed.", true);
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
});

/* ─────────────────────────────────────────────
   AUTH UI — toggle Login / Account links, profile
───────────────────────────────────────────── */
const navAuthLink    = $("#navAuthLink");
const navProfileLink = $("#navProfileLink");
const authSection    = $("#auth-section");
const profileSection = $("#profile-section");
const profileContent = $("#profileContent");

function updateAuthUI() {
  const user = getUser();
  const loggedIn = !!getToken() && !!user;

  navAuthLink?.classList.toggle("hidden", loggedIn);
  navProfileLink?.classList.toggle("hidden", !loggedIn);
  authSection?.classList.toggle("hidden", loggedIn);
  profileSection?.classList.toggle("hidden", !loggedIn);

  if (loggedIn && profileContent) {
    profileContent.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">${(user.name || user.email || "?").charAt(0).toUpperCase()}</div>
        <div>
          <h3>Welcome, ${escapeHtml(user.name || "Client")}</h3>
          <p class="text-muted">${escapeHtml(user.email || "")}</p>
          ${user.company ? `<p class="text-muted">${escapeHtml(user.company)}</p>` : ""}
        </div>
      </div>
      <div class="profile-meta">
        ${user.phone ? `<div><strong>Phone:</strong> ${escapeHtml(user.phone)}</div>` : ""}
        <div><strong>Status:</strong> <span class="text-gold">Active Client</span></div>
      </div>
      <div class="profile-actions">
        <a href="#hire" class="btn btn-gold">+ New Hire Request</a>
        <button class="btn btn-outline" id="logoutBtn">Sign Out</button>
      </div>
    `;
    $("#logoutBtn")?.addEventListener("click", () => {
      clearAuth();
      updateAuthUI();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

updateAuthUI();

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
    // POST to backend if available
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

    // Optimistically prepend to UI
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

/* ─────────────────────────────────────────────
   CONSOLE BRANDING
───────────────────────────────────────────── */
console.log("%cSRT ROYAL — Premium Frontend Experience", "color:#FFD700;font-size:16px;font-weight:bold;");
console.log("%cDesigned & Developed by Sr. Tawsif", "color:#888;font-size:12px;");
