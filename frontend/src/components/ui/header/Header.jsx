import { useState } from "react";
import { Calendar, ChevronDown, FileSpreadsheet } from "lucide-react";
import "./styles/Header.css";

const TABS = ["Monthly", "Quarterly", "Yearly"];

export default function Header() {
  const [tab, setTab] = useState("Monthly");
  const [region, setRegion] = useState("all");

  return (
    <div className="header">
      <div className="header__title">
        <h1>Dashboard</h1>
        <p>Revenue overview · January – October 2026</p>
      </div>

      <div className="header__bar">
        <div className="header__filters">
          <button className="header__pill">
            <Calendar size={15} />
            <span>Jan 1 – Oct 31, 2026</span>
          </button>

          <label className="header__pill header__select">
            <select value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="all">All regions</option>
              <option value="attica">Attica</option>
              <option value="cm">Central Macedonia</option>
              <option value="crete">Crete</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        <div className="header__tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`header__tab ${tab === t ? "is-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="header__file">
          <FileSpreadsheet size={15} />
          <span>sales_2026.xlsx</span>
        </div>
      </div>
    </div>
  );
}
