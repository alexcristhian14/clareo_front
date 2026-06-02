import { useState } from "react";
import { Plus } from "lucide-react";
import { CreatePaymentMethodModal } from "./modals/CreatePaymentMethodModal";

export function PaymentMethods({ onAddPayment }) {
  const [showModal, setShowModal] = useState(false);

  function handleCreate(data) {
    console.log("novo método de pagamento:", data);
    // futuramente: chamar service/API
  }

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-zinc-400 text-sm font-extrabold tracking-wide">
            MÉTODOS DE PAGAMENTO
          </h2>

          <p className="text-stone-900 text-xs font-light mt-1">
            Gerencie os métodos de pagamento da organização
          </p>
        </div>

        {/* BOTÃO */}
        <button
          onClick={onAddPayment}
          className="w-56 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          Novo Método
        </button>
      </div>

      {/* LISTA (mock por enquanto) */}
      <div className="bg-white border border-zinc-300 rounded-[10px] p-4">
        <p className="text-sm text-zinc-500">
          Nenhum método cadastrado (mock)
        </p>
      </div>

      {/* MODAL */}
      <CreatePaymentMethodModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}