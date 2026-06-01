import { StatusBadge } from "./StatusBadge";

// 🔥 MOCK PRA TESTE (remove depois quando integrar API)
const mockTransactions = [
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
    time: "09:42:10",
    member: "00412",
    type: "Crédito",
    value: "R$ 120,00",
    status: "Pendente",
  },
  {
    date: "27/05/2026",
    time: "18:05:22",
    member: "00981",
    type: "Débito",
    value: "R$ 75,50",
    status: "Cancelada",
  },
  {
    date: "27/05/2026",
    time: "14:33:01",
    member: "00219",
    type: "Crédito",
    value: "R$ 1.250,00",
    status: "Efetivada",
  },
];

export function TransactionsTable({
  transactions = mockTransactions,
  title = "Transações recentes",
}) {
  return (
    <div className="
      self-stretch bg-white rounded-[10px]
      shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]
      outline outline-1 outline-offset-[-1px] outline-zinc-400
      font-montserrat
    ">
      {/* TITLE */}
      <div className="px-5 pt-5 text-slate-700 text-lg font-extrabold">
        {title}
      </div>

      {/* HEADER */}
      <div className="
        mt-4 mx-5 h-10 px-4 py-2.5
        bg-slate-100 rounded-[10px]
        flex items-center justify-between
        text-slate-700 text-base font-medium
      ">
        <div className="w-60 flex justify-between">
          <span>DATA</span>
          <span>HORÁRIO</span>
        </div>

        <span>MEMBER_ID</span>
        <span>TIPO</span>
        <span>VALOR</span>
        <span>STATUS</span>
      </div>

      {/* ROWS */}
      <div className="flex flex-col pb-4">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="
              mx-5 mt-2 h-11
              bg-white rounded-[5px]
              outline outline-1 outline-slate-700/20
              flex items-center justify-between px-4
            "
          >
            {/* DATA + HORA */}
            <div className="w-60 flex justify-between text-black text-base">
              <span>{t.date}</span>
              <span>{t.time}</span>
            </div>

            {/* MEMBER */}
            <span className="w-24 text-center text-black text-base">
              {t.member}
            </span>

            {/* TYPE */}
            <span className="w-24 text-center text-black text-base">
              {t.type}
            </span>

            {/* VALUE */}
            <span className="w-28 text-center text-black text-base">
              {t.value}
            </span>

            {/* STATUS */}
            <div className="w-28 flex justify-center">
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}