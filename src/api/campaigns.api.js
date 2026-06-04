import { httpClient } from "./httpClient";

export const campaignsApi = {
  getAll: () => httpClient.get("/campaigns"),

  getById: (id) => httpClient.get(`/campaigns/${id}`),

  getByOrganization: (orgId) =>
    httpClient.get(`/organizations/${orgId}/campaigns`),

  donate: (campaignId, payload) =>
    httpClient.post(`/campaigns/${campaignId}/donate`, payload),
};