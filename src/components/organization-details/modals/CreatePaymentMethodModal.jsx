import { useState } from "react";
import { Button } from "../../Button";

export function CreatePaymentMethodModal({ isOpen, onClose, onCreate }) {
  const [methodType, setMethodType] = useState("");
  const [keyType, setKeyType] = useState("");
  const [key, setKey] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    onCreate?.({
      methodType,
      keyType,
      key,
    });

    setMethodType("");
    setKeyType("");
    setKey("");
    onClose();
  }

  const inputClass =
    "w-full p-2 bg-neutral-100 rounded-[10px] outline outline-1 outline-blue-600 text-sm";

  const labelClass = "text-blue-600 text-xs font-bold";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[515px] bg-white rounded-[8px] p-6 flex flex-col gap-5 shadow-lg">
        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-semibold text-black">
            NOVO MÉTODO DE PAGAMENTO
          </h2>
          <p className="text-sm text-zinc-500">
            Cadastre o novo método de pagamento
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-3">
          {/* TIPO MÉTODO */}
          <div>
            <p className={labelClass}>Tipo Método</p>
            <select
              value={methodType}
              onChange={(e) => setMethodType(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência</option>
              <option value="cartao">Cartão</option>
            </select>
          </div>

          {/* TIPO CHAVE */}
          <div>
            <p className={labelClass}>Tipo Chave</p>
            <select
              value={keyType}
              onChange={(e) => setKeyType(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione</option>
              <option value="cpf">CPF</option>
              <option value="email">E-mail</option>
              <option value="telefone">Telefone</option>
              <option value="aleatoria">Chave Aleatória</option>
            </select>
          </div>

          {/* CHAVE */}
          <div>
            <p className={labelClass}>Chave</p>
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className={inputClass}
              placeholder="Digite aqui..."
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancelar
          </Button>

          <Button onClick={handleSubmit} variant="primary" className="w-full">
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  );
}
