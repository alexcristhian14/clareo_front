import {
  Bell,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export function AlertsPanel({ alerts }) {
  return (
    <div className="bg-white p-6 border rounded-[10px]">
      <h2 className="font-bold text-lg mb-6">Alertas</h2>

      <div className="flex flex-col gap-4">
        {alerts.map((alert, i) => (
          <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
            <span className="text-sm">{alert.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}