import { DollarSign, ArrowLeftRight, Users, Target } from "lucide-react";

const kpis = [
  {
    title: "Receita Total",
    value: "R$ 128.450",
    growth: "+12% este mês",
    icon: DollarSign,
  },
  {
    title: "Transações",
    value: "1.245",
    growth: "+87 hoje",
    icon: ArrowLeftRight,
  },
  {
    title: "Contribuidores",
    value: "342",
    growth: "+5 novos",
    icon: Users,
  },
  {
    title: "Campanhas Ativas",
    value: "18",
    growth: "3 finalizando",
    icon: Target,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="bg-white border border-zinc-300 rounded-[10px] p-5 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.12)]"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-zinc-500">{kpi.title}</p>
              <h2 className="text-2xl font-bold text-black mt-1">
                {kpi.value}
              </h2>
              <span className="text-xs text-green-600 font-medium">
                {kpi.growth}
              </span>
            </div>

            <kpi.icon size={22} className="text-blue-600" />
          </div>
        </div>
      ))}
    </div>
  );
}