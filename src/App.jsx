import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";

// imports do Admin

import { Dashboard } from "./pages/admin/Dashboard";
import { Organizations } from "./pages/admin/Organizations";
import { OrganizationDetails } from "./pages/admin/OrganizationDetails";
import { Contributors } from "./pages/admin/Contributors";
import { Settings } from "./pages/admin/Settings";
import { CampaignDetails } from "./pages/admin/CampaignDetais";

// imports da Organização

import { Dashboard as OrganizationDashboard } from "./pages/organization/Dashboard";
import { Campaigns as OrganizationCampaigns } from "./pages/organization/Campaigns";
import { CampaignDetails as OrganizationCampaignDetails } from "./pages/organization/CampaignDetails";

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
      </Routes>
    </BrowserRouter>
  );
}
