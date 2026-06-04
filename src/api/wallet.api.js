import { httpClient } from "./httpClient";

export const walletApi = {
  getBalance: () => httpClient.get("/wallet/balance"),

  addBalance: (data) => httpClient.post("/wallet/add", data),

  getTransactions: () => httpClient.get("/wallet/transactions"),
};