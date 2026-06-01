const transactions = [
  {
    user: "João Felipe",
    type: "Doação",
    value: "R$ 250,00",
    date: "01/06/2026",
  },
  {
    user: "Maria Souza",
    type: "Pagamento",
    value: "R$ 120,00",
    date: "31/05/2026",
  },
  {
    user: "Pedro Lima",
    type: "Doação",
    value: "R$ 500,00",
    date: "30/05/2026",
  },
];

export function RecentTransactions() {
  return (
    <div className="bg-white border border-zinc-300 rounded-[10px] p-5 shadow">
      <h2 className="text-lg font-bold mb-4">
        Últimas transações
      </h2>

      <div className="flex flex-col gap-3">
        {transactions.map((t, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{t.user}</p>
              <p className="text-xs text-zinc-500">{t.type}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-blue-600">{t.value}</p>
              <p className="text-xs text-zinc-500">{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}