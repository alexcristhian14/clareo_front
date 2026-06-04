import { useState } from "react";
import { NavLink } from "react-router-dom";

import logo from "../../../assets/logo.svg";

import {
  Home,
  Building2,
  Megaphone,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

export function DonorSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`
        min-h-screen bg-slate-700
        shadow-[29px_20px_30px_-32px_rgba(0,0,0,0.25)]
        flex flex-col justify-between items-center
        overflow-hidden
        transition-all duration-300 ease-in-out
        py-8

        ${isOpen ? "w-72 px-4" : "w-32 px-3"}
      `}
    >
      {/* TOP */}
      <div className="w-full flex flex-col items-center gap-16">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={logo}
            alt="Clareo Logo"
            className={`
              object-contain transition-all duration-300
              ${isOpen ? "w-20 h-20" : "w-16 h-16"}
            `}
          />

          <div
            className={`
              h-10 rounded-[30px] border border-white
              flex items-center justify-center
              transition-all duration-300 overflow-hidden

              ${isOpen ? "w-40" : "w-24"}
            `}
          >
            <span
              className={`
                text-white font-bold whitespace-nowrap
                transition-all duration-300

                ${isOpen ? "text-lg" : "text-sm"}
              `}
            >
              CLAREO
            </span>
          </div>
        </div>

        {/* MENU */}
        <div className="w-full flex flex-col gap-4">
          <SidebarItem
            to="/donor/feed"
            icon={<Home size={24} />}
            label="Feed"
            isOpen={isOpen}
          />

          <SidebarItem
            to="/donor/organizations"
            icon={<Building2 size={24} />}
            label="Organizações"
            isOpen={isOpen}
          />

          <SidebarItem
            to="/donor/campaigns"
            icon={<Megaphone size={24} />}
            label="Campanhas"
            isOpen={isOpen}
          />

          <SidebarItem
            to="/donor/wallet"
            icon={<Wallet size={24} />}
            label="Carteira"
            isOpen={isOpen}
          />

          <SidebarItem
            to="/donor/settings"
            icon={<Settings size={24} />}
            label="Configurações"
            isOpen={isOpen}
          />
        </div>
      </div>

      {/* LOGOUT */}
      <button
        className={`
          h-14 rounded-[10px] border border-zinc-400
          flex items-center justify-center gap-3
          hover:bg-slate-600 transition-all duration-300
          overflow-hidden

          ${isOpen ? "w-48" : "w-14"}
        `}
      >
        <LogOut className="text-red-500 shrink-0" size={24} />

        <span
          className={`
            text-red-500 text-xl font-bold whitespace-nowrap
            transition-all duration-300

            ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}
          `}
        >
          Sair
        </span>
      </button>
    </aside>
  );
}

function SidebarItem({ to, icon, label, isOpen }) {
  return (
    <NavLink to={to} className="flex justify-center w-full">
      {({ isActive }) => (
        <div
          className={`
            h-12 rounded-xl
            flex items-center
            transition-all duration-300
            cursor-pointer overflow-hidden

            ${
              isOpen
                ? "w-64 px-4 gap-4 justify-start"
                : "w-14 mx-auto justify-center"
            }

            ${
              isActive
                ? "bg-white text-slate-700"
                : "text-zinc-300 hover:bg-slate-600 hover:text-white"
            }
          `}
        >
          <div className="shrink-0">{icon}</div>

          <span
            className={`
              whitespace-nowrap font-semibold
              transition-all duration-300

              ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
            `}
          >
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}
