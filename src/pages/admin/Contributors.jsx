import { useState } from "react";
import { useOrganizations } from "../../contexts/OrganizationContext";
import AdminLayout from "../../layouts/AdminLayout";

import { ContributorsToolbar } from "../../components/admin/contributors/ContributorsToolbar";
import { ContributorsTable } from "../../components/admin/contributors/ContributorsTable";
import { CreateContributorModal } from "../../components/admin/organization-details/modals/CreateContributorModal";

export function Contributors() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { contributors, addContributor } = useOrganizations();

  // filtro
  const filteredContributors = contributors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleCreate(data) {
    addContributor(data);
  }

  return (
    <AdminLayout
      title="Contribuidores"
      description="Visualize e gerencie os contribuidores da plataforma"
    >
      <div className="flex flex-col gap-6">
        {/* TOOLBAR */}
        <ContributorsToolbar
          search={search}
          setSearch={setSearch}
          onAdd={() => setShowModal(true)}
        />

        {/* TABLE */}
        <ContributorsTable data={filteredContributors} />

        {/* MODAL */}
        <CreateContributorModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      </div>
    </AdminLayout>
  );
}
