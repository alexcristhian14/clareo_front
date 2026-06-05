import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../common/Button";
import { toast } from "sonner";

import { useWallet } from "../../../contexts/WalletContext";
import { useCampaigns } from "../../../contexts/CampaignContext";

export function DonationModal({ isOpen, onClose, campaign }) {
  const { donate } = useWallet();
  const { updateCampaignAfterDonation } = useCampaigns();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("pix");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function next() {
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => s - 1);
  }

  async function handleConfirm() {
    try {
      setLoading(true);

      const value = Number(amount);

      if (!value || value <= 0) {
        toast.error("Valor inválido");
        return;
      }

      await donate(campaign.id, value, method);

      // 🔥 ATUALIZA CAMPANHA
      updateCampaignAfterDonation(campaign.id, value);

      toast.success("Doação realizada com sucesso 🎉");

      onClose();
    } catch (err) {
      console.error("❌ ERRO REAL:", err);
      toast.error(err.message || "Erro ao realizar doação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-xl p-6 relative">
        <button onClick={onClose} className="absolute right-3 top-3">
          <X size={18} />
        </button>

        {step === 1 && (
          <div>
            <h2 className="font-bold text-lg">Escolha o valor</h2>

            <div className="flex gap-2 mt-4">
              {["25", "50", "100"].map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={`px-3 py-2 rounded ${
                    amount === v ? "bg-blue-600 text-white" : "bg-slate-100"
                  }`}
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <input
              className="w-full mt-3 p-2 bg-slate-100 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Outro valor"
            />

            <div className="flex justify-end mt-6">
              <Button disabled={!amount} onClick={next}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-bold text-lg">Método</h2>

            <div className="flex flex-col gap-2 mt-4">
              {["pix", "card", "balance"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`p-3 border rounded ${
                    method === m ? "border-blue-600" : ""
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={back}>
                Voltar
              </Button>

              <Button onClick={next}>Continuar</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-bold text-lg">Confirmar</h2>

            <div className="mt-4 text-sm text-zinc-600">
              <p>Campanha: {campaign.title}</p>
              <p>Valor: R$ {amount}</p>
              <p>Método: {method}</p>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={back}>
                Voltar
              </Button>

              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "Processando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}