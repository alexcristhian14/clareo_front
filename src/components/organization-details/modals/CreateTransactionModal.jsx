import { useState } from "react";
import { Button } from "../../Button";

export function CreateTransactionModal({ isOpen, onClose, onCreate }) {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    onCreate?.({
      type,
      value,
      date,
      time,
    });

    setType("");
    setValue("");
    setDate("");
    setTime("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="w-[497px] bg-white rounded-[10px] p-6 shadow-xl flex flex-col gap-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">NOVA TRANSAÇÃO</h2>
          <p className="text-sm text-zinc-500">
            Preencha os dados para efetivar a transação
          </p>
        </div>

        {/* TYPE */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-blue-600">
            Tipo de Transação
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-10 px-3 bg-neutral-100 rounded border border-blue-600 text-sm"
          >
            <option value="">Selecione</option>
            <option value="income">Entrada</option>
            <option value="expense">Saída</option>
          </select>
        </div>

        {/* VALUE */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-blue-600">
            Valor (BRL)
          </label>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="R$ 0,00"
            className="h-10 px-3 bg-neutral-100 rounded border border-blue-600 text-sm"
          />
        </div>

        {/* DATE + TIME */}
        <div className="flex gap-3">

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-blue-600">Data</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 px-3 bg-neutral-100 rounded border border-blue-600 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-blue-600">Horário</label>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-10 px-3 bg-neutral-100 rounded border border-blue-600 text-sm"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between gap-3">

          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
          >
            Realizar Transação
          </Button>

        </div>
      </div>
    </div>
  );
}