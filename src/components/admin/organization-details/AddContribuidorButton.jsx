import { UserPlus } from "lucide-react";

export function AddContributorButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-blue-600 text-white
        px-4 py-2 rounded-[5px]
        flex items-center gap-2
        font-bold text-sm
        shadow-[8px_1px_14px_rgba(0,0,0,0.16)]
      "
    >
      <UserPlus size={18} />
      Adicionar Contribuidor
    </button>
  );
}