import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../common/Button";

export function AddPaymentMethodModal({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState("pix");

  const [pixKey, setPixKey] = useState("");

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const [bank, setBank] = useState("");
  const [agency, setAgency] = useState("");
  const [account, setAccount] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    let payload = { type };

    if (type === "pix") {
      payload.pixKey = pixKey;
    }

    if (type === "card") {
      payload.cardName = cardName;
      payload.cardNumber = cardNumber;
    }

    if (type === "transfer") {
      payload.bank = bank;
      payload.agency = agency;
      payload.account = account;
    }

    onSubmit?.(payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[450px] rounded-[10px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold">Adicionar método de pagamento</h2>

        <p className="text-sm text-zinc-500 mt-1">
          Escolha e preencha o método desejado
        </p>

        {/* TYPE */}
        <div className="mt-5 flex flex-col gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === "pix"}
              onChange={() => setType("pix")}
            />
            PIX
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === "card"}
              onChange={() => setType("card")}
            />
            Cartão
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={type === "transfer"}
              onChange={() => setType("transfer")}
            />
            Transferência
          </label>
        </div>

        {/* PIX */}
        {type === "pix" && (
          <div className="mt-4">
            <label className="text-sm font-semibold">Chave PIX</label>

            <input
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              className="w-full mt-2 p-2 border rounded bg-neutral-100"
              placeholder="email ou chave aleatória"
            />
          </div>
        )}

        {/* CARD */}
        {type === "card" && (
          <div className="mt-4 flex flex-col gap-3">
            <input
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="p-2 border rounded bg-neutral-100"
              placeholder="Nome no cartão"
            />

            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="p-2 border rounded bg-neutral-100"
              placeholder="Número do cartão"
            />
          </div>
        )}

        {/* TRANSFER */}
        {type === "transfer" && (
          <div className="mt-4 flex flex-col gap-3">
            <input
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="p-2 border rounded bg-neutral-100"
              placeholder="Banco"
            />

            <input
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="p-2 border rounded bg-neutral-100"
              placeholder="Agência"
            />

            <input
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="p-2 border rounded bg-neutral-100"
              placeholder="Conta"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit}>Salvar</Button>
        </div>
      </div>
    </div>
  );
}
