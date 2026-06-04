import { useParams } from "react-router-dom";
import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";
import { DonationModal } from "../../components/donor/modals/DonationModal";

import { useCampaigns } from "../../contexts/CampaignContext";

export function CampaignDetails() {
  const { campaignId } = useParams();
  const { campaigns, updateCampaignAfterDonation } = useCampaigns();

  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // 🔥 pega campanha REAL do context
  const campaign = campaigns.find(
    (c) => String(c.id) === String(campaignId)
  );

  if (!campaign) {
    return (
      <DonorLayout title="Carregando..." description="">
        <p>Carregando campanha...</p>
      </DonorLayout>
    );
  }

  async function handleDonate({ amount }) {
    // ⚠️ aqui você conecta com wallet depois
    updateCampaignAfterDonation(campaign.id, amount);

    setIsDonateOpen(false);
  }

  return (
    <DonorLayout
      title="Detalhes da campanha"
      description="Conheça e apoie esta causa"
    >
      <div className="relative">

        <CampaignDetailsBase
          mode="donor"
          campaign={campaign}
          isAssociated={true}
          onDonate={() => setIsDonateOpen(true)}
          onViewOrganization={() => console.log("ver organização")}
        />

        <DonationModal
          isOpen={isDonateOpen}
          onClose={() => setIsDonateOpen(false)}
          campaign={campaign}
          onConfirm={handleDonate}
        />

      </div>
    </DonorLayout>
  );
}