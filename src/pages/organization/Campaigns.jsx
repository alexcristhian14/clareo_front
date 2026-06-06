import { useState } from "react";
import { toast } from "sonner";

import OrganizationLayout from "../../layouts/OrganizationLayout";

import { useOrganizations } from "../../contexts/OrganizationContext";
import { useCampaigns } from "../../contexts/CampaignContext";

import { CreateCampaignModal } from "../../components/admin/organization-details/modals/CreateCampaignModal";
import { CampaignsStats } from "../../components/organization/campaigns/CampaignsStats";
import { CampaignsToolbar } from "../../components/organization/campaigns/CampaignsToolbar";
import { CampaignsTable } from "../../components/organization/campaigns/CampaignsTable";

export function Campaigns() {
  const { currentOrgId } = useOrganizations();

  const {
    getCampaignsByOrganization,
    addCampaign,
  } = useCampaigns();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minGoal, setMinGoal] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const campaigns =
    getCampaignsByOrganization(currentOrgId) ?? [];

  console.log("currentOrgId:", currentOrgId);
  console.log("campaigns raw:", campaigns);

  function handleCreate(data) {
    try {
      addCampaign({
        ...data,
        organizationId: currentOrgId,
      });

      toast.success("Campanha criada com sucesso!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Erro ao criar campanha");
    }
  }

  const filteredCampaigns = (Array.isArray(campaigns) ? campaigns : []).filter(
    (c) => {
      const matchSearch = c.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus = status ? c.status === status : true;
      const matchGoal = minGoal ? c.goal >= Number(minGoal) : true;

      return matchSearch && matchStatus && matchGoal;
    }
  );

  return (
    <OrganizationLayout
      title="Campanhas"
      description="Gerencie as campanhas da sua organização"
    >
      <div className="flex flex-col gap-8">
        <CampaignsStats campaigns={campaigns} />

        <CampaignsToolbar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          minGoal={minGoal}
          setMinGoal={setMinGoal}
          dateStart={dateStart}
          setDateStart={setDateStart}
          dateEnd={dateEnd}
          setDateEnd={setDateEnd}
          onCreateCampaign={() => setIsOpen(true)}
        />

        <CampaignsTable campaigns={filteredCampaigns} />

        <CreateCampaignModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onCreate={handleCreate}
        />
      </div>
    </OrganizationLayout>
  );
}