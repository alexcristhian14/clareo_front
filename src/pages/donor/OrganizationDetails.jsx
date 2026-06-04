import { useNavigate, useParams } from "react-router-dom";

import DonorLayout from "../../layouts/DonorLayout";
import { OrganizationDetailsBase } from "../../features/organization/OrganizationDetailsBase";

export function OrganizationDetails() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const organization = {
    id: organizationId,
    name: "Instituto Saúde Viva",
    description:
      "Organização focada em saúde comunitária e atendimento de populações em situação de vulnerabilidade.",

    campaignsCount: 15,
    supporters: 2134,
    raised: 850000,
    years: 8,
  };

  const campaigns = [
    {
      id: 1,
      title: "Acompanhamento Médico Itinerante",
      raised: 25000,
      goal: 50000,
    },
    {
      id: 2,
      title: "Mutirão de Vacinação",
      raised: 18000,
      goal: 25000,
    },
    {
      id: 3,
      title: "Medicamentos para Comunidades",
      raised: 12000,
      goal: 30000,
    },
  ];

  const isAssociated = false;

  function handleAssociate() {
    console.log("Associar organização", organizationId);
  }

  function handleOpenCampaign(campaignId) {
    navigate(`/donor/campaigns/${campaignId}`);
  }

  return (
    <DonorLayout
      title={organization.name}
      description="Detalhes da organização"
    >
      <OrganizationDetailsBase
        organization={organization}
        campaigns={campaigns}
        isAssociated={isAssociated}
        onAssociate={handleAssociate}
        onOpenCampaign={handleOpenCampaign}
      />
    </DonorLayout>
  );
}