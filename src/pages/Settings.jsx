import { useState } from "react";

import AppLayout from "../layouts/AppLayout";

import { GeneralSettingsCard } from "../components/settings/GeneralSettingsCard";
import { FinancialSettingsCard } from "../components/settings/FinancialSettingsCard";
import { NotificationSettingsCard } from "../components/settings/NotificationSettingsCard";
import { SecuritySettingsCard } from "../components/settings/SecuritySettingsCard";
import { AdminActionsCard } from "../components/settings/AdminActionsCard";

export function Settings() {
  const [settings, setSettings] = useState({
    // gerais
    platformName: "Clareo",
    supportEmail: "suporte@clareo.com",

    // segurança
    sessionTime: 60,
    loginAttempts: 5,

    // financeiro
    platformFee: 2,
    minTransaction: 10,

    // notificações
    notifyNewOrganization: true,
    notifyNewCampaign: true,
    notifyPaymentFailure: true,
    notifyWeeklyReport: true,
  });

  function saveSettings() {
    console.log("salvando configurações:", settings);

    // depois:
    // await api.put("/settings", settings);
  }

  return (
    <AppLayout
      title="Configurações"
      description="Gerencie as configurações da plataforma"
    >
      <div className="flex flex-col gap-6">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GeneralSettingsCard
            settings={settings}
            setSettings={setSettings}
            onSave={saveSettings}
          />

          <SecuritySettingsCard
            settings={settings}
            setSettings={setSettings}
            onSave={saveSettings}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FinancialSettingsCard
            settings={settings}
            setSettings={setSettings}
            onSave={saveSettings}
          />

          <NotificationSettingsCard
            settings={settings}
            setSettings={setSettings}
            onSave={saveSettings}
          />
        </div>

        <AdminActionsCard />

      </div>
    </AppLayout>
  );
}