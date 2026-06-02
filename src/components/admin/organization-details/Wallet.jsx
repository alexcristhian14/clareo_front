import { Plus } from "lucide-react";
import { TransactionsTable } from "./TransactionsTable";
import { CreateTransactionModal } from "./modals/CreateTransactionModal";

export function Wallet( { onNewTransaction } ) {
  const walletData = {
    total: "R$ 45.823,00",
    available: "R$ 38.123,00",
    blocked: "R$ 7.152,00",
  };

  const transactions = [
    {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Efetivada",
    },
    {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Pendente",
    },
    {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Cancelada",
    },
        {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Cancelada",
    },
        {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Cancelada",
    },
        {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Cancelada",
    },
        {
      date: "28/05/2026",
      time: "07:15:35",
      member: "00525",
      type: "Crédito",
      value: "R$ 500,00",
      status: "Cancelada",
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="h-20 px-3.5 py-3 bg-white rounded-[10px] shadow border flex flex-col">
          <span className="text-slate-700 font-extrabold">Saldo total</span>
          <span className="text-[#4269B4] font-black text-xl">
            {walletData.total}
          </span>
        </div>

        <div className="h-20 px-3.5 py-3 bg-white rounded-[10px] shadow border flex flex-col">
          <span className="text-slate-700 font-extrabold">
            Saldo disponível
          </span>
          <span className="text-green-400 font-black text-xl">
            {walletData.available}
          </span>
        </div>

        <div className="h-20 px-3.5 py-3 bg-white rounded-[10px] shadow border flex flex-col">
          <span className="text-slate-700 font-extrabold">Saldo bloqueado</span>
          <span className="text-red-500 font-black text-xl">
            {walletData.blocked}
          </span>
        </div>
      </div>

      {/* BOTÃO */}
      <div className="flex justify-end">
        <button
         onClick={onNewTransaction}
         className="w-56 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2">
          <Plus size={18} />
          Nova Transação
        </button>
      </div>

      {/* TABELA */}
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
