import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Ativas", value: 18 },
  { name: "Pausadas", value: 5 },
  { name: "Finalizadas", value: 12 },
];

const COLORS = ["#2563eb", "#f59e0b", "#10b981"];

export function CampaignPieChart() {
  return (
    <div className="bg-white border border-zinc-300 rounded-[10px] p-5 shadow">
      <h2 className="text-lg font-bold mb-4">Campanhas</h2>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              label
              outerRadius={100}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}