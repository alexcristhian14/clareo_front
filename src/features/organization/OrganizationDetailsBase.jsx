import { Button } from "../../components/common/Button";

export function OrganizationDetailsBase({
  organization,
  campaigns = [],
  isAssociated = false,
  onAssociate,
  onUnassociate,
  onOpenCampaign,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* HEADER */}
      <div className="bg-white rounded-[10px] border border-zinc-300 p-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">
            {organization.name}
          </h1>

          <p className="text-slate-500 mt-2">{organization.description}</p>
        </div>

        {isAssociated ? (
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded font-semibold">
              Associado ✓
            </div>

            <Button
              onClick={onUnassociate}
              className="bg-red-500 hover:bg-red-600"
            >
              Cancelar associação
            </Button>
          </div>
        ) : (
          <Button onClick={onAssociate}>Associar-se</Button>
        )}
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
          <p className="text-xs text-zinc-500 uppercase">Campanhas</p>

          <p className="text-2xl font-bold mt-2">
            {organization.campaignsCount}
          </p>
        </div>

        <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
          <p className="text-xs text-zinc-500 uppercase">Apoiadores</p>

          <p className="text-2xl font-bold mt-2">
            {organization.supporters}
          </p>
        </div>

        <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
          <p className="text-xs text-zinc-500 uppercase">Arrecadado</p>

          <p className="text-2xl font-bold mt-2">
            R$ {organization.raised.toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="bg-white rounded-[10px] border border-zinc-300 p-5">
          <p className="text-xs text-zinc-500 uppercase">Atuação</p>

          <p className="text-2xl font-bold mt-2">
            {organization.years} anos
          </p>
        </div>
      </div>

      {/* SOBRE */}
      <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
        <p className="text-zinc-400 text-sm font-extrabold">
          SOBRE A ORGANIZAÇÃO
        </p>

        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          {organization.description}
        </p>
      </div>

      {/* CAMPANHAS */}
      <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
        <p className="text-zinc-400 text-sm font-extrabold mb-5">
          CAMPANHAS ATIVAS
        </p>

        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100;

            return (
              <div
                key={campaign.id}
                className="border border-zinc-200 rounded-[10px] p-4"
              >
                <h3 className="font-bold text-slate-800">
                  {campaign.title}
                </h3>

                <p className="text-xs text-zinc-500 mt-2">
                  R$ {campaign.raised.toLocaleString("pt-BR")} de R${" "}
                  {campaign.goal.toLocaleString("pt-BR")}
                </p>

                <div className="w-full h-2 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                {onOpenCampaign && (
                  <Button
                    className="mt-4 w-full"
                    onClick={() => onOpenCampaign(campaign.id)}
                  >
                    Ver campanha
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}