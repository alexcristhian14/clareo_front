export function DonorStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-xs text-zinc-500">Total doado</p>

        <h3 className="text-2xl font-bold text-slate-800 mt-2">
          R$ {stats.totalDonated.toLocaleString("pt-BR")}
        </h3>
      </div>

      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-xs text-zinc-500">Campanhas apoiadas</p>

        <h3 className="text-2xl font-bold text-slate-800 mt-2">
          {stats.supportedCampaigns}
        </h3>
      </div>

      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-xs text-zinc-500">Evidências visualizadas</p>

        <h3 className="text-2xl font-bold text-slate-800 mt-2">
          {stats.evidencesViewed}
        </h3>
      </div>
    </div>
  );
}
