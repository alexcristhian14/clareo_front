import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";
import { CampaignGrid } from "../../components/donor/campaigns/CampaignGrid";
import { CampaignsToolbar } from "../../components/donor/campaigns/CampaignsToolbar";
import { Button } from "../../components/common/Button";

import { useCampaigns } from "../../contexts/CampaignContext";
import { useOrganizations } from "../../contexts/OrganizationContext";

export function Campaigns() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("");
  const [minGoal, setMinGoal] = useState("");

  const { campaigns } = useCampaigns();
  const { userOrganizations } = useOrganizations();

  const associatedIds =
    userOrganizations?.donor?.organizationIds || [];

  // 🔥 FILTRA SOMENTE CAMPANHAS DAS ORGS DO DONOR
  const availableCampaigns = campaigns.filter((c) =>
    associatedIds.includes(c.organizationId)
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
      description="Campanhas das organizações associadas"
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

        {availableCampaigns.length === 0 ? (
          <div className="bg-white p-12 text-center border rounded-[10px]">
            <h2 className="text-xl font-bold">
              Nenhuma campanha disponível
            </h2>
          </div>
        ) : (
          <CampaignGrid campaigns={filteredCampaigns} />
        )}

      </div>
    </DonorLayout>
  );
}