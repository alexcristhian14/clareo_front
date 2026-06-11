import axios from "axios";

const TOKEN_KEY = "clareo_token";
const USER_KEY = "clareo_user";
const ORG_KEY = "clareo_organization";

export const API_BASE = "http://api.174-138-124-240.nip.io";

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  const apiKey = localStorage.getItem("clareo_api_key");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (apiKey) {
    config.headers["X-API-Key"] = apiKey;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ORG_KEY);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getStoredOrganization() {
  const raw = localStorage.getItem(ORG_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function storeAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function storeOrganization(org) {
  localStorage.setItem(ORG_KEY, JSON.stringify(org));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ORG_KEY);
}
