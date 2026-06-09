import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, statusColor, statusLabel, sanitizeDescription } from "../utils/format";
import { Plus, Eye, Trash2, Paperclip, FileText, Receipt, Building2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function PrestacaoContas() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [orgExpenses, setOrgExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // "overview" | "expenses"

  async function loadData() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) {
        navigate("/organizacoes/nova");
        return;
      }

      const { data: exps } = await api.get(`/organizations/${orgId}/expenses?limit=200`);
      setOrgExpenses(Array.isArray(exps) ? exps : []);

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

  async function handleDelete(expenseId) {
    if (!window.confirm("Excluir esta despesa geral?")) return;
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.delete(`/organizations/${orgId}/expenses/${expenseId}`);
      setOrgExpenses((prev) => prev.filter((e) => e.entry_id !== expenseId));
      toast.success("Despesa excluída");
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  const orgTotalSpent = orgExpenses.reduce((s, e) => s + (e.amount_cents || 0), 0);

  return (
    <AppLayout title="Prestação de Contas">
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-[10px] p-1 border border-zinc-200 w-fit">
        <button
          onClick={() => setTab("overview")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "overview" ? "bg-slate-700 text-white" : "text-zinc-500 hover:text-slate-700"
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setTab("expenses")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            tab === "expenses" ? "bg-slate-700 text-white" : "text-zinc-500 hover:text-slate-700"
          }`}
        >
          Despesas Gerais
        </button>
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
      ) : tab === "overview" ? (
        <div className="space-y-6">
          <div className="mb-4 flex gap-3">
            <Button onClick={() => navigate("/campaigns/new")}>
              <Plus size={16} /> Nova Campanha
            </Button>
            <Button variant="outline" onClick={() => navigate("/expenses/new")}>
              <Receipt size={16} /> Nova Despesa Geral
            </Button>
          </div>

          {campaigns.length === 0 && orgExpenses.length === 0 ? (
            <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
              <FileText size={48} className="mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-500 mb-4">
                Nenhuma campanha ou despesa encontrada. Crie uma campanha para começar a prestar contas.
              </p>
              <Button onClick={() => navigate("/campaigns/new")}>
                <Plus size={16} /> Criar Campanha
              </Button>
            </div>
          ) : (
            <>
              {/* Org-wide expenses summary */}
              {orgExpenses.length > 0 && (
                <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-slate-700" />
                      <h3 className="font-bold text-slate-800">Despesas Gerais da Instituição</h3>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setTab("expenses")}>
                      <Receipt size={14} /> Gerenciar
                    </Button>
                  </div>
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Total Gasto</p>
                        <p className="text-lg font-bold text-red-500">{formatCents(orgTotalSpent)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Despesas</p>
                        <p className="text-lg font-bold text-slate-800">{orgExpenses.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {campaigns.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Campanhas</h3>
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
                              href={`/public/donate/campaign/${c.campaign_id}`}
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
            </>
          )}
        </div>
      ) : (
        /* Expenses tab - full CRUD list from OrgExpenses */
        <div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
              <p className="text-xs text-zinc-500 mb-1">Total de Despesas</p>
              <p className="text-lg font-bold text-red-600">{formatCents(orgTotalSpent)}</p>
            </div>
            <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
              <p className="text-xs text-zinc-500 mb-1">Nº de Despesas</p>
              <p className="text-lg font-bold text-slate-800">{orgExpenses.length}</p>
            </div>
            <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
              <p className="text-xs text-zinc-500 mb-1">Média</p>
              <p className="text-lg font-bold text-slate-800">
                {orgExpenses.length > 0
                  ? formatCents(Math.round(orgTotalSpent / orgExpenses.length))
                  : "R$ 0,00"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <Button onClick={() => navigate("/expenses/new")}>
              <Plus size={16} /> Nova Despesa Geral
            </Button>
          </div>

          {orgExpenses.length === 0 ? (
            <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
              <Building2 size={48} className="mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-500 mb-4">
                Nenhuma despesa geral registrada para esta instituição.
              </p>
              <Button onClick={() => navigate("/expenses/new")}>
                Registrar primeira despesa geral
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orgExpenses.map((e) => (
                <div
                  key={e.entry_id}
                  className="bg-white rounded-[10px] p-5 border border-zinc-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-800">{sanitizeDescription(e.description)}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                        <span className="font-bold text-red-600">{formatCents(e.amount_cents)}</span>
                        {e.category && <span>{e.category}</span>}
                        {e.expense_date && <span>{formatDate(e.expense_date)}</span>}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}
                        >
                          {statusLabel(e.status)}
                        </span>
                        {e.attachments?.length > 0 && (
                          <><Paperclip size={14} className="text-zinc-400" /> <span>{e.attachments.length}</span></>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => navigate(`/expenses/${e.entry_id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Eye size={16} className="text-zinc-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(e.entry_id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
