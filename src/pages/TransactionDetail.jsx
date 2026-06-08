import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { AppLayout } from "../layouts/AppLayout";
import { formatCents, formatDateTime, statusLabel } from "../utils/format";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function TransactionDetail() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { organization } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadTransaction() {
    const orgId = organization?.organization_id;
    if (!orgId) {
      toast.error("Nenhuma organização selecionada");
      navigate("/transactions");
      return;
    }
    try {
      const { data } = await api.get(
        `/owners/organization/${orgId}/transactions/${transactionId}`
      );
      setTransaction(data);
    } catch {
      toast.error("Erro ao carregar transação");
      navigate("/transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransaction();
  }, [transactionId, organization]);

  if (loading) {
    return (
      <AppLayout title="Carregando...">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse h-40" />
      </AppLayout>
    );
  }

  if (!transaction) return null;

  return (
    <AppLayout title="Detalhe da Transação">
      <button
        onClick={() => navigate("/transactions")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Transações
      </button>

      <div className="bg-white rounded-[10px] p-6 border border-zinc-200 max-w-xl">
        <h3 className="font-bold text-slate-800 mb-4">Informações</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">ID</dt>
            <dd className="font-mono text-xs text-slate-800">
              {transaction.transaction_id}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Tipo</dt>
            <dd className="font-medium text-slate-800">
              {statusLabel(transaction.transaction_type)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Valor</dt>
            <dd
              className={`font-bold ${
                transaction.transaction_type === "credit" ||
                transaction.transaction_type === "external_in"
                  ? "text-emerald-600"
                  : "text-red-500"
              }`}
            >
              {transaction.transaction_type === "credit" ||
              transaction.transaction_type === "external_in"
                ? "+"
                : "-"}
              {formatCents(transaction.amount_cents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">Status</dt>
            <dd className="font-medium text-slate-800">
              {statusLabel(transaction.status)}
            </dd>
          </div>
          {transaction.campaign_id && (
            <div className="flex justify-between">
              <dt className="text-zinc-500">Campanha</dt>
              <dd className="font-medium text-slate-800">
                {transaction.campaign_id}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-zinc-500">Data</dt>
            <dd className="font-medium text-slate-800">
              {formatDateTime(transaction.created_at)}
            </dd>
          </div>
          {transaction.idempotency_key && (
            <div className="flex justify-between">
              <dt className="text-zinc-500">Chave Idemp.</dt>
              <dd className="font-mono text-xs text-slate-800">
                {transaction.idempotency_key}
              </dd>
            </div>
          )}
          {transaction.external_reference && (
            <div className="flex justify-between">
              <dt className="text-zinc-500">Ref. Externa</dt>
              <dd className="font-medium text-slate-800">
                {transaction.external_reference}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </AppLayout>
  );
}
