import { useMemo, useState } from "react";
import { toast } from "sonner";

import AdminLayout from "../../layouts/AdminLayout";

import { OrganizationsToolbar } from "../../components/admin/organizations/OrganizationsToolbar";
import { OrganizationsTable } from "../../components/admin/organizations/OrganizationsTable";
import { CreateOrganizationModal } from "../../components/admin/organizations/CreateOrganizationModal";

import { useOrganizations } from "../../contexts/OrganizationContext";

export function Organizations() {
  const { organizations, addOrganization } = useOrganizations();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minMembers, setMinMembers] = useState("");
  const [minTransactions, setMinTransactions] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);

  function handleCreateOrganization(nome, ativa) {
    addOrganization({
      name: nome,
      status: ativa ? "Ativa" : "Inativa",
    });

    toast.success("Organização criada com sucesso!");
    setShowCreateModal(false);
  }

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchSearch = org.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "" || org.status === status;

      const matchMembers =
        minMembers === "" ||
        (org.members || 0) >= Number(minMembers);

      const matchTransactions =
        minTransactions === "" ||
        (org.transactions || 0) >= Number(minTransactions);

      return (
        matchSearch &&
        matchStatus &&
        matchMembers &&
        matchTransactions
      );
    });
  }, [
    organizations,
    search,
    status,
    minMembers,
    minTransactions,
  ]);

  return (
    <AdminLayout
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
          organizations={filteredOrganizations}
        />

        <CreateOrganizationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateOrganization}
        />
      </div>
    </AdminLayout>
  );
}