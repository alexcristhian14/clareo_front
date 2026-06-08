import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function OrgRoute({ children }) {
  const { user, loading, hasOrganization } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!hasOrganization) {
    return <Navigate to="/" replace />;
  }

  return children;
}
