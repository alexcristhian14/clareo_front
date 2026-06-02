import { useState } from "react";
import { X } from "lucide-react";

export function CreateOrganizationModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [nome, setNome] = useState("");
  const [ativa, setAtiva] = useState(true);

  if (!isOpen) return null;

  function handleSubmit() {
    if (!nome.trim()) return;

    onCreate(nome, ativa);

    setNome("");
    setAtiva(true);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-125 bg-white rounded-[10px] p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-800"
        >
          <X size={18} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold">
            NOVA ORGANIZAÇÃO
          </h2>

          <p className="text-sm text-zinc-500">
            Cadastre a nova organização
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-blue-600 mb-2">
              Nome
            </label>

            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite aqui..."
              className="w-full h-10 px-3 bg-neutral-100 rounded-[10px] border border-blue-600 outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-blue-600">
              Organização ativa?
            </label>

            <input
              type="checkbox"
              checked={ativa}
              onChange={(e) => setAtiva(e.target.checked)}
              className="w-4 h-4 accent-blue-600"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 border border-zinc-400 rounded-[5px] text-sm font-semibold"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 h-10 bg-blue-600 text-white rounded-[5px] text-sm font-bold"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}