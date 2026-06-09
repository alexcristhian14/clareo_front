import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, storeOrganization } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { Button } from "../components/common/Button";
import { Pagination } from "../components/common/Pagination";
import { Building2, Plus, ChevronRight, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export function MinhasInstituicoes() {
  const navigate = useNavigate();
  const { user, setCurrentOrganization } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    const userId = user.user_id || user.id;
    api.get(`/organizations?owner_user_id=${userId}&limit=50`).then(({ data }) => {
      const list = Array.isArray(data) ? data : data.organizations || [];
      setOrgs(list);
    }).catch(() => {
      toast.error("Erro ao carregar instituições");
    }).finally(() => setLoading(false));
  }, [user]);

  const totalPages = Math.max(1, Math.ceil(orgs.length / ITEMS_PER_PAGE));
  const paginatedOrgs = orgs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [orgs.length]);

  function handleSelectOrg(org) {
    storeOrganization(org);
    setCurrentOrganization(org);
    navigate("/dashboard");
  }

  return (
    <IndividualLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Minhas Instituições</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Gerencie suas instituições ou crie uma nova
            </p>
          </div>
          <Button onClick={() => navigate("/organizacoes/nova")}>
            <Plus size={16} /> Nova Instituição
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-zinc-200 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        ) : orgs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-zinc-200 text-center">
            <Building2 size={56} className="mx-auto text-zinc-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Você ainda não tem instituições
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Crie sua primeira instituição para começar a gerenciar campanhas,
              receber doações e prestar contas com transparência.
            </p>
            <Button onClick={() => navigate("/organizacoes/nova")}>
              <Plus size={16} /> Criar Instituição
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedOrgs.map((org) => (
              <div
                key={org.organization_id}
                className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between"
                onClick={() => handleSelectOrg(org)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {org.name?.charAt(0)?.toUpperCase() || "O"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{org.name}</p>
                    {org.contact_email && (
                      <p className="text-sm text-zinc-500">{org.contact_email}</p>
                    )}
                    <p className="text-xs text-zinc-400 mt-1">
                      {org.cnpj ? `CNPJ: ${org.cnpj}` : "Sem CNPJ"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <LayoutDashboard size={12} />
                    Painel
                  </span>
                  <ChevronRight size={20} className="text-zinc-400" />
                </div>
              </div>
            ))}
          </div>
        )}
        {orgs.length > ITEMS_PER_PAGE && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={orgs.length}
            />
          </div>
        )}
      </div>
    </IndividualLayout>
  );
}
