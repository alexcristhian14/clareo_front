import {
  Megaphone,
  Target,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useOrganizations } from "../../../contexts/OrganizationContext";

export function CampaignsStats() {
  const { campaigns } = useOrganizations();

  const totalGoal = campaigns.reduce((a, c) => a + c.goal, 0);
  const totalRaised = campaigns.reduce((a, c) => a + c.raised, 0);
  const active = campaigns.filter((c) => c.status === "Ativa");

  const stats = [
    {
      title: "Campanhas Ativas",
      value: active.length,
      icon: Megaphone,
    },
    {
      title: "Meta Total",
      value: `R$ ${totalGoal.toLocaleString("pt-BR")}`,
      icon: Target,
    },
    {
      title: "Arrecadado",
      value: `R$ ${totalRaised.toLocaleString("pt-BR")}`,
      icon: Wallet,
    },
    {
      title: "Taxa de Sucesso",
      value:
        totalGoal > 0
          ? `${((totalRaised / totalGoal) * 100).toFixed(0)}%`
          : "0%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold mt-2">
                  {stat.value}
                </h3>
              </div>

              <Icon size={28} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}