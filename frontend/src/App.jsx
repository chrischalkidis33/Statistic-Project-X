import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import Dashboard from "./features/dashboard/Dashboard";
import DefaultNavigate from "../src/features/auth/components/DefaultNavigate";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultNavigate />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
