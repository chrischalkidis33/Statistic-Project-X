import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //true μέχρι να ξέρουμε εάν υπάρχει session
  const [error, setError] = useState(null);

  //Στην εκκίνηση: υπάρχει ήδη session (cookie);
  useEffect(() => {
    let cancelled = false;

    authService
      .refresh()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  //Μέθοδος που καλεί το call για το login
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  //Μέθοδος που καλεί το call για το register
  //Προς το παρόν δεν χρησιμοποιείται και καλείτε απευθείας από το SignUpForm
  // const register = useCallback(async (fields) => {
  //   setError(null);
  //   try {
  //     await authService.register(fields);
  //     return true;
  //   } catch (err) {
  //     setError(err.message);
  //     return false;
  //   }
  // }, []);

  //Μέθοδος που καλέι το Logout. Δεν την έχω υλοποιήση ακόμα
  // const logout = useCallback(async () => {
  //   try {
  //     await authService.logout();
  //   } finally {
  //     setUser(null);
  //   }
  // }, []);

  // Ίδιο object αν δεν άλλαξε τίποτα → λιγότερα περιττά re-renders
  const value = useMemo(
    () => ({ user, loading, error, login }),
    [user, loading, error, login],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
