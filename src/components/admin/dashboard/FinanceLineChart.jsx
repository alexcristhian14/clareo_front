import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useOrganizations } from "../../../contexts/OrganizationContext";

export function FinanceLineChart() {
  const { getRevenueChartData } = useOrganizations();

  const data = getRevenueChartData();

  return (
    <div className="bg-white border rounded-[10px] p-5">
      <h2 className="text-lg font-bold mb-4">Receita ao longo do tempo</h2>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
