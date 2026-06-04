export function RecentUpdates({ updates }) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Atualizações recentes
      </h2>

      <div className="flex flex-col gap-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="border-b pb-4 last:border-none"
          >
            <h3 className="font-semibold text-slate-700">
              {update.campaign}
            </h3>

            <p className="text-sm text-zinc-600">
              {update.description}
            </p>

            <span className="text-xs text-zinc-500">
              {update.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}