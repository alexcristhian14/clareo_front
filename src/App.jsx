import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";

// Admin

import { Dashboard } from "./pages/admin/Dashboard";
import { Organizations } from "./pages/admin/Organizations";
import { OrganizationDetails } from "./pages/admin/OrganizationDetails";
import { Contributors } from "./pages/admin/Contributors";
import { Settings } from "./pages/admin/Settings";
import { CampaignDetails } from "./pages/admin/CampaignDetais";

// Organization

import { Dashboard as OrganizationDashboard } from "./pages/organization/Dashboard";
import { Campaigns as OrganizationCampaigns } from "./pages/organization/Campaigns";
import { CampaignDetails as OrganizationCampaignDetails } from "./pages/organization/CampaignDetails";
import { Contributors as OrganizationContributors } from "./pages/organization/Contributors";
import { Settings as OrganizationSettings } from "./pages/organization/Settings";

// Donor

import { Feed as DonorFeed } from "./pages/donor/Feed";
import { Campaigns as DonorCampaigns } from "./pages/donor/Campaigns";
import { CampaignDetails as DonorCampaignDetails } from "./pages/donor/CampaignDetails";
import { OrganizationDetails as DonorOrganizationDetails } from "./pages/donor/OrganizationDetails";
import { Organizations as DonorOrganizations } from "./pages/donor/Organizations";
import { Wallet as DonorWallet } from "./pages/donor/Wallet";
import { Settings as DonorSettings } from "./pages/donor/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ADMIN */}

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/admin/organizations" element={<Organizations />} />

        <Route
          path="/admin/organizations/:id"
          element={<OrganizationDetails />}
        />

        <Route path="/admin/contributors" element={<Contributors />} />

        <Route path="/admin/settings" element={<Settings />} />

        <Route
          path="/admin/organizations/:orgId/campaigns/:campaignId"
          element={<CampaignDetails />}
        />

        {/* ORGANIZATION */}

        <Route
          path="/organization/dashboard"
          element={<OrganizationDashboard />}
        />

        <Route
          path="/organization/campaigns"
          element={<OrganizationCampaigns />}
        />

        <Route
          path="/organization/campaigns/:campaignId"
          element={<OrganizationCampaignDetails />}
        />

        <Route
          path="/organization/contributors"
          element={<OrganizationContributors />}
        />

        <Route
          path="/organization/settings"
          element={<OrganizationSettings />}
        />

        {/* DONOR */}

        <Route path="/donor/feed" element={<DonorFeed />} />

        <Route path="/donor/campaigns" element={<DonorCampaigns />} />

        <Route path="/donor/organizations" element={<DonorOrganizations />} />

        <Route
          path="/donor/campaigns/:campaignId"
          element={<DonorCampaignDetails />}
        />

        <Route
          path="/donor/organizations/:organizationId"
          element={<DonorOrganizationDetails />}
        />

        <Route path="/donor/wallet" element={<DonorWallet />} />

        <Route path="/donor/settings" element={<DonorSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
