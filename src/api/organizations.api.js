import { httpClient } from "./httpClient";

export const organizationsApi = {
  getAll: () => httpClient.get("/organizations"),

  getById: (id) => httpClient.get(`/organizations/${id}`),

  associate: (orgId) =>
    httpClient.post(`/organizations/${orgId}/associate`),
};