import { CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS = {
  Efetivada: {
    icon: CheckCircle2,
    color: "text-green-400",
  },
  Pendente: {
    icon: Clock,
    color: "text-yellow-400",
  },
  Cancelada: {
    icon: XCircle,
    color: "text-red-500",
  },
};

export function StatusBadge({ status }) {
  const config = STATUS[status] || STATUS.Efetivada;

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      <Icon size={16} />
      <span className="text-base font-bold">{status}</span>
    </div>
  );
}