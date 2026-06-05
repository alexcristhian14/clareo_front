export function FeaturedCampaigns({ campaigns }) {
  return (
    <div className="bg-white p-6 border rounded-[10px]">
      <h2 className="text-lg font-bold mb-6">
        Campanhas em Destaque
      </h2>

      <div className="flex flex-col gap-6">
        {campaigns.map((campaign) => {
          const progress =
            (campaign.raised / campaign.goal) * 100;

          return (
            <div key={campaign.id}>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  {campaign.name}
                </span>

                <span className="text-blue-600 font-bold">
                  {progress.toFixed(0)}%
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}