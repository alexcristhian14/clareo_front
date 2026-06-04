import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export function CampaignCard({ campaign }) {
  const navigate = useNavigate();

  const progress = (campaign.raised / campaign.goal) * 100;

  function handleDonate() {
    navigate(`/donor/campaigns/${campaign.id}`, {
      state: { openDonate: true },
    });
  }

  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-5 hover:shadow-md transition">
      <h3 className="font-bold text-slate-800">{campaign.title}</h3>

      <p className="text-sm text-zinc-500 mt-1">{campaign.organization}</p>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-2">
          <span>R$ {campaign.raised.toLocaleString("pt-BR")}</span>

          <span>R$ {campaign.goal.toLocaleString("pt-BR")}</span>
        </div>

        <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={() => navigate(`/donor/campaigns/${campaign.id}`)}
          className="
            flex-1
            border
            border-slate-300
            rounded-lg
            py-2
            text-center
            text-sm
            font-semibold
            hover:bg-slate-50
          "
        >
          Ver campanha
        </button>

        <button
          onClick={handleDonate}
          className="
            flex-1
            flex
            items-center
            justify-center
            gap-2
            bg-slate-700
            text-white
            rounded-lg
            py-2
            text-sm
            font-semibold
            hover:bg-slate-800
          "
        >
          <Heart size={16} />
          Apoiar
        </button>
      </div>
    </div>
  );
}
