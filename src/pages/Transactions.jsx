import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Pagination } from "../components/common/Pagination";
import { formatCents, formatDate, statusColor, statusLabel } from "../utils/format";
import { ArrowLeft, Eye } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

export function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  async function loadTransactions() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) { navigate("/organizacoes/nova"); return; }
      const { data } = await api.get(
        `/owners/organization/${orgId}/transactions?limit=200`
      );
      setTransactions(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    if (filterType !== "all" && t.transaction_type !== filterType) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [filterType, filterStatus]);

  return (
    <AppLayout title="Transações">
      <button
        onClick={() => navigate("/wallet")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Carteira
      </button>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-3 rounded-[10px] bg-white border border-zinc-200 text-sm outline-none"
        >
          <option value="all">Todos tipos</option>
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
          <option value="transfer">Transferência</option>
          <option value="external_in">Entrada Externa</option>
          <option value="external_out">Saída Externa</option>
          <option value="withdrawal">Saque</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-[10px] bg-white border border-zinc-200 text-sm outline-none"
        >
          <option value="all">Todos status</option>
          <option value="captured">Capturada</option>
          <option value="authorized">Autorizada</option>
          <option value="refunded">Reembolsada</option>
          <option value="failed">Falhou</option>
          <option value="reversed">Estornada</option>
        </select>
        <span className="text-sm text-zinc-500 self-center">
          {filtered.length} transações
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-4 border border-zinc-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-zinc-500 uppercase">
            <span>Data</span>
            <span>Descrição</span>
            <span>Valor</span>
            <span>Status</span>
            <span></span>
          </div>
          <div className="divide-y divide-zinc-100">
            {paginated.map((t) => (
              <div
                key={t.transaction_id}
                className="grid grid-cols-5 gap-4 px-6 py-3 items-center hover:bg-gray-50 cursor-pointer text-sm"
                onClick={() => navigate(`/transactions/${t.transaction_id}`)}
              >
                <span className="text-zinc-500">
                  {formatDate(t.created_at, "dd/MM HH:mm")}
                </span>
                <span className="text-slate-700">
                  {t.campaign_id ? "Campanha" : statusLabel(t.transaction_type)}
                </span>
                <span
                  className={`font-bold ${
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
                  {formatCents(t.amount_cents)}
                </span>
                <span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}
                  >
                    {statusLabel(t.status)}
                  </span>
                </span>
                <span className="flex justify-end">
                  <Eye size={16} className="text-zinc-400" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
          />
        </div>
      )}
    </AppLayout>
  );
}
