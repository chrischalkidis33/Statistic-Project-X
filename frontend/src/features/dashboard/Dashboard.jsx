import { useAuth } from "../auth/hook/useAuth";
export default function Dashboard() {
  const { user } = useAuth();
  return <h1>Hello {user.email}</h1>;
}
