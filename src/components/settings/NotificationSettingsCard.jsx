import { Button } from "../Button";

export function NotificationSettingsCard() {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">

      <h2 className="text-lg font-bold text-slate-700 mb-6">
        Notificações
      </h2>

      <div className="flex flex-col gap-4">

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
          />

          Nova organização cadastrada
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
          />

          Nova campanha criada
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
          />

          Falhas de pagamento
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            defaultChecked
          />

          Relatório semanal
        </label>

      </div>

      <div className="flex justify-end mt-6">
        <Button>
          Salvar Alterações
        </Button>
      </div>

    </div>
  );
}