/* ═══════════════════════════════════════════════════════════
   SRT ROYAL — Premium Style Sheet
   Theme: Deep Navy (#0A0F1E) + Royal Gold (#FFD700)
   Font: Playfair Display (headings) + Inter (body)
═══════════════════════════════════════════════════════════ */

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');

/* ─── RESET & BASE ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:        #0A0F1E;
  --navy-2:      #0F1628;
  --navy-3:      #141c35;
  --navy-card:   #111827;
  --gold:        #FFD700;
  --gold-2:      #F5C800;
  --gold-dim:    rgba(255,215,0,.12);
  --gold-glow:   rgba(255,215,0,.25);
  --white:       #FFFFFF;
  --text:        #E2E8F0;
  --text-muted:  #8899BB;
  --border:      rgba(255,215,0,.15);
  --radius:      14px;
  --radius-lg:   22px;
  --shadow-card: 0 8px 40px rgba(0,0,0,.55);
  --shadow-gold: 0 0 30px rgba(255,215,0,.2);
  --transition:  .3s cubic-bezier(.4,0,.2,1);
  --font-head:   'Playfair Display', serif;
  --font-body:   'Inter', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--navy);
  color: var(--text);
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }
img { max-width: 100%; display: block; }
ul { list-style: none; }

.hidden { display: none !important; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

/* ─── TYPOGRAPHY ─── */
h1,h2,h3,h4 { font-family: var(--font-head); line-height: 1.15; }
.text-gold { color: var(--gold); }

/* ─── BUTTONS ─── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border-radius: 50px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: .95rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition);
  white-space: nowrap;
}

.btn-gold {
  background: var(--gold);
  color: var(--navy);
  border-color: var(--gold);
  box-shadow: 0 4px 20px rgba(255,215,0,.3);
}
.btn-gold:hover {
  background: #ffe633;
  box-shadow: 0 6px 30px rgba(255,215,0,.5);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--gold);
  border-color: var(--gold);
}
.btn-outline:hover {
  background: var(--gold-dim);
  transform: translateY(-2px);
}

.btn-lg { padding: 15px 32px; font-size: 1rem; }
.btn-sm { padding: 8px 18px; font-size: .85rem; }
.btn-full { width: 100%; justify-content: center; }

/* ─── SECTION COMMON ─── */
.section { padding: 100px 0; position: relative; }

.section-header { text-align: center; margin-bottom: 60px; }

.section-tag {
  display: inline-block;
  padding: 5px 16px;
  background: var(--gold-dim);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--white);
  margin-bottom: 16px;
}

.section-desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 560px;
  margin: 0 auto;
}

/* ─── REVEAL ANIMATIONS ─── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 999;
  padding: 0;
  background: transparent;
  transition: background .4s, box-shadow .4s, padding .3s;
}
.navbar.scrolled {
  background: rgba(10,15,30,.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 2px 30px rgba(0,0,0,.6);
  border-bottom: 1px solid var(--border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-head);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--white);
  letter-spacing: -.02em;
}
.nav-logo-img { height: 36px; width: auto; }
.logo-accent { color: var(--gold); }

.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: .9rem;
  font-weight: 500;
  color: var(--text);
  transition: var(--transition);
}
.nav-link:hover { color: var(--gold); background: var(--gold-dim); }

.nav-login-link { color: var(--text-muted); }

.nav-cta {
  margin-left: 10px;
  padding: 9px 22px;
  font-size: .88rem;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}
.hamburger span {
  display: block;
  width: 24px; height: 2px;
  background: var(--gold);
  border-radius: 2px;
  transition: var(--transition);
}
.hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 120px 24px 80px;
}

/* Radial glow background */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,215,0,.08) 0%, transparent 65%),
    radial-gradient(ellipse 50% 40% at 20% 80%, rgba(26,39,80,.6) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(10,25,60,.5) 0%, transparent 60%);
  pointer-events: none;
}

/* Grid pattern */
.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,215,0,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,215,0,.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 70%);
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.glow-1 {
  width: 600px; height: 400px;
  background: rgba(255,215,0,.06);
  top: -100px; left: 50%;
  transform: translateX(-50%);
}
.glow-2 {
  width: 400px; height: 300px;
  background: rgba(30,60,130,.3);
  bottom: 0; right: 10%;
}

.hero-container {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  background: rgba(255,215,0,.08);
  border: 1px solid rgba(255,215,0,.2);
  border-radius: 50px;
  font-size: .83rem;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: 28px;
  animation: fadeSlideDown .8s ease forwards;
}
.badge-dot {
  width: 7px; height: 7px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }

.hero-headline {
  font-size: clamp(2.8rem, 7vw, 5.2rem);
  font-weight: 900;
  color: var(--white);
  letter-spacing: -.03em;
  line-height: 1.08;
  margin-bottom: 24px;
  animation: fadeSlideUp .9s .2s ease both;
}

.hero-sub {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-muted);
  max-width: 620px;
  margin: 0 auto 40px;
  font-weight: 400;
  line-height: 1.75;
  animation: fadeSlideUp .9s .35s ease both;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
  animation: fadeSlideUp .9s .5s ease both;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px 36px;
  backdrop-filter: blur(10px);
  animation: fadeSlideUp .9s .65s ease both;
}

.hero-stat { text-align: center; padding: 0 32px; }
.stat-val {
  display: block;
  font-family: var(--font-head);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--gold);
  line-height: 1;
}
.stat-lbl {
  font-size: .8rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-top: 4px;
  display: block;
}
.hero-stat-divider {
  width: 1px; height: 48px;
  background: var(--border);
}

.hero-scroll-hint {
  position: absolute;
  bottom: 32px; left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: .78rem;
  letter-spacing: .08em;
  animation: fadeIn 1.5s 1.2s ease both;
}
.scroll-mouse {
  width: 22px; height: 36px;
  border: 2px solid var(--border);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}
.scroll-wheel {
  width: 4px; height: 8px;
  background: var(--gold);
  border-radius: 4px;
  animation: scrollWheel 2s infinite;
}
@keyframes scrollWheel { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(10px)} }

/* ─── KEYFRAMES ─── */
@keyframes fadeSlideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeSlideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn        { from{opacity:0} to{opacity:1} }

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════ */
.hiw-section {
  background: var(--navy-2);
  position: relative;
}
.hiw-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.hiw-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: start;
  gap: 0 12px;
}

.hiw-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 44px;
}
.hiw-connector::after {
  content: '';
  display: block;
  width: 60px; height: 2px;
  background: linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim));
  border-radius: 2px;
}

.hiw-card {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  text-align: center;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}
.hiw-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity: 0;
  transition: var(--transition);
}
.hiw-card:hover { border-color: rgba(255,215,0,.3); transform: translateY(-6px); box-shadow: var(--shadow-card); }
.hiw-card:hover::before { opacity: 1; }

.hiw-icon-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 24px;
}
.hiw-icon {
  width: 68px; height: 68px;
  background: var(--gold-dim);
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  transition: var(--transition);
}
.hiw-card:hover .hiw-icon {
  background: var(--gold);
  color: var(--navy);
  box-shadow: var(--shadow-gold);
}

.hiw-step-num {
  position: absolute;
  top: -4px; right: calc(50% - 52px);
  font-size: .7rem;
  font-weight: 700;
  color: var(--gold);
  background: var(--navy-2);
  border: 1px solid var(--border);
  border-radius: 50px;
  padding: 2px 8px;
  letter-spacing: .08em;
}

.hiw-card h3 {
  font-family: var(--font-body);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 12px;
}
.hiw-card p { font-size: .92rem; color: var(--text-muted); line-height: 1.7; }

/* ═══════════════════════════════════════════════════════════
   FEATURED DESIGNERS
═══════════════════════════════════════════════════════════ */
.designers-section { background: var(--navy); }

.designers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.designer-card {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}
.designer-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255,215,0,.04), transparent 70%);
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}
.designer-card:hover {
  border-color: rgba(255,215,0,.35);
  box-shadow: var(--shadow-card), 0 0 0 1px rgba(255,215,0,.1);
  transform: translateY(-8px);
}
.designer-card:hover::after { opacity: 1; }

.designer-card-top {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
}

.designer-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.designer-avatar {
  width: 66px; height: 66px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  transition: var(--transition);
}
.designer-card:hover .designer-avatar { border-color: var(--gold); }

.designer-available-dot {
  position: absolute;
  bottom: 3px; right: 3px;
  width: 12px; height: 12px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid var(--navy-card);
}

.designer-name {
  font-family: var(--font-body);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 3px;
}
.designer-title { font-size: .83rem; color: var(--text-muted); margin-bottom: 8px; }

.designer-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: .85rem;
}
.stars { color: var(--gold); font-size: .95rem; letter-spacing: -1px; }
.rating-val { font-weight: 700; color: var(--white); }
.rating-count { color: var(--text-muted); }

.designer-badge {
  position: absolute;
  top: 0; right: 0;
  font-size: .72rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 50px 0 0 50px;
  background: var(--gold);
  color: var(--navy);
}

.designer-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
}
.skill-tag {
  padding: 4px 12px;
  background: rgba(255,215,0,.08);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: .78rem;
  font-weight: 500;
  color: var(--gold);
  transition: var(--transition);
}
.skill-tag:hover { background: var(--gold-dim); border-color: rgba(255,215,0,.3); }

.designer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--border);
  padding-top: 18px;
  margin-top: 4px;
}
.designer-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: .78rem;
  color: var(--text-muted);
}
.designer-meta span { display: flex; align-items: center; gap: 5px; }

/* ═══════════════════════════════════════════════════════════
   HIRE REQUEST FORM
═══════════════════════════════════════════════════════════ */
.hire-section {
  background: var(--navy-2);
  position: relative;
}
.hire-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.hire-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 48px;
  align-items: start;
}

.hire-info h3 {
  font-size: 1.6rem;
  color: var(--white);
  margin-bottom: 30px;
}

.hire-feature {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-start;
}
.hf-icon {
  width: 38px; height: 38px;
  flex-shrink: 0;
  background: var(--gold-dim);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  margin-top: 2px;
}
.hire-feature strong { display: block; color: var(--white); font-size: .95rem; margin-bottom: 4px; }
.hire-feature p { font-size: .88rem; color: var(--text-muted); line-height: 1.6; }

.hire-cta-wa {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  padding: 14px 26px;
  background: rgba(37,211,102,.1);
  border: 1px solid rgba(37,211,102,.3);
  border-radius: var(--radius);
  color: #25d366;
  font-weight: 600;
  font-size: .92rem;
  transition: var(--transition);
}
.hire-cta-wa:hover {
  background: rgba(37,211,102,.18);
  transform: translateY(-2px);
}

/* Form */
.hire-form, .auth-form {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
}

.form-group { margin-bottom: 22px; }
.form-group label {
  display: block;
  font-size: .85rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  letter-spacing: .02em;
}
.req { color: var(--gold); }

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,215,0,.12);
  border-radius: 10px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: .93rem;
  outline: none;
  transition: var(--transition);
  -webkit-appearance: none;
  appearance: none;
}
.form-group input::placeholder,
.form-group textarea::placeholder { color: rgba(136,153,187,.5); }
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: rgba(255,215,0,.4);
  background: rgba(255,215,0,.04);
  box-shadow: 0 0 0 3px rgba(255,215,0,.08);
}
.form-group select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23FFD700' d='M1 1l5 5 5-5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
.form-group select option { background: var(--navy-2); color: var(--white); }
.form-group textarea { resize: vertical; min-height: 110px; }

.form-row-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-note {
  text-align: center;
  font-size: .8rem;
  color: var(--text-muted);
  margin-top: 14px;
}
.form-success { color: #22c55e; font-size: .9rem; text-align: center; margin-top: 12px; }
.form-error   { color: #f87171; font-size: .9rem; text-align: center; margin-top: 12px; }

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════ */
.testimonials-section { background: var(--navy); }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 60px;
}

.testimonial-card {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  transition: var(--transition);
  position: relative;
}
.testimonial-card:hover {
  border-color: rgba(255,215,0,.3);
  transform: translateY(-6px);
  box-shadow: var(--shadow-card);
}

.tcard-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.tcard-stars { color: var(--gold); font-size: 1.1rem; letter-spacing: -1px; }
.quote-icon { color: rgba(255,215,0,.15); flex-shrink: 0; }

.tcard-text {
  font-size: .93rem;
  line-height: 1.78;
  color: var(--text);
  margin-bottom: 24px;
}

.tcard-author {
  display: flex;
  align-items: center;
  gap: 14px;
  border-top: 1px solid var(--border);
  padding-top: 20px;
}
.tcard-avatar {
  width: 44px; height: 44px;
  background: var(--gold);
  color: var(--navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.tcard-author strong { display: block; color: var(--white); font-size: .92rem; }
.tcard-author span { font-size: .8rem; color: var(--text-muted); }

/* Leave review */
.leave-review-wrap {
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 40px;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}
.leave-review-wrap h3 {
  font-family: var(--font-body);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 20px;
}

.star-picker {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 1.8rem;
}
.rstar {
  cursor: pointer;
  color: rgba(255,215,0,.25);
  transition: var(--transition);
  line-height: 1;
}
.rstar.active { color: var(--gold); }
.rstar:hover { transform: scale(1.2); }

.review-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}
.rinput {
  width: 100%;
  padding: 11px 15px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,215,0,.12);
  border-radius: 10px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: .9rem;
  outline: none;
  transition: var(--transition);
}
.rinput::placeholder { color: rgba(136,153,187,.5); }
.rinput:focus { border-color: rgba(255,215,0,.4); box-shadow: 0 0 0 3px rgba(255,215,0,.08); }

/* ═══════════════════════════════════════════════════════════
   AUTH SECTION
═══════════════════════════════════════════════════════════ */
.auth-section-wrap {
  background: var(--navy-2);
  position: relative;
}
.auth-section-wrap::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-dim), transparent);
}

.auth-card {
  max-width: 600px;
  margin: 0 auto;
  background: var(--navy-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 48px 44px;
  position: relative;
  overflow: hidden;
}
.auth-card-deco {
  position: absolute;
  top: -60px; right: -60px;
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(255,215,0,.06), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.auth-tabs {
  display: flex;
  gap: 0;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 28px;
}
.auth-tab {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  border-radius: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: .9rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition);
}
.auth-tab.active {
  background: var(--gold);
  color: var(--navy);
}

/* ═══════════════════════════════════════════════════════════
   PROFILE SECTION
═══════════════════════════════════════════════════════════ */
/* Badge colors */
.badge-pending {
  background-color: #FFD700; /* Yellow */
  color: #000;
}

.badge-active {
  background-color: #1E90FF; /* Blue */
  color: #fff;
}

.badge-done {
  background-color: #32CD32; /* Green */
  color: #fff;
}

/* Profile card */
.profile-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  max-width: 400px;
  margin: 20px auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Profile image */
.profile-card img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
}

/* Info section */
.profile-info {
  font-size: 14px;
  line-height: 1.6;
}

.profile-info strong {
  display: inline-block;
  width: 100px;
}

}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
.footer { background: var(--navy); border-top: 1px solid var(--border); }

.footer-top { padding: 72px 0 48px; }

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 48px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-head);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 18px;
}

.footer-tagline {
  font-size: .88rem;
  color: var(--text-muted);
  line-height: 1.75;
  max-width: 300px;
  margin-bottom: 24px;
}

.footer-socials {
  display: flex;
  gap: 12px;
}
.social-link {
  width: 40px; height: 40px;
  background: var(--gold-dim);
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: var(--transition);
}
.social-link:hover {
  background: var(--gold);
  color: var(--navy);
  border-color: var(--gold);
  transform: translateY(-3px);
}

.footer-col h4 {
  font-family: var(--font-body);
  font-size: .8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: var(--gold);
  margin-bottom: 18px;
}
.footer-col ul { display: flex; flex-direction: column; gap: 10px; }
.footer-col ul li a {
  font-size: .88rem;
  color: var(--text-muted);
  transition: var(--transition);
}
.footer-col ul li a:hover { color: var(--gold); padding-left: 4px; }

.footer-bottom {
  border-top: 1px solid var(--border);
  padding: 22px 0;
}
.footer-bottom-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .82rem;
  color: var(--text-muted);
}

/* ═══════════════════════════════════════════════════════════
   WHATSAPP FAB
═══════════════════════════════════════════════════════════ */
.whatsapp-fab {
  position: fixed;
  bottom: 28px; right: 28px;
  z-index: 990;
  width: 56px; height: 56px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 6px 24px rgba(37,211,102,.45);
  transition: var(--transition);
}
.whatsapp-fab:hover {
  transform: scale(1.12) translateY(-3px);
  box-shadow: 0 10px 32px rgba(37,211,102,.6);
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hiw-grid { grid-template-columns: 1fr; }
  .hiw-connector { display: none; }
  .hire-layout { grid-template-columns: 1fr; }
  .hire-info { order: 1; }
  .hire-form { order: 2; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
  .footer-brand-col { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  .section { padding: 72px 0; }

  /* Nav mobile */
  .nav-links {
    position: fixed;
    inset: 74px 0 0 0;
    background: rgba(10,15,30,.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    gap: 4px;
    transform: translateX(100%);
    transition: transform .35s ease;
    overflow-y: auto;
    border-left: 1px solid var(--border);
  }
  .nav-links.open { transform: translateX(0); }
  .nav-link { padding: 12px 16px; width: 100%; border-radius: 10px; font-size: 1rem; }
  .nav-cta { margin-left: 0; margin-top: 8px; width: 100%; justify-content: center; }
  .hamburger { display: flex; }

  /* Hero */
  .hero-stats { flex-direction: column; gap: 20px; padding: 20px; }
  .hero-stat { padding: 0; }
  .hero-stat-divider { width: 80px; height: 1px; }

  /* Designers & Testimonials */
  .designers-grid,
  .testimonials-grid { grid-template-columns: 1fr; }

  /* Form rows */
  .form-row-two { grid-template-columns: 1fr; }
  .review-form-grid { grid-template-columns: 1fr; }

  /* Auth */
  .auth-card { padding: 32px 24px; }

  /* Footer */
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom-inner { flex-direction: column; gap: 8px; text-align: center; }

  /* Hire form */
  .hire-form { padding: 28px 20px; }
}

@media (max-width: 480px) {
  .hero-headline { font-size: 2.4rem; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { justify-content: center; }
  .profile-card { padding: 28px 20px; }
}

/* ─── SCROLLBAR ─── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--navy); }
::-webkit-scrollbar-thumb { background: rgba(255,215,0,.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,215,0,.5); }

/* ─── SELECTION ─── */
::selection { background: rgba(255,215,0,.25); color: var(--white); }
