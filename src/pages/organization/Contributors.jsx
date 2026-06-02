import OrganizationLayout from "../../layouts/OrganizationLayout";

export function Contributors() {
  const contributors = [
    {
      id: 1,
      name: "Carlos Silva",
      email: "carlos@email.com",
      totalDonated: 350,
      campaigns: 2,
      lastDonation: "2026-05-20",
    },
    {
      id: 2,
      name: "Maria Souza",
      email: "maria@email.com",
      totalDonated: 1200,
      campaigns: 5,
      lastDonation: "2026-06-01",
    },
  ];

  return (
    <OrganizationLayout
      title="Contribuidores"
      description="Pessoas que apoiaram suas campanhas"
    >
      <div className="bg-white rounded-[10px] border border-zinc-300 overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-5 px-6 py-4 bg-slate-100 font-semibold text-slate-800">
          <span>Nome</span>
          <span>Email</span>
          <span>Total doado</span>
          <span>Campanhas</span>
          <span>Última doação</span>
        </div>

        {/* LISTA */}
        {contributors.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-5 px-6 py-4 border-t items-center"
          >
            <span className="font-medium">{c.name}</span>

            <span className="text-sm text-zinc-600">
              {c.email}
            </span>

            <span className="text-green-600 font-semibold">
              R$ {c.totalDonated.toLocaleString("pt-BR")}
            </span>

            <span>{c.campaigns}</span>

            <span className="text-sm text-zinc-500">
              {c.lastDonation}
            </span>
          </div>
        ))}

      </div>
    </OrganizationLayout>
  );
}