import { useState } from "react";

export function CreateContributorModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState(true);

  if (!isOpen) return null;

  function handleSubmit() {
    if (!name || !email || !role) return;

    onCreate({
      name,
      email,
      role,
      active,
    });

    // limpa formulário
    setName("");
    setEmail("");
    setRole("");
    setActive(true);

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[497px] bg-white rounded-[5px] p-8">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            NOVO CONTRIBUIDOR
          </h2>
          <p className="text-sm">
            Cadastre o novo contribuidor
          </p>
        </div>

        {/* ORGANIZAÇÃO (mock por enquanto) */}
        <div className="mb-4">
          <label className="text-xs font-bold text-blue-600">
            Organização
          </label>
          <select className="w-full h-10 bg-neutral-100 rounded border border-blue-600 px-2">
            <option>Selecione</option>
          </select>
        </div>

        {/* NOME */}
        <div className="mb-4">
          <label className="text-xs font-bold text-blue-600">Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-10 bg-neutral-100 rounded border border-blue-600 px-2"
            placeholder="Digite aqui..."
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-xs font-bold text-blue-600">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-10 bg-neutral-100 rounded border border-blue-600 px-2"
            placeholder="Digite aqui..."
          />
        </div>

        {/* ROLE */}
        <div className="mb-4">
          <label className="text-xs font-bold text-blue-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 bg-neutral-100 rounded border border-blue-600 px-2"
          >
            <option value="">Selecione</option>
            <option value="admin">Admin</option>
            <option value="member">Membro</option>
          </select>
        </div>

        {/* ACTIVE */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-blue-600">
            Contribuidor ativo?
          </span>

          <input
            type="checkbox"
            checked={active}
            onChange={() => setActive(!active)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="w-44 h-8 border border-zinc-400 rounded text-xs font-bold"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="w-44 h-8 bg-blue-600 text-white rounded text-xs font-black"
          >
            Cadastrar
          </button>
        </div>

      </div>
    </div>
  );
}