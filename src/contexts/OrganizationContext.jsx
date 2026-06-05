import { createContext, useContext, useMemo, useState } from "react";

const OrganizationContext = createContext(null);

const initialOrganizations = [
  {
    id: 1,
    name: "Instituto Saúde Viva",
    description:
      "Organização focada em saúde comunitária e atendimento de populações em situação de vulnerabilidade.",
    campaignsCount: 15,
    supporters: 2134,
    raised: 850000,
    years: 8,
  },
];

const initialCampaigns = [
  {
    id: 1,
    organizationId: 1,
    name: "Água para Todos",
    goal: 10000,
    raised: 9200,
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    status: "Ativa",
  },
];

const initialContributors = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos@email.com",
    organizationId: 1,
    totalDonated: 350,
    campaigns: 2,
    lastDonation: "2026-05-20",
  },
];

export function OrganizationProvider({ children }) {
  const [organizations] = useState(initialOrganizations);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [contributors] = useState(initialContributors);

  // =====================
  // ORGANIZATION
  // =====================

  function getOrganizationById(id) {
    return organizations.find((o) => String(o.id) === String(id));
  }

  // =====================
  // CAMPAIGNS
  // =====================

  function getCampaignsByOrganization(orgId) {
    return campaigns.filter(
      (c) => String(c.organizationId) === String(orgId)
    );
  }

  function getCampaignById(id) {
    return campaigns.find((c) => String(c.id) === String(id));
  }

  function addCampaign(data) {
    const newCampaign = {
      id: Date.now(),
      raised: 0,
      status: "Ativa",
      ...data,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    return newCampaign;
  }

  function updateCampaign(id, data) {
    setCampaigns((prev) =>
      prev.map((c) =>
        String(c.id) === String(id) ? { ...c, ...data } : c
      )
    );
  }

  function deleteCampaign(id) {
    setCampaigns((prev) =>
      prev.filter((c) => String(c.id) !== String(id))
    );
  }

  // =====================
  // CONTRIBUTORS
  // =====================

  function getContributorsByOrganization(orgId) {
    return contributors.filter(
      (c) => String(c.organizationId) === String(orgId)
    );
  }

  // =====================
  // DASHBOARD DERIVED DATA (100% REAL)
  // =====================

  function getDashboardStats(orgId = 1) {
    const orgCampaigns = getCampaignsByOrganization(orgId);
    const orgContributors = getContributorsByOrganization(orgId);

    const activeCampaigns = orgCampaigns.filter(
      (c) => c.status === "Ativa"
    );

    const totalRaised = orgCampaigns.reduce(
      (acc, c) => acc + (c.raised || 0),
      0
    );

    const totalGoal = orgCampaigns.reduce(
      (acc, c) => acc + (c.goal || 0),
      0
    );

    return {
      balance: totalRaised,
      monthlyRaised: totalRaised * 0.2,
      activeCampaigns: activeCampaigns.length,
      donors: orgContributors.length,
      successRate: totalGoal
        ? (totalRaised / totalGoal) * 100
        : 0,
    };
  }

  function getRevenueChartData(orgId = 1) {
    const orgCampaigns = getCampaignsByOrganization(orgId);

    return orgCampaigns.map((c, i) => ({
      month: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i] || "Mês",
      value: c.raised,
    }));
  }

  function getFeaturedCampaigns(orgId = 1) {
    return getCampaignsByOrganization(orgId)
      .sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal))
      .slice(0, 3);
  }

  function getAlerts() {
    return [
      {
        type: "success",
        text: "Campanha atingiu 90% da meta.",
      },
      {
        type: "info",
        text: "Nova doação recebida.",
      },
      {
        type: "warning",
        text: "Campanha encerra em 3 dias.",
      },
    ];
  }

  const value = useMemo(
    () => ({
      organizations,
      campaigns,

      getOrganizationById,
      getCampaignsByOrganization,
      getCampaignById,

      addCampaign,
      updateCampaign,
      deleteCampaign,

      getContributorsByOrganization,

      getDashboardStats,
      getRevenueChartData,
      getFeaturedCampaigns,
      getAlerts,
      updateOrganization,
    }),
    [campaigns, contributors, organizations]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations() {
  const ctx = useContext(OrganizationContext);

  if (!ctx) {
    throw new Error(
      "useOrganizations must be used within OrganizationProvider"
    );
  }

  return ctx;
}

function updateOrganization(id, data) {
  setOrganizations((prev) =>
    prev.map((o) =>
      String(o.id) === String(id)
        ? { ...o, ...data }
        : o,
    ),
  );
}