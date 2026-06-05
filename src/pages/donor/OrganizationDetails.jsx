import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import DonorLayout from "../../layouts/DonorLayout";
import { OrganizationDetailsBase } from "../../features/organization/OrganizationDetailsBase";

import { useAssociations } from "../../contexts/AssociationContext";
import { useOrganizations } from "../../contexts/OrganizationContext";
import { useCampaigns } from "../../contexts/CampaignContext";

export function OrganizationDetails() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const { associate, unassociate, isAssociated } = useAssociations();

  const { getOrganizationById } = useOrganizations();

  const organization = getOrganizationById(Number(organizationId));

  if (!organization) {
    return (
      <DonorLayout title="Organização" description="Detalhes da organização">
        <p>Organização não encontrada.</p>
      </DonorLayout>
    );
  }

  const { getCampaignsByOrganization } = useCampaigns();

  const campaigns = getCampaignsByOrganization(Number(organizationId));

  const associated = isAssociated(organization.id);

  async function handleUnassociate() {
    try {
      await unassociate(organization.id);
      toast.success("Associação cancelada");
    } catch {
      toast.error("Erro ao cancelar associação");
    }
  }

  async function handleAssociate() {
    try {
      await associate(organization.id);
      toast.success("Agora você é associado desta organização");
    } catch {
      toast.error("Erro ao realizar associação");
    }
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
        isAssociated={associated}
        onAssociate={handleAssociate}
        onUnassociate={handleUnassociate}
        onOpenCampaign={handleOpenCampaign}
      />
    </DonorLayout>
  );
}
