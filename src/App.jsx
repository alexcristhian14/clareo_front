import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "./pages/Login";
import { Organizations } from "./pages/Organizations";
import { OrganizationDetails } from "./pages/OrganizationDetails";
import { Dashboard } from "./pages/Dashboard";
import { Contributors } from "./pages/Contributors";
import { Settings } from "./pages/Settings";
import { CampaignDetails } from "./pages/CampaingDetais";

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
