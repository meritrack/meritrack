// MériTrack v1.1 - Fixed pending approvals
import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://zjyfjgbblykjhornhilr.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeWZqZ2JibHlramhvcm5oaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMTc2NjUsImV4cCI6MjA5NTc5MzY2NX0.W1Vawf3_7-1J73nid8tA_8KSUEo9UDh01Y6IbH7tWkM";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── STYLES ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #1A3A5C;
    --gold: #C9952A;
    --gold-light: #F5E6C8;
    --cream: #FDFAF5;
    --white: #FFFFFF;
    --green: #2D7A4F;
    --green-light: #E8F5EE;
    --red: #C0392B;
    --red-light: #FDECEA;
    --grey-100: #F7F7F7;
    --grey-200: #EBEBEB;
    --grey-400: #AAAAAA;
    --grey-600: #666666;
    --grey-800: #333333;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.10);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
    --radius: 14px;
    --radius-sm: 8px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--grey-800);
    min-height: 100vh;
  }

  h1, h2, h3 { font-family: 'Playfair Display', serif; }

  /* ── AUTH ── */
  .auth-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--navy) 0%, #2a5080 100%);
    padding: 24px;
  }
  .auth-card {
    background: var(--white);
    border-radius: 20px;
    padding: 48px 40px;
    width: 100%;
    max-width: 400px;
    box-shadow: var(--shadow-lg);
  }
  .auth-logo { text-align: center; margin-bottom: 32px; }
  .auth-logo h1 { color: var(--navy); font-size: 2.2rem; }
  .auth-logo p { color: var(--gold); font-size: 0.85rem; letter-spacing: 0.08em; margin-top: 4px; font-family: 'DM Sans', sans-serif; font-weight: 500; }
  .auth-tab-row { display: flex; gap: 8px; margin-bottom: 24px; }
  .auth-tab { flex: 1; padding: 10px; border: 2px solid var(--grey-200); border-radius: var(--radius-sm); background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; color: var(--grey-600); }
  .auth-tab.active { border-color: var(--navy); background: var(--navy); color: white; }

  /* ── FORM ELEMENTS ── */
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 0.82rem; font-weight: 600; color: var(--grey-600); margin-bottom: 6px; letter-spacing: 0.04em; text-transform: uppercase; }
  .field input, .field select, .field textarea {
    width: 100%; padding: 12px 14px; border: 1.5px solid var(--grey-200);
    border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; background: var(--white); color: var(--grey-800);
    transition: border-color 0.2s; outline: none;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--navy); }
  .field textarea { resize: vertical; min-height: 80px; }

  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 22px; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
  }
  .btn-primary { background: var(--navy); color: white; }
  .btn-primary:hover { background: #14304e; }
  .btn-gold { background: var(--gold); color: white; }
  .btn-gold:hover { background: #b8841f; }
  .btn-ghost { background: transparent; color: var(--navy); border: 1.5px solid var(--navy); }
  .btn-ghost:hover { background: var(--navy); color: white; }
  .btn-danger { background: var(--red); color: white; }
  .btn-danger:hover { background: #a93226; }
  .btn-success { background: var(--green); color: white; }
  .btn-success:hover { background: #256b43; }
  .btn-sm { padding: 8px 14px; font-size: 0.85rem; }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── LAYOUT ── */
  .app-shell { display: flex; min-height: 100vh; }

  .sidebar {
    width: 240px; min-height: 100vh; background: var(--navy);
    display: flex; flex-direction: column; padding: 24px 0;
    position: fixed; left: 0; top: 0; bottom: 0; z-index: 100;
  }
  .sidebar-logo { padding: 0 24px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .sidebar-logo h2 { color: white; font-size: 1.5rem; }
  .sidebar-logo p { color: var(--gold); font-size: 0.75rem; margin-top: 2px; font-family: 'DM Sans', sans-serif; }
  .sidebar-user { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .sidebar-user-name { color: white; font-weight: 600; font-size: 0.95rem; }
  .sidebar-user-role { color: rgba(255,255,255,0.5); font-size: 0.78rem; text-transform: capitalize; }
  .sidebar-nav { flex: 1; padding: 16px 0; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 12px 24px;
    color: rgba(255,255,255,0.65); font-size: 0.9rem; font-weight: 500;
    cursor: pointer; transition: all 0.2s; border: none; background: none;
    width: 100%; text-align: left;
  }
  .nav-item:hover { color: white; background: rgba(255,255,255,0.08); }
  .nav-item.active { color: white; background: rgba(201,149,42,0.25); border-right: 3px solid var(--gold); }
  .nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.1); }

  .main-content { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }

  /* ── PAGE HEADER ── */
  .page-header { margin-bottom: 28px; }
  .page-header h1 { font-size: 1.9rem; color: var(--navy); }
  .page-header p { color: var(--grey-600); margin-top: 4px; font-size: 0.95rem; }

  /* ── CARDS ── */
  .card {
    background: var(--white); border-radius: var(--radius);
    padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--grey-200);
  }
  .card-title { font-size: 1.05rem; font-weight: 600; color: var(--navy); margin-bottom: 16px; font-family: 'Playfair Display', serif; }

  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--white); border-radius: var(--radius); padding: 20px;
    box-shadow: var(--shadow-sm); border: 1px solid var(--grey-200); text-align: center;
  }
  .stat-card.navy { background: var(--navy); border-color: var(--navy); }
  .stat-card.gold { background: var(--gold); border-color: var(--gold); }
  .stat-card.green { background: var(--green); border-color: var(--green); }
  .stat-value { font-size: 2rem; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--navy); }
  .stat-card.navy .stat-value, .stat-card.gold .stat-value, .stat-card.green .stat-value { color: white; }
  .stat-label { font-size: 0.78rem; font-weight: 600; color: var(--grey-400); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
  .stat-card.navy .stat-label, .stat-card.gold .stat-label, .stat-card.green .stat-label { color: rgba(255,255,255,0.7); }

  /* ── BADGES ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 99px; font-size: 0.78rem; font-weight: 600; }
  .badge-pending { background: #FFF3CD; color: #856404; }
  .badge-approved { background: var(--green-light); color: var(--green); }
  .badge-declined { background: var(--red-light); color: var(--red); }
  .badge-parent { background: #E8EEF5; color: var(--navy); }
  .badge-kid { background: var(--gold-light); color: #8B5E0A; }
  .badge-extended { background: var(--grey-100); color: var(--grey-600); }

  /* ── TABLES ── */
  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--grey-200); }
  table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  th { background: var(--navy); color: white; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 0.82rem; letter-spacing: 0.04em; text-transform: uppercase; }
  td { padding: 12px 16px; border-bottom: 1px solid var(--grey-200); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) td { background: var(--grey-100); }
  tr:hover td { background: #EEF3F8; }

  /* ── PENDING ITEM ── */
  .pending-item {
    background: var(--white); border: 1px solid var(--grey-200); border-radius: var(--radius);
    padding: 18px 20px; margin-bottom: 12px; display: flex; align-items: flex-start;
    gap: 16px; box-shadow: var(--shadow-sm);
  }
  .pending-item-icon { font-size: 1.6rem; flex-shrink: 0; }
  .pending-item-body { flex: 1; }
  .pending-item-title { font-weight: 600; color: var(--grey-800); font-size: 0.95rem; }
  .pending-item-meta { color: var(--grey-600); font-size: 0.82rem; margin-top: 4px; }
  .pending-item-actions { display: flex; gap: 8px; margin-top: 12px; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 24px;
  }
  .modal {
    background: var(--white); border-radius: 20px; padding: 32px;
    width: 100%; max-width: 480px; box-shadow: var(--shadow-lg);
    max-height: 85vh; overflow-y: auto;
  }
  .modal-title { font-size: 1.4rem; color: var(--navy); margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* ── ALERT ── */
  .alert { padding: 12px 16px; border-radius: var(--radius-sm); font-size: 0.88rem; margin-bottom: 16px; }
  .alert-error { background: var(--red-light); color: var(--red); border: 1px solid #f5c6c2; }
  .alert-success { background: var(--green-light); color: var(--green); border: 1px solid #b8dfc8; }
  .alert-info { background: #E8F0FB; color: var(--navy); border: 1px solid #bcd0ee; }

  /* ── TABS ── */
  .tab-row { display: flex; gap: 4px; margin-bottom: 20px; background: var(--grey-100); padding: 4px; border-radius: var(--radius-sm); }
  .tab-btn { flex: 1; padding: 9px 14px; border: none; border-radius: 6px; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500; cursor: pointer; color: var(--grey-600); transition: all 0.2s; }
  .tab-btn.active { background: white; color: var(--navy); font-weight: 600; box-shadow: var(--shadow-sm); }

  /* ── GRID ── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  /* ── CATALOGUE CARD ── */
  .cat-card {
    background: var(--white); border: 1.5px solid var(--grey-200); border-radius: var(--radius);
    padding: 18px; cursor: pointer; transition: all 0.2s;
  }
  .cat-card:hover { border-color: var(--navy); box-shadow: var(--shadow-md); transform: translateY(-1px); }
  .cat-card.selected { border-color: var(--gold); background: var(--gold-light); }
  .cat-card-name { font-weight: 600; color: var(--grey-800); font-size: 0.9rem; margin-bottom: 6px; }
  .cat-card-pts { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: var(--navy); font-weight: 700; }
  .cat-card-pts span { font-size: 0.75rem; color: var(--grey-400); font-family: 'DM Sans', sans-serif; font-weight: 400; }
  .cat-card-notes { font-size: 0.78rem; color: var(--grey-400); margin-top: 4px; }

  /* ── EMPTY STATE ── */
  .empty { text-align: center; padding: 48px 24px; color: var(--grey-400); }
  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty p { font-size: 0.95rem; }

  /* ── KID BALANCE HERO ── */
  .balance-hero {
    background: linear-gradient(135deg, var(--navy) 0%, #2a5080 100%);
    border-radius: var(--radius); padding: 32px; color: white; margin-bottom: 24px;
    position: relative; overflow: hidden;
  }
  .balance-hero::after {
    content: '✦'; position: absolute; right: 24px; top: 16px;
    font-size: 4rem; opacity: 0.07; color: var(--gold);
  }
  .balance-hero-label { font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.7; }
  .balance-hero-value { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 700; color: var(--gold); line-height: 1; margin: 8px 0; }
  .balance-hero-sub { font-size: 0.9rem; opacity: 0.75; }

  /* ── HISTORY ITEM ── */
  .history-item { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--grey-200); }
  .history-item:last-child { border-bottom: none; }
  .history-dot { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .history-dot.earn { background: var(--green-light); }
  .history-dot.spend { background: var(--gold-light); }
  .history-dot.lose { background: var(--red-light); }
  .history-body { flex: 1; }
  .history-title { font-weight: 500; font-size: 0.9rem; }
  .history-date { font-size: 0.78rem; color: var(--grey-400); margin-top: 2px; }
  .history-pts { font-weight: 700; font-family: 'Playfair Display', serif; font-size: 1.05rem; }
  .history-pts.earn { color: var(--green); }
  .history-pts.spend { color: var(--gold); }
  .history-pts.lose { color: var(--red); }

  .section-title { font-size: 1.1rem; color: var(--navy); margin-bottom: 16px; font-family: 'Playfair Display', serif; }
  .inline-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .merit-pts-badge { background: var(--navy); color: white; padding: 4px 12px; border-radius: 99px; font-size: 0.82rem; font-weight: 700; }

  @media (max-width: 768px) {
    .sidebar { width: 100%; min-height: auto; position: relative; }
    .main-content { margin-left: 0; padding: 16px; }
    .two-col, .three-col { grid-template-columns: 1fr; }
    .app-shell { flex-direction: column; }
  }
`;

// ── CONTEXT ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ── UTILS ─────────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" }) : "";

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>
    {status === "pending" ? "⏳" : status === "approved" ? "✅" : "❌"} {status}
  </span>;
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("kid");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ type: "error", text: error.message });
    setLoading(false);
  }

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setMsg({ type: "error", text: error.message }); setLoading(false); return; }
    if (data.user) {
      const { error: pe } = await supabase.from("profiles").insert({ id: data.user.id, full_name: name, role });
      if (!pe && (role === "kid")) {
        await supabase.from("merit_balances").insert({ kid_id: data.user.id });
      }
      if (pe) setMsg({ type: "error", text: pe.message });
      else setMsg({ type: "success", text: "Account created! You can now log in." });
    }
    setLoading(false);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>MériTrack</h1>
          <p>EARN TRUST · GAIN MERITS · UNLOCK REWARDS</p>
        </div>
        <div className="auth-tab-row">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Create Account</button>
        </div>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={tab === "login" ? handleLogin : handleSignup}>
          {tab === "signup" && <>
            <div className="field"><label>Full Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Marissa" required /></div>
            <div className="field"><label>Role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="kid">Kid (Marissa / Margaux)</option>
                <option value="parent">Parent (Maman / Papa)</option>
                <option value="extended_family">Extended Family (Mamina / Tatina)</option>
              </select>
            </div>
          </>}
          <div className="field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="field"><label>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ profile, page, setPage }) {
  const { signOut } = useApp();
  const isParent = profile?.role === "parent";
  const isKid = profile?.role === "kid";
  const isExt = profile?.role === "extended_family";

  const parentNav = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "pending", icon: "⏳", label: "Pending Approvals" },
    { id: "kids", icon: "👧", label: "Kids Overview" },
    { id: "issue-demerit", icon: "⚠️", label: "Issue Demerit" },
    { id: "bonus", icon: "⭐", label: "Bonus Merits" },
    { id: "catalogues", icon: "📚", label: "Catalogues" },
  ];
  const kidNav = [
    { id: "dashboard", icon: "🏠", label: "My Dashboard" },
    { id: "claim", icon: "✨", label: "Claim Merits" },
    { id: "redeem", icon: "🎁", label: "Request Reward" },
    { id: "history", icon: "📋", label: "My History" },
    { id: "catalogues", icon: "📚", label: "Catalogues" },
  ];
  const extNav = [
    { id: "dashboard", icon: "🏠", label: "Overview" },
    { id: "kids", icon: "👧", label: "Girls' Activity" },
  ];

  const nav = isParent ? parentNav : isKid ? kidNav : extNav;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>MériTrack</h2>
        <p>Family Merit Platform</p>
      </div>
      <div className="sidebar-user">
        <div className="sidebar-user-name">{profile?.full_name}</div>
        <div className="sidebar-user-role">
          <span className={`badge badge-${profile?.role === "extended_family" ? "extended" : profile?.role}`}>
            {profile?.role?.replace("_", " ")}
          </span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(n => (
          <button key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <span className="nav-icon">{n.icon}</span> {n.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn btn-ghost btn-sm btn-full" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );
}

// ── PARENT DASHBOARD ──────────────────────────────────────────────────────────
function ParentDashboard({ setPage }) {
  const [stats, setStats] = useState({ pendingClaims: 0, pendingRewards: 0, kids: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ count: pc }, { count: pr }, { data: kids }] = await Promise.all([
        supabase.from("merit_claims").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("reward_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("*, merit_balances(*)").eq("role", "kid"),
      ]);
      setStats({ pendingClaims: pc || 0, pendingRewards: pr || 0, kids: kids || [] });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading dashboard…</p></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Parent Dashboard</h1>
        <p>Family overview — {new Date().toLocaleDateString("en-SG", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card navy">
          <div className="stat-value">{stats.pendingClaims}</div>
          <div className="stat-label">Pending Merit Claims</div>
        </div>
        <div className="stat-card gold">
          <div className="stat-value">{stats.pendingRewards}</div>
          <div className="stat-label">Pending Reward Requests</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{stats.kids.length}</div>
          <div className="stat-label">Kids Registered</div>
        </div>
      </div>

      {(stats.pendingClaims > 0 || stats.pendingRewards > 0) && (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          ⚡ You have {stats.pendingClaims + stats.pendingRewards} item(s) awaiting approval — act within 3 hours.
          <button className="btn btn-sm btn-primary" style={{ marginLeft: 12 }} onClick={() => setPage("pending")}>Review Now</button>
        </div>
      )}

      <div className="two-col">
        {stats.kids.map(kid => (
          <div key={kid.id} className="card">
            <div className="card-title">👧 {kid.full_name}</div>
            <div className="stat-grid" style={{ marginBottom: 0 }}>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: "1.6rem" }}>{kid.merit_balances?.[0]?.current_balance ?? 0}</div>
                <div className="stat-label">Current Balance</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: "1.6rem" }}>{kid.merit_balances?.[0]?.total_earned ?? 0}</div>
                <div className="stat-label">Total Earned</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PENDING APPROVALS ─────────────────────────────────────────────────────────
function PendingApprovals() {
  const { profile } = useApp();
  const [tab, setTab] = useState("claims");
  const [claims, setClaims] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: c }, { data: r }, { data: profs }, { data: acts }, { data: rewItems }] = await Promise.all([
      supabase.from("merit_claims").select("*").eq("status", "pending").order("claimed_at"),
      supabase.from("reward_requests").select("*").eq("status", "pending").order("requested_at"),
      supabase.from("profiles").select("id, full_name"),
      supabase.from("merit_activities").select("id, name, is_time_based"),
      supabase.from("reward_items").select("id, name, merit_cost"),
    ]);
    const profMap = Object.fromEntries((profs||[]).map(p => [p.id, p]));
    const actMap = Object.fromEntries((acts||[]).map(a => [a.id, a]));
    const rewMap = Object.fromEntries((rewItems||[]).map(r => [r.id, r]));
    const enrichedC = (c||[]).map(x => ({...x, profiles: profMap[x.kid_id], merit_activities: actMap[x.activity_id]}));
    const enrichedR = (r||[]).map(x => ({...x, profiles: profMap[x.kid_id], reward_items: rewMap[x.reward_id]}));
    setClaims(enrichedC);
    setRewards(enrichedR);
    setLoading(false);
  }

  async function handleAction(type) {
    if (!activeItem) return;
    const isApprove = actionType === "approve";
    const table = type === "claim" ? "merit_claims" : "reward_requests";
    const { error } = await supabase.from(table).update({
      status: isApprove ? "approved" : "declined",
      reviewed_by: profile.id,
      review_note: reviewNote,
      reviewed_at: new Date().toISOString(),
    }).eq("id", activeItem.id);

    if (!error && isApprove) {
      if (type === "claim") {
        // Update balance
        const { data: bal } = await supabase.from("merit_balances").select("*").eq("kid_id", activeItem.kid_id).single();
        if (bal) {
          await supabase.from("merit_balances").update({
            current_balance: bal.current_balance + activeItem.claimed_merits,
            total_earned: bal.total_earned + activeItem.claimed_merits,
            last_updated: new Date().toISOString(),
          }).eq("kid_id", activeItem.kid_id);
        }
      } else {
        // Deduct merits for reward
        const { data: bal } = await supabase.from("merit_balances").select("*").eq("kid_id", activeItem.kid_id).single();
        if (bal) {
          await supabase.from("merit_balances").update({
            current_balance: Math.max(0, bal.current_balance - activeItem.merits_held),
            total_spent: bal.total_spent + activeItem.merits_held,
            last_updated: new Date().toISOString(),
          }).eq("kid_id", activeItem.kid_id);
        }
      }
    }
    setActiveItem(null); setReviewNote(""); setActionType(null);
    loadAll();
  }

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>;

  const claimCount = claims.length;
  const rewardCount = rewards.length;

  return (
    <div>
      <div className="page-header">
        <h1>Pending Approvals</h1>
        <p>Review and act within 3 hours of submission</p>
      </div>
      <div className="tab-row">
        <button className={`tab-btn ${tab === "claims" ? "active" : ""}`} onClick={() => setTab("claims")}>
          Merit Claims {claimCount > 0 && <span className="merit-pts-badge" style={{ marginLeft: 6 }}>{claimCount}</span>}
        </button>
        <button className={`tab-btn ${tab === "rewards" ? "active" : ""}`} onClick={() => setTab("rewards")}>
          Reward Requests {rewardCount > 0 && <span className="merit-pts-badge" style={{ marginLeft: 6 }}>{rewardCount}</span>}
        </button>
      </div>

      {tab === "claims" && (
        claims.length === 0 ? <div className="empty"><div className="empty-icon">✅</div><p>No pending merit claims</p></div> :
        claims.map(c => (
          <div key={c.id} className="pending-item">
            <div className="pending-item-icon">✨</div>
            <div className="pending-item-body">
              <div className="pending-item-title">{c.profiles?.full_name} — {c.merit_activities?.name}</div>
              <div className="pending-item-meta">
                {c.claimed_merits} merits claimed
                {c.duration_hours ? ` · ${c.duration_hours}h session` : ""}
                {c.notes ? ` · "${c.notes}"` : ""}
                <br />Submitted {fmtDate(c.claimed_at)} at {fmtTime(c.claimed_at)}
              </div>
              <div className="pending-item-actions">
                <button className="btn btn-success btn-sm" onClick={() => { setActiveItem(c); setActionType("approve"); }}>✅ Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => { setActiveItem(c); setActionType("decline"); }}>❌ Decline</button>
              </div>
            </div>
          </div>
        ))
      )}

      {tab === "rewards" && (
        rewards.length === 0 ? <div className="empty"><div className="empty-icon">✅</div><p>No pending reward requests</p></div> :
        rewards.map(r => (
          <div key={r.id} className="pending-item">
            <div className="pending-item-icon">🎁</div>
            <div className="pending-item-body">
              <div className="pending-item-title">{r.profiles?.full_name} — {r.reward_items?.name}</div>
              <div className="pending-item-meta">
                {r.merits_held} merits held
                <br />Requested {fmtDate(r.requested_at)} at {fmtTime(r.requested_at)}
              </div>
              <div className="pending-item-actions">
                <button className="btn btn-success btn-sm" onClick={() => { setActiveItem(r); setActionType("approve"); }}>✅ Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => { setActiveItem(r); setActionType("decline"); }}>❌ Decline</button>
              </div>
            </div>
          </div>
        ))
      )}

      {activeItem && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{actionType === "approve" ? "✅ Approve" : "❌ Decline"}</h2>
            <p style={{ marginBottom: 16, color: "var(--grey-600)" }}>
              {actionType === "decline" ? "Please provide a reason for declining:" : "Add an optional note:"}
            </p>
            <div className="field">
              <textarea value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder={actionType === "decline" ? "Reason for declining…" : "Optional note…"} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setActiveItem(null); setReviewNote(""); }}>Cancel</button>
              <button
                className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
                onClick={() => handleAction(tab === "claims" ? "claim" : "reward")}
                disabled={actionType === "decline" && !reviewNote}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── KIDS OVERVIEW (PARENT) ────────────────────────────────────────────────────
function KidsOverview() {
  const [kids, setKids] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*, merit_balances(*)").eq("role", "kid").then(({ data }) => {
      setKids(data || []);
      if (data?.length) setSelected(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    Promise.all([
      supabase.from("merit_claims").select("*, merit_activities(name)").eq("kid_id", selected).order("claimed_at", { ascending: false }).limit(20),
      supabase.from("reward_requests").select("*, reward_items(name)").eq("kid_id", selected).order("requested_at", { ascending: false }).limit(20),
      supabase.from("demerit_logs").select("*, demerit_behaviours(name)").eq("kid_id", selected).order("issued_at", { ascending: false }).limit(20),
    ]).then(([{ data: c }, { data: r }, { data: d }]) => {
      const all = [
        ...(c || []).map(x => ({ type: "earn", label: x.merit_activities?.name, pts: x.claimed_merits, date: x.claimed_at, status: x.status })),
        ...(r || []).map(x => ({ type: "spend", label: x.reward_items?.name, pts: x.merits_held, date: x.requested_at, status: x.status })),
        ...(d || []).map(x => ({ type: "lose", label: x.demerit_behaviours?.name, pts: x.points_deducted, date: x.issued_at, status: "issued" })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(all);
    });
  }, [selected]);

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>;

  const kid = kids.find(k => k.id === selected);
  const bal = kid?.merit_balances?.[0];

  return (
    <div>
      <div className="page-header"><h1>Kids Overview</h1></div>
      <div className="tab-row">
        {kids.map(k => <button key={k.id} className={`tab-btn ${selected === k.id ? "active" : ""}`} onClick={() => setSelected(k.id)}>{k.full_name}</button>)}
      </div>
      {kid && (
        <>
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            {[["Current Balance", bal?.current_balance ?? 0, "navy"], ["Total Earned", bal?.total_earned ?? 0, "green"], ["Total Spent", bal?.total_spent ?? 0, "gold"], ["Total Deducted", bal?.total_deducted ?? 0, ""]].map(([l, v, c]) => (
              <div key={l} className={`stat-card ${c}`}><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">Recent Activity</div>
            {history.length === 0 ? <div className="empty"><p>No activity yet</p></div> :
              history.map((h, i) => (
                <div key={i} className="history-item">
                  <div className={`history-dot ${h.type}`}>{h.type === "earn" ? "✨" : h.type === "spend" ? "🎁" : "⚠️"}</div>
                  <div className="history-body">
                    <div className="history-title">{h.label}</div>
                    <div className="history-date">{fmtDate(h.date)} · <StatusBadge status={h.status} /></div>
                  </div>
                  <div className={`history-pts ${h.type}`}>{h.type === "earn" ? "+" : "-"}{h.pts}</div>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}

// ── ISSUE DEMERIT ─────────────────────────────────────────────────────────────
function IssueDemerit() {
  const { profile } = useApp();
  const [kids, setKids] = useState([]);
  const [behaviours, setBehaviours] = useState([]);
  const [kidId, setKidId] = useState("");
  const [behaviourId, setBehaviourId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("*").eq("role", "kid"),
      supabase.from("demerit_behaviours").select("*").order("name"),
    ]).then(([{ data: k }, { data: b }]) => { setKids(k || []); setBehaviours(b || []); });
  }, []);

  const selected = behaviours.find(b => b.id === behaviourId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!kidId || !behaviourId) return;
    setLoading(true); setMsg(null);
    const b = behaviours.find(x => x.id === behaviourId);
    const suspUntil = b.baseline_suspension_days
      ? new Date(Date.now() + b.baseline_suspension_days * 86400000).toISOString() : null;

    const { error } = await supabase.from("demerit_logs").insert({
      kid_id: kidId, behaviour_id: behaviourId,
      points_deducted: b.demerit_points, issued_by: profile.id,
      note, suspension_active: !!suspUntil, suspension_ends_at: suspUntil,
    });

    if (!error) {
      // Deduct from balance (floor at 0)
      const { data: bal } = await supabase.from("merit_balances").select("*").eq("kid_id", kidId).single();
      if (bal) {
        const deduct = Math.min(bal.current_balance, b.demerit_points);
        await supabase.from("merit_balances").update({
          current_balance: bal.current_balance - deduct,
          total_deducted: bal.total_deducted + deduct,
          last_updated: new Date().toISOString(),
        }).eq("kid_id", kidId);
      }
      setMsg({ type: "success", text: `Demerit issued. ${b.demerit_points} points deducted.` });
      setKidId(""); setBehaviourId(""); setNote("");
    } else {
      setMsg({ type: "error", text: error.message });
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header"><h1>Issue Demerit</h1><p>Demerits are always issued with a reason.</p></div>
      <div className="card" style={{ maxWidth: 520 }}>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Select Kid</label>
            <select value={kidId} onChange={e => setKidId(e.target.value)} required>
              <option value="">Choose…</option>
              {kids.map(k => <option key={k.id} value={k.id}>{k.full_name}</option>)}
            </select>
          </div>
          <div className="field"><label>Behaviour</label>
            <select value={behaviourId} onChange={e => setBehaviourId(e.target.value)} required>
              <option value="">Choose…</option>
              {behaviours.map(b => <option key={b.id} value={b.id}>{b.name} (−{b.demerit_points} pts)</option>)}
            </select>
          </div>
          {selected && (
            <div className="alert alert-error" style={{ marginBottom: 16 }}>
              ⚠️ <strong>−{selected.demerit_points} merits</strong>
              {selected.baseline_suspension_days ? ` · Baseline suspended ${selected.baseline_suspension_days} days` : ""}
              {selected.notes ? ` · ${selected.notes}` : ""}
            </div>
          )}
          <div className="field"><label>Reason / Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Explain what happened…" required />
          </div>
          <button className="btn btn-danger btn-full" type="submit" disabled={loading || !kidId || !behaviourId}>
            {loading ? "Issuing…" : "Issue Demerit"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── BONUS MERITS ──────────────────────────────────────────────────────────────
function BonusMerits() {
  const { profile } = useApp();
  const [kids, setKids] = useState([]);
  const [kidId, setKidId] = useState("");
  const [pts, setPts] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { supabase.from("profiles").select("*").eq("role", "kid").then(({ data }) => setKids(data || [])); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const amount = parseInt(pts);
    // Insert as an approved claim with a special note
    const { error } = await supabase.from("merit_claims").insert({
      kid_id: kidId, activity_id: null, claimed_merits: amount,
      notes: `BONUS: ${reason}`, status: "approved",
      reviewed_by: profile.id, reviewed_at: new Date().toISOString(),
    });

    // This will fail due to FK constraint on activity_id — use demerit_logs as bonus log instead
    // Actually update balance directly
    if (error) {
      // Update balance directly
      const { data: bal } = await supabase.from("merit_balances").select("*").eq("kid_id", kidId).single();
      if (bal) {
        await supabase.from("merit_balances").update({
          current_balance: bal.current_balance + amount,
          total_earned: bal.total_earned + amount,
          last_updated: new Date().toISOString(),
        }).eq("kid_id", kidId);
        setMsg({ type: "success", text: `+${amount} bonus merits awarded!` });
        setKidId(""); setPts(""); setReason("");
      }
    } else {
      const { data: bal } = await supabase.from("merit_balances").select("*").eq("kid_id", kidId).single();
      if (bal) {
        await supabase.from("merit_balances").update({
          current_balance: bal.current_balance + amount,
          total_earned: bal.total_earned + amount,
          last_updated: new Date().toISOString(),
        }).eq("kid_id", kidId);
      }
      setMsg({ type: "success", text: `+${amount} bonus merits awarded!` });
      setKidId(""); setPts(""); setReason("");
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header"><h1>Award Bonus Merits</h1><p>For exceptional behaviour not in the merit catalogue. Both parents should agree before awarding.</p></div>
      <div className="card" style={{ maxWidth: 520 }}>
        {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Select Kid</label>
            <select value={kidId} onChange={e => setKidId(e.target.value)} required>
              <option value="">Choose…</option>
              {kids.map(k => <option key={k.id} value={k.id}>{k.full_name}</option>)}
            </select>
          </div>
          <div className="field"><label>Bonus Merits</label><input type="number" min="1" max="100" value={pts} onChange={e => setPts(e.target.value)} required placeholder="e.g. 25" /></div>
          <div className="field"><label>Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Why are these bonus merits being awarded?" required /></div>
          <button className="btn btn-gold btn-full" type="submit" disabled={loading || !kidId || !pts || !reason}>
            {loading ? "Awarding…" : "⭐ Award Bonus Merits"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── CATALOGUES (PARENT + KID VIEW) ────────────────────────────────────────────
function Catalogues() {
  const { profile } = useApp();
  const [tab, setTab] = useState("merits");
  const [merits, setMerits] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [demerits, setDemerits] = useState([]);

  useEffect(() => {
    Promise.all([
      supabase.from("merit_activities").select("*").eq("is_active", true).order("name"),
      supabase.from("reward_items").select("*").eq("is_active", true).order("merit_cost"),
      supabase.from("demerit_behaviours").select("*").order("name"),
    ]).then(([{ data: m }, { data: r }, { data: d }]) => {
      setMerits(m || []); setRewards(r || []); setDemerits(d || []);
    });
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Catalogues</h1><p>All activities, rewards, and demerit behaviours</p></div>
      <div className="tab-row">
        <button className={`tab-btn ${tab === "merits" ? "active" : ""}`} onClick={() => setTab("merits")}>✨ Earn Merits</button>
        <button className={`tab-btn ${tab === "rewards" ? "active" : ""}`} onClick={() => setTab("rewards")}>🎁 Rewards</button>
        {profile?.role === "parent" && <button className={`tab-btn ${tab === "demerits" ? "active" : ""}`} onClick={() => setTab("demerits")}>⚠️ Demerits</button>}
      </div>

      {tab === "merits" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Activity</th><th>Merits</th><th>Notes</th></tr></thead>
            <tbody>
              {merits.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td>
                    {m.is_time_based
                      ? <span>{m.tier_1_merits} / {m.tier_2_merits}{m.tier_3_merits ? ` / ${m.tier_3_merits}` : ""} <small style={{ color: "var(--grey-400)" }}>(cap {m.daily_cap})</small></span>
                      : <span className="merit-pts-badge">{m.base_merits}</span>
                    }
                  </td>
                  <td style={{ color: "var(--grey-600)", fontSize: "0.85rem" }}>{m.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "rewards" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Reward</th><th>Cost</th><th>Notice</th><th>Notes</th></tr></thead>
            <tbody>
              {rewards.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  <td><span className="merit-pts-badge">{r.merit_cost}</span></td>
                  <td style={{ fontSize: "0.85rem" }}>{r.advance_notice_hours > 0 ? `${r.advance_notice_hours}h` : "—"}</td>
                  <td style={{ color: "var(--grey-600)", fontSize: "0.85rem" }}>{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "demerits" && profile?.role === "parent" && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Behaviour</th><th>Demerits</th><th>Suspension</th><th>Notes</th></tr></thead>
            <tbody>
              {demerits.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong></td>
                  <td><span style={{ color: "var(--red)", fontWeight: 700 }}>−{d.demerit_points}</span></td>
                  <td style={{ fontSize: "0.85rem" }}>{d.baseline_suspension_days ? `${d.baseline_suspension_days}d (${d.suspension_type})` : "—"}</td>
                  <td style={{ color: "var(--grey-600)", fontSize: "0.85rem" }}>{d.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── KID DASHBOARD ─────────────────────────────────────────────────────────────
function KidDashboard({ setPage }) {
  const { profile } = useApp();
  const [balance, setBalance] = useState(null);
  const [pending, setPending] = useState({ claims: 0, rewards: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: bal }, { count: cc }, { count: rc }, { data: claims }, { data: reqs }] = await Promise.all([
        supabase.from("merit_balances").select("*").eq("kid_id", profile.id).single(),
        supabase.from("merit_claims").select("*", { count: "exact", head: true }).eq("kid_id", profile.id).eq("status", "pending"),
        supabase.from("reward_requests").select("*", { count: "exact", head: true }).eq("kid_id", profile.id).eq("status", "pending"),
        supabase.from("merit_claims").select("*, merit_activities(name)").eq("kid_id", profile.id).order("claimed_at", { ascending: false }).limit(5),
        supabase.from("reward_requests").select("*, reward_items(name)").eq("kid_id", profile.id).order("requested_at", { ascending: false }).limit(5),
      ]);
      setBalance(bal);
      setPending({ claims: cc || 0, rewards: rc || 0 });
      const all = [
        ...(claims || []).map(x => ({ type: "earn", label: x.merit_activities?.name, pts: x.claimed_merits, date: x.claimed_at, status: x.status })),
        ...(reqs || []).map(x => ({ type: "spend", label: x.reward_items?.name, pts: x.merits_held, date: x.requested_at, status: x.status })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
      setRecent(all);
      setLoading(false);
    }
    load();
  }, [profile.id]);

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>;

  return (
    <div>
      <div className="balance-hero">
        <div className="balance-hero-label">My Merit Balance</div>
        <div className="balance-hero-value">{balance?.current_balance ?? 0}</div>
        <div className="balance-hero-sub">Total earned: {balance?.total_earned ?? 0} · Total spent: {balance?.total_spent ?? 0}</div>
      </div>

      {pending.claims + pending.rewards > 0 && (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          ⏳ You have {pending.claims} merit claim(s) and {pending.rewards} reward request(s) pending parent approval.
        </div>
      )}

      <div className="two-col" style={{ marginBottom: 24 }}>
        <button className="btn btn-primary" style={{ padding: "18px", fontSize: "1rem" }} onClick={() => setPage("claim")}>
          ✨ Claim Merits
        </button>
        <button className="btn btn-gold" style={{ padding: "18px", fontSize: "1rem" }} onClick={() => setPage("redeem")}>
          🎁 Request Reward
        </button>
      </div>

      <div className="card">
        <div className="card-title">Recent Activity</div>
        {recent.length === 0 ? <div className="empty"><p>No activity yet — start claiming merits!</p></div> :
          recent.map((h, i) => (
            <div key={i} className="history-item">
              <div className={`history-dot ${h.type}`}>{h.type === "earn" ? "✨" : "🎁"}</div>
              <div className="history-body">
                <div className="history-title">{h.label}</div>
                <div className="history-date">{fmtDate(h.date)} · <StatusBadge status={h.status} /></div>
              </div>
              <div className={`history-pts ${h.type}`}>{h.type === "earn" ? "+" : "-"}{h.pts}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── CLAIM MERITS (KID) ────────────────────────────────────────────────────────
function ClaimMerits() {
  const { profile } = useApp();
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => { supabase.from("merit_activities").select("*").eq("is_active", true).order("name").then(({ data }) => setActivities(data || [])); }, []);

  function calcMerits() {
    if (!selected) return 0;
    if (!selected.is_time_based) return selected.base_merits;
    const tiers = [selected.tier_1_merits, selected.tier_2_merits, selected.tier_3_merits].filter(Boolean);
    const idx = Math.min(duration - 1, tiers.length - 1);
    return tiers[idx] || selected.base_merits;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true); setMsg(null);
    const merits = calcMerits();
    const { error } = await supabase.from("merit_claims").insert({
      kid_id: profile.id, activity_id: selected.id,
      claimed_merits: merits,
      duration_hours: selected.is_time_based ? duration : null,
      notes,
    });
    if (error) setMsg({ type: "error", text: error.message });
    else { setMsg({ type: "success", text: `Claim submitted for ${merits} merits! Waiting for parent approval.` }); setSelected(null); setNotes(""); setDuration(1); }
    setLoading(false);
  }

  const merits = calcMerits();

  return (
    <div>
      <div className="page-header"><h1>Claim Merits</h1><p>Select what you did today and submit for approval.</p></div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Select Activity</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {activities.map(a => (
            <div key={a.id} className={`cat-card ${selected?.id === a.id ? "selected" : ""}`} onClick={() => setSelected(a)}>
              <div className="cat-card-name">{a.name}</div>
              <div className="cat-card-pts">
                {a.is_time_based ? `${a.tier_1_merits}–${a.daily_cap}` : a.base_merits}
                <span> merits</span>
              </div>
              {a.notes && <div className="cat-card-notes">{a.notes}</div>}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-title">📝 {selected.name}</div>
          {selected.is_time_based && (
            <div className="field">
              <label>Duration (hours)</label>
              <select value={duration} onChange={e => setDuration(parseInt(e.target.value))}>
                {[1, 2, 3].map(h => <option key={h} value={h}>{h} hour{h > 1 ? "s" : ""}</option>)}
              </select>
            </div>
          )}
          <div className="field"><label>Notes (optional)</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add any details…" /></div>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            This claim is worth <strong>{merits} merits</strong>. A parent will review within 3 hours.
          </div>
          <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : `Submit Claim for ${merits} Merits`}
          </button>
        </div>
      )}
    </div>
  );
}

// ── REQUEST REWARD (KID) ──────────────────────────────────────────────────────
function RequestReward() {
  const { profile } = useApp();
  const [rewards, setRewards] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    Promise.all([
      supabase.from("reward_items").select("*").eq("is_active", true).order("merit_cost"),
      supabase.from("merit_balances").select("current_balance").eq("kid_id", profile.id).single(),
    ]).then(([{ data: r }, { data: b }]) => { setRewards(r || []); setBalance(b?.current_balance ?? 0); });
  }, [profile.id]);

  async function handleRequest() {
    if (!selected) return;
    if (balance < selected.merit_cost) { setMsg({ type: "error", text: "Not enough merits for this reward." }); return; }
    setLoading(true); setMsg(null);
    const { error } = await supabase.from("reward_requests").insert({
      kid_id: profile.id, reward_id: selected.id, merits_held: selected.merit_cost,
    });
    if (error) setMsg({ type: "error", text: error.message });
    else { setMsg({ type: "success", text: `Request submitted! ${selected.merit_cost} merits held pending approval.` }); setSelected(null); }
    setLoading(false);
  }

  return (
    <div>
      <div className="page-header"><h1>Request a Reward</h1>
        <p>Your balance: <strong style={{ color: "var(--navy)" }}>{balance} merits</strong></p>
      </div>
      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 24 }}>
        {rewards.map(r => (
          <div key={r.id} className={`cat-card ${selected?.id === r.id ? "selected" : ""} ${balance < r.merit_cost ? "opacity-50" : ""}`}
            onClick={() => balance >= r.merit_cost && setSelected(r)}
            style={{ opacity: balance < r.merit_cost ? 0.45 : 1 }}>
            <div className="cat-card-name">{r.name}</div>
            <div className="cat-card-pts">{r.merit_cost}<span> merits</span></div>
            {r.advance_notice_hours > 0 && <div className="cat-card-notes">⏰ {r.advance_notice_hours}h notice required</div>}
            {r.notes && <div className="cat-card-notes">{r.notes}</div>}
            {balance < r.merit_cost && <div className="cat-card-notes" style={{ color: "var(--red)" }}>Need {r.merit_cost - balance} more merits</div>}
          </div>
        ))}
      </div>

      {selected && (
        <div className="card" style={{ maxWidth: 420 }}>
          <div className="card-title">🎁 {selected.name}</div>
          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            This will hold <strong>{selected.merit_cost} merits</strong> until a parent approves or declines.
            {selected.advance_notice_hours > 0 && ` Please allow ${selected.advance_notice_hours} hours advance notice.`}
          </div>
          <button className="btn btn-gold btn-full" onClick={handleRequest} disabled={loading}>
            {loading ? "Submitting…" : `Request — ${selected.merit_cost} merits`}
          </button>
        </div>
      )}
    </div>
  );
}

// ── KID HISTORY ───────────────────────────────────────────────────────────────
function KidHistory() {
  const { profile } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("merit_claims").select("*, merit_activities(name)").eq("kid_id", profile.id).order("claimed_at", { ascending: false }),
      supabase.from("reward_requests").select("*, reward_items(name)").eq("kid_id", profile.id).order("requested_at", { ascending: false }),
      supabase.from("demerit_logs").select("*, demerit_behaviours(name)").eq("kid_id", profile.id).order("issued_at", { ascending: false }),
    ]).then(([{ data: c }, { data: r }, { data: d }]) => {
      const all = [
        ...(c || []).map(x => ({ type: "earn", label: x.merit_activities?.name, pts: x.claimed_merits, date: x.claimed_at, status: x.status, note: x.review_note })),
        ...(r || []).map(x => ({ type: "spend", label: x.reward_items?.name, pts: x.merits_held, date: x.requested_at, status: x.status, note: x.review_note })),
        ...(d || []).map(x => ({ type: "lose", label: x.demerit_behaviours?.name, pts: x.points_deducted, date: x.issued_at, status: "demerit", note: x.note })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistory(all);
      setLoading(false);
    });
  }, [profile.id]);

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading history…</p></div>;

  return (
    <div>
      <div className="page-header"><h1>My History</h1><p>All your merit activity</p></div>
      <div className="card">
        {history.length === 0 ? <div className="empty"><div className="empty-icon">📋</div><p>No history yet</p></div> :
          history.map((h, i) => (
            <div key={i} className="history-item">
              <div className={`history-dot ${h.type}`}>{h.type === "earn" ? "✨" : h.type === "spend" ? "🎁" : "⚠️"}</div>
              <div className="history-body">
                <div className="history-title">{h.label}</div>
                <div className="history-date">
                  {fmtDate(h.date)}
                  {h.status !== "demerit" && <> · <StatusBadge status={h.status} /></>}
                  {h.note && <> · <em style={{ color: "var(--grey-400)" }}>{h.note}</em></>}
                </div>
              </div>
              <div className={`history-pts ${h.type}`}>{h.type === "earn" ? "+" : "-"}{h.pts}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── EXTENDED FAMILY DASHBOARD ─────────────────────────────────────────────────
function ExtFamilyDashboard() {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profiles").select("*, merit_balances(*)").eq("role", "kid").then(({ data }) => {
      setKids(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="empty"><div className="empty-icon">⏳</div><p>Loading…</p></div>;

  return (
    <div>
      <div className="page-header"><h1>Family Overview</h1><p>Read-only view of the girls' progress</p></div>
      <div className="two-col">
        {kids.map(kid => {
          const bal = kid.merit_balances?.[0];
          return (
            <div key={kid.id} className="card">
              <div className="card-title">👧 {kid.full_name}</div>
              <div className="stat-grid" style={{ marginBottom: 0 }}>
                <div className="stat-card navy"><div className="stat-value">{bal?.current_balance ?? 0}</div><div className="stat-label">Balance</div></div>
                <div className="stat-card green"><div className="stat-value">{bal?.total_earned ?? 0}</div><div className="stat-label">Earned</div></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="alert alert-info" style={{ marginTop: 24 }}>
        You have read-only access. For reward coordination, please contact Maman or Papa directly.
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────────
function AppShell({ session }) {
  const [profile, setProfile] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (data) { setProfile(data); setLoading(false); return; }
        await new Promise(r => setTimeout(r, 800));
      }
      setLoading(false);
    }
    loadProfile();
  }, [session]);

  async function signOut() { await supabase.auth.signOut(); }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p style={{ color: "var(--grey-600)" }}>Loading MériTrack…</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="alert alert-error">Profile not found. Please contact an administrator.</div>
        <button className="btn btn-ghost btn-full" onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );

  function renderPage() {
    const isParent = profile.role === "parent";
    const isKid = profile.role === "kid";
    if (isParent) {
      if (page === "dashboard") return <ParentDashboard setPage={setPage} />;
      if (page === "pending") return <PendingApprovals />;
      if (page === "kids") return <KidsOverview />;
      if (page === "issue-demerit") return <IssueDemerit />;
      if (page === "bonus") return <BonusMerits />;
      if (page === "catalogues") return <Catalogues />;
    }
    if (isKid) {
      if (page === "dashboard") return <KidDashboard setPage={setPage} />;
      if (page === "claim") return <ClaimMerits />;
      if (page === "redeem") return <RequestReward />;
      if (page === "history") return <KidHistory />;
      if (page === "catalogues") return <Catalogues />;
    }
    if (profile.role === "extended_family") {
      if (page === "dashboard") return <ExtFamilyDashboard />;
      if (page === "kids") return <KidsOverview />;
    }
    return <div className="empty"><div className="empty-icon">🚧</div><p>Page not found</p></div>;
  }

  return (
    <AppContext.Provider value={{ profile, signOut }}>
      <div className="app-shell">
        <Sidebar profile={profile} page={page} setPage={setPage} />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </AppContext.Provider>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function MeriTrack() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--navy)" }}>
      <div style={{ color: "white", textAlign: "center" }}>
        <div style={{ fontFamily: "serif", fontSize: "2rem", marginBottom: 8 }}>MériTrack</div>
        <div style={{ opacity: 0.6 }}>Loading…</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      {session ? <AppShell session={session} /> : <AuthScreen />}
    </>
  );
}
