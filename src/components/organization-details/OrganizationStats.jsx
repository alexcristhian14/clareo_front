export  function OrganizationStats() {
  return (
    <div className="w-full xl:w-105 flex flex-col gap-4">

      <Stat title="Total membros" value="24" />
      <Stat title="Total movimentado" value="R$ 45.000" />
      <Stat title="Total transações" value="1.245" />

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white border rounded-xl shadow p-4">
      <div className="text-slate-700 font-bold">{title}</div>
      <div className="text-[#4269B4] text-xl font-black">{value}</div>
    </div>
  );
}