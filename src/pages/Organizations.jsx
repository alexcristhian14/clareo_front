import { useState } from "react";
import { toast } from "sonner";

import AppLayout from "../layouts/AppLayout";
import { OrganizationsToolbar } from "../components/organizations/OrganizationsToolbar";
import { OrganizationsTable } from "../components/organizations/OrganizationsTable";
import { CreateOrganizationModal } from "../components/organizations/CreateOrganizationModal";

export function Organizations() {
  const [organizations, setOrganizations] = useState([
    {
      id: "ORG-001",
      nome: "Instituto Saúde Viva",
      dataCadastro: "12/03/2026",
      membros: 24,
      status: "Ativa",
      transacoes: 1245,
    },
    {
      id: "ORG-002",
      nome: "Casa Esperança",
      dataCadastro: "15/03/2026",
      membros: 18,
      status: "Inativa",
      transacoes: 800,
    },
    {
      id: "ORG-003",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 2500,
    },
    {
      id: "ORG-004",
      nome: "Projeto Passado",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 2500,
    },
    {
      id: "ORG-005",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 1500,
    },
    {
      id: "ORG-006",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 200,
    },
    {
      id: "ORG-007",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 400,
    },
    {
      id: "ORG-008",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 500,
    },
    {
      id: "ORG-009",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 800,
    },
    {
      id: "ORG-010",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 700,
    },
    {
      id: "ORG-011",
      nome: "Projeto Futuro",
      dataCadastro: "20/03/2026",
      membros: 35,
      status: "Ativa",
      transacoes: 900,
    },
  ]);

  const convertDateToInputFormat = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minMembers, setMinMembers] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minTransactions, setMinTransactions] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  function handleCreateOrganization(nome, ativa) {
    const newOrganization = {
      id: `ORG-${String(organizations.length + 1).padStart(3, "0")}`,
      nome,
      dataCadastro: new Date().toLocaleDateString("pt-BR"),
      membros: 0,
      status: ativa ? "Ativa" : "Inativa",
      transacoes: 0,
    };

    setOrganizations((prev) => [...prev, newOrganization]);
    toast.success("Organização criada com sucesso!");
    setShowCreateModal(false);
  }

  const filteredOrganizations = organizations.filter((org) => {
    const matchSearch = org.nome.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "" || org.status === status;

    const matchMembers = minMembers === "" || org.membros >= Number(minMembers);

    const matchTransactions =
      minTransactions === "" || org.transacoes >= Number(minTransactions);

    const matchDate =
      dateFilter === "" ||
      convertDateToInputFormat(org.dataCadastro) === dateFilter;

    return (
      matchSearch &&
      matchStatus &&
      matchMembers &&
      matchTransactions &&
      matchDate
    );
  });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

  const currentOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <AppLayout
      title="Organizações"
      description="Gestão de todas as organizações da plataforma"
    >
      <div className="flex flex-col gap-12">
        <OrganizationsToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          minMembers={minMembers}
          setMinMembers={setMinMembers}
          minTransactions={minTransactions}
          setMinTransactions={setMinTransactions}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onCreateOrganization={() => setShowCreateModal(true)}
        />

        <OrganizationsTable
          organizations={currentOrganizations}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredOrganizations.length}
        />

        <CreateOrganizationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateOrganization}
        />
      </div>
    </AppLayout>
  );
}
