import Header from "./header/Header";
import KpiCards from "./header/KpiCards";
import LineChart from "./header/LineChart";
import BarChart from "./header/BarChart";
import TopSales from "./header/TopSales";
import "./MainContainer.css";
export default function MainContainer() {
  return (
    <main className="main">
      <Header />
      <KpiCards />
      <section className="main__charts">
        <LineChart />
        <BarChart />
      </section>
      <TopSales />
    </main>
  );
}
