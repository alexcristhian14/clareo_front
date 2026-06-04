import { CampaignCard } from "./CampaignCard";

export function CampaignSection({
  title,
  campaigns,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
          />
        ))}
      </div>
    </div>
  );
}