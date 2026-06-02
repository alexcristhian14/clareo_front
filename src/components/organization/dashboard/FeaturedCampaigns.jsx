const campaigns = [
  {
    name: "Água para Todos",
    goal: 10000,
    raised: 9200,
  },
  {
    name: "Natal Solidário",
    goal: 15000,
    raised: 9800,
  },
  {
    name: "Material Escolar",
    goal: 8000,
    raised: 3600,
  },
];

export function FeaturedCampaigns() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">
      <h2 className="text-lg font-bold mb-6">
        Campanhas em Destaque
      </h2>

      <div className="flex flex-col gap-6">
        {campaigns.map((campaign) => {
          const progress =
            (campaign.raised / campaign.goal) * 100;

          return (
            <div key={campaign.name}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {campaign.name}
                </span>

                <span className="text-blue-600 font-bold">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="text-sm text-zinc-500 mt-2">
                R$ {campaign.raised.toLocaleString()} de R${" "}
                {campaign.goal.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}