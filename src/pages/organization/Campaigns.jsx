import { useState } from "react";
import { toast } from "sonner";

import OrganizationLayout from "../../layouts/OrganizationLayout";

import { useOrganizations } from "../../contexts/OrganizationContext";

import { CreateCampaignModal } from "../../components/admin/organization-details/modals/CreateCampaignModal";
import { CampaignsStats } from "../../components/organization/campaigns/CampaignsStats";
import { CampaignsToolbar } from "../../components/organization/campaigns/CampaignsToolbar";
import { CampaignsTable } from "../../components/organization/campaigns/CampaignsTable";

export function Campaigns() {
  const {
    campaigns,
    addCampaign,
  } = useOrganizations();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minGoal, setMinGoal] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  function handleCreate(data) {
    try {
      addCampaign(data);

      toast.success("Campanha criada com sucesso!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Erro ao criar campanha");
    }
  }

  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch = c.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchStatus = status ? c.status === status : true;
    const matchGoal = minGoal ? c.goal >= Number(minGoal) : true;

    return matchSearch && matchStatus && matchGoal;
  });

  return (
    <OrganizationLayout
      title="Campanhas"
      description="Gerencie as campanhas da sua organização"
    >
      <div className="flex flex-col gap-8">
        <CampaignsStats />

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