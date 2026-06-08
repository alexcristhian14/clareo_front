import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { displayToCents } from "../utils/format";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export function CampaignNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_cents: "",
    starts_at: "",
    ends_at: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const goalCents = displayToCents(form.goal_cents);
      await api.post(`/organizations/${orgId}/campaigns`, {
        campaign: {
          name: form.name,
          description: form.description || undefined,
          goal_cents: goalCents,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : undefined,
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : undefined,
          status: form.status,
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
        <ArrowLeft size={16} /> Voltar
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[10px] p-6 border border-zinc-200 max-w-2xl"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Nome da Campanha *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Festa Junina Beneficente"
              required
              minLength={3}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">
              Descrição
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descreva sua campanha..."
              rows={3}
              className="w-full mt-2 px-3 py-2 rounded-[10px] bg-slate-50 border border-[#334155] outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">
              Meta de Arrecadação (R$) *
            </label>
            <input
              name="goal_cents"
              value={form.goal_cents}
              onChange={handleChange}
              placeholder="10.000,00"
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#334155] text-xs font-bold">
                Data de Início
              </label>
              <input
                type="date"
                name="starts_at"
                value={form.starts_at}
                onChange={handleChange}
                className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
            </div>
            <div>
              <label className="text-[#334155] text-xs font-bold">
                Data de Término
              </label>
              <input
                type="date"
                name="ends_at"
                value={form.ends_at}
                onChange={handleChange}
                className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            >
              <option value="active">Ativa</option>
              <option value="draft">Rascunho</option>
              <option value="ended">Encerrada</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
