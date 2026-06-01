import { Plus, Pencil, Trash2 } from "lucide-react";

export function PaymentMethods() {
  const methods = [
    {
      id: 1,
      name: "Transferência Bancária",
      status: "Ativo",
      details: "Ag 0001 / CC ****-7 · criado em 21/04/2026",
      type: "bank",
    },
    {
      id: 2,
      name: "Cartão de Crédito",
      status: "Ativo",
      details: "****4242 · criado em 04/03/2026",
      type: "card",
    },
    {
      id: 3,
      name: "Pix",
      status: "Ativo",
      details: "Ag 0001 / CC ****-7 · criado em 21/04/2026",
      type: "pix",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* BOTÃO */}
      <div className="flex justify-end">
        <button className="w-70 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2">
          <Plus size={18} />
          Novo Método de Pagamento
        </button>
      </div>

      {/* CARD LIST */}
      <div className="bg-white rounded-[10px] shadow border p-5 flex flex-col gap-4">

        <h2 className="text-lg font-extrabold text-slate-700">
          Métodos de Pagamento cadastrados
        </h2>

        {methods.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-3 border rounded-[5px]"
          >

            {/* ICON + NAME */}
            <div className="flex items-center gap-3">

              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs">
                {m.type === "bank" && "B"}
                {m.type === "card" && "C"}
                {m.type === "pix" && "P"}
              </div>

              <div>
                <p className="font-semibold text-stone-900">
                  {m.name}
                </p>

                <p className="text-xs text-black font-light">
                  {m.details}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400 text-sm font-bold">
                {m.status}
              </span>
            </div>

            <div className="w-20 flex justify-center gap-2">
              <button className="text-[#4269B4]">
                <Pencil size={18} />
              </button>

              <button className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}