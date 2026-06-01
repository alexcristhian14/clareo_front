import AppLayout from "../layouts/AppLayout";

import { DashboardStats } from "../components/dashboard/DashboardStats";
import { FinanceLineChart } from "../components/dashboard/FinanceLineChart";
import { CampaignPieChart } from "../components/dashboard/CampaignPieChart";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";

export function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Visão geral financeira da plataforma"
    >
      <div className="flex flex-col gap-8">

        {/* KPIs */}
        <DashboardStats />

        {/* GRÁFICO PRINCIPAL */}
        <FinanceLineChart />

        {/* PIZZA + ALERTAS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CampaignPieChart />
          <AlertsPanel />
        </div>

        {/* TRANSAÇÕES */}
        <RecentTransactions />

      </div>
    </AppLayout>
  );
}