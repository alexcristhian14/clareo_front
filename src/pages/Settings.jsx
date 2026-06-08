import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { toast } from "sonner";

export function Settings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    contact_email: "",
    cnpj: "",
    webhook_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadOrg() {
    try {
      const stored = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = stored?.organization_id || stored?.id;
      if (!orgId) { navigate("/organizacoes/nova"); return; }

      const { data } = await api.get(`/organizations/${orgId}`);
      setForm({
        name: data.name || "",
        contact_email: data.contact_email || "",
        cnpj: data.cnpj || "",
        webhook_url: data.webhook_url || "",
      });
    } catch {
      toast.error("Erro ao carregar configurações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrg();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const stored = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = stored?.organization_id || stored?.id;
      await api.patch(`/organizations/${orgId}`, {
        organization: form,
      });
      toast.success("Configurações salvas!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Configurações">
        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse h-64" />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Configurações">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-[10px] p-6 border border-zinc-200 max-w-2xl"
      >
        <h3 className="font-bold text-slate-800 mb-4">
          Dados da Organização
        </h3>

        <div className="space-y-5">
          <div>
            <label className="text-[#334155] text-xs font-bold">Nome *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Email de Contato
            </label>
            <input
              type="email"
              value={form.contact_email}
              onChange={(e) =>
                setForm({ ...form, contact_email: e.target.value })
              }
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
          <div>
            <label className="text-[#334155] text-xs font-bold">CNPJ</label>
            <input
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
              placeholder="12.345.678/0001-90"
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Webhook URL
            </label>
            <input
              type="url"
              value={form.webhook_url}
              onChange={(e) =>
                setForm({ ...form, webhook_url: e.target.value })
              }
              placeholder="https://exemplo.com/webhooks"
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
        </div>

        <Button type="submit" className="mt-8" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </AppLayout>
  );
}
