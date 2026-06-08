import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, relativeTime } from "../utils/format";
import { Wallet, TrendingUp, Target, Users, Plus } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadDashboard() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) {
        navigate("/organizacoes/nova");
        return;
      }
      const { data: dashData } = await api.get(`/organizations/${orgId}/dashboard`);
      setData(dashData);
    } catch {
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </AppLayout>
    );
  }

  const m = data?.metrics || {};
  const campaigns = data?.campaigns || [];
  const transactions = data?.recent_transactions || [];

  return (
    <AppLayout title={data?.name || "Dashboard"}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wallet size={20} className="text-blue-600" />
            </div>
            <span className="text-sm text-zinc-500">Disponível</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCents(m.wallet_available_cents)}
          </p>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <span className="text-sm text-zinc-500">Arrecadado</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCents(m.total_raised_cents)}
          </p>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Target size={20} className="text-amber-600" />
            </div>
            <span className="text-sm text-zinc-500">Progresso</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {m.active_campaigns}/{m.total_campaigns} campanhas
          </p>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users size={20} className="text-emerald-600" />
            </div>
            <span className="text-sm text-zinc-500">Membros</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {m.member_count || 0} membros
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-slate-800">Campanhas Ativas</h2>
            <Button size="sm" onClick={() => navigate("/campaigns/new")}>
              <Plus size={16} /> Nova
            </Button>
          </div>
          <div className="divide-y divide-zinc-100">
            {campaigns.length === 0 && (
              <p className="px-6 py-8 text-center text-zinc-500">
                Nenhuma campanha ativa ainda.
              </p>
            )}
            {campaigns.map((c) => (
              <div
                key={c.campaign_id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {formatCents(c.raised_cents)}
                  </span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min(c.progress_pct || 0, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-zinc-500">
                    {c.progress_pct?.toFixed(0) || 0}%
                  </span>
                  <span className="text-xs text-zinc-500">
                    Meta: {formatCents(c.goal_cents)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-slate-800">Transações Recentes</h2>
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver mais
            </button>
          </div>
          <div className="divide-y divide-zinc-100">
            {transactions.length === 0 && (
              <p className="px-6 py-8 text-center text-zinc-500">
                Nenhuma transação recente.
              </p>
            )}
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t.transaction_id}
                className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/transactions/${t.transaction_id}`)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      t.transaction_type === "credit" ||
                      t.transaction_type === "external_in"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {t.transaction_type === "credit" ||
                    t.transaction_type === "external_in"
                      ? "+"
                      : "-"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {formatCents(t.amount_cents)}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {relativeTime(t.created_at)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    t.status === "captured" || t.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : t.status === "failed"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
