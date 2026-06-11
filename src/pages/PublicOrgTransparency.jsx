import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, API_BASE } from "../services/api";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, formatDateTime, statusLabel } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";
import {
  Heart, ExternalLink, Calendar, TrendingUp, MessageCircle,
  ChevronDown, ChevronUp, DollarSign, Target, Activity,
  FileText, ShieldCheck, Users, Clock, Image, Paperclip,
  ArrowUpRight, BarChart3, PieChart, Building2
} from "lucide-react";
import { toast } from "sonner";

const GRADIENTS = [
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-orange-500 via-pink-600 to-rose-700",
  "from-violet-600 via-purple-600 to-fuchsia-700",
  "from-sky-600 via-blue-600 to-indigo-700",
  "from-rose-600 via-red-600 to-pink-700",
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function PublicOrgTransparency() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPastCampaigns, setShowPastCampaigns] = useState(false);
  const [expandedCampaigns, setExpandedCampaigns] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedExpense, setExpandedExpense] = useState(null);

  useEffect(() => {
    api.get(`/public/institutions/${organizationId}`).then(({ data }) => {
      setData(data);
    }).catch(() => {
      toast.error("Instituição não encontrada");
    }).finally(() => {
      setLoading(false);
    });
  }, [organizationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!data?.organization) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zinc-500 mb-4">Instituição não encontrada</p>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  const org = data.organization;
  const campaigns = data.campaigns || [];
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const pastCampaigns = campaigns.filter((c) => c.status !== "active");
  const feedPosts = data.feed_posts || [];
  const orgExpenses = data.org_expenses || [];

  const allCampaignExpenses = campaigns.flatMap((c) =>
    (c.expenses || []).map((e) => ({ ...e, _campaignName: c.name, _campaignId: c.campaign_id }))
  );
  const allOrgExpenses = orgExpenses.map((e) => ({ ...e, _campaignName: "Geral", _campaignId: null }));
  const allExpenses = [...allCampaignExpenses, ...allOrgExpenses].sort(
    (a, b) => new Date(b.expense_date || b.created_at) - new Date(a.expense_date || a.created_at)
  );

  const totalRaised = campaigns.reduce((s, c) => s + (c.raised_cents || 0), 0);
  const totalSpent = allExpenses.reduce((s, e) => s + (e.amount_cents || 0), 0);
  const totalHeld = campaigns.reduce((s, c) => s + (c.held_cents || 0), 0);
  const balance = totalRaised - totalSpent;

  const gradientIdx = hashCode(organizationId) % GRADIENTS.length;
  const coverGradient = GRADIENTS[gradientIdx];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <img src={logo} alt="Clareo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">CLAREO</span>
        </button>
        <div className="flex items-center gap-3">
          <a
            href={`/public/institutions/${organizationId}`}
            className="text-sm text-zinc-500 hover:text-blue-600 underline flex items-center gap-1"
          >
            <ExternalLink size={14} /> Feed da Instituição
          </a>
          <button onClick={() => navigate("/")} className="text-sm text-zinc-500 hover:text-slate-700 underline">
            Voltar
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className={`bg-gradient-to-br ${coverGradient} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/20 shrink-0">
              {(org.name || "?")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{org.name}</h1>
              {org.contact_email && (
                <p className="text-white/70 text-sm">{org.contact_email}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-white/15 text-white/90 flex items-center gap-1">
                  <Activity size={12} /> {activeCampaigns.length} campanha{activeCampaigns.length !== 1 ? "s" : ""} ativa{activeCampaigns.length !== 1 ? "s" : ""}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/15 text-white/90 flex items-center gap-1">
                  <Target size={12} /> {formatCents(totalRaised)} arrecadados
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-white/15 text-white/90 flex items-center gap-1">
                  <FileText size={12} /> {allExpenses.length} despesa{allExpenses.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">Total Arrecadado</p>
            <p className="text-2xl font-bold text-slate-800">{formatCents(totalRaised)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
              <DollarSign size={20} className="text-red-500" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">Total Gasto</p>
            <p className="text-2xl font-bold text-slate-800">{formatCents(totalSpent)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
              <PieChart size={20} className="text-amber-600" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">Saldo Líquido</p>
            <p className="text-2xl font-bold text-slate-800">{formatCents(balance)}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {totalRaised > 0 ? `${((balance / totalRaised) * 100).toFixed(1)}% dos recursos` : "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium mb-1">Campanhas</p>
            <p className="text-2xl font-bold text-slate-800">{campaigns.length}</p>
            <p className="text-xs text-zinc-400 mt-1">{activeCampaigns.length} ativa{activeCampaigns.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Active Campaigns */}
            {activeCampaigns.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Heart size={20} className="text-red-500" />
                  Campanhas Ativas
                </h2>
                <div className="space-y-6">
                  {activeCampaigns.map((c) => {
                    const pct = c.goal_cents ? ((c.raised_cents || 0) / c.goal_cents) * 100 : 0;
                    const campExpenses = c.expenses || [];
                    const campSpent = campExpenses.reduce((s, e) => s + (e.amount_cents || 0), 0);
                    const isExpanded = expandedCampaigns[c.campaign_id];

                    return (
                      <div key={c.campaign_id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md transition">
                        {c.cover_image ? (
                          <div className="h-48 overflow-hidden">
                            <img src={c.cover_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-700"
                            style={c.cover_color ? { background: c.cover_color } : {}}
                          />
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 mb-1">{c.name}</h3>
                              {c.tags?.length > 0 && (
                                <div className="flex gap-1 mb-3 flex-wrap">
                                  {c.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">#{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                              c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                            }`}>
                              {statusLabel(c.status)}
                            </span>
                          </div>

                          {c.description && (
                            <p className="text-zinc-600 text-sm mb-4 leading-relaxed">{c.description}</p>
                          )}

                          {/* Progress bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="text-zinc-500">{formatCents(c.raised_cents || 0)} arrecadados</span>
                              <span className="font-bold text-blue-600">{pct.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-zinc-400 mt-1.5">
                              <span>Meta: {formatCents(c.goal_cents)}</span>
                              {c.ends_at && <span>Até {formatDate(c.ends_at)}</span>}
                            </div>
                          </div>

                          {/* Campaign actions */}
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                            >
                              <Heart size={14} /> Doar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                            >
                              <BarChart3 size={14} /> Prestação de Contas
                            </Button>
                          </div>

                          {/* Campaign expenses toggle */}
                          {campExpenses.length > 0 && (
                            <div className="mt-4 border-t border-zinc-100 pt-4">
                              <button
                                onClick={() => setExpandedCampaigns(prev => ({
                                  ...prev,
                                  [c.campaign_id]: !prev[c.campaign_id]
                                }))}
                                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600"
                              >
                                <FileText size={16} />
                                {campExpenses.length} despesa{campExpenses.length !== 1 ? "s" : ""}
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>

                              {isExpanded && (
                                <div className="mt-3 space-y-2">
                                  {campExpenses.map((e) => (
                                    <div key={e.entry_id}>
                                      <button
                                        onClick={() => setExpandedExpense(expandedExpense === e.entry_id ? null : e.entry_id)}
                                        className="w-full text-left flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 transition"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                            <DollarSign size={13} className="text-red-500" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-sm text-slate-700 truncate">{e.description}</p>
                                            <p className="text-xs text-zinc-400">{e.category} &middot; {formatDate(e.expense_date)}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0 ml-2">
                                          <span className="text-sm font-bold text-red-500">{formatCents(e.amount_cents)}</span>
                                          <ChevronDown size={14} className={`text-zinc-300 transition ${expandedExpense === e.entry_id ? "rotate-180" : ""}`} />
                                        </div>
                                      </button>
                                      {expandedExpense === e.entry_id && e.attachments?.length > 0 && (
                                        <div className="ml-10 mb-2 flex gap-2 flex-wrap">
                                          {e.attachments.map((att) => (
                                            att.content_type?.startsWith("image/") ? (
                                              <img
                                                key={att.attachment_id}
                                                src={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/campaigns/${c.campaign_id}/entries/${e.entry_id}/attachments/${att.attachment_id}/download`}
                                                alt={att.original_filename}
                                                className="w-24 h-20 object-cover rounded-lg border border-zinc-200"
                                              />
                                            ) : (
                                              <a
                                                key={att.attachment_id}
                                                href={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/campaigns/${c.campaign_id}/entries/${e.entry_id}/attachments/${att.attachment_id}/download`}
                                                className="flex items-center gap-1 text-xs text-blue-600 hover:underline p-1.5 bg-blue-50 rounded-lg"
                                              >
                                                <Paperclip size={12} /> {att.original_filename}
                                              </a>
                                            )
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Past Campaigns */}
            {pastCampaigns.length > 0 && (
              <section>
                <button
                  onClick={() => setShowPastCampaigns(!showPastCampaigns)}
                  className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 hover:text-slate-600"
                >
                  <Calendar size={20} className="text-zinc-400" />
                  Campanhas Anteriores ({pastCampaigns.length})
                  {showPastCampaigns ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {showPastCampaigns && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastCampaigns.map((c) => {
                      const pct = c.goal_cents ? ((c.raised_cents || 0) / c.goal_cents) * 100 : 0;
                      return (
                        <div key={c.campaign_id} className="bg-white rounded-xl border border-zinc-200 p-5 hover:shadow-md transition">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <TrendingUp size={18} className="text-zinc-400" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-700">{c.name}</h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-1 ${
                                c.status === "ended" ? "bg-zinc-100 text-zinc-600" : "bg-yellow-100 text-yellow-700"
                              }`}>
                                {statusLabel(c.status)}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-stone-200 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-zinc-500 mb-3">
                            <span>{formatCents(c.raised_cents || 0)} de {formatCents(c.goal_cents)}</span>
                            <span>{pct.toFixed(0)}%</span>
                          </div>
                          <button
                            onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                            className="w-full text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                          >
                            Ver detalhes
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* All Expenses Timeline */}
            {allExpenses.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FileText size={20} className="text-red-500" />
                  Todas as Despesas & Auditorias
                </h2>
                <div className="space-y-2">
                  {allExpenses.map((e) => (
                    <div key={e.entry_id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedExpense(expandedExpense === e.entry_id ? null : e.entry_id)}
                        className="w-full text-left flex items-center justify-between p-4 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            e.type === "audit" ? "bg-emerald-50" : "bg-red-50"
                          }`}>
                            {e.type === "audit"
                              ? <ShieldCheck size={16} className="text-emerald-500" />
                              : <DollarSign size={16} className="text-red-500" />
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{e.description}</p>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                              <span>{e.type === "audit" ? "Auditoria" : "Despesa"}</span>
                              {e._campaignName && e._campaignName !== "Geral" && (
                                <>
                                  <span>&middot;</span>
                                  <span className="text-blue-500">{e._campaignName}</span>
                                </>
                              )}
                              <span>&middot;</span>
                              <span>{formatDate(e.expense_date)}</span>
                              {e.category && (
                                <>
                                  <span>&middot;</span>
                                  <span>{e.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-sm font-bold ${e.type === "audit" ? "text-emerald-600" : "text-red-500"}`}>
                            {e.type === "audit" ? "+" : "-"}{formatCents(e.amount_cents)}
                          </span>
                          <ChevronDown size={14} className={`text-zinc-300 transition ${expandedExpense === e.entry_id ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      {expandedExpense === e.entry_id && (
                        <div className="px-4 pb-4 border-t border-zinc-100 pt-3">
                          <p className="text-sm text-zinc-600 mb-3">{e.description}</p>
                          {e.attachments?.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              {e.attachments.map((att) => (
                                att.content_type?.startsWith("image/") ? (
                                  <img
                                    key={att.attachment_id}
                                    src={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/entries/${e.entry_id}/attachments/${att.attachment_id}/download`}
                                    alt={att.original_filename}
                                    className="w-32 h-28 object-cover rounded-lg border border-zinc-200"
                                  />
                                ) : (
                                  <a
                                    key={att.attachment_id}
                                    href={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/entries/${e.entry_id}/attachments/${att.attachment_id}/download`}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline p-2 bg-blue-50 rounded-lg"
                                  >
                                    <Paperclip size={12} /> {att.original_filename}
                                  </a>
                                )
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Feed Posts */}
            {feedPosts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <MessageCircle size={20} className="text-blue-600" />
                  Feed de Atualizações
                </h2>
                <div className="space-y-4">
                  {feedPosts.map((post) => (
                    <div key={post.post_id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{post.author_name}</p>
                            <p className="text-xs text-zinc-400 flex items-center gap-1">
                              <Clock size={12} /> {formatDateTime(post.created_at)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>

                        {post.attachments?.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {post.attachments.map((att) => (
                              att.content_type?.startsWith("image/") ? (
                                <img
                                  key={att.attachment_id}
                                  src={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/posts/${post.post_id}/attachments/${att.attachment_id}/download`}
                                  alt={att.original_filename}
                                  className="rounded-lg w-full h-40 object-cover border border-zinc-200"
                                />
                              ) : (
                                <a
                                  key={att.attachment_id}
                                  href={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/posts/${post.post_id}/attachments/${att.attachment_id}/download`}
                                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline p-2 bg-blue-50 rounded-lg"
                                >
                                  <Paperclip size={12} /> {att.original_filename}
                                </a>
                              )
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setExpandedPosts(prev => ({ ...prev, [post.post_id]: !prev[post.post_id] }))}
                          className="mt-3 flex items-center gap-1 text-sm text-zinc-500 hover:text-blue-600"
                        >
                          <MessageCircle size={14} />
                          {post.comments?.length || 0} comentário{post.comments?.length !== 1 ? "s" : ""}
                          {expandedPosts[post.post_id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {expandedPosts[post.post_id] && post.comments?.length > 0 && (
                          <div className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                            {post.comments.map((c) => (
                              <div key={c.comment_id} className="flex gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                                  <Users size={10} className="text-slate-500" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-slate-700">{c.author_name}</p>
                                  <p className="text-sm text-zinc-600">{c.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {campaigns.length === 0 && feedPosts.length === 0 && allExpenses.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-500">Esta instituição ainda não possui dados de transparência.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation CTA */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200 sticky top-24">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
                Apoie esta instituição
              </h3>
              <p className="text-sm text-zinc-500 text-center mb-5">
                Sua doação faz a diferença. Contribua diretamente para a instituição ou escolha uma campanha específica.
              </p>

              <Button
                className="w-full mb-3"
                onClick={() => navigate(`/public/donate/organization/${organizationId}`, {
                  state: { orgName: org.name }
                })}
              >
                <Heart size={16} /> Doar Agora
              </Button>

              {activeCampaigns.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Campanhas ativas</p>
                  {activeCampaigns.map((c) => (
                    <button
                      key={c.campaign_id}
                      onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                      className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Target size={14} className="text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{c.name}</p>
                        <p className="text-xs text-zinc-400">{formatCents(c.raised_cents || 0)} de {formatCents(c.goal_cents)}</p>
                      </div>
                      <ArrowUpRight size={14} className="text-zinc-300 shrink-0 ml-auto" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Summary sidebar card */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-600" />
                Resumo Financeiro
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Arrecadado</span>
                  <span className="font-medium text-emerald-600">{formatCents(totalRaised)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Gasto</span>
                  <span className="font-medium text-red-500">{formatCents(totalSpent)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Reservado</span>
                  <span className="font-medium text-amber-600">{formatCents(totalHeld)}</span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Saldo Líquido</span>
                  <span className={`font-bold ${balance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {formatCents(balance)}
                  </span>
                </div>
              </div>

              {/* Allocation bar */}
              {totalRaised > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-zinc-400 mb-2">Alocação dos recursos</p>
                  <div className="h-3 bg-stone-200 rounded-full overflow-hidden flex">
                    {totalSpent > 0 && (
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${Math.min((totalSpent / totalRaised) * 100, 100)}%` }}
                        title={`Gasto: ${((totalSpent / totalRaised) * 100).toFixed(1)}%`}
                      />
                    )}
                    {totalHeld > 0 && (
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${Math.min((totalHeld / totalRaised) * 100, 100)}%` }}
                        title={`Reservado: ${((totalHeld / totalRaised) * 100).toFixed(1)}%`}
                      />
                    )}
                    {balance > 0 && (
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.max(Math.min((balance / totalRaised) * 100, 100), 0)}%` }}
                        title={`Disponível: ${((balance / totalRaised) * 100).toFixed(1)}%`}
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 mt-1.5">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Gasto ({((totalSpent / totalRaised) * 100).toFixed(0)}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Disponível ({((balance / totalRaised) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-xl p-5 border border-zinc-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity size={16} className="text-blue-600" />
                Estatísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Target size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Campanhas Ativas</p>
                    <p className="text-lg font-bold text-slate-700">{activeCampaigns.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <FileText size={15} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Despesas Registradas</p>
                    <p className="text-lg font-bold text-slate-700">{allExpenses.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Atualizações no Feed</p>
                    <p className="text-lg font-bold text-slate-700">{feedPosts.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center border-t border-zinc-200">
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
          <img src={logo} alt="" className="h-5 w-5" />
          Clareo &mdash; Doe com transparência
        </div>
      </footer>
    </div>
  );
}
