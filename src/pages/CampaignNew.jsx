import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, displayToCents } from "../utils/format";
import { toast } from "sonner";
import { ArrowLeft, Image, X, Palette, Eye, Edit3, Heart, Tag } from "lucide-react";

const COLORS = [
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#eab308", "#f97316", "#10b981",
  "#14b8a6", "#06b6d4", "#22c55e", "#84cc16", "#0ea5e9",
  "#2563eb", "#1e40af", "#1e293b", "#475569", "#dc2626",
];

export function CampaignNew() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [tab, setTab] = useState("dados");
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_cents: "",
    starts_at: "",
    ends_at: "",
    cover_color: "",
    cover_image: "",
    tags: "",
  });
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const goalCentsNum = displayToCents(form.goal_cents) || 0;
  const previewPct = goalCentsNum > 0 ? 65 : 0;
  const tagsList = form.tags
    ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  function toTimestamp(dateStr) {
    if (!dateStr) return undefined;
    return `${dateStr}T12:00:00Z`;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result;
      setCoverPreview(base64);
      setForm({ ...form, cover_image: base64 });
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setCoverPreview(null);
    setForm({ ...form, cover_image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const goalCents = displayToCents(form.goal_cents);
      const tags = tagsList.length > 0 ? tagsList : undefined;
      await api.post(`/organizations/${orgId}/campaigns`, {
        campaign: {
          name: form.name,
          description: form.description || undefined,
          goal_cents: goalCents,
          starts_at: toTimestamp(form.starts_at),
          ends_at: toTimestamp(form.ends_at),
          cover_image: form.cover_image || undefined,
          cover_color: form.cover_color || undefined,
          tags: tags,
        },
      });
      toast.success("Campanha criada!");
      navigate("/campaigns");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar campanha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="Nova Campanha">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Campanhas
      </button>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("dados")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "dados" ? "bg-white text-slate-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <Edit3 size={16} />
          Dados da Campanha
        </button>
        <button
          onClick={() => setTab("visual")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === "visual" ? "bg-white text-slate-800 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
          }`}
        >
          <Eye size={16} />
          Personalizar & Preview
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {tab === "dados" && (
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 max-w-2xl space-y-6">
            <div>
              <label className="text-[#334155] text-xs font-bold">Nome da Campanha *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Festa Junina Beneficente"
                required
                minLength={3}
                className="w-full mt-2 h-12 px-4 rounded-xl bg-slate-50 border border-[#334155] outline-none"
              />
            </div>

            <div>
              <label className="text-[#334155] text-xs font-bold">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Conte um pouco sobre o objetivo da campanha..."
                rows={3}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-[#334155] outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[#334155] text-xs font-bold">Meta de Arrecadação (R$) *</label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">R$</span>
                <input
                  name="goal_cents"
                  value={form.goal_cents}
                  onChange={handleChange}
                  placeholder="10.000,00"
                  required
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#334155] text-xs font-bold">Data de Início</label>
                <input
                  type="date"
                  name="starts_at"
                  value={form.starts_at}
                  onChange={handleChange}
                  className="w-full mt-2 h-12 px-4 rounded-xl bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div>
                <label className="text-[#334155] text-xs font-bold">Data de Término</label>
                <input
                  type="date"
                  name="ends_at"
                  value={form.ends_at}
                  onChange={handleChange}
                  className="w-full mt-2 h-12 px-4 rounded-xl bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[#334155] text-xs font-bold flex items-center gap-1">
                <Tag size={14} />
                Tags <span className="text-zinc-400 font-normal">(separadas por vírgula)</span>
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Ex: educação, crianças, tecnologia"
                className="w-full mt-2 h-12 px-4 rounded-xl bg-slate-50 border border-[#334155] outline-none"
              />
              {tagsList.length > 0 && (
                <div className="flex gap-1 mt-3 flex-wrap">
                  {tagsList.map((t, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
                Cancelar
              </Button>
              <Button type="button" onClick={() => setTab("visual")}>
                Personalizar Capa
              </Button>
            </div>
          </div>
        )}

        {tab === "visual" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Customization controls */}
            <div className="bg-white rounded-2xl p-8 border border-zinc-200 lg:w-[400px] shrink-0 space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Image size={18} />
                Personalização Visual
              </h3>

              <div>
                <label className="text-[#334155] text-xs font-bold mb-2 block">Imagem de Capa</label>
                {coverPreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={coverPreview} alt="" className="w-full h-32 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-zinc-300 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition"
                  >
                    <Image size={24} className="text-zinc-300" />
                    <span className="text-xs text-zinc-400 font-medium">Clique para enviar</span>
                    <span className="text-[10px] text-zinc-300">PNG, JPG — 2MB máx</span>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>

              <div>
                <label className="text-[#334155] text-xs font-bold mb-2 flex items-center gap-1">
                  <Palette size={14} />
                  Cor de Fundo
                </label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, cover_color: form.cover_color === c ? "" : c })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        form.cover_color === c
                          ? "border-slate-800 scale-110 shadow-md"
                          : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="color"
                    value={form.cover_color || "#3b82f6"}
                    onChange={(e) => setForm({ ...form, cover_color: e.target.value })}
                    className="w-9 h-9 rounded-full border-0 cursor-pointer"
                  />
                  <input
                    name="cover_color"
                    value={form.cover_color}
                    onChange={handleChange}
                    placeholder="#3b82f6"
                    className="flex-1 h-10 px-4 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setTab("dados")}>
                  Voltar aos Dados
                </Button>
                <Button type="submit" disabled={loading || !form.name}>
                  {loading ? "Criando..." : "Criar Campanha"}
                </Button>
              </div>
            </div>

            {/* Live preview */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Eye size={18} />
                Preview
              </h3>
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                {/* Cover */}
                {coverPreview ? (
                  <div className="h-44 overflow-hidden">
                    <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="h-44 flex items-center justify-center"
                    style={{
                      background: form.cover_color
                        ? (form.cover_color.startsWith("#") ? form.cover_color : `#${form.cover_color}`)
                        : "linear-gradient(135deg, #3b82f6, #6366f1)",
                    }}
                  >
                    {!form.cover_color && !coverPreview && (
                      <div className="text-center text-white/70">
                        <Image size={32} className="mx-auto mb-1 opacity-50" />
                        <p className="text-xs">Capa da Campanha</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow">
                      {(form.name || "C")[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">
                        {form.name || "Nome da Campanha"}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {form.starts_at
                          ? new Date(form.starts_at + "T12:00:00Z").toLocaleDateString("pt-BR")
                          : "Data de início"}
                        {form.ends_at && " até "}
                        {form.ends_at &&
                          new Date(form.ends_at + "T12:00:00Z").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span className="ml-auto text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                      Rascunho
                    </span>
                  </div>

                  {form.description && (
                    <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{form.description}</p>
                  )}

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-500">
                        {formatCents(0)} de {formatCents(goalCentsNum || 500000)}
                      </span>
                      <span className="font-medium text-blue-600">{goalCentsNum > 0 ? "0%" : "—"}</span>
                    </div>
                    <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                        style={{ width: "0%" }}
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  {tagsList.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {tagsList.map((t, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Fake donate button */}
                  <button
                    type="button"
                    className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 opacity-60"
                  >
                    <Heart size={16} />
                    Doar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </AppLayout>
  );
}
