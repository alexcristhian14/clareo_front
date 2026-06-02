import OrganizationLayout from "../../layouts/OrganizationLayout";

import { DashboardStats } from "../../components/organization/dashboard/DashboardStats";
import { RevenueLineChart } from "../../components/organization/dashboard/RevenueLineChart";
import { FeaturedCampaigns } from "../../components/organization/dashboard/FeaturedCampaigns";
import { AlertsPanel } from "../../components/organization/dashboard/AlertsPanel";

export function Dashboard() {
  return (
    <OrganizationLayout
      title="Dashboard"
      description="Acompanhe os resultados da sua organização"
    >
      <div className="flex flex-col gap-8">

        <DashboardStats />

        <RevenueLineChart />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <FeaturedCampaigns />
          </div>

          <AlertsPanel />
        </div>

      </div>
    </OrganizationLayout>
  );
}