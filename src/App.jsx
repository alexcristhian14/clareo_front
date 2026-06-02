import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";

import { Dashboard } from "./pages/admin/Dashboard";
import { Organizations } from "./pages/admin/Organizations";
import { OrganizationDetails } from "./pages/admin/OrganizationDetails";
import { Contributors } from "./pages/admin/Contributors";
import { Settings } from "./pages/admin/Settings";
import { CampaignDetails } from "./pages/admin/CampaingDetais";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/organizations" element={<Organizations />} />

        <Route path="/organizations/:id" element={<OrganizationDetails />} />

        <Route path="/contributors" element={<Contributors />} />

        <Route path="/settings" element={<Settings />} />

        <Route
          path="/organizations/:orgId/campaigns/:campaignId"
          element={<CampaignDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}
