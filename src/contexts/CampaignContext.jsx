import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

const CampaignContext = createContext({});

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCampaigns() {
    setLoading(true);

    const data = [
      {
        id: 1,
        organizationId: 1,
        title: "Acompanhamento Médico Itinerante",
        organization: "Instituto Saúde Viva",
        raised: 25000,
        goal: 50000,
        description: "Equipe médica volante para atender comunidades rurais.",
        startDate: "2026-06-06"
      },
      {
        id: 2,
        organizationId: 1,
        title: "Mutirão de Vacinação",
        organization: "Instituto Saúde Viva",
        raised: 18000,
        goal: 25000,
        description: "Campanha para ampliar a cobertura vacinal.",
        startDate: "2026-06-06"
      },
      {
        id: 3,
        organizationId: 2,
        title: "Medicamentos para Comunidades",
        organization: "Instituto Saúde Viva",
        raised: 12000,
        goal: 30000,
        description: "Distribuição de medicamentos essenciais.",
        startDate: "2026-06-06"
      },
      {
        id: 4,
        organizationId: 2,
        title: "Educação no Campo",
        organization: "Projeto Futuro",
        raised: 38000,
        goal: 45000,
        description: "Levar educação de qualidade para áreas rurais.",
        startDate: "2026-06-06"
      },
      {
        id: 5,
        organizationId: 3,
        title: "Alimentação Solidária",
        organization: "Rede Esperança",
        raised: 28000,
        goal: 30000,
        description: "Distribuição de alimentos para famílias vulneráveis.",
        startDate: "2026-06-06"
      },
    ];

    setCampaigns(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  // =========================
  // BASE QUERIES
  // =========================

  const getCampaignById = useCallback(
    (id) => campaigns.find((c) => String(c.id) === String(id)),
    [campaigns],
  );

const getCampaignsByOrganization = useCallback(
  (organizationId) => {
    if (!organizationId) return [];

    return campaigns.filter(
      (c) =>
        String(c.organizationId) === String(organizationId)
    );
  },
  [campaigns]
);

  // =========================
  // FEED QUERIES
  // =========================

  const getFeaturedCampaign = useCallback(() => {
    return campaigns.filter((c) => c.featured === true);
  }, [campaigns]);

  const getTrendingCampaigns = useCallback(
    (limit = 4) => {
      return [...campaigns]
        .sort((a, b) => (b.raised || 0) - (a.raised || 0))
        .slice(0, limit);
    },
    [campaigns],
  );

  const getEndingCampaigns = useCallback(
    (limit = 4) => {
      return [...campaigns]
        .sort((a, b) => b.raised / b.goal - a.raised / a.goal)
        .slice(0, limit);
    },
    [campaigns],
  );

  // =========================
  // 🔥 UPDATE CORRETO (ÚNICO E DEFINITIVO)
  // =========================

  const updateCampaignAfterDonation = useCallback((campaignId, amount) => {
    const value = Number(amount);

    if (!campaignId || isNaN(value)) return;

    setCampaigns((prev) =>
      prev.map((c) => {
        if (String(c.id) !== String(campaignId)) return c;

        return {
          ...c,
          raised: Number(c.raised || 0) + value,
        };
      }),
    );
  }, []);

  // =========================
  // STATS
  // =========================

  const stats = useMemo(() => {
    return {
      totalCampaigns: campaigns.length,
      totalRaised: campaigns.reduce((acc, c) => acc + Number(c.raised || 0), 0),
    };
  }, [campaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,

        getCampaignById,
        getCampaignsByOrganization,

        getFeaturedCampaign,
        getTrendingCampaigns,
        getEndingCampaigns,
        

        updateCampaignAfterDonation,

        stats,

        setCampaigns,
        reload: loadCampaigns,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);

  if (!context) {
    throw new Error("useCampaigns must be used within CampaignProvider");
  }

  return context;
}
