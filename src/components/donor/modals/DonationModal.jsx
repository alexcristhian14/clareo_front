import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../common/Button";
import { toast } from "sonner";

export function DonationModal({ isOpen, onClose, campaign, onConfirm }) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("pix");

  if (!isOpen) return null;

  function handleNext() {
    setStep((prev) => prev + 1);
  }

  function handleBack() {
    setStep((prev) => prev - 1);
  }

  function handleFinish() {
    onConfirm({ amount: Number(amount), method });

    toast.success("Doação realizada com sucesso! 🎉");

    setTimeout(() => {
      setStep(1);
      setAmount("");
      setMethod("pix");
      onClose();
    }, 300);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-[12px] p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500"
        >
          <X size={18} />
        </button>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold">Escolha o valor</h2>

            <div className="flex gap-2 mt-4">
              {["25", "50", "100"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={`px-4 py-2 rounded ${
                    amount === v
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <input
              className="w-full mt-3 p-2 bg-neutral-100 rounded"
              placeholder="Outro valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="flex justify-end mt-6">
              <Button disabled={!amount} onClick={handleNext}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold">Método de pagamento</h2>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => setMethod("pix")}
                className={`p-3 rounded border ${
                  method === "pix" ? "border-blue-600" : ""
                }`}
              >
                PIX
              </button>

              <button
                onClick={() => setMethod("card")}
                className={`p-3 rounded border ${
                  method === "card" ? "border-blue-600" : ""
                }`}
              >
                Cartão de crédito
              </button>

              <button
                onClick={() => setMethod("balance")}
                className={`p-3 rounded border ${
                  method === "balance" ? "border-blue-600" : ""
                }`}
              >
                Saldo da carteira
              </button>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>

              <Button onClick={handleNext}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold">Confirmar doação</h2>

            <div className="mt-4 text-sm text-zinc-600">
              <p>Campanha: {campaign.title}</p>
              <p>Valor: R$ {amount}</p>
              <p>Método: {method}</p>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Voltar
              </Button>

              <Button onClick={handleFinish}>
                Confirmar
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}