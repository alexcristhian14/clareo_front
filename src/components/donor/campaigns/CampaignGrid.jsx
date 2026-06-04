import { CampaignCard } from "../feed/CampaignCard";

export function CampaignGrid({
  campaigns,
}) {
  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-[10px] border border-zinc-300 p-10 text-center">
        <p className="text-zinc-500">
          Nenhuma campanha encontrada.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        lg:grid-cols-2
        xl:grid-cols-3
        gap-5
      "
    >
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
        />
      ))}
    </div>
  );
}