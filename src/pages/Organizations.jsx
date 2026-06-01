import { toast } from "sonner";

import AppLayout from "../layouts/AppLayout";
import { OrganizationsToolbar } from "../components/organizations/OrganizationsToolbar";
import { OrganizationsTable } from "../components/organizations/OrganizationsTable";
import { CreateOrganizationModal } from "../components/organizations/CreateOrganizationModal";

import { useState } from "react";
import { useOrganizations } from "../hooks/useOrganizations";

export function Organizations() {
  const {
    currentOrganizations,
    filteredOrganizations,
    currentPage,
    setCurrentPage,
    totalPages,

    search,
    setSearch,
    status,
    setStatus,
    minMembers,
    setMinMembers,
    minTransactions,
    setMinTransactions,
    dateFilter,
    setDateFilter,

    addOrganization,
  } = useOrganizations();

  const [showCreateModal, setShowCreateModal] = useState(false);

  function handleCreateOrganization(nome, ativa) {
    addOrganization(nome, ativa);
    toast.success("Organização criada com sucesso!");
    setShowCreateModal(false);
  }

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