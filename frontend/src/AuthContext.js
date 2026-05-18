import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import authService from "./services/authService";

const AuthContext = createContext({
  initialized: false,
  isAuthenticated: false,
  userEmail: "",
  login: async (email, password) => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLogout = useCallback(
    (redirect = true) => {
      authService.logout();
      setIsAuthenticated(false);
      setUserEmail("");
      if (redirect) {
        navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  const login = useCallback(async (email, password) => {
    const response = await authService.loginWithPassword(email, password);
    const valid = authService.isSessionValid();
    setIsAuthenticated(valid);
    setUserEmail(valid ? authService.getCurrentUser() : "");
    return response;
  }, []);

  useEffect(() => {
    const valid = authService.isSessionValid();
    if (!valid) {
      authService.logout();
    }

    setIsAuthenticated(valid);
    setUserEmail(valid ? authService.getCurrentUser() : "");
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return undefined;

    const interval = window.setInterval(() => {
      if (!authService.isSessionValid()) {
        handleLogout(false);
      }
    }, 15000);

    return () => window.clearInterval(interval);
  }, [initialized, handleLogout]);

  const value = useMemo(
    () => ({
      initialized,
      isAuthenticated,
      userEmail,
      login,
      logout: handleLogout,
    }),
    [initialized, isAuthenticated, userEmail, login, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
