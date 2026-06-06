import { createContext, useContext, useState } from "react";

const SettingsContext = createContext(null);

const initialAdminSettings = {
  platformName: "Clareo",
  supportEmail: "suporte@clareo.com",
  sessionTime: 60,
  loginAttempts: 5,
  platformFee: 2,
  minTransaction: 10,
  notifyNewOrganization: true,
  notifyNewCampaign: true,
  notifyPaymentFailure: true,
  notifyWeeklyReport: true,
};

const initialDonorSettings = {
  name: "Alex Cristhian",
  email: "alex@email.com",
  notifications: true,
  emailUpdates: true,
};

const initialOrganizationSettings = {
  name: "",
  description: "",
  email: "",
  phone: "",
  receiveNotifications: true,
  publicCampaigns: true,
};

export function SettingsProvider({ children }) {
  const [adminSettings, setAdminSettings] = useState(initialAdminSettings);
  const [donorSettings, setDonorSettings] = useState(initialDonorSettings);
  const [organizationSettings, setOrganizationSettings] = useState(
    initialOrganizationSettings,
  );

  // =====================
  // GENERIC UPDATE HELPERS
  // =====================

  function updateAdminSettings(field, value) {
    setAdminSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateDonorSettings(field, value) {
    setDonorSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateOrganizationSettings(field, value) {
    setOrganizationSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // =====================
  // SAVE (MOCK / FUTURO API)
  // =====================

  function saveAdminSettings() {
    console.log("ADMIN SETTINGS:", adminSettings);
  }

  function saveDonorSettings() {
    console.log("DONOR SETTINGS:", donorSettings);
  }

  function saveOrganizationSettings() {
    console.log("ORG SETTINGS:", organizationSettings);
  }

  return (
    <SettingsContext.Provider
      value={{
        adminSettings,
        donorSettings,
        organizationSettings,

        updateAdminSettings,
        updateDonorSettings,
        updateOrganizationSettings,

        saveAdminSettings,
        saveDonorSettings,
        saveOrganizationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return ctx;
}