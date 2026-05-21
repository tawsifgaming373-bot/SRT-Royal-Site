/*
  ╔═══════════════════════════════════════════════════════╗
  ║           SRT Royal Site — server.js                  ║
  ║   Routes matched to app.js API calls                  ║
  ╚═══════════════════════════════════════════════════════╝

  Required npm packages:
    npm install express bcryptjs jsonwebtoken cors dotenv uuid

  .env file:
    JWT_SECRET=your_super_secret_key_here
    PORT=3000
*/

require("dotenv").config();

const express    = require("express");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
const path       = require("path");
const { v4: uuidv4 } = require("uuid");

const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "srt_secret_fallback_change_this";

/* ─── MIDDLEWARE ─── */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // HTML/CSS/JS files bursts

/* ─── IN-MEMORY DB (replace with real DB later) ─── */
// Users
const users = [
  // Pre-seeded CEO account — change password immediately!
  {
    id:        "ceo-001",
    clientId:  "SRT-CEO-0001",
    name:      "Sr. Tawsif",
    email:     "tawsifgaming373@gmail.com",
    password:  bcrypt.hashSync("SRT@CEO2025!", 10), // change this
    role:      "CEO",
    company:   "SRT Royal",
    phone:     "+8801976365076",
    createdAt: new Date("2024-01-01").toISOString(),
  }
];

// Reviews
const reviews = [];

/* ─── HELPERS ─── */
function generateClientId() {
  const num = String(users.length).padStart(4, "0");
  return `SRT-CLIENT-${num}`;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  // Strip password before sending to client
  const { password, ...safe } = user;
  return safe;
}

/* ─── AUTH MIDDLEWARE ─── */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireCEO(req, res, next) {
  if (req.user.role !== "CEO") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

/* ══════════════════════════════════════════
   AUTH ROUTES
   ══════════════════════════════════════════ */

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, company, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    // Email already exists?
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id:        uuidv4(),
      clientId:  generateClientId(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      password:  hashed,
      role:      "Client",
      company:   company?.trim() || "",
      phone:     phone?.trim() || "",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = signToken(newUser);
    return res.status(201).json({ token, user: safeUser(newUser) });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    return res.json({ token, user: safeUser(user) });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

/* ══════════════════════════════════════════
   PROFILE ROUTE
   ══════════════════════════════════════════ */

// GET /api/me  — used for auto-login & refresh
app.get("/api/me", requireAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.json({ user: safeUser(user) });
});

/* ══════════════════════════════════════════
   ADMIN ROUTE
   ══════════════════════════════════════════ */

// GET /api/admin/clients  — CEO only
app.get("/api/admin/clients", requireAuth, requireCEO, (req, res) => {
  // Return all clients except CEO accounts
  const clients = users
    .filter(u => u.role !== "CEO")
    .map(safeUser);
  return res.json({ clients });
});

/* ══════════════════════════════════════════
   REVIEWS ROUTES
   ══════════════════════════════════════════ */

// GET /api/reviews
app.get("/api/reviews", (req, res) => {
  // Return newest first
  const sorted = [...reviews].reverse();
  return res.json({ reviews: sorted });
});

// POST /api/reviews
app.post("/api/reviews", (req, res) => {
  try {
    const { name, role, text, rating } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: "Name and review text are required." });
    }

    const review = {
      id:        uuidv4(),
      name:      name.trim(),
      role:      role?.trim() || "Visitor",
      text:      text.trim(),
      rating:    Math.min(5, Math.max(1, parseInt(rating) || 5)),
      createdAt: new Date().toISOString(),
    };

    reviews.push(review);
    return res.status(201).json({ review });

  } catch (err) {
    console.error("Review error:", err);
    return res.status(500).json({ message: "Server error." });
  }
});

/* ══════════════════════════════════════════
   SERVE FRONTEND
   ══════════════════════════════════════════ */

// Catch-all: serve index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ─── START ─── */
app.listen(PORT, () => {
  console.log(`✅ SRT Royal Server running at http://localhost:${PORT}`);
  console.log(`   CEO email: tawsifgaming373@gmail.com`);
  console.log(`   Default CEO password: SRT@CEO2025!  ← change this!`);
});
