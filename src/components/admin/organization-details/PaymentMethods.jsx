import { useState } from "react";
import { Plus } from "lucide-react";
import { CreatePaymentMethodModal } from "./modals/CreatePaymentMethodModal";
import { useParams } from "react-router-dom";
import { useOrganizations } from "../../../contexts/OrganizationContext";

export function PaymentMethods({ onAddPayment }) {
  const [showModal, setShowModal] = useState(false);

  const { id: orgId } = useParams();

  const { getPaymentMethodsByOrganization } = useOrganizations();

  const methods = getPaymentMethodsByOrganization(orgId);

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

      {/* LISTA */}
      <div className="bg-white border border-zinc-300 rounded-[10px] p-4">
        {methods.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nenhum método cadastrado
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {methods.map((method) => (
              <div
                key={method.id}
                className="border rounded-lg p-3"
              >
                <p className="font-semibold">
                  {method.type}
                </p>

                <p className="text-sm text-zinc-600">
                  {method.key}
                </p>
              </div>
            ))}
          </div>
        )}
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