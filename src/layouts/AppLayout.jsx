import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  Wallet,
  Settings,
  LogOut,
  Landmark,
  Menu,
  X,
  ScrollText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/campaigns", label: "Campanhas", icon: Megaphone },
  { to: "/contributors", label: "Contribuintes", icon: Users },
  { to: "/wallet", label: "Carteira", icon: Wallet },
  { to: "/financeiro", label: "Financeiro", icon: Landmark },
  { to: "/prestacao-contas", label: "Prestação de Contas", icon: ScrollText },
  { to: "/settings", label: "Configurações", icon: Settings },
];

export function AppLayout({ children, title, description }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-700 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-600">
          <img src={logo} alt="Clareo" className="h-10 w-10" />
          <span className="text-xl font-bold">CLAREO</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-slate-700"
                    : "text-slate-300 hover:bg-slate-600 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/20 hover:text-red-200 w-full transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-slate-600"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex-1">
            {title && (
              <h1 className="text-xl font-bold text-slate-800">{title}</h1>
            )}
            {description && (
              <p className="text-sm text-zinc-500">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-700">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs text-zinc-500">{user?.email}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
