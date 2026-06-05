import DonorLayout from "../../layouts/DonorLayout";

import { HeroCampaign } from "../../components/donor/feed/HeroCampaign";
import { CampaignSection } from "../../components/donor/feed/CampaignSection";
import { RecentUpdates } from "../../components/donor/feed/RecentUpdates";
import { DonorStats } from "../../components/donor/feed/DonorStats";

import { useCampaigns } from "../../contexts/CampaignContext";
import { useWallet } from "../../contexts/WalletContext";

export function Feed() {
  const {
    campaigns = [],
    getTrendingCampaigns,
    getEndingCampaigns,
    getFeaturedCampaign,
    stats: campaignStats,
  } = useCampaigns();

  const { transactions = [] } = useWallet();

  const featuredCampaign = getFeaturedCampaign?.() || null;
  const trendingCampaigns = getTrendingCampaigns?.() || [];
  const endingCampaigns = getEndingCampaigns?.() || [];

  // =========================
  // 🔥 STATS REAIS
  // =========================

  // 💰 total doado (REAL)
  const totalDonated = transactions
    .filter((t) => t.type === "donation")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  // 🎯 campanhas apoiadas (únicas)
  const supportedCampaigns = new Set(
    transactions
      .filter((t) => t.type === "donation" && t.campaignId)
      .map((t) => t.campaignId)
  ).size;

  // 👀 evidências vistas (placeholder inteligente)
  const evidencesViewed = new Set(
    transactions
      .filter((t) => t.type === "donation" && t.campaignId)
      .map((t) => t.campaignId)
  ).size * 2;

  const donorStats = {
    totalDonated,
    supportedCampaigns,
    evidencesViewed,
  };

  // =========================
  // updates reais
  // =========================
  const updates = (transactions || [])
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      campaign: t.campaignId
        ? `Campanha #${t.campaignId}`
        : "Recarga de carteira",
      description:
        t.type === "donation"
          ? `Doação de R$ ${t.amount}`
          : `Recarga de R$ ${t.amount}`,
      date: t.date
        ? new Date(t.date).toLocaleDateString("pt-BR")
        : "",
    }));

  return (
    <DonorLayout
      title="Feed"
      description="Descubra campanhas e acompanhe seu impacto"
    >
      <div className="flex flex-col gap-8">
        {featuredCampaign && (
          <HeroCampaign campaign={featuredCampaign} />
        )}

        <CampaignSection
          title="Campanhas em alta"
          campaigns={trendingCampaigns}
        />

        <CampaignSection
          title="Próximas de atingir a meta"
          campaigns={endingCampaigns}
        />

        <RecentUpdates updates={updates} />

        <DonorStats stats={donorStats} />
      </div>
    </DonorLayout>
  );
}