import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { Plus, CreditCard, X } from "lucide-react";
import { toast } from "sonner";

export function PaymentMethods() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    payment_type: "credit_card",
    reference: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMethods();
  }, []);

  async function loadMethods() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) { navigate("/organizacoes/nova"); return; }
      const { data } = await api.get(`/owners/organization/${orgId}/payment_methods`);
      setMethods(Array.isArray(data) ? data : []);
    } catch {
      setMethods([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post(`/owners/organization/${orgId}/payment_methods`, newMethod);
      toast.success("Método de pagamento adicionado!");
      setShowModal(false);
      setNewMethod({ payment_type: "credit_card", reference: "", is_default: false });
      loadMethods();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao adicionar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout title="Métodos de Pagamento">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          Métodos de Pagamento
        </h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Novo
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          ))}
        </div>
      ) : methods.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <CreditCard size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 mb-4">
            Nenhum método de pagamento cadastrado.
          </p>
          <Button onClick={() => setShowModal(true)}>
            Adicionar método
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <div
              key={m.payment_method_id}
              className="bg-white rounded-[10px] p-5 border border-zinc-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={24} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      {m.payment_type === "credit_card"
                        ? "Cartão de Crédito"
                        : m.payment_type === "pix"
                        ? "PIX"
                        : "Transferência Bancária"}
                    </p>
                    <p className="text-sm text-zinc-500">{m.reference}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.is_default && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      Padrão
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Novo Método de Pagamento</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155]">Tipo</label>
                <select
                  value={newMethod.payment_type}
                  onChange={(e) =>
                    setNewMethod({ ...newMethod, payment_type: e.target.value })
                  }
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                >
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="pix">PIX</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#334155]">
                  Referência
                </label>
                <input
                  value={newMethod.reference}
                  onChange={(e) =>
                    setNewMethod({ ...newMethod, reference: e.target.value })
                  }
                  placeholder="Token ou chave"
                  required
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newMethod.is_default}
                  onChange={(e) =>
                    setNewMethod({ ...newMethod, is_default: e.target.checked })
                  }
                  className="rounded"
                />
                Definir como padrão
              </label>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
