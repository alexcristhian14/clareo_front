import {
  Wallet,
  TrendingUp,
  Megaphone,
  Users,
} from "lucide-react";


export function DashboardStats({ stats }) {
  const items = [
    {
      title: "Saldo Disponível",
      value: `R$ ${stats.balance}`,
      icon: Wallet,
    },
    {
      title: "Arrecadado no Mês",
      value: `R$ ${stats.monthlyRaised}`,
      icon: TrendingUp,
    },
    {
      title: "Campanhas Ativas",
      value: stats.activeCampaigns,
      icon: Megaphone,
    },
    {
      title: "Doadores Ativos",
      value: stats.donors,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.title} className="bg-white p-6 border rounded-[10px]">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-zinc-500">{stat.title}</p>
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