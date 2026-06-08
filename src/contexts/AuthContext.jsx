import { createContext, useContext, useEffect, useState } from "react";
import {
  api,
  getStoredToken,
  getStoredOrganization,
  storeAuth,
  clearAuth,
} from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(getStoredOrganization());

  const hasOrganization = !!organization;

  async function loadUser() {
    try {
      const { data } = await api.get("/auth/me");
      const userData = data.user || data;
      setUser({ ...userData, token: getStoredToken() });
      storeAuth(getStoredToken(), userData);

      const storedOrg = getStoredOrganization();
      if (storedOrg?.organization_id) {
        try {
          const { data: orgData } = await api.get(
            `/organizations/${storedOrg.organization_id}`
          );
          const verifiedOrg = orgData.organization || orgData;
          setOrganization(verifiedOrg);
          return;
        } catch {
          setOrganization(null);
        }
      }

      try {
        const { data: orgs } = await api.get("/organizations?limit=50");
        const list = Array.isArray(orgs) ? orgs : orgs.organizations || [];
        const userOrg = list.find(
          (o) => o.owner_user_id === (userData.user_id || userData.id)
        );
        if (userOrg) {
          setOrganization(userOrg);
        }
      } catch {
        // no orgs found
      }
    } catch {
      clearAuth();
      setUser(null);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const userData = data.user || data;
    const token = data.token;
    storeAuth(token, userData);
    setUser({ ...userData, token });
    return userData;
  }

  async function register(name, email, password) {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    const userData = data.user || data;
    const token = data.token;
    storeAuth(token, userData);
    setUser({ ...userData, token });
    return userData;
  }

  function logout() {
    clearAuth();
    setUser(null);
    setOrganization(null);
  }

  function setCurrentOrganization(org) {
    setOrganization(org);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        organization,
        hasOrganization,
        setCurrentOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
