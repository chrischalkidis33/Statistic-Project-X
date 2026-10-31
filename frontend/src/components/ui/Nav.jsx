import { useState } from "react";
import { Search, Upload, Bell } from "lucide-react";
import "./Nav.css";
export default function Nav() {
  const [query, setQuery] = useState(""); //αυτό το query αφορά το search
  return (
    <header className="nav">
      <div className="nav__logo">
        <span className="nav__logo-mark" aria-hidden="true" />
        <span className="nav__logo-text">Statistics</span>
      </div>

      <label className="nav__search">
        <Search size={16} />
        <input
          type="search"
          placeholder="Search reports, files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="nav__actions">
        <button className="nav__upload">
          <Upload size={16} />
          <span>Upload Excel</span>
        </button>

        <button className="nav__icon-btn" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <button className="nav__profile">
          <span className="nav__avatar">DU</span>
          <span className="nav__profile-name">Demo User</span>
        </button>
      </div>
    </header>
  );
}
