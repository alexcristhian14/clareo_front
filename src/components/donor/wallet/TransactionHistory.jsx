import { TransactionItem } from "./TransactionItem";

export function TransactionHistory({ transactions }) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Histórico</h2>

        <p className="text-sm text-zinc-500">
          Últimas movimentações da carteira
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} {...transaction} />
        ))}
      </div>
    </div>
  );
}
