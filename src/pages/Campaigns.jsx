import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { Pagination } from "../components/common/Pagination";
import { formatCents, formatDate, statusColor, statusLabel } from "../utils/format";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 12;

export function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  async function loadCampaigns() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      if (!orgId) { navigate("/organizacoes/nova"); return; }
      const { data } = await api.get(`/organizations/${orgId}/campaigns?limit=100`);
      setCampaigns(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar campanhas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  useEffect(() => { setPage(1); }, [filter, search]);

  const tabs = [
    { key: "all", label: "Todas" },
    { key: "active", label: "Ativas" },
    { key: "ended", label: "Encerradas" },
    { key: "draft", label: "Rascunho" },
  ];

  return (
    <AppLayout title="Campanhas">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-zinc-200 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button onClick={() => navigate("/campaigns/new")}>
          <Plus size={16} /> Nova Campanha
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar campanhas..."
          className="w-full h-11 pl-10 pr-4 rounded-[10px] bg-white border border-zinc-200 outline-none text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <p className="text-zinc-500 mb-4">Nenhuma campanha encontrada.</p>
          <Button onClick={() => navigate("/campaigns/new")}>
            Criar primeira campanha
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginated.map((c) => {
            const pct = c.goal_cents ? ((c.raised_cents || 0) / c.goal_cents) * 100 : 0;
            return (
              <div
                key={c.campaign_id}
                className="bg-white rounded-[10px] p-5 border border-zinc-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/campaigns/${c.campaign_id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{c.name}</h3>
                    {c.description && (
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-1">
                        {c.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(c.status)}`}
                    >
                      {statusLabel(c.status)}
                    </span>
                    <Eye size={16} className="text-zinc-400" />
                  </div>
                </div>

                <div className="h-3 bg-stone-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">
                    {formatCents(c.raised_cents || 0)} arrecadados
                  </span>
                  <span className="text-zinc-500">
                    Meta: {formatCents(c.goal_cents)}
                  </span>
                  <span className="font-medium text-blue-600">{pct.toFixed(0)}%</span>
                </div>

                <div className="flex gap-4 mt-2 text-xs text-zinc-400">
                  <span>{c.expense_count || 0} despesas</span>
                  {(c.spent_cents || 0) > 0 && <span>{formatCents(c.spent_cents)} gasto</span>}
                </div>

                {c.tags?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {c.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-xs text-zinc-400">
                  {c.starts_at && formatDate(c.starts_at)} até{" "}
                  {c.ends_at && formatDate(c.ends_at)}
                </div>
              </div>
            );
          })}
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
