import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { statusColor, statusLabel } from "../utils/format";
import { Search, Plus, Eye, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

export function Contributors() {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newContributor, setNewContributor] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContributors();
  }, []);

  async function loadContributors() {
    try {
      const { data } = await api.get("/contributors");
      setContributors(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar contribuintes");
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
      await api.post("/contributors", {
        contributor: {
          ...newContributor,
          organization_id: orgId,
        },
      });
      toast.success("Contribuinte criado!");
      setShowModal(false);
      setNewContributor({ name: "", email: "", cpf: "", phone: "" });
      loadContributors();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar contribuinte");
    } finally {
      setSaving(false);
    }
  }

  const filtered = contributors.filter(
    (c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Contribuintes">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar contribuintes..."
            className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm"
          />
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={16} /> Novo Contribuinte
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <p className="text-zinc-500 mb-4">Nenhum contribuinte encontrado.</p>
          <Button onClick={() => setShowModal(true)}>
            <UserPlus size={16} /> Adicionar contribuinte
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id || c.contributor_id}
              className="bg-white rounded-[10px] p-5 border border-zinc-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/contributors/${c.id || c.contributor_id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {c.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{c.name}</p>
                    <p className="text-sm text-zinc-500">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(c.status || "active")}`}
                  >
                    {statusLabel(c.status || "active")}
                  </span>
                  <Eye size={16} className="text-zinc-400" />
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
              <h3 className="font-bold text-slate-800">Novo Contribuinte</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155]">Nome *</label>
                <input
                  value={newContributor.name}
                  onChange={(e) =>
                    setNewContributor({ ...newContributor, name: e.target.value })
                  }
                  required
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#334155]">Email *</label>
                <input
                  type="email"
                  value={newContributor.email}
                  onChange={(e) =>
                    setNewContributor({ ...newContributor, email: e.target.value })
                  }
                  required
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#334155]">CPF</label>
                <input
                  value={newContributor.cpf}
                  onChange={(e) =>
                    setNewContributor({ ...newContributor, cpf: e.target.value })
                  }
                  placeholder="123.456.789-00"
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#334155]">
                  Telefone
                </label>
                <input
                  value={newContributor.phone}
                  onChange={(e) =>
                    setNewContributor({ ...newContributor, phone: e.target.value })
                  }
                  placeholder="(11) 99999-8888"
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
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
