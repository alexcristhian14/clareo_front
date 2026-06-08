import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { formatCents, relativeTime, statusColor, statusLabel } from "../utils/format";
import { Wallet as WalletIcon, TrendingUp, Lock } from "lucide-react";
import { toast } from "sonner";

export function Wallet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadWallet() {
    try {
      const ownerType = "user";
      const ownerId = user?.user_id || user?.id;

      if (!ownerId) { setLoading(false); return; }

      const { data: w } = await api.get(`/owners/${ownerType}/${ownerId}/wallet`);
      setWallet(w);

      const { data: tx } = await api.get(
        `/owners/${ownerType}/${ownerId}/transactions?limit=10`
      );
      setTransactions(Array.isArray(tx) ? tx : []);
    } catch {
      toast.error("Erro ao carregar carteira");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, []);

  if (loading) {
    return (
      <IndividualLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
      </IndividualLayout>
    );
  }

  return (
    <IndividualLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Minha Carteira</h1>
        <p className="text-sm text-zinc-500 -mt-4 mb-8">
          Saldo pessoal — suas doações e créditos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <WalletIcon size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-zinc-500">Saldo Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {formatCents(wallet?.balance_cents)}
            </p>
          </div>

          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <span className="text-sm text-zinc-500">Disponível</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCents(wallet?.available_cents)}
            </p>
          </div>

          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lock size={20} className="text-amber-600" />
              </div>
              <span className="text-sm text-zinc-500">Bloqueado</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {formatCents(wallet?.locked_cents)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[10px] border border-zinc-200">
          <div className="px-6 py-4 border-b border-zinc-100">
            <h2 className="font-bold text-slate-800">Últimas Transações</h2>
          </div>
          {transactions.length === 0 ? (
            <p className="px-6 py-8 text-center text-zinc-500">
              Nenhuma transação encontrada.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {transactions.map((t) => (
                <div
                  key={t.transaction_id}
                  className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
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
                    <span className="text-xs text-zinc-400">
                      {relativeTime(t.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}
                    >
                      {statusLabel(t.status)}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {statusLabel(t.transaction_type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </IndividualLayout>
  );
}
