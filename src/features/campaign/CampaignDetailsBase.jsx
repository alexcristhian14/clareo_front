import { useState, useMemo } from "react";
import { TimelineItem } from "../../components/admin/organization-details/TimelineItem";
import { Button } from "../../components/common/Button";
import { X, Pencil, Plus } from "lucide-react";
import { CreateEvidenceModal } from "../../components/common/modals/CreateEvidenceModal";
import { ReceiptPreviewModal } from "../../components/common/modals/ReceiptPreviewModal";

export function CampaignDetailsBase({
  campaign,
  mode = "admin",

  onEdit,
  onClose,

  onAddEvidence,
  onDonate,

  onViewOrganization,
  onAssociate,

  isAssociated = false,
}) {
  // =========================
  // 🔥 NORMALIZAÇÃO SEGURA (resolve bug de render)
  // =========================
  const raised = Number(campaign?.raised || 0);
  const goal = Number(campaign?.goal || 1);

  const progress = useMemo(() => {
    return (raised / goal) * 100;
  }, [raised, goal]);

  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  function handleAddEvidence() {
    setIsEvidenceOpen(true);
  }

  function handleCreateEvidence(data) {
    setTimeline((prev) => [
      {
        id: Date.now(),
        ...data,
      },
      ...prev,
    ]);
  }

  function handleOpenReceipt(file) {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  }

  const canManageCampaign = mode === "admin" || mode === "organization";

  if (!campaign) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="w-full p-2.5">
        <div className="bg-white rounded-[10px] border border-zinc-400 p-6 flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-slate-700 text-3xl font-extrabold">
              {campaign.title}
            </h1>

            <p className="text-slate-700 text-sm font-light">
              por {campaign.organization}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManageCampaign && (
              <>
                <Button variant="outline" icon={Pencil} onClick={onEdit}>
                  Editar Campanha
                </Button>

                <Button variant="danger" icon={X} onClick={onClose}>
                  Encerrar Campanha
                </Button>
              </>
            )}

            {mode === "donor" && (
              <>
                <Button variant="outline" onClick={onViewOrganization}>
                  Ver Organização
                </Button>

                {isAssociated ? (
                  <Button onClick={onDonate}>Apoiar Campanha</Button>
                ) : (
                  <Button onClick={onAssociate}>Associar-se</Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="w-full flex justify-center gap-10 flex-wrap">
        {/* ARRECADADO */}
        <div className="w-[700px] bg-white rounded-[10px] border border-zinc-400 p-4">
          <p className="text-zinc-400 font-extrabold text-sm">ARRECADADO</p>

          <div className="mt-4 flex justify-between items-end text-slate-700">
            <div className="text-xl font-bold">
              R$ {raised.toLocaleString("pt-BR")}
            </div>

            <div className="text-sm">
              de R$ {goal.toLocaleString("pt-BR")}
            </div>
          </div>

          <div className="mt-4 w-full">
            <div className="flex justify-between text-xs mb-1 text-slate-500">
              <span>Progresso</span>

              <span className="font-bold text-slate-700">
                {progress.toFixed(0)}%
              </span>
            </div>

            <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between mt-4 text-xs">
            <div className="bg-slate-100 p-2 rounded">
              Meta <br />
              <b>{Math.round(progress)}%</b>
            </div>

            <div className="bg-slate-100 p-2 rounded">
              Doadores <br />
              <b>{campaign.donors || 0}</b>
            </div>

            <div className="bg-slate-100 p-2 rounded">
              Restam <br />
              <b>{campaign.daysLeft || 0} dias</b>
            </div>
          </div>
        </div>

        {/* APOIAR */}
        {(mode === "organization" || (mode === "donor" && isAssociated)) && (
          <div className="w-[380px] bg-white rounded-[10px] border border-zinc-400 p-4">
            <p className="text-zinc-400 font-extrabold text-sm">
              APOIAR A CAMPANHA
            </p>

            <div className="flex gap-2 mt-4">
              {["25", "50", "100"].map((v) => (
                <button
                  key={v}
                  className="px-4 py-2 bg-slate-100 rounded text-sm hover:bg-slate-200 transition"
                >
                  R$ {v}
                </button>
              ))}
            </div>

            <input
              className="w-full mt-2 p-2 bg-neutral-100 rounded border"
              placeholder="Outro valor"
            />

            <button
              onClick={onDonate}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              Doar agora
            </button>
          </div>
        )}
      </div>

      {/* SOBRE */}
      <div className="bg-white rounded-[10px] border border-zinc-400 p-4">
        <p className="text-zinc-400 font-extrabold text-sm">
          SOBRE A CAMPANHA
        </p>

        <p className="text-sm text-stone-900 mt-2">
          {campaign.description}
        </p>
      </div>

      {/* ORGANIZAÇÃO */}
      {mode === "donor" && (
        <div className="bg-white rounded-[10px] border border-zinc-400 p-4">
          <p className="text-zinc-400 font-extrabold text-sm">
            ORGANIZAÇÃO RESPONSÁVEL
          </p>

          <div className="mt-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800">
                {campaign.organization}
              </h3>

              <p className="text-sm text-zinc-500">
                Organização responsável pela campanha
              </p>
            </div>

            <Button variant="outline" onClick={onViewOrganization}>
              Ver Organização
            </Button>
          </div>
        </div>
      )}

      {/* TIMELINE */}
      <div className="bg-white rounded-[10px] border border-zinc-400 shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-zinc-400 text-sm font-extrabold tracking-wide">
              LINHA DO TEMPO
            </h2>

            <p className="text-stone-900 text-xs font-light mt-1">
              Atualizações da campanha em ordem cronológica
            </p>
          </div>

          {canManageCampaign && (
            <Button variant="primary" icon={Plus} onClick={handleAddEvidence}>
              Nova Evidência
            </Button>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {timeline.map((item) => (
            <TimelineItem
              key={item.id}
              {...item}
              onOpenFile={handleOpenReceipt}
            />
          ))}
        </div>
      </div>

      <CreateEvidenceModal
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        onCreate={handleCreateEvidence}
        mode={mode}
      />

      <ReceiptPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={selectedFile}
      />
    </div>
  );
}