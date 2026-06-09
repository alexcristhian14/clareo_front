import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, relativeTime, statusColor, statusLabel } from "../utils/format";
import { Wallet as WalletIcon, TrendingUp, DollarSign, ArrowLeftRight, X } from "lucide-react";
import { toast } from "sonner";

export function Wallet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentOrganization } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(null); // "deposit" | "withdraw" | null
  const [amountInput, setAmountInput] = useState("");

  const isOrgContext = location.pathname.startsWith("/wallet");
  const Layout = isOrgContext ? AppLayout : IndividualLayout;

  async function loadWallet() {
    try {
      const ownerType = isOrgContext ? "organization" : "user";
      const ownerId = isOrgContext
        ? currentOrganization?.organization_id
        : user?.user_id || user?.id;

      if (!ownerId) { setLoading(false); return; }

      const { data: w } = await api.get(`/owners/${ownerType}/${ownerId}/wallet`);
      setWallet(w);

      const { data: tx } = await api.get(
        `/owners/${ownerType}/${ownerId}/transactions?limit=100`
      );
      setTransactions(Array.isArray(tx) ? tx : []);
    } catch {
      toast.error("Erro ao carregar carteira");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransaction(type) {
    const amountCents = parseFloat(amountInput.replace(",", ".")) * 100;
    if (isNaN(amountCents) || amountCents <= 0) { toast.error("Valor inválido"); return; }
    setSaving(true);
    try {
      const ownerType = isOrgContext ? "organization" : "user";
      const ownerId = isOrgContext ? currentOrganization?.organization_id : user?.user_id || user?.id;
      await api.post(`/owners/${ownerType}/${ownerId}/transactions`, {
        transaction: { amount_cents: Math.round(amountCents), currency: "BRL", transaction_type: type, idempotency_key: `${type}_${ownerId}_${Date.now()}` },
      });
      toast.success(type === "credit" ? "Depósito realizado!" : "Saque realizado!");
      setShowForm(null);
      setAmountInput("");
      loadWallet();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro na transação");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, [isOrgContext]);

  function TransactionForm({ type }) {
    const isDeposit = type === "deposit";
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-[10px] p-6 w-full max-w-md border border-zinc-200 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">{isDeposit ? "Depositar" : "Sacar"}</h3>
            <button onClick={() => { setShowForm(null); setAmountInput(""); }} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} className="text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            {isDeposit ? "Adicione fundos à sua carteira." : "Retire fundos da sua carteira."} {!isOrgContext && "Seu saldo pessoal será atualizado."}
          </p>
          <label className="text-[#334155] text-xs font-bold block mb-2">Valor (R$)</label>
          <input
            type="text"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="100,00"
            className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none mb-6"
            autoFocus
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setShowForm(null); setAmountInput(""); }} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={() => handleTransaction(isDeposit ? "credit" : "debit")} disabled={saving || !amountInput} className="flex-1">
              {saving ? "Processando..." : isDeposit ? "Depositar" : "Sacar"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Carteira" description={isOrgContext ? "Saldo institucional da organização" : "Seu saldo pessoal"}>
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={() => setShowForm("deposit")}>
            <TrendingUp size={16} /> Depositar
          </Button>
          <Button variant="outline" onClick={() => setShowForm("withdraw")}>
            <DollarSign size={16} /> Sacar
          </Button>
        </div>

        {showForm && <TransactionForm type={showForm} />}

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
              {transactions.map((t) => {
                const isRedemption = t.metadata?.redemption === "true" || t.metadata?.redemption === true;
                const isCredit = t.transaction_type === "credit" || t.transaction_type === "external_in";
                return (
                  <div
                    key={t.transaction_id}
                    className="px-6 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`font-bold shrink-0 ${
                          isCredit ? "text-emerald-600" : "text-red-500"
                        }`}
                      >
                        {isCredit ? "+" : "-"}
                        {formatCents(t.amount_cents)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-400">
                          {relativeTime(t.created_at)}
                        </p>
                        {isRedemption && t.campaign_name && (
                          <p className="text-xs text-amber-600 truncate">
                            Resgate: {t.campaign_name}
                          </p>
                        )}
                        {t.metadata?.description && !isRedemption && (
                          <p className="text-xs text-zinc-500 truncate">
                            {t.metadata.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}
                      >
                        {statusLabel(t.status)}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {isRedemption ? "Resgate" : statusLabel(t.transaction_type)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
