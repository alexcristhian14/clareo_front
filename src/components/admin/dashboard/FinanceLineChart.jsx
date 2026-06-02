import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Fev", revenue: 18000 },
  { month: "Mar", revenue: 24000 },
  { month: "Abr", revenue: 31000 },
  { month: "Mai", revenue: 28000 },
  { month: "Jun", revenue: 36000 },
];

export function FinanceLineChart() {
  return (
    <div className="bg-white border border-zinc-300 rounded-[10px] p-5 shadow">
      <h2 className="text-lg font-bold mb-4">
        Receita ao longo do tempo
      </h2>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}