import { ArrowUp } from "lucide-react";
import "./styles/KpiCards.css";

const KPIS = [
  {
    label: "Total revenue",
    value: "€528.0K",
    delta: "+17.9%",
    vs: "vs 2025",
    spark: [3, 4, 4, 6, 5, 7, 9],
  },
  {
    label: "Orders",
    value: "4,812",
    delta: "+9.4%",
    vs: "vs 2025",
    spark: [4, 5, 4, 6, 6, 7, 7],
  },
  {
    label: "Avg. order value",
    value: "€109.7",
    delta: "+7.7%",
    vs: "vs 2025",
    spark: [3, 3, 4, 4, 5, 5, 6],
  },
  {
    label: "Best month (Oct)",
    value: "€68.0K",
    delta: "+7.9%",
    vs: "vs Sep",
    spark: [4, 5, 4, 6, 5, 7, 8],
  },
];

function Sparkline({ data }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((v - min) / (max - min || 1)) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      className="kpi__spark"
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={pts}
        fill="none"
        stroke="var(--chart-5)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function KpiCards() {
  return (
    <section className="kpis">
      {KPIS.map((k) => (
        <article key={k.label} className="card kpi">
          <p className="kpi__label">{k.label}</p>
          <p className="kpi__value">{k.value}</p>
          <div className="kpi__footer">
            <p className="kpi__delta">
              <ArrowUp size={14} />
              <strong>{k.delta}</strong>
              <span>{k.vs}</span>
            </p>
            <Sparkline data={k.spark} />
          </div>
        </article>
      ))}
    </section>
  );
}
