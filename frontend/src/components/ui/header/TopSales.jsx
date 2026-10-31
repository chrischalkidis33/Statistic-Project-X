import "./styles/TopSales.css";

const PRODUCTS = [
  {
    name: "Extra virgin olive oil 5L",
    category: "Pantry",
    units: 1124,
    revenue: "€84.3K",
    share: 16.0,
  },
  {
    name: "Thyme honey 450g",
    category: "Pantry",
    units: 986,
    revenue: "€71.6K",
    share: 13.6,
  },
  {
    name: "Feta PDO 400g",
    category: "Dairy",
    units: 1310,
    revenue: "€63.2K",
    share: 12.0,
  },
  {
    name: "Halkidiki olives 1kg",
    category: "Pantry",
    units: 702,
    revenue: "€52.8K",
    share: 10.0,
  },
  {
    name: "Mountain tea mix",
    category: "Herbs",
    units: 589,
    revenue: "€44.1K",
    share: 8.4,
  },
];

export default function TopSales() {
  return (
    <article className="card topsales">
      <h2 className="card__title">Top products</h2>
      <p className="card__subtitle">By revenue, year to date</p>

      <div className="topsales__scroll">
        <table className="topsales__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th className="is-num">Units</th>
              <th className="is-num">Revenue</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>
                  <span className="topsales__tag">{p.category}</span>
                </td>
                <td className="is-num">{p.units.toLocaleString("en-US")}</td>
                <td className="is-num">{p.revenue}</td>
                <td>
                  <div className="topsales__share">
                    <div className="topsales__track">
                      <div
                        className="topsales__fill"
                        style={{ width: `${p.share * 6}%` }}
                      />
                    </div>
                    <span>{p.share.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
