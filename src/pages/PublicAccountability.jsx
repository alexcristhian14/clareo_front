import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, statusLabel } from "../utils/format";
import logo from "../assets/logo.svg";
import { Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function PublicAccountability() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadReport() {
    try {
      const { data } = await api.get(
        `/public/campaigns/${campaignId}/accountability`
      );
      setReport(data);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error("Campanha não encontrada");
      } else {
        toast.error("Erro ao carregar prestação de contas");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-zinc-500">Carregando...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-xl text-zinc-500 mb-2">
            Campanha não encontrada
          </p>
          <p className="text-sm text-zinc-400 mb-4">
            Verifique se o link está correto.
          </p>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const s = report.summary || {};
  const expenses = report.expenses || [];

  const categoryTotals = {};
  expenses.forEach((e) => {
    const cat = e.category || "Outros";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (e.amount_cents || 0);
  });
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount_cents || 0), 0);
  const categories = Object.entries(categoryTotals).map(([cat, val]) => ({
    category: cat,
    totalCents: val,
    percentage: totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0,
  }));

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Clareo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">CLAREO</span>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            📊 Prestação de Contas
          </h1>
          <p className="text-lg text-zinc-600">
            🏢 {report.organization?.name}
          </p>
          <p className="text-sm text-zinc-500">
            🎯 Campanha: {report.campaign?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
            <p className="text-xs text-zinc-500 mb-1">💰 Arrecadado</p>
            <p className="text-xl font-bold text-emerald-600">
              {formatCents(s.total_raised)}
            </p>
          </div>
          <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
            <p className="text-xs text-zinc-500 mb-1">💳 Gasto</p>
            <p className="text-xl font-bold text-red-500">
              {formatCents(s.total_spent)}
            </p>
          </div>
          <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
            <p className="text-xs text-zinc-500 mb-1">Saldo Restante</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCents(s.balance)}
            </p>
          </div>
          <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
            <p className="text-xs text-zinc-500 mb-1">📄 Despesas</p>
            <p className="text-xl font-bold text-slate-800">
              {s.expense_count || 0}
            </p>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
            <h2 className="font-bold text-slate-800 mb-4">
              🥧 Distribuição dos Gastos
            </h2>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{cat.category}</span>
                    <span className="text-zinc-500">
                      {formatCents(cat.totalCents)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {expenses.length === 0 ? (
          <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
            <p className="text-zinc-500 mb-2">
              Ainda não há despesas registradas para esta campanha.
            </p>
            <p className="text-sm text-zinc-400">
              Total arrecadado: {formatCents(s.total_raised)}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[10px] border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-bold text-slate-800">
                Detalhamento das Despesas
              </h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {expenses.map((e) => (
                <div key={e.entry_id} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-800">
                        📄 {e.description}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {e.category} ·{" "}
                        {e.expense_date
                          ? formatDate(e.expense_date)
                          : "---"}{" "}
                        · {statusLabel(e.status)}
                      </p>
                    </div>
                    <span className="font-bold text-red-500">
                      {formatCents(e.amount_cents)}
                    </span>
                  </div>
                  {e.attachments?.length > 0 && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {e.attachments.map((att) => (
                        <a
                          key={att.attachment_id}
                          href={`/api/v1/organizations/${report.organization?.id}/campaigns/${campaignId}/expenses/${e.entry_id}/attachments/${att.attachment_id}/download`}
                          target="_blank"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Download size={12} />
                          {att.original_filename} ({(att.file_size / 1024).toFixed(0)} KB)
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center bg-white rounded-[10px] p-6 border border-zinc-200">
          <p className="text-sm text-zinc-500 mb-4">
            💡 Quer contribuir com esta causa?
          </p>
          <Button onClick={() => navigate(`/public/donate/campaign/${campaignId}`)}>
            Fazer uma Doação
          </Button>
          <p className="text-xs text-zinc-400 mt-4">
            📅 Última atualização:{" "}
            {report.campaign?.updated_at
              ? formatDate(report.campaign.updated_at)
              : "---"}
          </p>
        </div>
      </div>
    </div>
  );
}
