import { useOrganizations } from "../../../contexts/OrganizationContext";
import { DollarSign, ArrowLeftRight, Users, Target } from "lucide-react";

export function DashboardStats() {
  const { getDashboardStats } = useOrganizations();

  const stats = getDashboardStats();

  const kpis = [
    {
      title: "Receita Total",
      value: stats.totalRevenue,
      icon: DollarSign,
    },
    {
      title: "Transações",
      value: stats.totalTransactions,
      icon: ArrowLeftRight,
    },
    {
      title: "Contribuidores",
      value: stats.totalContributors,
      icon: Users,
    },
    {
      title: "Campanhas Ativas",
      value: stats.activeCampaigns,
      icon: Target,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="bg-white border rounded-[10px] p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-zinc-500">{kpi.title}</p>
              <h2 className="text-2xl font-bold">{kpi.value}</h2>
            </div>

            <kpi.icon className="text-blue-600" />
          </div>
        </div>
      ))}
    </div>
  );
}