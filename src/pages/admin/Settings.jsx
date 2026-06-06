import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";

import AdminLayout from "../../layouts/AdminLayout";

import { GeneralSettingsCard } from "../../components/admin/settings/GeneralSettingsCard";
import { FinancialSettingsCard } from "../../components/admin/settings/FinancialSettingsCard";
import { NotificationSettingsCard } from "../../components/admin/settings/NotificationSettingsCard";
import { SecuritySettingsCard } from "../../components/admin/settings/SecuritySettingsCard";
import { AdminActionsCard } from "../../components/admin/settings/AdminActionsCard";

export function Settings() {
  const { settings, setSettings, saveSettings } = useSettings();

  return (
    <AdminLayout title="Configurações" description="Gerencie as configurações da plataforma">

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

    </AdminLayout>
  );
}