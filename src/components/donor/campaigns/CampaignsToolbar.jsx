import { useState } from "react";
import { Search, Filter } from "lucide-react";

export function CampaignsToolbar({
  search,
  setSearch,

  category,
  setCategory,

  status,
  setStatus,

  minGoal,
  setMinGoal,
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
              placeholder="Buscar campanhas..."
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

      {/* PAINEL */}
      {showFilters && (
        <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-6">

          <div className="grid grid-cols-3 gap-6">

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Categoria
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="all">Todas</option>
                <option value="health">Saúde</option>
                <option value="education">Educação</option>
                <option value="food">Alimentação</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="">Todos</option>
                <option value="active">Em andamento</option>
                <option value="finished">Finalizada</option>
              </select>
            </div>

            {/* Meta mínima */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Meta mínima
              </label>

              <input
                type="number"
                value={minGoal}
                onChange={(e) => setMinGoal(e.target.value)}
                placeholder="R$"
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setStatus("");
                setMinGoal("");
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