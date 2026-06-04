import { campaignsApi } from "../api/campaigns.api";

const mockCampaigns = [
  {
    id: 1,
    title: "Saúde para Todos",
    organization: "Instituto Saúde Viva",
    category: "health",
    status: "active",
    raised: 25000,
    goal: 50000,
  },
  {
    id: 2,
    title: "Educação no Campo",
    organization: "Projeto Futuro",
    category: "education",
    status: "active",
    raised: 38000,
    goal: 45000,
  },
  {
    id: 3,
    title: "Alimentação Solidária",
    organization: "Rede Esperança",
    category: "food",
    status: "finished",
    raised: 12000,
    goal: 30000,
  },
];

export const campaignService = {
  getCampaigns: async () => {
    await campaignsApi.getAll(); // já simula backend

    return mockCampaigns;
  },

  getCampaignById: async (id) => {
    await campaignsApi.getById(id);

    return mockCampaigns.find((c) => c.id === Number(id));
  },

  donate: async (campaignId, data) => {
    await campaignsApi.donate(campaignId, data);

    return {
      success: true,
      newBalance: 0, // futuramente wallet
    };
  },
};