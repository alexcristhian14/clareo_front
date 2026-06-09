import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { Pagination } from "../components/common/Pagination";
import { statusColor, statusLabel } from "../utils/format";
import { Search, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 15;

export function Contributors() {
  const navigate = useNavigate();
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadContributors();
  }, []);

  async function loadContributors() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const params = orgId ? { organization_id: orgId } : {};
      const { data } = await api.get("/contributors", { params });
      setContributors(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar contribuintes");
    } finally {
      setLoading(false);
    }
  }

  const filtered = contributors.filter(
    (c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [search]);

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
          <UserPlus size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 mb-2">Nenhum contribuinte encontrado.</p>
          <p className="text-sm text-zinc-400">
            Contribuintes aparecerão aqui após realizarem uma doação.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((c) => (
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
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
          />
        </div>
      )}
    </AppLayout>
  );
}
