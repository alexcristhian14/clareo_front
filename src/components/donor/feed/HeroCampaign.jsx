import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export function HeroCampaign({ campaign }) {
  const navigate = useNavigate();

  const progress =
    (campaign.raised / campaign.goal) * 100;

  function handleDonate() {
    navigate(`/donor/campaigns/${campaign.id}`, {
      state: { openDonate: true },
    });
  }

  return (
    <div className="bg-slate-700 rounded-[10px] p-8 text-white">

      <p className="text-sm opacity-80">
        Campanha em destaque
      </p>

      <h1 className="text-3xl font-bold mt-2">
        {campaign.title}
      </h1>

      <p className="mt-3 max-w-3xl opacity-90">
        {campaign.description}
      </p>

      <div className="mt-4 text-sm opacity-80">
        por {campaign.organization}
      </div>

      {/* PROGRESSO */}
      <div className="mt-6">

        <div className="flex justify-between text-sm mb-2">
          <span>
            R$ {campaign.raised.toLocaleString("pt-BR")}
          </span>

          <span>
            R$ {campaign.goal.toLocaleString("pt-BR")}
          </span>
        </div>

        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-2 text-sm font-semibold">
          {progress.toFixed(0)}% da meta alcançada
        </div>

      </div>

      {/* AÇÕES */}
      <div className="flex gap-3 mt-8">

        <button
          onClick={() =>
            navigate(`/donor/campaigns/${campaign.id}`)
          }
          className="
            px-6 py-3
            rounded-lg
            border border-white/30
            font-semibold
            hover:bg-white/10
            transition
          "
        >
          Ver campanha
        </button>

        <button
          onClick={handleDonate}
          className="
            px-6 py-3
            rounded-lg
            bg-white
            text-slate-700
            font-bold
            flex
            items-center
            gap-2
            hover:bg-slate-100
            transition
          "
        >
          <Heart size={18} />
          Doar agora
        </button>

      </div>

    </div>
  );
}