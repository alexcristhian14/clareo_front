import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export function TransactionItem({ type, title, value, date }) {
  const isRecharge = type === "recharge";

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center gap-3">
        {isRecharge ? (
          <ArrowDownCircle size={22} className="text-green-600" />
        ) : (
          <ArrowUpCircle size={22} className="text-red-500" />
        )}

        <div>
          <p className="font-semibold">{title}</p>

          <p className="text-xs text-zinc-500">{date}</p>
        </div>
      </div>

      <span
        className={`font-bold ${
          isRecharge ? "text-green-600" : "text-red-500"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
