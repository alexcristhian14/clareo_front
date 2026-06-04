import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";

import { CampaignGrid } from "../../components/donor/campaigns/CampaignGrid";
import { CampaignsToolbar } from "../../components/donor/campaigns/CampaignsToolbar";
import { Button } from "../../components/common/Button";

export function Campaigns() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [minGoal, setMinGoal] = useState("");

  // MOCK
  // depois virá da API
  const associatedOrganizations = [1, 3];

  const campaigns = [
    {
      id: 1,
      organizationId: 1,
      title: "Saúde para Todos",
      organization: "Instituto Saúde Viva",
      category: "health",
      status: "active",
      raised: 25000,
      goal: 50000,
    },
    {
      id: 2,
      organizationId: 2,
      title: "Educação no Campo",
      organization: "Projeto Futuro",
      category: "education",
      status: "active",
      raised: 38000,
      goal: 45000,
    },
    {
      id: 3,
      organizationId: 3,
      title: "Alimentação Solidária",
      organization: "Rede Esperança",
      category: "food",
      status: "finished",
      raised: 12000,
      goal: 30000,
    },
  ];

  // Apenas campanhas das organizações associadas
  const availableCampaigns = campaigns.filter((campaign) =>
    associatedOrganizations.includes(campaign.organizationId)
  );

  const filteredCampaigns = availableCampaigns.filter((campaign) => {
    const matchesSearch = campaign.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || campaign.category === category;

    const matchesStatus =
      status === "" || campaign.status === status;

    const matchesMinGoal =
      minGoal === "" || campaign.goal >= Number(minGoal);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesMinGoal
    );
  });

  return (
    <DonorLayout
      title="Campanhas"
      description="Campanhas disponíveis das organizações às quais você está associado"
    >
      <div className="flex flex-col gap-6">

        <CampaignsToolbar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          minGoal={minGoal}
          setMinGoal={setMinGoal}
        />

        {associatedOrganizations.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-zinc-300 p-12 text-center">

            <h2 className="text-xl font-bold text-slate-800">
              Nenhuma campanha disponível
            </h2>

            <p className="text-zinc-500 mt-2">
              Associe-se a uma organização para visualizar e apoiar campanhas.
            </p>

            <div className="mt-6">
              <Button>
                Explorar organizações
              </Button>
            </div>

          </div>
        ) : (
          <CampaignGrid campaigns={filteredCampaigns} />
        )}

      </div>
    </DonorLayout>
  );
}