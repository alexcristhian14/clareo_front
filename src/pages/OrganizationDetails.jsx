import { useState } from "react";
import { Plus } from "lucide-react";

import AppLayout from "../layouts/AppLayout";

import { OrganizationHeader } from "../components/organization-details/OrganizationHeader";
import { OrganizationTabs } from "../components/organization-details/OrganizationTabs";
import { OrganizationInfo } from "../components/organization-details/OrganizationInfo";
import { OrganizationStats } from "../components/organization-details/OrganizationStats";
import { TransactionsTable } from "../components/organization-details/TransactionsTable";
import { ContributorsTable } from "../components/organization-details/ContributorsTable";
import { Wallet } from "../components/organization-details/Wallet";
import { Campaigns } from "../components/organization-details/Campaings";
import { PaymentMethods } from "../components/organization-details/PaymentMethods";

export function OrganizationDetails() {
  const [tab, setTab] = useState("overview");

  return (
    <AppLayout
      title="Detalhes da Organização"
      description="Visualize e gerencie a organização"
    >
      <div className="flex flex-col gap-8 w-full">
        <OrganizationHeader />

        <OrganizationTabs defaultTab={tab} onChange={setTab} />

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              <OrganizationInfo />
              <OrganizationStats />
            </div>

            <TransactionsTable />
          </div>
        )}

        {/* CONTRIBUTORS */}
        {tab === "contributors" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button className="w-56 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2">
                <Plus size={18} />
                Adicionar Contribuidor
              </button>
            </div>

            <ContributorsTable />
          </div>
        )}

        {tab === "wallet" && (
          <div className="flex flex-col gap-8 w-full">
            <Wallet />
          </div>
        )}

        {/* CAMPAIGNS */}
        {tab === "campaigns" && (
          <div className="flex flex-col gap-8 w-full">
            <Campaigns />
          </div>
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <div className="flex flex-col gap-8 w-full">
            <PaymentMethods />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
