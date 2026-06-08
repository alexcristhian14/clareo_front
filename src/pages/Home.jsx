import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { formatCents } from "../utils/format";
import { Building2, Megaphone, Wallet, ExternalLink, RefreshCw } from "lucide-react";

export function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [associations, setAssociations] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [assocRes, walletRes] = await Promise.allSettled([
          api.get("/associations"),
          api.get(`/owners/user/${user?.user_id || user?.id}/wallet`),
        ]);

        if (assocRes.status === "fulfilled") {
          setAssociations(Array.isArray(assocRes.value.data) ? assocRes.value.data : []);
        }
        if (walletRes.status === "fulfilled") {
          setWallet(walletRes.value.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (user) load();
  }, [user]);

  return (
    <IndividualLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Olá, {user?.name?.split(" ")[0] || "usuário"}!
          </h1>
          <p className="text-slate-500">Acompanhe suas instituições e doações.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/carteira")}
            className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet size={18} className="text-blue-600" />
              </div>
              <span className="text-sm text-zinc-500">Carteira</span>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {wallet ? formatCents(wallet.available_cents) : "---"}
            </p>
          </button>

          <button
            onClick={() => navigate("/minhas-associacoes")}
            className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Building2 size={18} className="text-emerald-600" />
              </div>
              <span className="text-sm text-zinc-500">Associações</span>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {associations.length} instituição(ões)
            </p>
          </button>

          <button
            onClick={() => navigate("/minhas-doacoes-recorrentes")}
            className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCw size={18} className="text-amber-600" />
              </div>
              <span className="text-sm text-zinc-500">Doações Recorrentes</span>
            </div>
            <p className="text-sm text-slate-400">Gerenciar assinaturas</p>
          </button>
        </div>

        <div>
          <h2 className="font-bold text-slate-800 mb-4">Minhas Associações</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-[10px] p-5 border border-zinc-200 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-48" />
                </div>
              ))}
            </div>
          ) : associations.length === 0 ? (
            <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
              <Building2 size={40} className="mx-auto text-zinc-300 mb-4" />
              <p className="text-zinc-500 mb-2">Você ainda não se associou a nenhuma instituição.</p>
              <p className="text-sm text-zinc-400 mb-4">
                Associe-se para acompanhar campanhas e prestações de contas.
              </p>
              <button
                onClick={() => navigate("/minhas-associacoes")}
                className="text-blue-600 hover:underline font-medium"
              >
                Ver instituições disponíveis
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {associations.map((a) => (
                <div
                  key={a.organization_id}
                  className="bg-white rounded-[10px] p-5 border border-zinc-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {(a.organization_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{a.organization_name}</p>
                        <p className="text-sm text-zinc-500">
                          {a.campaigns_count || 0} campanha(s)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/minhas-associacoes")}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Gerenciar
                    </button>
                  </div>
                  {a.campaigns?.length > 0 && (
                    <div className="border-t border-zinc-100 pt-3">
                      <p className="text-xs text-zinc-400 mb-2 flex items-center gap-1">
                        <Megaphone size={12} /> Campanhas
                      </p>
                      <div className="space-y-2">
                        {a.campaigns.map((c) => (
                          <div key={c.campaign_id} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">{c.name}</span>
                            <a
                              href={`/public/accountability/${c.campaign_id}`}
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink size={12} />
                              Prestação de Contas
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </IndividualLayout>
  );
}
