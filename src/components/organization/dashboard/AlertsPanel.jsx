import {
  Bell,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const alerts = [
  {
    icon: CheckCircle,
    text: "Campanha Água para Todos atingiu 90% da meta.",
  },
  {
    icon: Bell,
    text: "Nova doação recebida de R$ 500.",
  },
  {
    icon: AlertCircle,
    text: "Campanha Natal Solidário encerra em 3 dias.",
  },
];

export function AlertsPanel() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">
      <h2 className="font-bold text-lg mb-6">
        Alertas
      </h2>

      <div className="flex flex-col gap-4">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;

          return (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-lg bg-slate-50"
            >
              <Icon
                size={18}
                className="text-blue-600 mt-0.5"
              />

              <span className="text-sm">
                {alert.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}