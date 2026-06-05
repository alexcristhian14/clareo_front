import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DonorLayout from "../../layouts/DonorLayout";

import { OrganizationsToolbar } from "../../components/donor/organizations/OrganizationsToolbar";
import { OrganizationGrid } from "../../components/donor/organizations/OrganizationGrid";

import { useAssociations } from "../../contexts/AssociationContext";
import { useOrganizations } from "../../contexts/OrganizationContext";

export function Organizations() {
  const [search, setSearch] = useState("");
  const [associatedOnly, setAssociatedOnly] = useState("all");
  const [minCampaigns, setMinCampaigns] = useState("");
  const [minSupporters, setMinSupporters] = useState("");

  const navigate = useNavigate();

  const {
    associate,
    unassociate,
    isAssociated,
  } = useAssociations();

  const { organizations } = useOrganizations();

  const organizationsWithAssociation = organizations.map(
    (org) => ({
      ...org,
      associated: isAssociated(org.id),
    })
  );

  const filteredOrganizations =
    organizationsWithAssociation.filter((org) => {
      const matchesSearch = org.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesAssociation =
        associatedOnly === "all" ||
        (associatedOnly === "associated" &&
          org.associated) ||
        (associatedOnly === "not-associated" &&
          !org.associated);

      const matchesCampaigns =
        minCampaigns === "" ||
        org.campaignsCount >= Number(minCampaigns);

      const matchesSupporters =
        minSupporters === "" ||
        org.supporters >= Number(minSupporters);

      return (
        matchesSearch &&
        matchesAssociation &&
        matchesCampaigns &&
        matchesSupporters
      );
    });

  async function handleAssociate(id) {
    try {
      if (isAssociated(id)) {
        await unassociate(id);
        toast.success("Associação cancelada");
      } else {
        await associate(id);
        toast.success("Agora você é associado");
      }
    } catch {
      toast.error("Erro ao atualizar associação");
    }
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