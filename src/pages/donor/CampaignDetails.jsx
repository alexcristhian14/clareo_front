import { useParams } from "react-router-dom";
import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";
import { CampaignDetailsBase } from "../../features/campaign/CampaignDetailsBase";
import { DonationModal } from "../../components/donor/modals/DonationModal";

export function CampaignDetails() {
  const { campaignId } = useParams();

  const [isDonateOpen, setIsDonateOpen] = useState(false);

  const campaign = {
    id: campaignId,
    title: "Saúde para Todos",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  };

  function handleDonate({ amount, method }) {
    console.log("DOAÇÃO:", {
      amount,
      method,
      campaignId,
    });

    // aqui depois vira API:
    // await api.post("/donations", {...})

    setIsDonateOpen(false);
  }

  return (
    <DonorLayout
      title="Detalhes da campanha"
      description="Conheça e apoie esta causa"
    >
      <div className="relative">
        {/* CAMPANHA */}
        <CampaignDetailsBase
          mode="donor"
          campaign={campaign}
          isAssociated={true}
          onDonate={() => setIsDonateOpen(true)}
          onViewOrganization={() => console.log("ver organização")}
        />

        {/* MODAL NOVO (STEP FLOW) */}
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
