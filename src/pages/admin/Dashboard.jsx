import AppLayout from "../../layouts/AppLayout";

import { DashboardStats } from "../../components/admin/dashboard/DashboardStats";
import { FinanceLineChart } from "../../components/admin/dashboard/FinanceLineChart";
import { CampaignPieChart } from "../../components/admin/dashboard/CampaignPieChart";
import { AlertsPanel } from "../../components/admin/dashboard/AlertsPanel";
import { RecentTransactions } from "../../components/admin/dashboard/RecentTransactions";

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