import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { ExpenseDetailModal } from "../components/common/modals/ExpenseDetailModal";
import {
  formatCents,
  formatDate,
  relativeTime,
  statusColor,
  statusLabel,
  displayToCents,
  sanitizeDescription,
} from "../utils/format";
import {
  ArrowLeft, Copy, Plus, ExternalLink, Edit3, Play, Square,
  DollarSign, MessageSquare, ShieldCheck, Image, Upload, X,
  Eye, Pencil,
} from "lucide-react";
import { toast } from "sonner";

const COLORS = [
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#eab308", "#f97316", "#10b981",
  "#14b8a6", "#06b6d4", "#22c55e", "#84cc16", "#0ea5e9",
  "#2563eb", "#1e40af", "#1e293b", "#475569", "#dc2626",
];

const TYPE_CONFIG = {
  expense: { icon: DollarSign, label: "Despesa", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  update: { icon: MessageSquare, label: "Atualização", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  audit: { icon: ShieldCheck, label: "Auditoria", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  redemption: { icon: DollarSign, label: "Resgate", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
};

export function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [campaign, setCampaign] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("transactions");
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editCoverPreview, setEditCoverPreview] = useState(null);

  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const [newEntryOpen, setNewEntryOpen] = useState(false);
  const [entryForm, setEntryForm] = useState({
    type: "update",
    description: "",
    amount_cents: "",
    category: "",
    expense_date: new Date().toISOString().split("T")[0],
    status: "paid",
  });

  async function loadCampaign() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data: c } = await api.get(`/organizations/${orgId}/campaigns/${campaignId}`);
      setCampaign(c);
      setEditForm({
        name: c.name || "",
        description: c.description || "",
        goal_cents: c.goal_cents ? formatCents(c.goal_cents).replace("R$ ", "").replace(/\./g, "").replace(",", ",") : "",
        starts_at: c.starts_at ? c.starts_at.split("T")[0] : "",
        ends_at: c.ends_at ? c.ends_at.split("T")[0] : "",
        cover_image: c.cover_image || "",
        cover_color: c.cover_color || "",
        tags: c.tags?.join(", ") || "",
      });

      const { data: tx } = await api.get(`/campaigns/${campaignId}/transactions?limit=50`);
      setTransactions(Array.isArray(tx) ? tx : []);

      const { data: exps } = await api.get(`/organizations/${orgId}/campaigns/${campaignId}/expenses?limit=100`);
      const allEntries = Array.isArray(exps) ? exps.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) : [];
      setEntries(allEntries);
    } catch {
      toast.error("Erro ao carregar campanha");
      navigate("/campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
  const orgId = org?.organization_id || org?.id;
  const pct = campaign?.goal_cents
    ? ((campaign.raised_cents || 0) / campaign.goal_cents) * 100 : 0;
  const filteredEntries = entries.filter((e) => {
    if (tab === "expenses") return e.type === "expense" || !e.type;
    if (tab === "updates") return e.type === "update" || e.type === "audit" || e.type === "redemption";
    return true;
  });

  function handleCopyPublicLink() {
    const link = `${window.location.origin}/public/donate/campaign/${campaignId}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  }

  async function handleStatusChange(newStatus) {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const updated = await api.put(`/organizations/${orgId}/campaigns/${campaignId}`, {
        campaign: { status: newStatus },
      });
      setCampaign(updated.data);
      toast.success(newStatus === "active" ? "Campanha ativada!" : "Campanha desativada!");
    } catch {
      toast.error("Erro ao alterar status");
    }
  }

  async function handleRedeem() {
    try {
      const amountCents = displayToCents(redeemAmount);
      if (!amountCents || amountCents <= 0) { toast.error("Valor inválido"); return; }
      setRedeeming(true);
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data: updated } = await api.put(`/organizations/${orgId}/campaigns/${campaignId}/redeem`, {
        amount_cents: amountCents,
      });
      setCampaign(updated);
      setRedeemOpen(false);
      setRedeemAmount("");
      toast.success("Valor resgatado com sucesso!");
      loadCampaign();
    } catch {
      toast.error("Erro ao resgatar");
    } finally {
      setRedeeming(false);
    }
  }

  async function handleSaveEdit() {
    try {
      const goalCents = editForm.goal_cents ? displayToCents(editForm.goal_cents) : campaign.goal_cents;
      const tags = editForm.tags ? editForm.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined;
      const payload = {
        campaign: {
          name: editForm.name || campaign.name,
          description: editForm.description || undefined,
          goal_cents: goalCents,
          starts_at: editForm.starts_at ? `${editForm.starts_at}T12:00:00Z` : undefined,
          ends_at: editForm.ends_at ? `${editForm.ends_at}T12:00:00Z` : undefined,
          cover_image: editForm.cover_image || undefined,
          cover_color: editForm.cover_color || undefined,
          tags: tags,
        },
      };
      const { data: updated } = await api.put(`/organizations/${orgId}/campaigns/${campaignId}`, payload);
      setCampaign(updated);
      setEditing(false);
      toast.success("Campanha atualizada!");
    } catch {
      toast.error("Erro ao atualizar campanha");
    }
  }

  function handleEditImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Imagem muito grande. Máximo 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result;
      setEditCoverPreview(base64);
      setEditForm({ ...editForm, cover_image: base64 });
    };
    reader.readAsDataURL(file);
  }

  function toTimestamp(dateStr) {
    if (!dateStr) return undefined;
    return `${dateStr}T12:00:00Z`;
  }

  async function handleCreateEntry(e) {
    e.preventDefault();
    try {
      const amountCents = displayToCents(entryForm.amount_cents);
      const payload = {
        expense: {
          description: entryForm.description,
          type: entryForm.type,
          amount_cents: entryForm.type === "expense" ? amountCents : undefined,
          category: entryForm.type === "expense" ? (entryForm.category || undefined) : undefined,
          expense_date: entryForm.expense_date || undefined,
          status: entryForm.type === "expense" ? "paid" : "active",
        },
      };
      await api.post(`/organizations/${orgId}/campaigns/${campaignId}/expenses`, payload);
      toast.success("Registrado com sucesso!");
      setNewEntryOpen(false);
      setEntryForm({ type: "update", description: "", amount_cents: "", category: "", expense_date: new Date().toISOString().split("T")[0], status: "paid" });
      loadCampaign();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao registrar");
    }
  }

  if (loading) {
    return (
      <AppLayout title="Carregando...">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-64" /><div className="h-4 bg-gray-200 rounded w-96" /><div className="h-3 bg-gray-200 rounded w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!campaign) return null;

  return (
    <AppLayout title={campaign.name}>
      <button onClick={() => navigate("/campaigns")} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6">
        <ArrowLeft size={16} /> Campanhas
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Meta</p>
          <p className="text-lg font-bold text-slate-800">{formatCents(campaign.goal_cents)}</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Arrecadado</p>
          <p className="text-lg font-bold text-emerald-600">{formatCents(campaign.raised_cents || 0)}</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Disponível para Resgate</p>
          <p className="text-lg font-bold text-amber-600">{formatCents(campaign.held_cents || 0)}</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Progresso</p>
          <p className="text-lg font-bold text-blue-600">{pct.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-1">Status</p>
          <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
            campaign.status === "active" ? "bg-emerald-100 text-emerald-700" :
            campaign.status === "ended" ? "bg-zinc-100 text-zinc-600" :
            "bg-blue-100 text-blue-700"
          }`}>
            {campaign.status === "active" ? "Ativa" : campaign.status === "ended" ? "Encerrada" : "Rascunho"}
          </span>
        </div>
      </div>

      <div className="h-4 bg-stone-200 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>
          <Pencil size={14} /> {editing ? "Cancelar" : "Editar"}
        </Button>
        {campaign.status !== "active" && campaign.status !== "ended" && (
          <Button size="sm" onClick={() => handleStatusChange("active")}>
            <Play size={14} /> Ativar
          </Button>
        )}
        {campaign.status === "active" && (
          <Button size="sm" variant="outline" onClick={() => handleStatusChange("draft")}>
            <Square size={14} /> Desativar
          </Button>
        )}
        <Button size="sm" disabled={(campaign.held_cents || 0) <= 0} onClick={() => setRedeemOpen(true)}>
          <DollarSign size={14} /> Resgatar
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.open(`/public/donate/campaign/${campaignId}`, "_blank")}>
          <ExternalLink size={14} /> Ver Página de Doação
        </Button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6 space-y-4">
          <h3 className="font-bold text-slate-800">Editar Campanha</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-500">Nome</label>
              <input name="name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full mt-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500">Meta (R$)</label>
              <input value={editForm.goal_cents} onChange={(e) => setEditForm({ ...editForm, goal_cents: e.target.value })} className="w-full mt-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-zinc-500">Descrição</label>
              <textarea name="description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className="w-full mt-1 px-3 py-2 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500">Data de Início</label>
              <input type="date" value={editForm.starts_at} onChange={(e) => setEditForm({ ...editForm, starts_at: e.target.value })} className="w-full mt-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500">Data de Término</label>
              <input type="date" value={editForm.ends_at} onChange={(e) => setEditForm({ ...editForm, ends_at: e.target.value })} className="w-full mt-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-zinc-500">Tags (separadas por vírgula)</label>
              <input value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} placeholder="educação, crianças" className="w-full mt-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-zinc-500 mb-2 block">Capa</label>
              {(editCoverPreview || editForm.cover_image) ? (
                <div className="relative w-full h-32 rounded-[10px] overflow-hidden">
                  <img src={editCoverPreview || editForm.cover_image} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setEditCoverPreview(null); setEditForm({ ...editForm, cover_image: "" }); }} className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"><X size={14} /></button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-24 rounded-[10px] border-2 border-dashed border-zinc-300 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-400 transition">
                  <Image size={20} className="text-zinc-300" />
                  <span className="text-xs text-zinc-400">Clique para enviar imagem</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
              <div className="flex gap-2 flex-wrap mt-2">
                {COLORS.slice(0, 10).map((c) => (
                  <button key={c} type="button" onClick={() => setEditForm({ ...editForm, cover_color: editForm.cover_color === c ? "" : c })}
                    className={`w-6 h-6 rounded-full border-2 ${editForm.cover_color === c ? "border-slate-800 scale-110" : "border-transparent"}`} style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveEdit}><Pencil size={14} /> Salvar</Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "transactions", label: "Transações" },
          { key: "all", label: "Atualizações" },
          { key: "expenses", label: "Despesas" },
          { key: "updates", label: "Comunicados" },
          { key: "public", label: "Link Público" },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-zinc-200 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Transactions */}
      {tab === "transactions" && (
        <div className="bg-white rounded-[10px] border border-zinc-200">
          <div className="px-6 py-4 border-b border-zinc-100"><h3 className="font-bold text-slate-800">Transações da Campanha</h3></div>
          {transactions.length === 0 ? (
            <p className="px-6 py-8 text-center text-zinc-500">Nenhuma transação ainda.</p>
          ) : (
            <div className="divide-y divide-zinc-100">
              {transactions.map((t) => (
                <div key={t.transaction_id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/transactions/${t.transaction_id}`)}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${t.transaction_type === "credit" ? "text-emerald-600" : "text-red-500"}`}>
                      {t.transaction_type === "credit" ? "+" : "-"}{formatCents(t.amount_cents)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{relativeTime(t.created_at)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}>{statusLabel(t.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Entries (unified) */}
      {(tab === "all" || tab === "expenses" || tab === "updates") && (
        <div className="bg-white rounded-[10px] border border-zinc-200">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">
              {tab === "expenses" ? "Despesas" : tab === "updates" ? "Comunicados" : "Atualizações"}
            </h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setNewEntryOpen(!newEntryOpen)}>
                <Plus size={16} /> {newEntryOpen ? "Cancelar" : "Nova Atualização"}
              </Button>
              {tab === "expenses" && (
                <Button size="sm" variant="outline" onClick={() => navigate(`/campaigns/${campaignId}/expenses`)}>
                  <Eye size={14} /> Ver Todas
                </Button>
              )}
            </div>
          </div>

          {/* New entry form */}
          {newEntryOpen && (
            <div className="p-6 border-b border-zinc-100 bg-slate-50">
              <form onSubmit={handleCreateEntry} className="space-y-3 max-w-xl">
                <div>
                  <label className="text-xs font-bold text-zinc-500">Tipo</label>
                  <select value={entryForm.type} onChange={(e) => setEntryForm({ ...entryForm, type: e.target.value })}
                    className="w-full mt-1 h-10 px-3 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm">
                    <option value="update">Atualização</option>
                    <option value="expense">Despesa</option>
                    <option value="audit">Auditoria</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500">Mensagem *</label>
                  <textarea value={entryForm.description} onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })}
                    required rows={2}
                    placeholder={entryForm.type === "expense" ? "Ex: Compra de materiais" : "Ex: Iniciamos a distribuição dos kits"}
                    className="w-full mt-1 px-3 py-2 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm resize-none" />
                </div>
                {entryForm.type === "expense" && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-zinc-500">Valor (R$) *</label>
                      <input value={entryForm.amount_cents} onChange={(e) => setEntryForm({ ...entryForm, amount_cents: e.target.value })}
                        required placeholder="200,00" className="w-full mt-1 h-10 px-3 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500">Categoria</label>
                      <select value={entryForm.category} onChange={(e) => setEntryForm({ ...entryForm, category: e.target.value })}
                        className="w-full mt-1 h-10 px-3 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm">
                        <option value="">Selecione...</option>
                        {["Alimentação", "Estrutura", "Divulgação", "Transporte", "Pessoal", "Material", "Serviço", "Impostos", "Outros"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-xs font-bold text-zinc-500">Data</label>
                  <input type="date" value={entryForm.expense_date} onChange={(e) => setEntryForm({ ...entryForm, expense_date: e.target.value })}
                    className="w-full mt-1 h-10 px-3 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm" />
                </div>
                <Button type="submit" size="sm">Publicar</Button>
              </form>
            </div>
          )}

          {/* Entries list */}
          {filteredEntries.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-zinc-500">
                {tab === "expenses" ? "Nenhuma despesa registrada." : tab === "updates" ? "Nenhum comunicado publicado." : "Nenhuma atualização ainda."}
              </p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => setNewEntryOpen(true)}>
                <Plus size={14} /> Criar primeira
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {filteredEntries.map((e) => {
                const t = e.type || "expense";
                const cfg = TYPE_CONFIG[t] || TYPE_CONFIG.expense;
                const Icon = cfg.icon;
                return (
                  <div key={e.entry_id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelectedEntry(e)}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={16} className={cfg.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                          {e.expense_date && <span className="text-xs text-zinc-400">{formatDate(e.expense_date)}</span>}
                          {e.status && t === "expense" && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor(e.status)}`}>{statusLabel(e.status)}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-800">{sanitizeDescription(e.description)}</p>
                        {e.amount_cents > 0 && (
                          <p className={`text-sm font-bold mt-0.5 ${t === "expense" ? "text-red-500" : t === "redemption" ? "text-amber-600" : ""}`}>
                            {t === "expense" ? "-" : t === "redemption" ? "+" : ""}{formatCents(e.amount_cents)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Public Link */}
      {tab === "public" && (
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-2">Link Público de Doação</h3>
          <p className="text-sm text-zinc-500 mb-4">Compartilhe este link para receber doações:</p>
          <div className="flex items-center gap-2">
            <input type="text" readOnly value={`${window.location.origin}/public/donate/campaign/${campaignId}`}
              className="flex-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-zinc-200 text-sm outline-none select-all" />
            <Button onClick={handleCopyPublicLink}><Copy size={16} /> Copiar</Button>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => window.open(`/public/donate/campaign/${campaignId}`, "_blank")}>
              <ExternalLink size={16} /> Abrir página de doação
            </Button>
          </div>
        </div>
      )}

      {/* Redeem modal */}
      {redeemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !redeeming && setRedeemOpen(false)}>
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Resgatar Fundos</h3>
            <p className="text-sm text-zinc-500 mb-4">
              Disponível: <strong className="text-amber-600">{formatCents(campaign.held_cents || 0)}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor para resgatar</label>
              <input type="text" value={redeemAmount} onChange={(e) => setRedeemAmount(e.target.value)}
                placeholder="R$ 0,00" className="w-full h-11 px-3 rounded-[10px] border border-zinc-200 outline-none focus:border-blue-400" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" disabled={redeeming} onClick={() => { setRedeemOpen(false); setRedeemAmount(""); }}>
                Cancelar
              </Button>
              <Button disabled={redeeming || !redeemAmount} onClick={handleRedeem}>
                {redeeming ? "Resgatando..." : "Confirmar Resgate"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ExpenseDetailModal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        expense={selectedEntry}
        orgId={orgId}
        campaignId={campaignId}
      />
    </AppLayout>
  );
}
