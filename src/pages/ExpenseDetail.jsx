import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { formatCents, formatDate, formatDateTime, statusLabel } from "../utils/format";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ExpenseDetail() {
  const { campaignId, expenseId } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadExpense() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data } = await api.get(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses/${expenseId}`
      );
      setExpense(data);
    } catch {
      toast.error("Erro ao carregar despesa");
      navigate(`/campaigns/${campaignId}/expenses`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpense();
  }, [campaignId, expenseId]);

  async function handleDownload(attId) {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const response = await api.get(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses/${expenseId}/attachments/${attId}/download`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "anexo");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao baixar anexo");
    }
  }

  async function handleDeleteAttachment(attId) {
    if (!window.confirm("Remover este anexo?")) return;
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.delete(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses/${expenseId}/attachments/${attId}`
      );
      loadExpense();
      toast.success("Anexo removido");
    } catch {
      toast.error("Erro ao remover anexo");
    }
  }

  if (loading) {
    return (
      <AppLayout title="Carregando...">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse space-y-4" />
      </AppLayout>
    );
  }

  if (!expense) return null;

  return (
    <AppLayout title="Detalhe da Despesa">
      <button
        onClick={() => navigate(`/campaigns/${campaignId}/expenses`)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Despesas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-4">Informações</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Descrição</dt>
              <dd className="font-medium text-slate-800">{expense.description}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Valor</dt>
              <dd className="font-bold text-red-600">
                {formatCents(expense.amount_cents)}
              </dd>
            </div>
            {expense.category && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Categoria</dt>
                <dd className="font-medium text-slate-800">{expense.category}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-zinc-500">Data</dt>
              <dd className="font-medium text-slate-800">
                {expense.expense_date
                  ? formatDate(expense.expense_date)
                  : "---"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Status</dt>
              <dd className="font-medium text-emerald-600">
                {statusLabel(expense.status)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Criado em</dt>
              <dd className="font-medium text-slate-800">
                {formatDateTime(expense.created_at)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-4">Anexos</h3>
          {(!expense.attachments || expense.attachments.length === 0) && (
            <p className="text-sm text-zinc-500">Nenhum anexo.</p>
          )}
          <div className="space-y-3">
            {expense.attachments?.map((att) => (
              <div
                key={att.attachment_id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    📎 {att.original_filename}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {(att.file_size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(att.attachment_id)}
                    className="p-2 hover:bg-blue-50 rounded-lg"
                  >
                    <Download size={16} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteAttachment(att.attachment_id)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
