import { authApi } from "../api/auth.api";

let userMock = {
  id: 1,
  name: "Alex",
  email: "alex@email.com",
  role: "admin", // ou "admin" // ou "donor"
};

export const authService = {
  login: async (email, password) => {
    await authApi.login({ email, password });

    return userMock;
  },

  getMe: async () => {
    await authApi.me();

    return userMock;
  },

  logout: async () => {
    userMock = null;
  },
};