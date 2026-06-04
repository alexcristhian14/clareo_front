export function WalletStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-zinc-400 text-sm font-bold">TOTAL DOADO</p>

        <h3 className="text-2xl font-bold mt-2">R$ {stats.donated}</h3>
      </div>

      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-zinc-400 text-sm font-bold">RECARGAS</p>

        <h3 className="text-2xl font-bold mt-2">R$ {stats.recharges}</h3>
      </div>

      <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
        <p className="text-zinc-400 text-sm font-bold">CAMPANHAS APOIADAS</p>

        <h3 className="text-2xl font-bold mt-2">{stats.campaigns}</h3>
      </div>
    </div>
  );
}
