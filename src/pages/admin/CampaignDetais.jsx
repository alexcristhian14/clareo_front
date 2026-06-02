import { useParams } from "react-router-dom";
import { useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";
import { EditCampaignModal } from "../../components/common/modals/EditCampaignModal";
import { DeleteCampaignModal } from "../../components/common/modals/DeleteCampaignModal";

export function CampaignDetails() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState({
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  function handleEditSave(updated) {
    setCampaign(updated);
  }

  function handleDelete() {
    console.log("Excluir campanha:", campaignId);
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