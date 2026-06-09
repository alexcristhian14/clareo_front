import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { OrgRoute } from "./routes/OrgRoute";

import { Login } from "./pages/Login";
import { Vitrine } from "./pages/Vitrine";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { NewOrganization } from "./pages/NewOrganization";
import { MinhasInstituicoes } from "./pages/MinhasInstituicoes";

import { Dashboard } from "./pages/Dashboard";
import { Campaigns } from "./pages/Campaigns";
import { CampaignNew } from "./pages/CampaignNew";
import { CampaignDetail } from "./pages/CampaignDetail";
import { Expenses } from "./pages/Expenses";
import { ExpenseNew } from "./pages/ExpenseNew";
import { ExpenseDetail } from "./pages/ExpenseDetail";
import { OrgExpenseNew } from "./pages/OrgExpenseNew";
import { OrgExpenseDetail } from "./pages/OrgExpenseDetail";
import { Contributors } from "./pages/Contributors";
import { ContributorDetail } from "./pages/ContributorDetail";
import { Wallet } from "./pages/Wallet";
import { Financas } from "./pages/Financas";
import { Memberships } from "./pages/Memberships";
import { RecurringDonations } from "./pages/RecurringDonations";
import { Settings } from "./pages/Settings";
import { PrestacaoContas } from "./pages/PrestacaoContas";

import { PublicDonate } from "./pages/PublicDonate";
import { PublicAccountability } from "./pages/PublicAccountability";
import { PublicInstitution } from "./pages/PublicInstitution";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Vitrine />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route
            path="/minhas-instituicoes"
            element={
              <ProtectedRoute>
                <MinhasInstituicoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carteira"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizacoes/nova"
            element={
              <ProtectedRoute>
                <NewOrganization />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <OrgRoute>
                <Dashboard />
              </OrgRoute>
            }
          />

          <Route
            path="/campaigns"
            element={
              <OrgRoute>
                <Campaigns />
              </OrgRoute>
            }
          />
          <Route
            path="/campaigns/new"
            element={
              <OrgRoute>
                <CampaignNew />
              </OrgRoute>
            }
          />
          <Route
            path="/campaigns/:campaignId"
            element={
              <OrgRoute>
                <CampaignDetail />
              </OrgRoute>
            }
          />

          <Route
            path="/campaigns/:campaignId/expenses"
            element={
              <OrgRoute>
                <Expenses />
              </OrgRoute>
            }
          />
          <Route
            path="/campaigns/:campaignId/expenses/new"
            element={
              <OrgRoute>
                <ExpenseNew />
              </OrgRoute>
            }
          />
          <Route
            path="/campaigns/:campaignId/expenses/:expenseId"
            element={
              <OrgRoute>
                <ExpenseDetail />
              </OrgRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <OrgRoute>
                <PrestacaoContas />
              </OrgRoute>
            }
          />
          <Route
            path="/expenses/new"
            element={
              <OrgRoute>
                <OrgExpenseNew />
              </OrgRoute>
            }
          />
          <Route
            path="/expenses/:expenseId"
            element={
              <OrgRoute>
                <OrgExpenseDetail />
              </OrgRoute>
            }
          />

          <Route
            path="/contributors"
            element={
              <OrgRoute>
                <Contributors />
              </OrgRoute>
            }
          />
          <Route
            path="/contributors/:contributorId"
            element={
              <OrgRoute>
                <ContributorDetail />
              </OrgRoute>
            }
          />
          <Route
            path="/contributors/:contributorId/recurring"
            element={
              <OrgRoute>
                <RecurringDonations />
              </OrgRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <OrgRoute>
                <Wallet />
              </OrgRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <OrgRoute>
                <Financas />
              </OrgRoute>
            }
          />

          <Route
            path="/minhas-associacoes"
            element={
              <ProtectedRoute>
                <Memberships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/minhas-doacoes-recorrentes"
            element={
              <ProtectedRoute>
                <RecurringDonations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestacao-contas"
            element={
              <OrgRoute>
                <PrestacaoContas />
              </OrgRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <OrgRoute>
                <Settings />
              </OrgRoute>
            }
          />

          <Route
            path="/public/donate/campaign/:campaignId"
            element={<PublicDonate />}
          />
          <Route
            path="/public/donate/:campaignId"
            element={<PublicDonate />}
          />
          <Route
            path="/public/donate/organization/:organizationId"
            element={<PublicDonate />}
          />
          <Route
            path="/public/accountability/:campaignId"
            element={<PublicAccountability />}
          />
          <Route
            path="/public/institutions/:id"
            element={<PublicInstitution />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
