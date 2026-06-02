import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 2500 },
  { month: "Fev", value: 4100 },
  { month: "Mar", value: 3900 },
  { month: "Abr", value: 5600 },
  { month: "Mai", value: 7200 },
  { month: "Jun", value: 8750 },
];

export function RevenueLineChart() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">
      <h2 className="font-bold text-lg mb-6">
        Evolução da Arrecadação
      </h2>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}