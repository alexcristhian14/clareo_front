import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, relativeTime } from "../utils/format";
import { Wallet, TrendingUp, Target, Users, Plus, Receipt, Building2 } from "lucide-react";
import { toast } from "sonner";

export function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadDashboard() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) { navigate("/organizacoes/nova"); return; }
      const { data: dashData } = await api.get(`/organizations/${orgId}/dashboard`);
      setData(dashData);
    } catch {
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

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
  const orgExpenses = data?.org_wide_expenses || [];
  const orgWideSpent = orgExpenses.reduce((s, e) => s + (e.amount_cents || 0), 0);
  const campaignSpent = campaigns.reduce((s, c) => s + (c.spent_cents || 0), 0);
  const totalSpent = campaignSpent + orgWideSpent;

  return (
    <AppLayout title={data?.name || "Dashboard"}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Wallet size={20} className="text-blue-600" /></div>
            <span className="text-sm text-zinc-500">Disponível</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatCents(m.wallet_available_cents)}</p>
        </div>
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg"><TrendingUp size={20} className="text-purple-600" /></div>
            <span className="text-sm text-zinc-500">Arrecadado</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCents(m.total_raised_cents)}</p>
        </div>
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg"><Target size={20} className="text-amber-600" /></div>
            <span className="text-sm text-zinc-500">Progresso</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{m.active_campaigns}/{m.total_campaigns} campanhas</p>
        </div>
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><Users size={20} className="text-emerald-600" /></div>
            <span className="text-sm text-zinc-500">Membros</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">{m.member_count || 0} membros</p>
        </div>
      </div>

      {/* Spending summary */}
      <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm mb-8">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Receipt size={18} /> Resumo Financeiro
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-zinc-500">Arrecadado Total</p>
            <p className="text-lg font-bold text-emerald-600">{formatCents(m.total_raised_cents)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Gasto em Campanhas</p>
            <p className="text-lg font-bold text-red-500">{formatCents(campaignSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Despesas Gerais</p>
            <p className="text-lg font-bold text-red-500">{formatCents(orgWideSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Total Gasto</p>
            <p className="text-lg font-bold text-red-600">{formatCents(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Saldo Final</p>
            <p className="text-lg font-bold text-blue-600">{formatCents(m.total_raised_cents - totalSpent)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Active campaigns */}
        <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-slate-800">Campanhas</h2>
            <Button size="sm" onClick={() => navigate("/campaigns/new")}><Plus size={16} /> Nova</Button>
          </div>
          <div className="divide-y divide-zinc-100 max-h-[400px] overflow-y-auto">
            {campaigns.length === 0 && (
              <p className="px-6 py-8 text-center text-zinc-500">Nenhuma campanha ainda.</p>
            )}
            {campaigns.map((c) => (
              <div key={c.campaign_id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/campaigns/${c.campaign_id}`)}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-slate-800">{c.name}</span>
                    <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}>{c.status}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{formatCents(c.raised_cents)}</span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(c.progress_pct || 0, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-xs text-zinc-500">
                  <span>{c.progress_pct?.toFixed(0) || 0}% · Meta: {formatCents(c.goal_cents)}</span>
                  <span>{c.expense_count || 0} despesas · {formatCents(c.spent_cents)} gasto</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-slate-800">Transações Recentes</h2>
            <button onClick={() => navigate("/transactions")} className="text-sm text-blue-600 hover:underline">Ver mais</button>
          </div>
          <div className="divide-y divide-zinc-100 max-h-[400px] overflow-y-auto">
            {transactions.length === 0 && (
              <p className="px-6 py-8 text-center text-zinc-500">Nenhuma transação recente.</p>
            )}
            {transactions.slice(0, 5).map((t) => (
              <div key={t.transaction_id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/transactions/${t.transaction_id}`)}>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${t.transaction_type === "credit" || t.transaction_type === "external_in" ? "text-emerald-600" : "text-red-500"}`}>
                    {t.transaction_type === "credit" || t.transaction_type === "external_in" ? "+" : "-"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{formatCents(t.amount_cents)}</p>
                    <p className="text-xs text-zinc-400">{relativeTime(t.created_at)}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  t.status === "captured" || t.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                  t.status === "failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                }`}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Revenue & Expenses by campaign */}
      <div className="bg-white rounded-[10px] border border-zinc-200 shadow-sm mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Receipt size={18} /> Receitas e Despesas por Campanha
          </h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate("/expenses")}>
              <Building2 size={14} /> Ver Gerais
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/prestacao-contas")}>
              Relatório Completo
            </Button>
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-2 text-xs font-medium text-zinc-400 uppercase tracking-wider bg-zinc-50 border-b border-zinc-100">
          <div className="col-span-3">Campanha</div>
          <div className="col-span-2 text-right">Arrecadado</div>
          <div className="col-span-2 text-right">Disponível</div>
          <div className="col-span-2 text-right">Despesas</div>
          <div className="col-span-2 text-right">Saldo</div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-zinc-100">
          {campaigns.filter(c => (c.expense_count || 0) > 0 || (c.raised_cents || 0) > 0).length === 0 && orgExpenses.length === 0 && (
            <p className="px-6 py-8 text-center text-zinc-500">Nenhuma movimentação registrada.</p>
          )}
          {campaigns.filter(c => (c.expense_count || 0) > 0 || (c.raised_cents || 0) > 0).map((c) => (
            <div key={c.campaign_id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/campaigns/${c.campaign_id}`)}>
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                <div className="md:col-span-3">
                  <p className="font-medium text-slate-800 truncate">{c.name}</p>
                  <div className="flex items-center gap-2 md:hidden mt-1">
                    <span className="text-xs text-zinc-400">{c.status}</span>
                    <span className="text-xs text-zinc-300">|</span>
                    <span className="text-xs text-zinc-400">{c.expense_count || 0} despesa(s)</span>
                  </div>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-sm font-semibold text-emerald-600">{formatCents(c.raised_cents)}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-sm font-semibold text-amber-600">{formatCents(c.held_cents)}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-sm font-semibold text-red-500">{formatCents(c.spent_cents)}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className={`text-sm font-bold ${c.available_balance_cents >= 0 ? "text-blue-600" : "text-red-600"}`}>
                    {c.available_balance_cents >= 0 ? "+" : ""}{formatCents(c.available_balance_cents)}
                  </p>
                </div>
                <div className="md:col-span-1 text-right hidden md:block">
                  <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                  }`}>{c.status === "active" ? "Ativa" : c.status === "draft" ? "Rascunho" : "Encerrada"}</span>
                </div>
              </div>
              {/* Progress bar for mobile */}
              {c.goal_cents > 0 && (
                <div className="mt-2 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(c.progress_pct || 0, 100)}%` }} />
                </div>
              )}
            </div>
          ))}
          {orgExpenses.length > 0 && (
            <div className="px-6 py-4 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-zinc-400 shrink-0" />
                    <p className="font-medium text-slate-800">Despesas Gerais</p>
                  </div>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-xs text-zinc-400">—</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-xs text-zinc-400">—</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-sm font-semibold text-red-500">{formatCents(orgWideSpent)}</p>
                </div>
                <div className="md:col-span-2 text-right">
                  <p className="text-xs text-zinc-400">{orgExpenses.length} despesa(s)</p>
                </div>
                <div className="md:col-span-1 text-right">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); navigate("/expenses"); }}>
                    <Receipt size={14} />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
