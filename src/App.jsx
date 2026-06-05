import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔐 AUTH + WALLET + CAMPAIGNS
import { AuthProvider } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import { CampaignProvider } from "./contexts/CampaignContext";
import { AssociationProvider } from "./contexts/AssociationContext";
import { OrganizationProvider } from "./contexts/OrganizationContext";

// 🛡 PROTECTED ROUTE
import { ProtectedRoute } from "./routes/ProtectedRoute";

// 🛑 LOGIN
import { Login } from "./pages/Login";

// =======================
// ADMIN
// =======================
import { Dashboard } from "./pages/admin/Dashboard";
import { Organizations } from "./pages/admin/Organizations";
import { OrganizationDetails } from "./pages/admin/OrganizationDetails";
import { Contributors } from "./pages/admin/Contributors";
import { Settings } from "./pages/admin/Settings";
import { CampaignDetails } from "./pages/admin/CampaignDetais";

// =======================
// ORGANIZATION
// =======================
import { Dashboard as OrgDashboard } from "./pages/organization/Dashboard";
import { Campaigns as OrgCampaigns } from "./pages/organization/Campaigns";
import { CampaignDetails as OrgCampaignDetails } from "./pages/organization/CampaignDetails";
import { Contributors as OrgContributors } from "./pages/organization/Contributors";
import { Settings as OrgSettings } from "./pages/organization/Settings";

// =======================
// DONOR
// =======================
import { Feed as DonorFeed } from "./pages/donor/Feed";
import { Campaigns as DonorCampaigns } from "./pages/donor/Campaigns";
import { CampaignDetails as DonorCampaignDetails } from "./pages/donor/CampaignDetails";
import { OrganizationDetails as DonorOrganizationDetails } from "./pages/donor/OrganizationDetails";
import { Organizations as DonorOrganizations } from "./pages/donor/Organizations";
import { Wallet as DonorWallet } from "./pages/donor/Wallet";
import { Settings as DonorSettings } from "./pages/donor/Settings";

export default function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <CampaignProvider>
          <AssociationProvider>
            <OrganizationProvider>
              <BrowserRouter>
                <Routes>
                  {/* ================= LOGIN ================= */}
                  <Route path="/" element={<Login />} />

                  {/* ================= ADMIN ================= */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/organizations"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Organizations />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/organizations/:id"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <OrganizationDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/contributors"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Contributors />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/organizations/:orgId/campaigns/:campaignId"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <CampaignDetails />
                      </ProtectedRoute>
                    }
                  />

                  {/* ================= ORGANIZATION ================= */}
                  <Route
                    path="/organization/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["organization"]}>
                        <OrgDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/organization/campaigns"
                    element={
                      <ProtectedRoute allowedRoles={["organization"]}>
                        <OrgCampaigns />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/organization/campaigns/:campaignId"
                    element={
                      <ProtectedRoute allowedRoles={["organization"]}>
                        <OrgCampaignDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/organization/contributors"
                    element={
                      <ProtectedRoute allowedRoles={["organization"]}>
                        <OrgContributors />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/organization/settings"
                    element={
                      <ProtectedRoute allowedRoles={["organization"]}>
                        <OrgSettings />
                      </ProtectedRoute>
                    }
                  />

                  {/* ================= DONOR ================= */}
                  <Route
                    path="/donor/feed"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorFeed />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/campaigns"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorCampaigns />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/organizations"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorOrganizations />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/campaigns/:campaignId"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorCampaignDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/organizations/:organizationId"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorOrganizationDetails />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/wallet"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorWallet />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/donor/settings"
                    element={
                      <ProtectedRoute allowedRoles={["donor"]}>
                        <DonorSettings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </OrganizationProvider>
          </AssociationProvider>
        </CampaignProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
