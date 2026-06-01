const STATUS_STYLES = {
  Efetivada: {
    text: "text-green-400",
    dot: "bg-green-400",
  },
  Pendente: {
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  Cancelada: {
    text: "text-red-500",
    dot: "bg-red-500",
  },
};

// 🔥 MOCK PRA TESTE (PODE REMOVER DEPOIS)
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
  {
    date: "26/05/2026",
    time: "11:20:45",
    member: "00777",
    type: "Crédito",
    value: "R$ 300,00",
    status: "Pendente",
  },
];

export function TransactionsTable({
  transactions = mockTransactions,
  title = "Transações recentes",
}) {
  return (
    <div className="self-stretch bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] outline outline-1 outline-offset-[-1px] outline-zinc-400 font-montserrat">
      {/* TITLE */}
      <div className="px-5 pt-5 text-slate-700 text-lg font-extrabold">
        {title}
      </div>

      {/* HEADER */}
      <div className="mt-4 mx-5 h-10 px-4 py-2.5 bg-slate-100 rounded-[10px] outline outline-2 outline-offset-[-2px] outline-slate-100 flex items-center justify-between">
        <div className="w-60 flex justify-between text-slate-700 text-base">
          <span>DATA</span>
          <span>HORÁRIO</span>
        </div>

        <span className="text-slate-700 text-base font-medium">MEMBER_ID</span>
        <span className="text-slate-700 text-base font-medium">
          TIPO_TRANSAÇÃO
        </span>
        <span className="text-slate-700 text-base font-medium">VALOR</span>
        <span className="text-slate-700 text-base font-medium">STATUS</span>
      </div>

      {/* ROWS */}
      <div className="flex flex-col pb-4">
        {transactions.map((t, index) => {
          const status = STATUS_STYLES[t.status] || STATUS_STYLES.Efetivada;

          return (
            <div
              key={index}
              className="mx-5 h-11 mt-2 bg-white rounded-[5px] outline outline-1 outline-offset-[-1px] outline-slate-700/20 flex items-center justify-between px-4"
            >
              {/* DATA + TIME */}
              <div className="w-60 flex justify-between text-black text-base">
                <span>{t.date}</span>
                <span>{t.time}</span>
              </div>

              {/* MEMBER */}
              <span className="text-black text-base w-24 text-center">
                {t.member}
              </span>

              {/* TYPE */}
              <span className="text-black text-base w-24 text-center">
                {t.type}
              </span>

              {/* VALUE */}
              <span className="text-black text-base w-28 text-center">
                {t.value}
              </span>

              {/* STATUS */}
              <div className="flex items-center gap-1 w-28 justify-center">
                <div className={`w-3 h-3 ${status.dot}`} />

                <span className={`text-base font-bold ${status.text}`}>
                  {t.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
