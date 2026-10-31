import "./styles/BarChart.css";

const REGIONS = [
  { name: "Attica", value: 188 },
  { name: "Central Macedonia", value: 142 },
  { name: "Crete", value: 71 },
  { name: "Thessaly", value: 52 },
  { name: "Peloponnese", value: 39 },
  { name: "Other", value: 36 },
];

const MAX = Math.max(...REGIONS.map((r) => r.value));

export default function BarChart() {
  return (
    <article className="card barchart">
      <h2 className="card__title">Revenue by region</h2>
      <p className="card__subtitle">€ thousands, year to date</p>

      <ul className="barchart__list">
        {REGIONS.map((r) => (
          <li key={r.name} className="barchart__row">
            <span className="barchart__name">{r.name}</span>
            <div className="barchart__track">
              <div
                className="barchart__bar"
                style={{ width: `${(r.value / MAX) * 100}%` }}
              />
            </div>
            <span className="barchart__value">{r.value}K</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
