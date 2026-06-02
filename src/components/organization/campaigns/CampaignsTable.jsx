import { Eye, Pencil, Trash2, ChevronRight } from "lucide-react";

import { Button } from "../../common/Button";

export function CampaignsTable({ campaigns }) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] overflow-hidden">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_220px] px-8 py-4 bg-slate-100 font-semibold text-slate-800">
        <span>NOME</span>
        <span>META</span>
        <span>ARRECADADO</span>
        <span>PROGRESSO</span>
        <span>INÍCIO</span>
        <span>STATUS</span>
        <span className="text-center">AÇÕES</span>
      </div>

      {campaigns.map((campaign) => {
        const progress = (campaign.raised / campaign.goal) * 100;

        return (
          <div
            key={campaign.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_220px] px-8 py-4 border-t items-center"
          >
            <span>{campaign.name}</span>

            <span>R$ {campaign.goal.toLocaleString()}</span>

            <span>R$ {campaign.raised.toLocaleString()}</span>

            <span>{progress.toFixed(0)}%</span>

            <span>{campaign.startDate}</span>

            <span>
              <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                {campaign.status}
              </span>
            </span>

            <div className="flex justify-center gap-2">
              <button
                className="flex items-center gap-1 text-blue-600 font-semibold"
              >
                Ver detalhes
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
