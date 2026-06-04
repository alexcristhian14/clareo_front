import { CreditCard, Landmark, Plus } from "lucide-react";
import { Button } from "../../common/Button";

export function PaymentMethodsCard({ methods, onAddMethod }) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Métodos de pagamento
          </h2>

          <p className="text-sm text-zinc-500">
            Gerencie suas formas de recarga
          </p>
        </div>

        <Button icon={Plus} onClick={onAddMethod}>
          Adicionar método
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {methods.map((method, index) => (
          <div
            key={index}
            className="border rounded-[10px] p-4 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {method.type === "PIX" ? (
                <Landmark size={18} />
              ) : (
                <CreditCard size={18} />
              )}

              <div>
                <p className="font-semibold">{method.type}</p>

                <p className="text-sm text-zinc-500">{method.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
