import { X } from "lucide-react";

export function EditOrganizationModal({
  isOpen,
  onClose,
  onSave,
  value,
  setValue,
  isActive,
  setIsActive,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[500px] bg-white rounded-[10px] shadow-lg p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black">
            EDITAR ORGANIZAÇÃO
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Edite informações da organização cadastrada
          </p>
        </div>

        {/* NOME */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-xs font-bold text-blue-600">Nome</label>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full h-10 px-3 rounded-[10px] bg-neutral-100 border border-blue-600 outline-none text-sm"
          />
        </div>

        {/* ATIVO */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-blue-600">
            Organização ativa?
          </span>

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 accent-blue-600"
          />
        </div>

        {/* AÇÕES */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[6px] border border-zinc-300 text-sm font-semibold hover:bg-zinc-100"
          >
            Cancelar
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2 rounded-[6px] bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}