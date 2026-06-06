import { useParams } from "react-router-dom";
import { useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";
import { EditCampaignModal } from "../../components/common/modals/EditCampaignModal";
import { DeleteCampaignModal } from "../../components/common/modals/DeleteCampaignModal";
import { useCampaigns } from "../../contexts/CampaignContext";

export function CampaignDetails() {
  const { campaignId } = useParams();
  const { getCampaignById, updateCampaign, closeCampaign } = useCampaigns();

  const campaign = getCampaignById(campaignId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function handleEditSave(updated) {
    updateCampaign(campaign.id, updated);
  }

  function handleDelete() {
    closeCampaign(campaign.id);
    setIsDeleteOpen(false);
  }

  return (
    <AdminLayout
      title={campaign.organization}
      description="Detalhamento da campanha"
    >
      <CampaignDetailsBase
        mode="admin"
        campaign={campaign}
        onEdit={() => setIsEditOpen(true)}
        onClose={() => setIsDeleteOpen(true)}
      />

      {/* MODAL EDITAR */}
      <EditCampaignModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        campaign={campaign}
        onSave={handleEditSave}
      />

      {/* MODAL EXCLUIR */}
      <DeleteCampaignModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
