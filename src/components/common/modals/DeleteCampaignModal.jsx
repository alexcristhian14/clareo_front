import { Button } from "../Button";

export function DeleteCampaignModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Excluir campanha?",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[420px] bg-white rounded-[10px] p-6 flex flex-col gap-4">

        <h2 className="text-lg font-bold text-red-600">
          {title}
        </h2>

        <p className="text-sm text-zinc-600">
          Essa ação não pode ser desfeita.
        </p>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            className="w-full bg-red-600 text-white"
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}