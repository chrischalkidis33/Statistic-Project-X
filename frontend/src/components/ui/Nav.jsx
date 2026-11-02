import { useState, useEffect } from "react";
import { Search, Upload, Bell, Moon, Sun } from "lucide-react";
import "./Nav.css";

function getInitialTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Nav() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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

        <button
          className="nav__icon-btn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
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