import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import {
  formatCents,
  formatDate,
  relativeTime,
  statusColor,
  statusLabel,
} from "../utils/format";
import { ArrowLeft, Copy, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("transactions");

  async function loadCampaign() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data: c } = await api.get(`/organizations/${orgId}/campaigns/${campaignId}`);
      setCampaign(c);

      const { data: tx } = await api.get(`/campaigns/${campaignId}/transactions?limit=50`);
      setTransactions(Array.isArray(tx) ? tx : []);
    } catch {
      toast.error("Erro ao carregar campanha");
      navigate("/campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  function handleCopyPublicLink() {
    const link = `${window.location.origin}/public/donate/${campaignId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  }

  if (loading) {
    return (
      <AppLayout title="Carregando...">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-96" />
          <div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!campaign) return null;

  const pct = campaign.goal_cents
    ? ((campaign.raised_cents || 0) / campaign.goal_cents) * 100
    : 0;

  const tabs = [
    { key: "transactions", label: "Transações" },
    { key: "expenses", label: "Despesas" },
    { key: "public", label: "Link Público" },
  ];

  return (
    <AppLayout title={campaign.name}>
      <button
        onClick={() => navigate("/campaigns")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Campanhas
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Meta</p>
          <p className="text-lg font-bold text-slate-800">
            {formatCents(campaign.goal_cents)}
          </p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Arrecadado</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatCents(campaign.raised_cents || 0)}
          </p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Progresso</p>
          <p className="text-lg font-bold text-blue-600">{pct.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Período</p>
          <p className="text-sm font-medium text-slate-700">
            {campaign.starts_at ? formatDate(campaign.starts_at) : "---"} até{" "}
            {campaign.ends_at ? formatDate(campaign.ends_at) : "---"}
          </p>
        </div>
      </div>

      <div className="h-4 bg-stone-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-blue-600 rounded-full"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-600 border border-zinc-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "transactions" && (
        <div className="bg-white rounded-[10px] border border-zinc-200">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h3 className="font-bold text-slate-800">Transações da Campanha</h3>
          </div>
          {transactions.length === 0 ? (
            <p className="px-6 py-8 text-center text-zinc-500">
              Nenhuma transação ainda.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {transactions.map((t) => (
                <div
                  key={t.transaction_id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/transactions/${t.transaction_id}`)}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold ${
                        t.transaction_type === "credit"
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >
                      {t.transaction_type === "credit" ? "+" : "-"}
                      {formatCents(t.amount_cents)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">
                      {relativeTime(t.created_at)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}
                    >
                      {statusLabel(t.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "expenses" && (
        <div className="bg-white rounded-[10px] border border-zinc-200">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Despesas da Campanha</h3>
            <Button
              size="sm"
              onClick={() => navigate(`/campaigns/${campaignId}/expenses/new`)}
            >
              <Plus size={16} /> Nova
            </Button>
          </div>
          <div className="p-6 text-center">
            <p className="text-zinc-500 mb-4">
              Veja as despesas detalhadas na página de despesas.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(`/campaigns/${campaignId}/expenses`)}
            >
              Ver Despesas
            </Button>
          </div>
        </div>
      )}

      {tab === "public" && (
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-2">Link Público de Doação</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Compartilhe este link para receber doações:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/public/donate/${campaignId}`}
              className="flex-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 text-sm outline-none select-all"
            />
            <Button onClick={handleCopyPublicLink}>
              <Copy size={16} /> Copiar
            </Button>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `/public/donate/${campaignId}`,
                  "_blank"
                )
              }
            >
              <ExternalLink size={16} /> Abrir página de doação
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
