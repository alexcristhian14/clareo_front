import { useState } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";

import { OrganizationHeader } from "../../components/admin/organization-details/OrganizationHeader";
import { OrganizationTabs } from "../../components/admin/organization-details/OrganizationTabs";
import { OrganizationInfo } from "../../components/admin/organization-details/OrganizationInfo";
import { OrganizationStats } from "../../components/admin/organization-details/OrganizationStats";
import { TransactionsTable } from "../../components/admin/organization-details/TransactionsTable";
import { ContributorsTable } from "../../components/admin/organization-details/ContributorsTable";
import { Wallet } from "../../components/admin/organization-details/Wallet";
import { Campaigns } from "../../components/admin/organization-details/Campaings";
import { PaymentMethods } from "../../components/admin/organization-details/PaymentMethods";

import { EditOrganizationModal } from "../../components/admin/organizations/EditOrganizationModal";

import { CreateContributorModal } from "../../components/admin/organization-details/modals/CreateContributorModal";
import { CreateTransactionModal } from "../../components/admin/organization-details/modals/CreateTransactionModal";
import { CreateCampaignModal } from "../../components/admin/organization-details/modals/CreateCampaignModal";
import { CreatePaymentMethodModal } from "../../components/admin/organization-details/modals/CreatePaymentMethodModal";

import { useOrganizations } from "../../contexts/OrganizationContext";

export function OrganizationDetails() {
  const {
    getOrganizationById,
    getContributorsByOrganization,
    getTransactionsByOrganization,
  } = useOrganizations();

  const { id } = useParams();

  const organization = getOrganizationById(id);

  const contributors = getContributorsByOrganization(id);

  const transactions = getTransactionsByOrganization(id);

  const [tab, setTab] = useState("overview");

  // MODAIS
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContributorModal, setShowContributorModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <AdminLayout
      title="Detalhes da Organização"
      description="Visualize e gerencie a organização"
    >
      <div className="flex flex-col gap-8 w-full">
        {/* HEADER */}
        <OrganizationHeader
          organization={organization}
          onEditClick={() => setShowEditModal(true)}
        />

        <OrganizationTabs defaultTab={tab} onChange={setTab} />

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              <OrganizationInfo />
              <OrganizationStats />
            </div>

            <TransactionsTable transactions={transactions.slice(0,3)} />
          </div>
        )}

        {/* CONTRIBUTORS */}
        {tab === "contributors" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowContributorModal(true)}
                className="w-56 p-2.5 bg-blue-600 text-white rounded-[5px] font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Adicionar Contribuidor
              </button>
            </div>

            <ContributorsTable contributors={contributors} />
          </div>
        )}

        {/* WALLET */}
        {tab === "wallet" && (
          <Wallet onNewTransaction={() => setShowTransactionModal(true)} />
        )}

        {/* CAMPAIGNS */}
        {tab === "campaigns" && (
          <Campaigns onAddCampaign={() => setShowCampaignModal(true)} />
        )}

        {/* PAYMENTS */}
        {tab === "payments" && (
          <PaymentMethods onAddPayment={() => setShowPaymentModal(true)} />
        )}

        {/* MODAIS (CENTRALIZADOS AQUI) */}
        <EditOrganizationModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          organization={organization}
        />

        <CreateContributorModal
          isOpen={showContributorModal}
          onClose={() => setShowContributorModal(false)}
          onCreate={(data) => {
            console.log("contribuidor:", data);
          }}
        />

        <CreateTransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
        />

        <CreateCampaignModal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          onCreate={(data) => {
            console.log("campanha criada:", data);
          }}
        />

        <CreatePaymentMethodModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      </div>
    </AdminLayout>
  );
}
