import { Button } from "../../common/Button";

export function GeneralSettingsCard() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">

      <h2 className="text-lg font-bold text-slate-700 mb-6">
        Configurações Gerais
      </h2>

      <div className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Nome da Plataforma
          </label>

          <input
            type="text"
            defaultValue="Clareo"
            className="w-full h-10 px-3 rounded-lg border"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            E-mail de Suporte
          </label>

          <input
            type="email"
            defaultValue="suporte@clareo.com"
            className="w-full h-10 px-3 rounded-lg border"
          />
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <Button>
          Salvar Alterações
        </Button>
      </div>

    </div>
  );
}