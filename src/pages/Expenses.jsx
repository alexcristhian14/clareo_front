import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, statusColor, statusLabel } from "../utils/format";
import { ArrowLeft, Plus, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function Expenses() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;

      const { data: c } = await api.get(`/organizations/${orgId}/campaigns/${campaignId}`);
      setCampaignName(c.name);

      const { data: exps } = await api.get(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses?limit=100`
      );
      setExpenses(Array.isArray(exps) ? exps : []);
    } catch {
      toast.error("Erro ao carregar despesas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [campaignId]);

  async function handleDelete(expenseId) {
    if (!window.confirm("Excluir esta despesa?")) return;
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.delete(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses/${expenseId}`
      );
      setExpenses((prev) => prev.filter((e) => e.entry_id !== expenseId));
      toast.success("Despesa excluída");
    } catch {
      toast.error("Erro ao excluir");
    }
  }

  const totalAmount = expenses.reduce((s, e) => s + (e.amount_cents || 0), 0);

  return (
    <AppLayout title="Despesas da Campanha">
      <button
        onClick={() => navigate(`/campaigns/${campaignId}`)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> {campaignName || "Campanha"}
      </button>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Total de Despesas</p>
          <p className="text-lg font-bold text-red-600">
            {formatCents(totalAmount)}
          </p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Nº de Despesas</p>
          <p className="text-lg font-bold text-slate-800">{expenses.length}</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Média</p>
          <p className="text-lg font-bold text-slate-800">
            {expenses.length > 0
              ? formatCents(Math.round(totalAmount / expenses.length))
              : "R$ 0,00"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Button onClick={() => navigate(`/campaigns/${campaignId}/expenses/new`)}>
          <Plus size={16} /> Nova Despesa
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <p className="text-zinc-500 mb-4">
            Nenhuma despesa registrada para esta campanha.
          </p>
          <Button onClick={() => navigate(`/campaigns/${campaignId}/expenses/new`)}>
            Registrar primeira despesa
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((e) => (
            <div
              key={e.entry_id}
              className="bg-white rounded-[10px] p-5 border border-zinc-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">
                    {e.description}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                    <span className="font-bold text-red-600">
                      {formatCents(e.amount_cents)}
                    </span>
                    {e.category && <span>{e.category}</span>}
                    {e.expense_date && <span>{formatDate(e.expense_date)}</span>}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}
                    >
                      {statusLabel(e.status)}
                    </span>
                    {e.attachments?.length > 0 && (
                      <span>📎 {e.attachments.length}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() =>
                      navigate(
                        `/campaigns/${campaignId}/expenses/${e.entry_id}`
                      )
                    }
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
    </AppLayout>
  );
}
