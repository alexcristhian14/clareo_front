import { Pencil, Trash2 } from "lucide-react";

// 🔥 MOCK (depois vem da API)
const mockContributors = [
  {
    name: "João Felipe Lima",
    email: "joaofelipe@org.com",
    role: "Admin",
    date: "14/01/2026",
  },
  {
    name: "Maria Alice Pereira",
    email: "marialice@org.com",
    role: "Gestor",
    date: "14/01/2025",
  },
  {
    name: "Rafael Sousa",
    email: "rafaelsousa@org.com",
    role: "Viewer",
    date: "14/06/2024",
  },
  {
    name: "Luísa Lima",
    email: "luisalima@org.com",
    role: "Finance",
    date: "25/12/2021",
  },
];

export function ContributorsTable({
  contributors = mockContributors,
}) {
  return (
    <div className="
      bg-white rounded-[10px]
      shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]
      outline outline-1 outline-zinc-400
      font-montserrat
      overflow-hidden
    ">
      {/* HEADER */}
      <div className="px-5 pt-5 text-slate-700 text-lg font-extrabold">
        Contribuidores
      </div>

      {/* TABLE HEADER */}
      <div className="
        mt-4 mx-5 h-10 px-4
        bg-slate-100 rounded-[10px]
        flex items-center justify-between
        text-slate-700 text-base font-medium
      ">
        <span className="w-48">NOME</span>
        <span className="w-60">EMAIL</span>
        <span className="w-28">ROLE</span>
        <span className="w-28">DATA</span>
        <span className="w-20 text-center">AÇÕES</span>
      </div>

      {/* ROWS */}
      <div className="flex flex-col pb-4">
        {contributors.map((c, index) => (
          <div
            key={index}
            className="
              mx-5 mt-2 h-11
              bg-white rounded-[5px]
              outline outline-1 outline-slate-700/20
              flex items-center justify-between px-4
            "
          >
            <span className="w-48 text-black text-base">
              {c.name}
            </span>

            <span className="w-60 text-black text-base">
              {c.email}
            </span>

            <span className="w-28 text-black text-base">
              {c.role}
            </span>

            <span className="w-28 text-black text-base">
              {c.date}
            </span>

            {/* ACTIONS */}
            <div className="w-20 flex justify-center gap-2">
              <button className="text-[#4269B4]">
                <Pencil size={18} />
              </button>

              <button className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}