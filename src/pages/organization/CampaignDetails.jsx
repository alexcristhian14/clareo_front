import { useParams } from "react-router-dom";

import OrganizationLayout from "../../layouts/OrganizationLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";

export function CampaignDetails() {
  const { campaignId } = useParams();

  const campaign = {
    id: campaignId,
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  };

  function handleAddEvidence() {
    console.log("Nova evidência para campanha:", campaignId);
  }

  function handleDonate() {
    console.log("Doação para campanha:", campaignId);
  }

  return (
    <OrganizationLayout
      title={campaign.title}
      description="Acompanhe a campanha"
    >
      <CampaignDetailsBase
        mode="organization"
        campaign={campaign}
        onAddEvidence={handleAddEvidence}
        onDonate={handleDonate}
      />
    </OrganizationLayout>
  );
}