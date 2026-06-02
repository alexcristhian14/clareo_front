import { Button } from "../../common/Button";

export function FinancialSettingsCard() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">

      <h2 className="text-lg font-bold text-slate-700 mb-6">
        Políticas Financeiras
      </h2>

      <div className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-semibold mb-2">
            Taxa da Plataforma (%)
          </label>

          <input
            type="number"
            defaultValue="2"
            className="w-full h-10 px-3 rounded-lg border"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Valor Mínimo de Transação
          </label>

          <input
            type="number"
            defaultValue="10"
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