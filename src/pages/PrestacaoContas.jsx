import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents } from "../utils/format";
import { ExternalLink, Plus, FileText } from "lucide-react";
import { toast } from "sonner";

export function PrestacaoContas() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) {
        navigate("/organizacoes/nova");
        return;
      }

      const { data: dashData } = await api.get(`/organizations/${orgId}/dashboard`);
      const allCampaigns = dashData?.campaigns || [];

      const enriched = await Promise.all(
        allCampaigns.map(async (c) => {
          try {
            const { data: report } = await api.get(
              `/public/campaigns/${c.campaign_id}/accountability`
            );
            return {
              ...c,
              accountability: report?.summary || null,
              expenses: report?.expenses || [],
            };
          } catch {
            return { ...c, accountability: null, expenses: [] };
          }
        })
      );

      setCampaigns(enriched);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppLayout title="Prestação de Contas">
      <div className="mb-6">
        <Button onClick={() => navigate("/campaigns/new")}>
          <Plus size={16} /> Nova Campanha
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <FileText size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 mb-4">
            Nenhuma campanha encontrada. Crie uma campanha para começar a prestar contas.
          </p>
          <Button onClick={() => navigate("/campaigns/new")}>
            <Plus size={16} /> Criar Campanha
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map((c) => {
            const acc = c.accountability;
            return (
              <div
                key={c.campaign_id}
                className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{c.name}</h3>
                    <p className="text-sm text-zinc-500">
                      {c.status} · Meta: {formatCents(c.goal_cents)} · Arrecadado: {formatCents(c.raised_cents)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/campaigns/${c.campaign_id}/expenses`)}
                    >
                      <FileText size={14} /> Despesas
                    </Button>
                    <a
                      href={`/public/accountability/${c.campaign_id}`}
                      target="_blank"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ExternalLink size={14} />
                      Ver Relatório
                    </a>
                  </div>
                </div>

                {acc ? (
                  <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500">Arrecadado</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCents(acc.total_raised)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Gasto</p>
                      <p className="text-lg font-bold text-red-500">
                        {formatCents(acc.total_spent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Saldo</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCents(acc.balance)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Despesas</p>
                      <p className="text-lg font-bold text-slate-800">
                        {acc.expense_count || 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <p className="text-sm text-zinc-400">
                      Nenhuma despesa registrada ainda.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
