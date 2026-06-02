import { useState } from "react";
import { toast } from "sonner";

import OrganizationLayout from "../../layouts/OrganizationLayout";

import { CreateCampaignModal } from "../../components/admin/organization-details/modals/CreateCampaignModal";
import { CampaignsStats } from "../../components/organization/campaigns/CampaignsStats";
import { CampaignsToolbar } from "../../components/organization/campaigns/CampaignsToolbar";
import { CampaignsTable } from "../../components/organization/campaigns/CampaignsTable";

export function Campaigns() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minGoal, setMinGoal] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  function handleCreate(data) {
    try {
      console.log("Criando campanha:", data);

      // simulação de API
      const success = true;

      if (success) {
        const newCampaign = {
          id: Date.now(),
          ...data,
          raised: 0,
          status: "Ativa",
        };

        setCampaigns((prev) => [newCampaign, ...prev]);

        toast.success("Campanha criada com sucesso!");
      } else {
        toast.error("Erro ao criar campanha");
      }

      setIsOpen(false);
    } catch (error) {
      toast.error("Erro inesperado");
    }
  }

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Água para Todos",
      goal: 10000,
      raised: 9200,
      startDate: "01/05/2026",
      endDate: "30/06/2026",
      status: "Ativa",
    },
  ]);

  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status ? c.status === status : true;

    const matchGoal = minGoal ? c.goal >= Number(minGoal) : true;

    const matchStart = dateStart
      ? new Date(c.startDate) >= new Date(dateStart)
      : true;

    const matchEnd = dateEnd ? new Date(c.endDate) <= new Date(dateEnd) : true;

    return matchSearch && matchStatus && matchGoal && matchStart && matchEnd;
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
