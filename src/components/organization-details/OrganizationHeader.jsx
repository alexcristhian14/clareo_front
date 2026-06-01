import { ActionButtons } from "./ActionButtons";

export  function OrganizationHeader() {
  return (
    <div className="flex flex-col gap-4 w-full">

      <div className="text-sm text-slate-700 font-medium">
        Organizações
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 px-2">

        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-700">
            Instituto Saúde Viva
          </h1>

          <span className="text-green-500 font-medium text-sm">
            Ativa
          </span>
        </div>

        <ActionButtons />

      </div>

    </div>
  );
}