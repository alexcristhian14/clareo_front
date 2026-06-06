import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { useOrganizations } from "../../../contexts/OrganizationContext";

export function CampaignPieChart() {
  const { getCampaignStatusData } = useOrganizations();

  const data = getCampaignStatusData();

  return (
    <div className="bg-white border rounded-[10px] p-5">
      <h2 className="text-lg font-bold mb-4">Campanhas</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="value" label outerRadius={100} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
