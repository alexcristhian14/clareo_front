const alerts = [
  {
    type: "warning",
    title: "Campanha próxima do fim",
    message: "Campanha 'Ajuda Nordeste' termina em 2 dias",
  },
  {
    type: "success",
    title: "Meta quase atingida",
    message: "Instituto Saúde Viva atingiu 92% da meta mensal",
  },
  {
    type: "danger",
    title: "Transação falhou",
    message: "Pagamento de R$ 120,00 não foi processado",
  },
];

export function AlertsPanel() {
  return (
    <div className="bg-white border border-zinc-300 rounded-[10px] p-5 shadow">
      <h2 className="text-lg font-bold mb-4">Alertas do sistema</h2>

      <div className="flex flex-col gap-3">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex flex-col gap-1 border-b pb-3"
          >
            <p
              className={`text-sm font-bold ${
                alert.type === "danger"
                  ? "text-red-500"
                  : alert.type === "warning"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {alert.title}
            </p>

            <p className="text-xs text-zinc-600">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}