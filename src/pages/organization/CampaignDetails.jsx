import { useState } from "react";
import { useParams } from "react-router-dom";

import OrganizationLayout from "../../layouts/OrganizationLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";

import { DeleteCampaignModal } from "../../components/common/modals/DeleteCampaignModal";
import { EditCampaignModal } from "../../components/common/modals/EditCampaignModal";

export function CampaignDetails() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState({
    id: campaignId,
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  });

  // modais (mesmos do admin — reutiliza tudo)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ORGANIZATION ACTIONS
  function handleAddEvidence() {
    console.log("Nova evidência para campanha:", campaignId);
  }

  function handleDonate() {
    console.log("Doação para campanha:", campaignId);
  }

  function handleSaveEdit(updatedCampaign) {
    setCampaign(updatedCampaign);
  }

  function handleDelete() {
    console.log("Cancelar campanha (org):", campaignId);
    setIsDeleteOpen(false);
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
        onEdit={() => setIsEditOpen(true)}
        onClose={() => setIsDeleteOpen(true)}
      />

      {/* EDIT MODAL (reutilizado do admin) */}
      <EditCampaignModal
        isOpen={isEditOpen}
        campaign={campaign}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />

      {/* DELETE MODAL (reutilizado do admin) */}
      <DeleteCampaignModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </OrganizationLayout>
  );
}