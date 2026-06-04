import { httpClient } from "./httpClient";

export const authApi = {
  login: (data) => httpClient.post("/auth/login", data),
  register: (data) => httpClient.post("/auth/register", data),
  me: () => httpClient.get("/auth/me"),
};