import { useState } from "react";
import { Button } from "../../../common/Button";

export function CreateCampaignModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  function handleSubmit() {
    onCreate?.({
      name,
      description,
      goal: Number(goal),
      startDate,
      endDate,
    });

    setName("");
    setDescription("");
    setGoal("");
    setStartDate("");
    setEndDate("");
    onClose();
  }

  const inputClass =
    "w-full p-2 bg-neutral-100 rounded-[10px] outline outline-1 outline-blue-600 text-sm";

  const labelClass =
    "text-blue-600 text-xs font-bold";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[515px] bg-white rounded-[8px] p-6 flex flex-col gap-5 shadow-lg">

        {/* HEADER */}
        <div>
          <h2 className="text-2xl font-semibold text-black">
            NOVA CAMPANHA
          </h2>
          <p className="text-sm text-zinc-500">
            Cadastre sua nova campanha
          </p>
        </div>

        {/* FORM */}
        <div className="flex flex-col gap-3">

          <div>
            <p className={labelClass}>Nome</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Digite aqui..."
            />
          </div>

          <div>
            <p className={labelClass}>Descrição</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="Digite aqui..."
            />
          </div>

          <div>
            <p className={labelClass}>Meta</p>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className={inputClass}
              placeholder="Digite aqui..."
              type="number"
            />
          </div>

          <div>
            <p className={labelClass}>Data Início</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <p className={labelClass}>Data Fim</p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </div>

        </div>

        {/* ACTIONS CENTRALIZADOS */}
        <div className="flex justify-center gap-4 mt-4">

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
            Cadastrar
          </Button>

        </div>

      </div>
    </div>
  );
}