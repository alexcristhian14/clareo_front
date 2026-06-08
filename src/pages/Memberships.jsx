import { useState, useEffect } from "react";
import { api } from "../services/api";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { Button } from "../components/common/Button";
import { Search, Plus, X, ExternalLink, Building2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function Memberships() {
  const [associations, setAssociations] = useState([]);
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orgSearch, setOrgSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAssociations() {
    try {
      const { data } = await api.get("/associations");
      setAssociations(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar associações");
    } finally {
      setLoading(false);
    }
  }

  async function loadAvailableOrgs() {
    try {
      const { data } = await api.get("/public/organizations");
      setAvailableOrgs(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar instituições");
    }
  }

  useEffect(() => {
    loadAssociations();
  }, []);

  async function handleAssociate(e) {
    e.preventDefault();
    if (!selectedOrgId) return;
    setSaving(true);
    try {
      await api.post("/associations", { organization_id: selectedOrgId });
      toast.success("Associação criada!");
      setShowModal(false);
      setSelectedOrgId("");
      loadAssociations();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao associar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisassociate(orgId, orgName) {
    if (!window.confirm(`Desassociar de "${orgName}"?`)) return;
    try {
      await api.delete(`/associations/${orgId}`);
      toast.success("Desassociado com sucesso");
      loadAssociations();
    } catch {
      toast.error("Erro ao desassociar");
    }
  }

  const assocOrgIds = new Set(associations.map((a) => a.organization_id));
  const filteredAssociations = associations.filter((a) => {
    if (!search) return true;
    const name = (a.organization_name || "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const availableFiltered = availableOrgs.filter(
    (o) => !assocOrgIds.has(o.organization_id || o.id)
  );

  return (
    <IndividualLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Minhas Associações</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Instituições que você acompanha
            </p>
          </div>
          <Button onClick={() => { setShowModal(true); loadAvailableOrgs(); }}>
            <Plus size={16} /> Associar-se
          </Button>
        </div>

        <div className="relative flex-1 max-w-md mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar instituições..."
            className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            ))}
          </div>
        ) : filteredAssociations.length === 0 ? (
          <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
            <Building2 size={40} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-500 mb-4">Nenhuma associação encontrada.</p>
            <Button onClick={() => { setShowModal(true); loadAvailableOrgs(); }}>
              <Plus size={16} /> Associar-se a uma instituição
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssociations.map((a) => (
              <div
                key={a.organization_id}
                className="bg-white rounded-[10px] p-5 border border-zinc-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {(a.organization_name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {a.organization_name}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                        <span>{a.campaigns_count || 0} campanha(s)</span>
                        {a.campaigns?.length > 0 && a.campaigns.map((c) => (
                          <a
                            key={c.campaign_id}
                            href={`/public/accountability/${c.campaign_id}`}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={12} />
                            {c.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDisassociate(a.organization_id, a.organization_name)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                    title="Desassociar"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Associar-se a uma Instituição</h3>
                <button onClick={() => setShowModal(false)}>
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  placeholder="Buscar instituições..."
                  className="w-full h-10 pl-9 pr-4 rounded-[10px] bg-slate-50 border border-zinc-200 outline-none text-sm"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {availableFiltered
                  .filter((o) => {
                    if (!orgSearch) return true;
                    return (o.name || "").toLowerCase().includes(orgSearch.toLowerCase());
                  })
                  .map((o) => (
                    <button
                      key={o.organization_id || o.id}
                      onClick={() => setSelectedOrgId(o.organization_id || o.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedOrgId === (o.organization_id || o.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <p className="font-medium text-slate-800 text-sm">{o.name}</p>
                      {o.contact_email && (
                        <p className="text-xs text-zinc-500">{o.contact_email}</p>
                      )}
                    </button>
                  ))}
                {availableFiltered.filter((o) => {
                  if (!orgSearch) return true;
                  return (o.name || "").toLowerCase().includes(orgSearch.toLowerCase());
                }).length === 0 && (
                  <p className="text-sm text-zinc-400 text-center py-4">
                    Nenhuma instituição disponível
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssociate}
                  disabled={!selectedOrgId || saving}
                >
                  {saving ? "Associando..." : "Associar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </IndividualLayout>
  );
}
