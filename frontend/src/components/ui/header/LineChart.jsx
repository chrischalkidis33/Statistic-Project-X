import "./styles/LineChart.css";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];
const DATA_2026 = [38, 41, 46, 44, 52, 58, 61, 57, 63, 68];
const DATA_2025 = [32, 35, 37, 40, 43, 47, 52, 50, 55, 58];

// διαστάσεις του SVG (viewBox) και περιθώρια
const W = 640,
  H = 280;
const M = { top: 16, right: 44, bottom: 30, left: 44 };
const MAX = 80;
const TICKS = [0, 20, 40, 60, 80];

const x = (i) => M.left + (i / (MONTHS.length - 1)) * (W - M.left - M.right);
const y = (v) => M.top + (1 - v / MAX) * (H - M.top - M.bottom);

const toPath = (data) =>
  data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");

export default function LineChart() {
  const last = MONTHS.length - 1;
  const areaPath = `${toPath(DATA_2026)} L${x(last)},${y(0)} L${x(0)},${y(0)} Z`;

  return (
    <article className="card linechart">
      <div className="linechart__head">
        <div>
          <h2 className="card__title">Revenue by month</h2>
          <p className="card__subtitle">€ thousands, 2026 vs 2025</p>
        </div>
        <ul className="linechart__legend">
          <li>
            <span style={{ background: "var(--chart-1)" }} />
            2026
          </li>
          <li>
            <span style={{ background: "var(--chart-2)" }} />
            2025
          </li>
        </ul>
      </div>

      <svg
        className="linechart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Revenue by month, 2026 vs 2025"
      >
        {TICKS.map((t) => (
          <g key={t}>
            <line
              x1={M.left}
              x2={W - M.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--color-border)"
            />
            <text
              x={M.left - 8}
              y={y(t) + 4}
              textAnchor="end"
              className="linechart__tick"
            >
              {t === 0 ? "0" : `${t}K`}
            </text>
          </g>
        ))}

        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            className="linechart__tick"
          >
            {m}
          </text>
        ))}

        <path d={areaPath} fill="var(--chart-1)" opacity="0.1" />
        <path
          d={toPath(DATA_2025)}
          fill="none"
          stroke="var(--chart-2)"
          strokeWidth="2"
        />
        <path
          d={toPath(DATA_2026)}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
        />

        <circle
          cx={x(last)}
          cy={y(DATA_2026[last])}
          r="4"
          fill="var(--chart-1)"
        />
        <circle
          cx={x(last)}
          cy={y(DATA_2025[last])}
          r="4"
          fill="var(--chart-2)"
        />
        <text
          x={x(last) + 8}
          y={y(DATA_2026[last]) + 4}
          className="linechart__label"
        >
          {DATA_2026[last]}K
        </text>
        <text
          x={x(last) + 8}
          y={y(DATA_2025[last]) + 4}
          className="linechart__label"
        >
          {DATA_2025[last]}K
        </text>
      </svg>
    </article>
  );
}
