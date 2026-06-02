import { useEffect, useState } from "react";
import { Button } from "../Button";

export function EditCampaignModal({
  isOpen,
  onClose,
  onSave,
  campaign,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title || "");
      setDescription(campaign.description || "");
      setGoal(campaign.goal || "");
    }
  }, [campaign]);

  if (!isOpen) return null;

  function handleSave() {
    onSave?.({
      ...campaign,
      title,
      description,
      goal: Number(goal),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[500px] bg-white rounded-[10px] p-6 flex flex-col gap-4">

        <h2 className="text-lg font-bold">Editar Campanha</h2>

        <input
          className="p-2 bg-neutral-100 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título"
        />

        <input
          className="p-2 bg-neutral-100 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
        />

        <input
          className="p-2 bg-neutral-100 rounded"
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Meta"
        />

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>

          <Button className="w-full" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}