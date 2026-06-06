import OrganizationLayout from "../../layouts/OrganizationLayout";
import { useOrganizations } from "../../contexts/OrganizationContext";

import { DashboardStats } from "../../components/organization/dashboard/DashboardStats";
import { RevenueLineChart } from "../../components/organization/dashboard/RevenueLineChart";
import { FeaturedCampaigns } from "../../components/organization/dashboard/FeaturedCampaigns";
import { AlertsPanel } from "../../components/organization/dashboard/AlertsPanel";

export function Dashboard() {
  const {
    getDashboardStats,
    getRevenueChartData,
    campaigns,
    getAlerts,
  } = useOrganizations();

  const stats = getDashboardStats();
  const revenue = getRevenueChartData();
  const alerts = getAlerts();

  // aqui você define “featured” de forma simples (sem depender de função inexistente)
  const featuredCampaigns = (campaigns || [])
    .filter((c) => c.status === "Ativa")
    .slice(0, 3);

  return (
    <OrganizationLayout
      title="Dashboard"
      description="Acompanhe os resultados da sua organização"
    >
      <div className="flex flex-col gap-8">

        <DashboardStats stats={stats} />

        <RevenueLineChart data={revenue} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <FeaturedCampaigns campaigns={featuredCampaigns} />
          </div>

          <AlertsPanel alerts={alerts} />
        </div>

      </div>
    </OrganizationLayout>
  );
}