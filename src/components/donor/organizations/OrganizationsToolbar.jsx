import { useState } from "react";
import { Search, Filter } from "lucide-react";

export function OrganizationsToolbar({
  search,
  setSearch,

  associatedOnly,
  setAssociatedOnly,

  minCampaigns,
  setMinCampaigns,

  minSupporters,
  setMinSupporters,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* TOOLBAR */}
      <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-5 flex justify-between items-center">
        <div className="flex flex-1 gap-4">
          <div className="flex-1 h-10 px-3 bg-slate-100 rounded-[10px] flex items-center gap-2">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar organizações..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="
              h-10
              px-6
              bg-slate-100
              rounded-[10px]
              flex items-center gap-2
              hover:bg-slate-200
              transition
            "
          >
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* PAINEL DE FILTROS */}
      {showFilters && (
        <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* ASSOCIAÇÃO */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Associação
              </label>

              <select
                value={associatedOnly}
                onChange={(e) => setAssociatedOnly(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="all">Todas</option>
                <option value="associated">Associadas</option>
                <option value="not-associated">Não associadas</option>
              </select>
            </div>

            {/* CAMPANHAS */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mínimo de campanhas
              </label>

              <input
                type="number"
                value={minCampaigns}
                onChange={(e) => setMinCampaigns(e.target.value)}
                placeholder="Ex: 5"
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

            {/* APOIADORES */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Mínimo de apoiadores
              </label>

              <input
                type="number"
                value={minSupporters}
                onChange={(e) => setMinSupporters(e.target.value)}
                placeholder="Ex: 100"
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSearch("");
                setAssociatedOnly("all");
                setMinCampaigns("");
                setMinSupporters("");
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
