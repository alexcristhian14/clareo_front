import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";

export function OrganizationsToolbar({
  search,
  setSearch,
  status,
  setStatus,
  minMembers,
  setMinMembers,
  minTransactions,
  setMinTransactions,
  dateFilter,
  setDateFilter,
  onCreateOrganization,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 p-5 flex justify-between items-center">
        <div className="flex flex-1 gap-4">
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

        <button 
        onClick={onCreateOrganization}
        className="ml-4 h-10 px-5 bg-blue-600 rounded-[5px] text-white font-bold flex items-center gap-2 shadow-md">
          <Plus size={18} />
          Nova Organização
        </button>
      </div>

      {/* Painel de filtros */}
      {showFilters && (
        <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-6">
          <div className="grid grid-cols-4 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="">Todos</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>

            {/* Membros */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mínimo de membros
              </label>

              <input
                type="number"
                placeholder="Membros mín."
                value={minMembers}
                onChange={(e) => setMinMembers(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

            {/* Transações */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mínimo de transações
              </label>

              <input
                type="number"
                placeholder="Mín. transações"
                className="w-full h-10 px-3 rounded-lg border"
                value={minTransactions}
                onChange={(e) => setMinTransactions(e.target.value)}
              />
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Data de cadastro
              </label>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setMinMembers("");
                setMinTransactions("");
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
