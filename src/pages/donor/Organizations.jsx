import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DonorLayout from "../../layouts/DonorLayout";

import { OrganizationsToolbar } from "../../components/donor/organizations/OrganizationsToolbar";
import { OrganizationGrid } from "../../components/donor/organizations/OrganizationGrid";

export function Organizations() {
  const [search, setSearch] = useState("");
  const [associatedOnly, setAssociatedOnly] = useState("all");
  const [minCampaigns, setMinCampaigns] = useState("");
  const [minSupporters, setMinSupporters] = useState("");
  const navigate = useNavigate();

  const organizations = [
    {
      id: 1,
      name: "Instituto Saúde Viva",
      description: "Saúde comunitária e atendimento itinerante.",
      campaigns: 15,
      supporters: 2134,
      associated: true,
    },
    {
      id: 2,
      name: "Projeto Futuro",
      description: "Educação para jovens em situação de vulnerabilidade.",
      campaigns: 9,
      supporters: 1240,
      associated: false,
    },
    {
      id: 3,
      name: "Rede Esperança",
      description: "Combate à insegurança alimentar.",
      campaigns: 12,
      supporters: 980,
      associated: false,
    },
  ];

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(search.toLowerCase());

    const matchesAssociation =
      associatedOnly === "all" ||
      (associatedOnly === "associated" && org.associated) ||
      (associatedOnly === "not-associated" && !org.associated);

    const matchesCampaigns =
      minCampaigns === "" || org.campaigns >= Number(minCampaigns);

    const matchesSupporters =
      minSupporters === "" || org.supporters >= Number(minSupporters);

    return (
      matchesSearch &&
      matchesAssociation &&
      matchesCampaigns &&
      matchesSupporters
    );
  });

  function handleAssociate(id) {
    console.log("Associar:", id);
  }

  function handleDetails(id) {
    navigate(`/donor/organizations/${id}`);
  }

  return (
    <DonorLayout
      title="Organizações"
      description="Encontre organizações para apoiar"
    >
      <div className="flex flex-col gap-6">
        <OrganizationsToolbar
          search={search}
          setSearch={setSearch}
          associatedOnly={associatedOnly}
          setAssociatedOnly={setAssociatedOnly}
          minCampaigns={minCampaigns}
          setMinCampaigns={setMinCampaigns}
          minSupporters={minSupporters}
          setMinSupporters={setMinSupporters}
        />

        <OrganizationGrid
          organizations={filteredOrganizations}
          onAssociate={handleAssociate}
          onDetails={handleDetails}
        />
      </div>
    </DonorLayout>
  );
}
