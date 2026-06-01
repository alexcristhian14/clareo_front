import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

export function ActionButtons() {

  function handleEdit() {
    toast.success("Abrindo edição da organização");
  }

  function handleDelete() {
    toast.error("Organização excluída");
  }

  return (
    <div className="flex gap-3">

      <button
        onClick={handleEdit}
        className="px-4 py-2 border border-[#4269B4] text-[#4269B4] rounded-md font-bold flex items-center gap-2"
      >
        <Pencil size={16} />
        Editar Organização
      </button>

      <button
        onClick={handleDelete}
        className="px-4 py-2 border border-red-500 text-red-500 rounded-md font-bold flex items-center gap-2"
      >
        <Trash2 size={16} />
        Excluir Organização
      </button>

    </div>
  );
}