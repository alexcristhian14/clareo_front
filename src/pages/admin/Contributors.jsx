import { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";

import { ContributorsToolbar } from "../../components/admin/contributors/ContributorsToolbar";
import { ContributorsTable } from "../../components/admin/contributors/ContributorsTable";
import { CreateContributorModal } from "../../components/admin/organization-details/modals/CreateContributorModal";

// MOCK (troca por API depois)
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
];

export function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // simula API
  useEffect(() => {
    setContributors(mockContributors);
  }, []);

  // filtro
  const filteredContributors = contributors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // criar contribuidor (mock)
  function handleCreate(data) {
    const newContributor = {
      id: Date.now(),
      ...data,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setContributors((prev) => [newContributor, ...prev]);
  }

  return (
    <AppLayout
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
    </AppLayout>
  );
}
