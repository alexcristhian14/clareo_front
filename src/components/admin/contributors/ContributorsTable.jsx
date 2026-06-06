import { Pencil, Trash } from "lucide-react";
import { useParams } from "react-router-dom";
import { useOrganizations } from "../../../contexts/OrganizationContext";

export function ContributorsTable({ onEdit, onDelete }) {
  const { id: orgId } = useParams();

  const { getAllContributors } = useOrganizations();

  const contributors = getAllContributors();

  return (
    <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 overflow-hidden">
      {/* HEADER */}
      <div className="grid grid-cols-6 px-8 py-4 bg-slate-100 font-semibold text-slate-800">
        <span>NOME</span>
        <span>EMAIL</span>
        <span>ROLE</span>
        <span>DATA_ENTRADA</span>
        <span>ORGANIZAÇÃO</span>
        <span className="text-center">AÇÕES</span>
      </div>

      {/* EMPTY STATE */}
      {contributors.length === 0 ? (
        <div className="p-6 text-sm text-zinc-500">
          Nenhum contribuinte encontrado
        </div>
      ) : (
        contributors.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-6 p-3 border-t text-sm items-center"
          >
            <span>{c.name}</span>
            <span>{c.email}</span>
            <span>{c.role}</span>
            <span>{c.date}</span>
            <span>{c.organizationId}</span>

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
        ))
      )}
    </div>
  );
}
