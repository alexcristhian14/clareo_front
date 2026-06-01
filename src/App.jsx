import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Organizations } from "./pages/Organizations";
import { OrganizationDetails } from "./pages/OrganizationDetails";
import { Dashboard } from "./pages/Dashboard";
import { Contributors } from "./pages/Contributors";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/organizations" element={<Organizations />} />

        <Route path="/organizations/:id" element={<OrganizationDetails />} />

        <Route path="/contributors" element={<Contributors />} />

        <Route path="/settings" element={<Settings />} />

      </Routes>
    </BrowserRouter>
  );
}