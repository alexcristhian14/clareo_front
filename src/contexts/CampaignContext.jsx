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

  // =========================
  // MOCK LOAD (substitui por API depois)
  // =========================
  async function loadCampaigns() {
    setLoading(true);

    const data = [
      {
        id: 1,
        title: "Saúde para Todos",
        organization: "Instituto Saúde Viva",
        raised: 25000,
        goal: 50000,
      },
      {
        id: 2,
        title: "Educação Digital",
        organization: "Tech For All",
        raised: 12000,
        goal: 30000,
      },
    ];

    setCampaigns(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  // =========================
  // UPDATE DONATION (IMUTÁVEL + SEGURO)
  // =========================
  const updateCampaignAfterDonation = useCallback((campaignId, amount) => {
    const value = Number(amount || 0);

    if (!campaignId || value <= 0) return;

    setCampaigns((prev) =>
      prev.map((campaign) => {
        const sameCampaign =
          String(campaign.id) === String(campaignId);

        if (!sameCampaign) return campaign;

        const currentRaised = Number(campaign.raised || 0);

        return {
          ...campaign,
          raised: currentRaised + value,
        };
      })
    );
  }, []);

  // =========================
  // DERIVADOS OTIMIZADOS
  // =========================
  const featuredCampaign = useMemo(
    () => campaigns?.[0] || null,
    [campaigns]
  );

  const stats = useMemo(() => {
    const safe = Array.isArray(campaigns) ? campaigns : [];

    return {
      totalCampaigns: safe.length,
      totalRaised: safe.reduce(
        (acc, c) => acc + Number(c.raised || 0),
        0
      ),
    };
  }, [campaigns]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        featuredCampaign,
        stats,
        setCampaigns,
        updateCampaignAfterDonation,
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