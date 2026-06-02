import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "../../common/Button";

export function CampaignsToolbar({
  search,
  setSearch,
  status,
  setStatus,
  minGoal,
  setMinGoal,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  onCreateCampaign,
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4">

      {/* TOP BAR */}
      <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 p-5 flex justify-between items-center">

        <div className="flex flex-1 gap-4">

          {/* SEARCH */}
          <div className="flex-1 h-10 px-3 bg-slate-100 rounded-[10px] flex items-center gap-2">
            <Search size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar campanha..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* FILTER BUTTON */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="h-10 px-6 bg-slate-100 rounded-[10px] flex items-center gap-2 hover:bg-slate-200 transition"
          >
            <Filter size={18} />
            Filtros
          </button>

        </div>

        {/* CREATE BUTTON */}
        <Button
          icon={Plus}
          onClick={onCreateCampaign}
          className="ml-4"
        >
          Nova Campanha
        </Button>

      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] p-6">

          <div className="grid grid-cols-4 gap-6">

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              >
                <option value="">Todas</option>
                <option value="Ativa">Ativa</option>
                <option value="Pausada">Pausada</option>
                <option value="Encerrada">Encerrada</option>
              </select>
            </div>

            {/* MIN GOAL */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Meta mínima
              </label>

              <input
                type="number"
                value={minGoal}
                onChange={(e) => setMinGoal(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
                placeholder="Ex: 5000"
              />
            </div>

            {/* START DATE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Data início
              </label>

              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Data fim
              </label>

              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="h-10 px-3 rounded-lg border w-full"
              />
            </div>

          </div>

          {/* CLEAR */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setMinGoal("");
                setDateStart("");
                setDateEnd("");
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