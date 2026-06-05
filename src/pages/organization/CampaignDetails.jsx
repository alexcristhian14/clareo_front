import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";

import OrganizationLayout from "../../layouts/OrganizationLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";

import { useOrganizations } from "../../contexts/OrganizationContext";

import { DeleteCampaignModal } from "../../components/common/modals/DeleteCampaignModal";
import { EditCampaignModal } from "../../components/common/modals/EditCampaignModal";

export function CampaignDetails() {
  const { campaignId } = useParams();

  const {
    getCampaignById,
    getOrganizationById,
    updateCampaign,
    deleteCampaign,
  } = useOrganizations();

  const campaign = getCampaignById(campaignId);

  const campaignWithOrg = useMemo(() => {
    if (!campaign) return null;

    const org = getOrganizationById(campaign.organizationId);

    return {
      ...campaign,
      organization: org?.name ?? "Organização",
    };
  }, [campaign, getOrganizationById]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!campaignWithOrg) {
    return <div>Campanha não encontrada</div>;
  }

  function handleSaveEdit(updated) {
    updateCampaign(campaign.id, updated);
    setIsEditOpen(false);
  }

  function handleDelete() {
    deleteCampaign(campaign.id);
    setIsDeleteOpen(false);
  }

  return (
    <OrganizationLayout
      title={campaignWithOrg.name}
      description="Acompanhe a campanha"
    >
      <CampaignDetailsBase
        mode="organization"
        campaign={campaignWithOrg} // 👈 AGORA TEM organization
        onEdit={() => setIsEditOpen(true)}
        onClose={() => setIsDeleteOpen(true)}
      />

      <EditCampaignModal
        isOpen={isEditOpen}
        campaign={campaignWithOrg}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />

      <DeleteCampaignModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </OrganizationLayout>
  );
}