import { ChevronRight, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateCampaignModal } from "./modals/CreateCampaignModal";

export function Campaigns({ onAddCampaign }) {
  const navigate = useNavigate();
  const { id: orgId } = useParams();

  const campaigns = [
    {
      id: 1,
      title: "Atendimento Médico Itinerante",
      description:
        "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
      status: "Ativa",
      daysLeft: 18,
      raised: 32000,
      goal: 50000,
    },
    {
      id: 2,
      title: "Campanha de Vacinação",
      description: "Ação de vacinação em regiões vulneráveis.",
      status: "Ativa",
      daysLeft: 10,
      raised: 18000,
      goal: 30000,
    },
    {
      id: 3,
      title: "Saúde Infantil",
      description: "Atendimento pediátrico gratuito para crianças.",
      status: "Encerrada",
      daysLeft: 0,
      raised: 50000,
      goal: 50000,
    },
    {
      id: 4,
      title: "Doação de Medicamentos",
      description: "Distribuição de medicamentos essenciais.",
      status: "Ativa",
      daysLeft: 5,
      raised: 12000,
      goal: 20000,
    },
  ];

  const handleDetails = (campaignId) => {
    navigate(`/organizations/${orgId}/campaigns/${campaignId}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* BOTÃO */}
      <div className="flex justify-end">
        <button 
        onClick={onAddCampaign}
        className="w-56 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2">
          <Plus size={18} />
          Adicionar Campanha
        </button>
      </div>

      <h2 className="text-lg font-extrabold text-slate-700">
        Campanhas vinculadas
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {campaigns.map((c) => {
          const progress = Math.min((c.raised / c.goal) * 100, 100);
          const isActive = c.status === "Ativa";

          return (
            <div
              key={c.id}
              className="bg-white rounded-[10px] shadow p-4 border"
            >
              <div className="flex justify-between items-center bg-slate-100 p-2 rounded-[10px]">
                <span className="text-indigo-700 font-semibold">
                  {c.title}
                </span>

                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {c.status}
                </span>

                <span className="text-xs text-red-500 bg-white px-2 py-1 rounded-full">
                  {c.daysLeft > 0
                    ? `${c.daysLeft}d restantes`
                    : "Finalizada"}
                </span>
              </div>

              <p className="text-sm text-stone-900 mt-3">
                {c.description}
              </p>

              <div className="flex justify-between mt-4 text-sm font-bold text-slate-700">
                <span>R$ {c.raised.toLocaleString("pt-BR")}</span>
                <span>de R$ {c.goal.toLocaleString("pt-BR")}</span>
              </div>

              <div className="w-full h-2 bg-stone-200 rounded-full mt-2">
                <div
                  className="h-2 bg-green-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => handleDetails(c.id)}
                  className="flex items-center gap-1 text-blue-600 font-semibold"
                >
                  Ver detalhes
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}