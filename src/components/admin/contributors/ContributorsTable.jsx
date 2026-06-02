import { Pencil, Trash } from "lucide-react";

const mockContributors = [
  {
    id: 1,
    name: "João Felipe Lima",
    email: "joao@org.com",
    role: "Admin",
    date: "14/01/2026",
    organization: "Instituto Nova Vida",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria@org.com",
    role: "Member",
    date: "12/01/2026",
    organization: "Instituto Saúde Viva",
  },
  {
    id: 3,
    name: "Carlos Souza",
    email: "carlos@org.com",
    role: "Viewer",
    date: "10/01/2026",
    organization: "Instituto Esperança",
  },
];

export function ContributorsTable({ onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 overflow-hidden">
      <div className="grid grid-cols-6 px-8 py-4 bg-slate-100 font-semibold text-slate-800">
        <span>NOME</span>
        <span>EMAIL</span>
        <span>ROLE</span>
        <span>DATA_ENTRADA</span>
        <span>ORGANIZAÇÃO</span>

        {/* centraliza o título na coluna */}
        <span className="text-center">AÇÕES</span>
      </div>

      {/* ROWS */}
      {mockContributors.map((c) => (
        <div
          key={c.id}
          className="grid grid-cols-6 p-3 border-t text-sm items-center"
        >
          <span>{c.name}</span>
          <span>{c.email}</span>
          <span>{c.role}</span>
          <span>{c.date}</span>
          <span>{c.organization}</span>

          {/* AÇÕES */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onEdit?.(c)}
              className="p-2 rounded hover:bg-blue-50 transition"
            >
              <Pencil size={16} className="text-indigo-600" />
            </button>

            <button
              onClick={() => onDelete?.(c.id)}
              className="p-2 rounded hover:bg-red-50 transition"
            >
              <Trash size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
