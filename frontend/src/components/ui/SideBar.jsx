import { useState } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  MapPin,
  Package,
  Upload,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import "./SideBar.css";

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "revenue", label: "Revenue", icon: TrendingUp },
  { id: "regions", label: "Regions", icon: MapPin },
  { id: "products", label: "Products", icon: Package },
];

const DATA = [
  { id: "uploads", label: "Uploads", icon: Upload },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

function Section({ title, items, active, onSelect }) {
  return (
    <div className="sidebar__section">
      <p className="sidebar__title">{title}</p>
      <ul className="sidebar__list">
        {items.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              className={`sidebar__item ${active === id ? "is-active" : ""}`}
              onClick={() => onSelect(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function SideBar() {
  const [active, setActive] = useState("dashboard");
  return (
    <aside className="sidebar">
      <Section
        title="Analytics"
        items={MENU}
        active={active}
        onSelect={setActive}
      />
      <Section title="Data" items={DATA} active={active} onSelect={setActive} />
    </aside>
  );
}
