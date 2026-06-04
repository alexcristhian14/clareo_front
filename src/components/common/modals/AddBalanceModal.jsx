import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../common/Button";

export function AddBalanceModal({ isOpen, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("pix");

  if (!isOpen) return null;

  function handleSubmit() {
    if (!amount) return;

    onSubmit?.({
      amount: Number(amount),
      method,
    });

    setAmount("");
    setMethod("pix");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-[10px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold text-slate-800">Adicionar saldo</h2>

        <p className="text-sm text-zinc-500 mt-1">
          Informe o valor e método de recarga
        </p>

        {/* VALOR */}
        <div className="mt-5">
          <label className="text-sm font-semibold">Valor</label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 p-2 border rounded bg-neutral-100"
            placeholder="Ex: 100"
          />
        </div>

        {/* MÉTODO */}
        <div className="mt-4">
          <label className="text-sm font-semibold">Método</label>

          <div className="flex flex-col gap-2 mt-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "pix"}
                onChange={() => setMethod("pix")}
              />
              PIX
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              Cartão de crédito
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={method === "transfer"}
                onChange={() => setMethod("transfer")}
              />
              Transferência
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit}>Adicionar saldo</Button>
        </div>
      </div>
    </div>
  );
}
