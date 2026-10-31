import { useAuth } from "../auth/hook/useAuth";
import Nav from "../../components/ui/Nav";
import SideBar from "../../components/ui/SideBar";
import MainContainer from "../../components/ui/MainContainer";
import Footer from "../../components/ui/Footer";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Nav />
      <SideBar />
      <MainContainer />
      <Footer />
    </div>
  );
}
