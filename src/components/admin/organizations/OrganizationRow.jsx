import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OrganizationRow({ org }) {
  const navigate = useNavigate();

  function handleDetails() {
    navigate(`/admin/organizations/${org.id}`);
  }

  return (
    <div className="grid grid-cols-7 items-center px-8 py-4 border-t border-slate-200 hover:bg-slate-50 transition">
      <span>{org.id}</span>

      <span>{org.nome}</span>

      <span>{org.dataCadastro}</span>

      <span>{org.membros}</span>

      <span className={org.status === "Ativa" ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
        {org.status}
      </span>

      <span>{org.transacoes}</span>

      <button
        onClick={handleDetails}
        className="flex items-center gap-1 text-blue-600 font-semibold"
      >
        Ver detalhes
        <ChevronRight size={16} />
      </button>
    </div>
  );
}