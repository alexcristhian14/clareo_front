import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "../../common/Button";

export function ContributorsToolbar({
  search,
  setSearch,
  role,
  setRole,
  organization,
  setOrganization,
  dateFilter,
  setDateFilter,
  onAdd,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* TOOLBAR */}
      <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 p-5 flex justify-between items-center mt-2">
        {/* SEARCH + FILTER BTN */}
        <div className="flex flex-1 gap-6">
          <div className="flex-1 h-10 px-3 bg-slate-100 rounded-[10px] flex items-center gap-2">
            <Search size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 px-6 bg-slate-100 rounded-[10px] flex items-center gap-2 hover:bg-slate-200 transition"
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>

        {/* BUTTON */}
        <Button icon={Plus} onClick={onAdd} variant="primary">
          Novo Contribuidor
        </Button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* ROLE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Cargo (Role)
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="">Todos</option>
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {/* ORGANIZATION */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Organização
              </label>

              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Filtrar organização"
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Data de entrada
              </label>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>
          </div>

          {/* CLEAR */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSearch("");
                setRole("");
                setOrganization("");
                setDateFilter("");
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
