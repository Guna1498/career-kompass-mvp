export default function Sidebar({ nav, setNav, onLogout }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#1D9E75" />
          <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sidebar-logo-text">Career Kompass</span>
      </div>

      {/* Menu section */}
      <div className="sidebar-section-label">MENU</div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item${nav === "dashboard" ? " active" : ""}`}
          onClick={() => setNav("dashboard")}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </span>
          Dashboard
        </button>

        <button
          className={`sidebar-nav-item${nav === "analysis" ? " active" : ""}`}
          onClick={() => setNav("analysis")}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="13" width="4" height="8" rx="1" />
              <rect x="10" y="8" width="4" height="13" rx="1" />
              <rect x="17" y="3" width="4" height="18" rx="1" />
            </svg>
          </span>
          Analysis
        </button>

        <button
          className={`sidebar-nav-item${nav === "history" ? " active" : ""}`}
          onClick={() => setNav("history")}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
          </span>
          History
        </button>
      </nav>

      <div style={{ flex: 1 }} />

      {/* General section */}
      <div className="sidebar-section-label">GENERAL</div>
      <nav className="sidebar-nav sidebar-nav-bottom">
        <button
          className={`sidebar-nav-item${nav === "settings" ? " active" : ""}`}
          onClick={() => setNav("settings")}
        >
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          Settings
        </button>

        <button className="sidebar-nav-item logout-item" onClick={onLogout}>
          <span className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          Logout
        </button>
      </nav>
    </aside>
  );
}
