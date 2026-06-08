import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, statusLabel } from "../utils/format";
import { ArrowLeft, X, Plus } from "lucide-react";
import { toast } from "sonner";

export function ContributorDetail() {
  const { contributorId } = useParams();
  const navigate = useNavigate();
  const [contributor, setContributor] = useState(null);
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [newRecurring, setNewRecurring] = useState({
    campaign_id: "",
    amount_cents: "",
    interval_days: "30",
    payment_method: "card",
    next_charge_date: "",
  });
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const { data: c } = await api.get(`/contributors/${contributorId}`);
      setContributor(c);

      const { data: rec } = await api.get(
        `/contributors/${contributorId}/recurring_donations`
      );
      setRecurring(Array.isArray(rec) ? rec : []);

      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (orgId) {
        const { data: comps } = await api.get(
          `/organizations/${orgId}/campaigns?limit=100`
        );
        setCampaigns(Array.isArray(comps) ? comps : []);
      }
    } catch {
      toast.error("Erro ao carregar contribuinte");
      navigate("/contributors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [contributorId]);

  async function handleCancelRecurring(recId) {
    if (!window.confirm("Cancelar esta doação recorrente?")) return;
    try {
      await api.delete(
        `/contributors/${contributorId}/recurring_donations/${recId}`,
        { data: {} }
      );
      toast.success("Doação cancelada");
      loadData();
    } catch {
      toast.error("Erro ao cancelar");
    }
  }

  async function handleCreateRecurring(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post(`/contributors/${contributorId}/recurring_donations`, {
        recurring_donation: {
          organization_id: orgId,
          amount_cents: Math.round(parseFloat(newRecurring.amount_cents.replace(",", ".")) * 100),
          interval_days: parseInt(newRecurring.interval_days),
          payment_method: newRecurring.payment_method,
          campaign_id: newRecurring.campaign_id || undefined,
          next_charge_date: newRecurring.next_charge_date || undefined,
        },
      });
      toast.success("Doação recorrente criada!");
      setShowRecurringModal(false);
      setNewRecurring({
        campaign_id: "",
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

  if (loading) {
    return (
      <AppLayout title="Carregando...">
        <div className="animate-pulse space-y-4">
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 h-40" />
        </div>
      </AppLayout>
    );
  }

  if (!contributor) return null;

  const totalActive = recurring
    .filter((r) => r.status === "active")
    .reduce((s, r) => s + (r.amount_cents || 0), 0);

  return (
    <AppLayout title={contributor.name}>
      <button
        onClick={() => navigate("/contributors")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Contribuintes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-4">Dados do Contribuinte</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Nome</dt>
              <dd className="font-medium text-slate-800">{contributor.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Email</dt>
              <dd className="font-medium text-slate-800">{contributor.email}</dd>
            </div>
            {contributor.cpf && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">CPF</dt>
                <dd className="font-medium text-slate-800">{contributor.cpf}</dd>
              </div>
            )}
            {contributor.phone && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Telefone</dt>
                <dd className="font-medium text-slate-800">{contributor.phone}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-zinc-500">Status</dt>
              <dd className="font-medium text-emerald-600">
                {statusLabel(contributor.status || "active")}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Membro desde</dt>
              <dd className="font-medium text-slate-800">
                {formatDate(contributor.created_at)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">
                Doações Recorrentes
              </h3>
              <Button size="sm" onClick={() => setShowRecurringModal(true)}>
                <Plus size={16} /> Nova
              </Button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Total ativo:{" "}
              <span className="font-bold text-slate-800">
                {formatCents(totalActive)}
              </span>
              /mês em {recurring.filter((r) => r.status === "active").length}{" "}
              assinatura(s)
            </p>
            {recurring.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Nenhuma doação recorrente.
              </p>
            ) : (
              <div className="space-y-3">
                {recurring.map((r) => (
                  <div
                    key={r.recurring_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {formatCents(r.amount_cents)}/mês
                      </p>
                      {r.next_charge_date && (
                        <p className="text-xs text-zinc-500">
                          Próxima: {formatDate(r.next_charge_date)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          r.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {statusLabel(r.status)}
                      </span>
                      {r.status === "active" && (
                        <button
                          onClick={() => handleCancelRecurring(r.recurring_id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg"
                        >
                          <X size={14} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRecurringModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">
                Nova Doação Recorrente
              </h3>
              <button onClick={() => setShowRecurringModal(false)}>
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleCreateRecurring} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155]">
                  Campanha
                </label>
                <select
                  value={newRecurring.campaign_id}
                  onChange={(e) =>
                    setNewRecurring({
                      ...newRecurring,
                      campaign_id: e.target.value,
                    })
                  }
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                >
                  <option value="">Selecione...</option>
                  {campaigns.map((c) => (
                    <option key={c.campaign_id} value={c.campaign_id}>
                      {c.name}
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
                    setNewRecurring({
                      ...newRecurring,
                      amount_cents: e.target.value,
                    })
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
                    setNewRecurring({
                      ...newRecurring,
                      interval_days: e.target.value,
                    })
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
                    setNewRecurring({
                      ...newRecurring,
                      payment_method: e.target.value,
                    })
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
                    setNewRecurring({
                      ...newRecurring,
                      next_charge_date: e.target.value,
                    })
                  }
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecurringModal(false)}
                >
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
    </AppLayout>
  );
}
