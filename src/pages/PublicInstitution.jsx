import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, API_BASE } from "../services/api";
import { Button } from "../components/common/Button";
import { formatCents, formatDateTime, statusColor, statusLabel } from "../utils/format";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/logo.svg";
import {
  Heart, ExternalLink, Calendar, TrendingUp, MessageCircle, Send,
  Image, Paperclip, Clock, User, ChevronDown, ChevronUp, Loader
} from "lucide-react";
import { toast } from "sonner";

export function PublicInstitution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [postFiles, setPostFiles] = useState([]);
  const [posting, setPosting] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [commenting, setCommenting] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showPastCampaigns, setShowPastCampaigns] = useState(false);

  useEffect(() => {
    api.get(`/public/institutions/${id}`).then(({ data }) => {
      setData(data);
    }).catch(() => {
      toast.error("Instituição não encontrada");
    }).finally(() => {
      setLoading(false);
    });
  }, [id]);

  async function handleCreatePost() {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const orgId = data.organization.organization_id;
      const formData = new FormData();
      formData.append("post[content]", newPost);
      for (const file of postFiles) {
        formData.append("files[]", file);
      }
      const { data: created } = await api.post(`/organizations/${orgId}/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setData(prev => ({
        ...prev,
        feed_posts: [created, ...(prev.feed_posts || [])]
      }));
      setNewPost("");
      setPostFiles([]);
      toast.success("Post publicado!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao publicar");
    } finally {
      setPosting(false);
    }
  }

  async function handleComment(postId) {
    const text = commentText[postId];
    if (!text?.trim()) return;
    setCommenting(prev => ({ ...prev, [postId]: true }));
    try {
      const { data: created } = await api.post(`/posts/${postId}/comments`, {
        comment: { content: text }
      });
      setData(prev => ({
        ...prev,
        feed_posts: (prev.feed_posts || []).map(p =>
          p.post_id === postId
            ? { ...p, comments: [created, ...(p.comments || [])] }
            : p
        )
      }));
      setCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao comentar");
    } finally {
      setCommenting(prev => ({ ...prev, [postId]: false }));
    }
  }

  function toggleComments(postId) {
    setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  }

  function isImageFile(contentType) {
    return contentType?.startsWith("image/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-zinc-500">Carregando...</p>
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
  const orgTotalSpent = orgExpenses.reduce((s, e) => s + (e.amount_cents || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between">
        <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
          <img src={logo} alt="Clareo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">CLAREO</span>
        </div>
        <button onClick={() => navigate("/")} className="text-sm text-zinc-500 hover:text-slate-700 underline">
          Voltar
        </button>
      </header>

      {/* Org hero */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/20">
              {(org.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{org.name}</h1>
              {org.contact_email && (
                <p className="text-white/60 text-sm">{org.contact_email}</p>
              )}
              <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-white/10 text-white/80">
                {activeCampaigns.length} campanha{activeCampaigns.length !== 1 ? "s" : ""} ativa{activeCampaigns.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active campaigns */}
          {activeCampaigns.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Heart size={20} className="text-red-500" />
                Campanhas Ativas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCampaigns.map((c) => {
                  const pct = c.goal_cents ? ((c.raised_cents || 0) / c.goal_cents) * 100 : 0;
                  return (
                    <div key={c.campaign_id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition">
                      {c.cover_image ? (
                        <div className="h-36 overflow-hidden">
                          <img src={c.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700"
                          style={c.cover_color ? { background: c.cover_color } : {}}
                        />
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{c.name}</h3>
                        {c.description && (
                          <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{c.description}</p>
                        )}
                        <div className="h-2.5 bg-stone-200 rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <div className="flex justify-between text-sm mb-4">
                          <span className="text-zinc-500">{formatCents(c.raised_cents || 0)} arrecadados</span>
                          <span className="font-medium text-blue-600">{pct.toFixed(0)}%</span>
                        </div>
                        {c.tags?.length > 0 && (
                          <div className="flex gap-1 mb-4 flex-wrap">
                            {c.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">#{tag}</span>
                            ))}
                          </div>
                        )}
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                        >
                          <Heart size={16} /> Doar para esta campanha
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past campaigns */}
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
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <TrendingUp size={18} className="text-zinc-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-700 text-sm">{c.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(c.status)}`}>
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
                          Ver Campanha
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Create post form */}
          {user && (
            <section className="bg-white rounded-[10px] p-5 border border-zinc-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-600" />
                Publicar no Feed
              </h3>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="O que está acontecendo na instituição?"
                rows={3}
                className="w-full p-3 rounded-[10px] bg-slate-50 border border-zinc-300 outline-none resize-none text-sm"
              />
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 text-sm text-zinc-500 cursor-pointer hover:text-blue-600">
                  <Image size={18} />
                  <span>Adicionar imagens</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPostFiles([...e.target.files])}
                    className="hidden"
                  />
                </label>
                <Button onClick={handleCreatePost} disabled={posting || !newPost.trim()} size="sm">
                  {posting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                  {posting ? "Publicando..." : "Publicar"}
                </Button>
              </div>
              {postFiles.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {Array.from(postFiles).map((f, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                      <Paperclip size={12} /> {f.name}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Feed posts */}
          {feedPosts.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-600" />
                Feed de Atualizações
              </h2>
              <div className="space-y-4">
                {feedPosts.map((post) => (
                  <div key={post.post_id} className="bg-white rounded-[10px] border border-zinc-200 overflow-hidden">
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{post.author_name}</p>
                          <p className="text-xs text-zinc-400 flex items-center gap-1">
                            <Clock size={12} /> {formatDateTime(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>

                      {/* Post attachments */}
                      {post.attachments?.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {post.attachments.map((att) => (
                            isImageFile(att.content_type) ? (
                              <img
                                key={att.attachment_id}
                                src={`${API_BASE}/api/v1/public/organizations/${org.organization_id}/posts/${post.post_id}/attachments/${att.attachment_id}/download`}
                                alt={att.original_filename}
                                className="rounded-lg w-full h-40 object-cover border border-zinc-200"
                              />
                            ) : (
                              <a
                                key={att.attachment_id}
                                href={`/api/v1/public/organizations/${org.organization_id}/posts/${post.post_id}/attachments/${att.attachment_id}/download`}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:underline p-2 bg-blue-50 rounded-lg"
                              >
                                <Paperclip size={14} /> {att.original_filename}
                              </a>
                            )
                          ))}
                        </div>
                      )}

                      {/* Comments toggle */}
                      <button
                        onClick={() => toggleComments(post.post_id)}
                        className="mt-4 flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-600"
                      >
                        <MessageCircle size={16} />
                        {post.comments?.length || 0} comentários
                        {expandedPosts[post.post_id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {/* Comments section */}
                      {expandedPosts[post.post_id] && (
                        <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
                          {post.comments?.length > 0 && (
                            <div className="space-y-3 mb-4">
                              {post.comments.map((c) => (
                                <div key={c.comment_id} className="flex gap-3">
                                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <User size={12} className="text-slate-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-slate-700">{c.author_name}</p>
                                    <p className="text-sm text-zinc-600">{c.content}</p>
                                    <p className="text-xs text-zinc-400 mt-1">{formatDateTime(c.created_at)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Comment form */}
                          {user ? (
                            <div className="flex gap-2">
                              <input
                                value={commentText[post.post_id] || ""}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.post_id]: e.target.value }))}
                                placeholder="Escreva um comentário..."
                                className="flex-1 h-10 px-3 rounded-[10px] bg-slate-50 border border-zinc-300 outline-none text-sm"
                                onKeyDown={(e) => e.key === "Enter" && handleComment(post.post_id)}
                              />
                              <Button
                                size="sm"
                                onClick={() => handleComment(post.post_id)}
                                disabled={commenting[post.post_id] || !commentText[post.post_id]?.trim()}
                              >
                                {commenting[post.post_id] ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                              </Button>
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-400">
                              <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">
                                Faça login
                              </button> para comentar.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No content state */}
          {campaigns.length === 0 && feedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-zinc-500">Esta instituição ainda não possui campanhas ou publicações.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Org expenses summary */}
          {orgExpenses.length > 0 && (
            <div className="bg-white rounded-[10px] border border-zinc-200 p-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-red-500" />
                Despesas Gerais
              </h3>
              <p className="text-2xl font-bold text-red-500 mb-1">{formatCents(orgTotalSpent)}</p>
              <p className="text-sm text-zinc-500">{orgExpenses.length} despesa{orgExpenses.length !== 1 ? "s" : ""}</p>
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {orgExpenses.slice(0, 10).map((e) => (
                  <div key={e.entry_id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-700 truncate">{e.description}</p>
                      <p className="text-xs text-zinc-400">{e.category}</p>
                    </div>
                    <span className="text-sm font-bold text-red-500 shrink-0 ml-2">{formatCents(e.amount_cents)}</span>
                  </div>
                ))}
              </div>
              {orgExpenses.length > 10 && (
                <p className="text-xs text-zinc-400 mt-2">+ {orgExpenses.length - 10} despesa{orgExpenses.length - 10 !== 1 ? "s" : ""}</p>
              )}
            </div>
          )}

          {/* Quick donate */}
          <div className="text-center bg-white rounded-2xl p-6 border border-zinc-200">
            <p className="text-lg font-bold text-slate-800 mb-3">
              Deseja apoiar esta instituição?
            </p>
            <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto">
              Sua doação ajuda a manter os projetos e campanhas da {org.name}.
            </p>
            <Button onClick={() => navigate(`/public/donate/organization/${org.organization_id}`, { state: { orgName: org.name } })}>
              <Heart size={18} />
              Fazer uma Doação
            </Button>
          </div>
        </div>
      </div>

      <footer className="mt-16 py-8 text-center border-t border-zinc-200">
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
          <img src={logo} alt="" className="h-5 w-5" />
          Clareo — Doe com transparência
        </div>
      </footer>
    </div>
  );
}
