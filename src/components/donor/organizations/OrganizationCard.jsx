import { Button } from "../../common/Button";

export function OrganizationCard({
  organization,
  onAssociate,
  onDetails,
}) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.12)] p-5 flex flex-col justify-between">

      <div>

        <div className="w-14 h-14 rounded-full bg-slate-100 mb-4" />

        <h3 className="text-lg font-bold text-slate-800">
          {organization.name}
        </h3>

        <p className="text-sm text-zinc-500 mt-2">
          {organization.description}
        </p>

        <div className="flex gap-6 mt-5 text-sm">

          <div>
            <p className="text-zinc-400">
              Campanhas
            </p>

            <p className="font-bold">
              {organization.campaigns}
            </p>
          </div>

          <div>
            <p className="text-zinc-400">
              Apoiadores
            </p>

            <p className="font-bold">
              {organization.supporters}
            </p>
          </div>

        </div>

      </div>

      <div className="flex gap-2 mt-6">

        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onDetails(organization.id)}
        >
          Ver detalhes
        </Button>

        {organization.associated ? (
          <Button
            className="flex-1"
            disabled
          >
            Associado ✓
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={() => onAssociate(organization.id)}
          >
            Associar-se
          </Button>
        )}

      </div>

    </div>
  );
}