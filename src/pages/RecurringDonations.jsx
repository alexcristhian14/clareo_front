import { useState, useEffect } from "react";
import { api } from "../services/api";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, statusLabel } from "../utils/format";
import { Plus, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function RecurringDonations() {
  const [donations, setDonations] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRecurring, setNewRecurring] = useState({
    organization_id: "",
    amount_cents: "",
    interval_days: "30",
    payment_method: "card",
    next_charge_date: "",
  });
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const { data: rec } = await api.get("/me/recurring_donations");
      setDonations(Array.isArray(rec) ? rec : []);
    } catch {
      toast.error("Erro ao carregar doações recorrentes");
    } finally {
      setLoading(false);
    }
  }

  async function loadOrganizations() {
    try {
      const { data } = await api.get("/public/organizations");
      setOrganizations(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar instituições");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCancel(id, orgId) {
    if (!window.confirm("Cancelar esta doação recorrente?")) return;
    try {
      await api.delete(`/me/recurring_donations/${id}`, {
        params: { organization_id: orgId },
      });
      toast.success("Doação cancelada");
      loadData();
    } catch {
      toast.error("Erro ao cancelar");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/me/recurring_donations", {
        recurring_donation: {
          organization_id: newRecurring.organization_id,
          amount_cents: Math.round(parseFloat(newRecurring.amount_cents.replace(",", ".")) * 100),
          interval_days: parseInt(newRecurring.interval_days),
          payment_method: newRecurring.payment_method,
          next_charge_date: newRecurring.next_charge_date || undefined,
        },
      });
      toast.success("Doação recorrente criada!");
      setShowModal(false);
      setNewRecurring({
        organization_id: "",
        amount_cents: "",
        interval_days: "30",
        payment_method: "card",
        next_charge_date: "",
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar");
    } finally {
      setSaving(false);
    }
  }

  const totalActive = donations
    .filter((d) => d.status === "active")
    .reduce((s, d) => s + (d.amount_cents || 0), 0);

  return (
    <IndividualLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Minhas Doações Recorrentes</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gerencie suas assinaturas de doação
            </p>
          </div>
          <Button onClick={() => { setShowModal(true); loadOrganizations(); }}>
            <Plus size={16} /> Nova Doação
          </Button>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
          <div className="flex items-center gap-3">
            <RefreshCw size={24} className="text-blue-600" />
            <div>
              <p className="text-sm text-zinc-500">Total ativo por mês</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatCents(totalActive)}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
            <RefreshCw size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 mb-4">Nenhuma doação recorrente.</p>
            <Button onClick={() => { setShowModal(true); loadOrganizations(); }}>
              <Plus size={16} /> Criar primeira doação recorrente
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((d) => (
              <div
                key={d.recurring_id}
                className="bg-white rounded-[10px] p-5 border border-zinc-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">
                      {formatCents(d.amount_cents)}/mês
                    </p>
                    <p className="text-sm text-zinc-500">
                      {d.organization_name || "Instituição"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                      {d.next_charge_date && (
                        <span>Próxima: {formatDate(d.next_charge_date)}</span>
                      )}
                      <span>{d.payment_method}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          d.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {statusLabel(d.status)}
                      </span>
                    </div>
                  </div>
                  {d.status === "active" && (
                    <button
                      onClick={() => handleCancel(d.recurring_id, d.organization_id)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Nova Doação Recorrente</h3>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#334155]">
                    Instituição *
                  </label>
                  <select
                    value={newRecurring.organization_id}
                    onChange={(e) =>
                      setNewRecurring({ ...newRecurring, organization_id: e.target.value })
                    }
                    required
                    className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  >
                    <option value="">Selecione...</option>
                    {organizations.map((o) => (
                      <option key={o.organization_id || o.id} value={o.organization_id || o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155]">
                    Valor Mensal (R$) *
                  </label>
                  <input
                    value={newRecurring.amount_cents}
                    onChange={(e) =>
                      setNewRecurring({ ...newRecurring, amount_cents: e.target.value })
                    }
                    placeholder="50,00"
                    required
                    className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155]">
                    Intervalo
                  </label>
                  <select
                    value={newRecurring.interval_days}
                    onChange={(e) =>
                      setNewRecurring({ ...newRecurring, interval_days: e.target.value })
                    }
                    className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  >
                    <option value="7">Semanal (7 dias)</option>
                    <option value="15">Quinzenal (15 dias)</option>
                    <option value="30">Mensal (30 dias)</option>
                    <option value="90">Trimestral (90 dias)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155]">
                    Método de Pagamento
                  </label>
                  <select
                    value={newRecurring.payment_method}
                    onChange={(e) =>
                      setNewRecurring({ ...newRecurring, payment_method: e.target.value })
                    }
                    className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  >
                    <option value="card">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#334155]">
                    Data Primeira Cobrança
                  </label>
                  <input
                    type="date"
                    value={newRecurring.next_charge_date}
                    onChange={(e) =>
                      setNewRecurring({ ...newRecurring, next_charge_date: e.target.value })
                    }
                    className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Criando..." : "Criar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </IndividualLayout>
  );
}
