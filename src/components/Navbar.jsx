import { Search, Bell, ChevronDown } from "lucide-react";

export function Navbar({ title, description }) {
  return (
    <header className="w-full h-26 px-8 py-4 bg-white border-b border-zinc-300 flex items-center justify-between">

      {/* LEFT */}
      <div className="flex flex-col gap-1">
        <h1 className="text-slate-700 text-3xl font-extrabold font-montserrat">
          {title}
        </h1>

        <p className="text-slate-700 text-sm font-medium font-montserrat">
          {description}
        </p>
      </div>

      {/* CENTER */}
      <div className="w-[450px] h-11 px-4 bg-white rounded-lg border-2 border-slate-700 flex items-center gap-3">
        <Search className="text-slate-700" size={20} />

        <input
          type="text"
          placeholder="Pesquisar..."
          className="w-full outline-none text-slate-700 text-sm"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        <div className="flex items-center gap-2">
          <Bell className="text-slate-700" size={24} />
        </div>

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-slate-700 rounded-2xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              AC
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-slate-700 text-sm font-bold">
              Alex Cristhian
            </span>

            <span className="text-slate-700 text-[10px] font-light">
              alex@gmail.com
            </span>
          </div>

          <ChevronDown className="text-slate-700" size={18} />

        </div>
      </div>
    </header>
  );
}