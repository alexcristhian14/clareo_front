import { useParams } from "react-router-dom";

import { TimelineItem } from "../../components/admin/organization-details/TimelineItem";
import { Button } from "../../components/common/Button";

import { X, Pencil, Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";

export function CampaignDetails() {
  const { orgId, campaignId } = useParams();

  const campaign = {
    title: "Acompanhamento Médico Itinerante",
    organization: "Instituto Saúde Viva",
    raised: 25000,
    goal: 50000,
    donors: 142,
    daysLeft: 18,
    description:
      "Equipe médica volante para atender comunidades rurais sem acesso a postos de saúde.",
  };

  const progress = (campaign.raised / campaign.goal) * 100;

  return (
    <AppLayout
      title={campaign.organization}
      description="Detalhamento da campanha"
    >
      <div className="w-full flex flex-col gap-6">
        {/* HEADER BANNER */}
        <div className="w-full p-2.5">
          <div className="bg-white rounded-[10px] border border-zinc-400 p-6 flex justify-between items-start">
            {/* TITULO */}
            <div className="flex flex-col">
              <h1 className="text-slate-700 text-3xl font-extrabold">
                {campaign.title}
              </h1>
              <p className="text-slate-700 text-sm font-light">
                por {campaign.organization}
              </p>
            </div>

            {/* AÇÕES */}
            <div className="flex items-center gap-3">
              <Button variant="outline" icon={Pencil}>
                Editar Campanha
              </Button>

              <Button variant="danger" icon={X}>
                Encerrar Campanha
              </Button>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="w-full flex justify-center gap-10 flex-wrap">
          {/* ARRECADADO */}
          <div className="w-[800px] bg-white rounded-[10px] border border-zinc-400 p-4">
            <p className="text-zinc-400 font-extrabold text-sm">ARRECADADO</p>

            {/* VALORES */}
            <div className="mt-4 flex justify-between items-end text-slate-700">
              <div className="text-xl font-bold">
                R$ {campaign.raised.toLocaleString("pt-BR")}
              </div>

              <div className="text-sm">
                de R$ {campaign.goal.toLocaleString("pt-BR")}
              </div>
            </div>

            {/* PROGRESSO */}
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

            {/* INFO BOXES */}
            <div className="flex justify-between mt-4 text-xs">
              <div className="bg-slate-100 p-2 rounded">
                Meta <br />
                <b>{Math.round(progress)}%</b>
              </div>

              <div className="bg-slate-100 p-2 rounded">
                Doadores <br />
                <b>{campaign.donors}</b>
              </div>

              <div className="bg-slate-100 p-2 rounded">
                Restam <br />
                <b>{campaign.daysLeft} dias</b>
              </div>
            </div>
          </div>

          {/* APOIO */}
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

            <div className="mt-4">
              <p className="text-xs font-bold">Outro valor (R$)</p>
              <input
                className="w-full mt-2 p-2 bg-neutral-100 rounded border"
                placeholder="R$ 0,00"
              />
            </div>

            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
              Doar agora
            </button>
          </div>
        </div>

        {/* SOBRE */}
        <div className="bg-white rounded-[10px] border border-zinc-400 p-4">
          <p className="text-zinc-400 font-extrabold text-sm">
            SOBRE A CAMPANHA
          </p>

          <p className="text-sm text-stone-900 mt-2">{campaign.description}</p>
        </div>

        {/* TIMELINE */}
        <div className="bg-white rounded-[10px] border border-zinc-400 shadow p-6">
          {/* HEADER + ACTIONS */}
          <div className="flex justify-between items-start">
            {/* TEXTO */}
            <div>
              <h2 className="text-zinc-400 text-sm font-extrabold tracking-wide">
                LINHA DO TEMPO
              </h2>

              <p className="text-stone-900 text-xs font-light mt-1">
                Atualizações da campanha em ordem cronológica
              </p>
            </div>

            {/* AÇÕES */}
            <div className="flex items-center gap-3">
              <Button variant="primary" icon={Plus}>
                Nova Movimentação
              </Button>

              <Button variant="outline" icon={Pencil}>
                Editar Movimentações
              </Button>
            </div>
          </div>

          {/* LISTA */}
          <div className="mt-6 flex flex-col gap-6">
            <TimelineItem
              type="expense"
              title="Compra de gasolina para o veículo."
              description="Gasolina adquirida no posto Ipiranga"
              value="- R$ 585,30"
              date="25 de maio de 2026"
              receiptText="Ver comprovante"
            />

            <TimelineItem
              type="expense"
              title="Esterilização de materiais"
              description="Materiais esterilizados na empresa Esterilização LTDA"
              value="- R$ 1000,30"
              date="20 de maio de 2026"
              receiptText="Ver comprovante"
            />

            <TimelineItem
              type="milestone"
              title="Marco: 50% da meta alcançada"
              description="Atingimos 50% da meta. Gratidão aos doadores!"
              date="20 de maio de 2026"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
