import { Database, RefreshCcw, HardDrive } from "lucide-react";

import { Button } from "../../common/Button";

export function AdminActionsCard() {
  return (
    <div className="bg-white rounded-[10px] border border-red-200 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)]">

      <h2 className="text-lg font-bold text-red-500 mb-6">
        Área Administrativa
      </h2>

      <div className="flex flex-wrap gap-4">

        <Button
          variant="outline"
          icon={Database}
        >
          Exportar Backup
        </Button>

        <Button
          variant="outline"
          icon={RefreshCcw}
        >
          Limpar Cache
        </Button>

        <Button
          variant="danger"
          icon={HardDrive}
        >
          Restaurar Backup
        </Button>

      </div>

    </div>
  );
}