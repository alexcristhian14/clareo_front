import { OrganizationRow } from "./OrganizationRow";
import { Pagination } from "../../common/Pagination";

export function OrganizationsTable({ organizations }) {
  return (
    <div className="bg-white rounded-[10px] shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-300 overflow-hidden">
      <div className="grid grid-cols-7 px-8 py-4 bg-slate-100 font-semibold text-slate-800">
        <span>ID</span>
        <span>Nome</span>
        <span>Data Cadastro</span>
        <span>Membros</span>
        <span>Status</span>
        <span>Transações</span>
        <span>Ações</span>
      </div>

      {organizations.map((org) => (
        <OrganizationRow key={org.id} org={org} />
      ))}
    </div>
  );
}
