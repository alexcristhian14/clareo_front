import { useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";

export function CampaignDetails() {
  const { orgId, campaignId } = useParams();

  const campaign = {
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  };

  function handleEdit() {
    console.log("Editar campanha");
  }

  function handleClose() {
    console.log("Encerrar campanha");
  }

  return (
    <AdminLayout
      title={campaign.organization}
      description="Detalhamento da campanha"
    >
      <CampaignDetailsBase
        mode="admin"
        campaign={campaign}
        onEdit={handleEdit}
        onClose={handleClose}
      />
    </AdminLayout>
  );
}