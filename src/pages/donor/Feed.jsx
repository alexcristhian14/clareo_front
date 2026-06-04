import DonorLayout from "../../layouts/DonorLayout";

import { HeroCampaign } from "../../components/donor/feed/HeroCampaign";
import { CampaignSection } from "../../components/donor/feed/CampaignSection";
import { RecentUpdates } from "../../components/donor/feed/RecentUpdates";
import { DonorStats } from "../../components/donor/feed/DonorStats";

export function Feed() {
  const featuredCampaign = {
    id: 1,
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    description:
      "Equipe médica volante para atender comunidades rurais.",
  };

  const featuredCampaigns = [
    {
      id: 1,
      title: "Saúde para Todos",
      organization: "Instituto Saúde Viva",
      raised: 25000,
      goal: 50000,
    },
    {
      id: 2,
      title: "Educação no Campo",
      organization: "Projeto Futuro",
      raised: 38000,
      goal: 45000,
    },
  ];

  const endingCampaigns = [
    {
      id: 3,
      title: "Alimentação Solidária",
      organization: "Rede Esperança",
      raised: 28000,
      goal: 30000,
    },
    {
      id: 4,
      title: "Projeto Água",
      organization: "Instituto Esperança",
      raised: 46000,
      goal: 50000,
    },
  ];

  const updates = [
    {
      id: 1,
      campaign: "Acompanhamento Médico Itinerante",
      description: "Compra de medicamentos realizada.",
      date: "Hoje",
    },
    {
      id: 2,
      campaign: "Alimentação Solidária",
      description: "Entrega de 200 cestas básicas.",
      date: "Ontem",
    },
  ];

  const stats = {
    totalDonated: 1250,
    supportedCampaigns: 8,
    evidencesViewed: 23,
  };

  return (
    <DonorLayout
      title="Feed"
      description="Descubra campanhas e acompanhe seu impacto"
    >
      <div className="flex flex-col gap-8">
        <HeroCampaign campaign={featuredCampaign} />

        <CampaignSection
          title="Campanhas em alta"
          campaigns={featuredCampaigns}
        />

        <CampaignSection
          title="Próximas de atingir a meta"
          campaigns={endingCampaigns}
        />

        <RecentUpdates updates={updates} />

        <DonorStats stats={stats} />
      </div>
    </DonorLayout>
  );
}