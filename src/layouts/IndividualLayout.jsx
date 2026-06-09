import { useNavigate, Link } from "react-router-dom";
import { Wallet, LogOut, Building2, LogIn, UserPlus, Handshake, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";

export function IndividualLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Clareo" className="h-8 w-8" />
            <span className="text-lg font-bold text-slate-800">CLAREO</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate("/carteira")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Wallet size={18} />
                <span className="hidden sm:inline">Carteira</span>
              </button>

              <button
                onClick={() => navigate("/minhas-instituicoes")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Building2 size={18} />
                <span className="hidden sm:inline">Minhas Instituições</span>
              </button>

              <button
                onClick={() => navigate("/minhas-associacoes")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Handshake size={18} />
                <span className="hidden sm:inline">Associações</span>
              </button>

              <button
                onClick={() => navigate("/minhas-doacoes-recorrentes")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">Doações Recorrentes</span>
              </button>

              <button
                onClick={() => navigate("/perfil")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  {user?.name || "Usuário"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Entrar</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <UserPlus size={18} />
                <span className="hidden sm:inline">Criar Conta</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
