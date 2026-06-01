import { OrganizationHeader } from "../components/organization-details/OrganizationHeader";
import { OrganizationTabs } from "../components/organization-details/OrganizationTabs";
import { OrganizationInfo } from "../components/organization-details/OrganizationInfo";
import { OrganizationStats } from "../components/organization-details/OrganizationStats";
import { TransactionsTable } from "../components/organization-details/TransactionsTable";
import AppLayout from "../layouts/AppLayout";

export function OrganizationDetails() {
  return (
    <AppLayout
      title="Detalhes"
      description="Visualize as principais métricas da plataforma"
    >
      <div className="flex flex-col gap-8 w-full">
        <OrganizationHeader />

        <OrganizationTabs />

        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col xl:flex-row gap-4 w-full">
            <OrganizationInfo />
            <OrganizationStats />
          </div>

          <TransactionsTable />
        </div>
      </div>
    </AppLayout>
  );
}
