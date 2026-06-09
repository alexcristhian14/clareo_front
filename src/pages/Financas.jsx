import { useState, useEffect } from "react";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, relativeTime, statusLabel, statusColor } from "../utils/format";
import {
  Wallet as WalletIcon,
  TrendingUp,
  CreditCard,
  Plus,
  X,
  PiggyBank,
  Trash2,
  Landmark,
  DollarSign,
  ArrowLeftRight,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { key: "extrato", label: "Extrato", icon: FileText },
  { key: "credito", label: "Crédito", icon: CreditCard },
  { key: "pagamentos", label: "Pagamentos", icon: PiggyBank },
];

export function Financas() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("extrato");

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showRequestCredit, setShowRequestCredit] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showPayBill, setShowPayBill] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) return;
      const { data: d } = await api.get(`/finance/organization/${orgId}`);
      setData(d);
    } catch {
      toast.error("Erro ao carregar dados financeiros");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const wallet = data?.wallet || {};
  const creditLines = data?.credit_lines || [];
  const bills = data?.bills || [];
  const paymentMethods = data?.payment_methods || [];
  const transactions = data?.transactions || [];

  const activeCredit = creditLines.find((c) => c.status === "active");
  const pendingBills = bills.filter((b) => b.status === "pending" || b.status === "partial");

  async function handleTransaction(type) {
    const amountInput = prompt(`Valor em centavos para ${type === "credit" ? "depositar" : "sacar"}:`);
    if (!amountInput) return;
    const amountCents = parseInt(amountInput, 10);
    if (isNaN(amountCents) || amountCents <= 0) { toast.error("Valor inválido"); return; }

    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post(`/owners/organization/${orgId}/transactions`, {
        transaction: {
          amount_cents: amountCents,
          currency: "BRL",
          transaction_type: type,
          idempotency_key: `${type}_${orgId}_${Date.now()}`,
        },
      });
      toast.success(type === "credit" ? "Depósito realizado!" : "Saque realizado!");
      setShowDeposit(false);
      setShowWithdraw(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro na transação");
    } finally {
      setSaving(false);
    }
  }

  async function handleRequestCredit() {
    const amountInput = prompt("Valor do crédito solicitado (em centavos):");
    if (!amountInput) return;
    const amountCents = parseInt(amountInput, 10);
    if (isNaN(amountCents) || amountCents <= 0) { toast.error("Valor inválido"); return; }

    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data: result } = await api.get(`/credit_lines/${orgId}/request/${amountCents}`);
      toast.success(result.message || "Crédito aprovado!");
      setShowRequestCredit(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao solicitar crédito");
    } finally {
      setSaving(false);
    }
  }

  async function handlePayBill(bill) {
    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post(`/credit_lines/${orgId}/bills/${bill.bill_id}/pay`, { amount_cents: bill.amount_cents });
      toast.success("Fatura paga!");
      setShowPayBill(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao pagar fatura");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPayment(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post(`/owners/organization/${orgId}/payment_methods`, {
        owner_type: "organization",
        owner_id: orgId,
        method_type: form.get("method_type"),
        details: { last4: form.get("last4"), brand: form.get("brand") },
        is_default: form.get("is_default") === "on",
      });
      toast.success("Método de pagamento adicionado!");
      setShowAddPayment(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao adicionar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePayment(methodId) {
    if (!confirm("Remover este método de pagamento?")) return;
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.delete(`/owners/organization/${orgId}/payment_methods/${methodId}`);
      toast.success("Removido!");
      loadData();
    } catch {
      toast.error("Erro ao remover");
    }
  }

  const billStatusIcon = (s) => {
    if (s === "paid") return <CheckCircle2 size={14} className="text-emerald-500" />;
    if (s === "pending") return <Clock size={14} className="text-amber-500" />;
    return <AlertTriangle size={14} className="text-red-500" />;
  };

  const totalRedemption = transactions
    .filter((t) => t.metadata?.redemption === "true" || t.metadata?.redemption === true)
    .reduce((s, t) => s + (t.amount_cents || 0), 0);

  if (loading) {
    return (
      <AppLayout title="Financeiro">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 h-28" />
            ))}
          </div>
          <div className="bg-white rounded-[10px] border border-zinc-200 h-64" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Financeiro" description="Gestão financeira completa da organização">
      <div className="max-w-6xl mx-auto">
        {/* Balance cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg"><WalletIcon size={20} className="text-blue-600" /></div>
              <span className="text-sm text-zinc-500">Saldo Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCents(wallet.balance_cents)}</p>
          </div>
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg"><TrendingUp size={20} className="text-emerald-600" /></div>
              <span className="text-sm text-zinc-500">Disponível</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{formatCents(wallet.available_cents)}</p>
          </div>
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg"><CreditCard size={20} className="text-amber-600" /></div>
              <span className="text-sm text-zinc-500">Crédito Disponível</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {activeCredit ? formatCents(activeCredit.available_cents) : "R$ 0,00"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={() => setShowDeposit(true)} disabled={saving}>
            <TrendingUp size={16} /> Depositar
          </Button>
          <Button variant="outline" onClick={() => setShowWithdraw(true)} disabled={saving}>
            <DollarSign size={16} /> Sacar
          </Button>
          <Button variant="outline" onClick={() => setShowRequestCredit(true)} disabled={saving}>
            <Landmark size={16} /> Solicitar Crédito
          </Button>
          <Button variant="outline" onClick={() => setShowAddPayment(true)}>
            <Plus size={16} /> Adicionar Pagamento
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-zinc-200 hover:bg-gray-50"
              }`}>
              <t.icon size={16} className="inline mr-1.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Extrato */}
        {tab === "extrato" && (
          <div className="bg-white rounded-[10px] border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Extrato Bancário</h3>
              <span className="text-xs text-zinc-400">{transactions.length} transações</span>
            </div>
            {transactions.length === 0 ? (
              <p className="px-6 py-8 text-center text-zinc-500">Nenhuma transação.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {transactions.map((t) => {
                  const isRedemption = t.metadata?.redemption === "true" || t.metadata?.redemption === true;
                  const isCredit = t.transaction_type === "credit" || t.transaction_type === "external_in";
                  return (
                    <div key={t.transaction_id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`font-bold shrink-0 ${isCredit ? "text-emerald-600" : "text-red-500"}`}>
                          {isCredit ? "+" : "-"}{formatCents(t.amount_cents)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs text-zinc-400">{relativeTime(t.created_at)}</p>
                          {isRedemption && t.campaign_name && (
                            <p className="text-xs text-amber-600 truncate">Resgate: {t.campaign_name}</p>
                          )}
                          {t.metadata?.description && !isRedemption && (
                            <p className="text-xs text-zinc-500 truncate">{t.metadata.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}>
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
        )}

        {/* Tab: Crédito */}
        {tab === "credito" && (
          <div className="space-y-6">
            {/* Active credit line */}
            <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
              <h3 className="font-bold text-slate-800 mb-4">Linha de Crédito</h3>
              {activeCredit ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-zinc-500">Limite Total</p>
                      <p className="text-lg font-bold text-slate-800">{formatCents(activeCredit.limit_cents)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Utilizado</p>
                      <p className="text-lg font-bold text-red-500">{formatCents(activeCredit.used_cents)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Disponível</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCents(activeCredit.available_cents)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{
                      width: `${Math.min((activeCredit.used_cents / activeCredit.limit_cents) * 100, 100)}%`
                    }} />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Nenhuma linha de crédito ativa.</p>
              )}
            </div>

            {/* Bills */}
            <div className="bg-white rounded-[10px] border border-zinc-200">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Faturas</h3>
                <Button size="sm" onClick={() => { generateBills(); }}>
                  <Calendar size={14} /> Gerar Fatura
                </Button>
              </div>
              {bills.length === 0 ? (
                <p className="px-6 py-8 text-center text-zinc-500">Nenhuma fatura gerada.</p>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {bills.map((b) => (
                    <div key={b.bill_id} className="px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {billStatusIcon(b.status)}
                        <div>
                          <p className="text-sm font-medium text-slate-800">{formatCents(b.amount_cents)}</p>
                          <p className="text-xs text-zinc-400">Vencimento: {b.due_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          b.status === "paid" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
                        }`}>
                          {b.status === "paid" ? "Pago" : b.status === "pending" ? "Pendente" : "Vencido"}
                        </span>
                        {b.status !== "paid" && (
                          <Button size="sm" onClick={() => handlePayBill(b)} disabled={saving}>
                            <Send size={12} /> Pagar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button variant="outline" onClick={() => setShowRequestCredit(true)}>
              <Landmark size={16} /> Solicitar Aumento de Crédito
            </Button>
          </div>
        )}

        {/* Tab: Pagamentos */}
        {tab === "pagamentos" && (
          <div className="bg-white rounded-[10px] border border-zinc-200">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Métodos de Pagamento</h3>
              <Button size="sm" onClick={() => setShowAddPayment(true)}>
                <Plus size={16} /> Adicionar
              </Button>
            </div>
            {paymentMethods.length === 0 ? (
              <p className="px-6 py-8 text-center text-zinc-500">Nenhum método de pagamento cadastrado.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {paymentMethods.map((pm) => (
                  <div key={pm.method_id} className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <CreditCard size={16} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {pm.method_type === "credit_card" ? "Cartão de Crédito" : pm.method_type}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {pm.details?.brand} •••• {pm.details?.last4}
                          {pm.is_default && <span className="text-emerald-600 ml-1">(padrão)</span>}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDeletePayment(pm.method_id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowDeposit(false)}>
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Depositar</h3>
              <button onClick={() => setShowDeposit(false)}><X size={20} className="text-zinc-400" /></button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Digite o valor em centavos para depositar na carteira.</p>
            <div className="flex gap-3">
              <Button onClick={() => handleTransaction("credit")} disabled={saving} className="flex-1">
                {saving ? "Processando..." : `Depositar R$ 1.000,00`}
              </Button>
              <Button variant="outline" onClick={() => setShowDeposit(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowWithdraw(false)}>
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Sacar</h3>
              <button onClick={() => setShowWithdraw(false)}><X size={20} className="text-zinc-400" /></button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Digite o valor em centavos para sacar.</p>
            <div className="flex gap-3">
              <Button onClick={() => handleTransaction("debit")} disabled={saving} className="flex-1">
                {saving ? "Processando..." : "Sacar"}
              </Button>
              <Button variant="outline" onClick={() => setShowWithdraw(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Request Credit Modal */}
      {showRequestCredit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowRequestCredit(false)}>
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Solicitar Crédito</h3>
              <button onClick={() => setShowRequestCredit(false)}><X size={20} className="text-zinc-400" /></button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">Sua solicitação será analisada e aprovada automaticamente.</p>
            <Button onClick={handleRequestCredit} disabled={saving} className="w-full">
              {saving ? "Analisando..." : "Solicitar Análise de Crédito"}
            </Button>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowAddPayment(false)}>
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Adicionar Pagamento</h3>
              <button onClick={() => setShowAddPayment(false)}><X size={20} className="text-zinc-400" /></button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500">Tipo</label>
                <select name="method_type" required className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm">
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500">Bandeira</label>
                <input name="brand" placeholder="Visa, Mastercard..." className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-500">Últimos 4 dígitos</label>
                <input name="last4" placeholder="1234" maxLength={4} className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input name="is_default" type="checkbox" /> Pagamento padrão
              </label>
              <div className="flex gap-3">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Salvando..." : "Adicionar"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddPayment(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

  async function generateBills() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.get(`/credit_lines/${orgId}/bills`);
      toast.success("Faturas geradas!");
      loadData();
    } catch {
      toast.error("Erro ao gerar faturas");
    }
  }
