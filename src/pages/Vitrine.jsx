import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { useAuth } from "../contexts/AuthContext";
import { formatCents } from "../utils/format";
import {
  Building2, Heart, Shield, Zap,
  ExternalLink, LayoutDashboard, Search, TrendingUp, Tag
} from "lucide-react";
import { api } from "../services/api";

export function Vitrine() {
  const navigate = useNavigate();
  const { user, hasOrganization } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    api.get("/public/organizations").then(({ data }) => {
      setInstitutions(Array.isArray(data) ? data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const params = selectedTag ? `?tag=${encodeURIComponent(selectedTag)}&limit=50` : "?limit=50";
    api.get(`/public/campaigns${params}`).then(({ data }) => {
      const list = Array.isArray(data) ? data : (data?.campaigns || []);
      setCampaigns(list.filter((c) => c.status === "active"));
      if (data?.tags) setAllTags(data.tags);
    }).catch(() => {});
  }, [selectedTag]);

  const filteredCampaigns = campaigns;

  return (
    <IndividualLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
            Doe para causas que <span className="text-blue-600">transformam</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Conectamos doadores a instituções transparentes.
            Acompanhe como cada real é usado com prestação de contas em tempo real.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            {!user && (
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Heart size={20} />
                Quero Doar
              </button>
            )}
            {user && !hasOrganization && (
              <button
                onClick={() => navigate("/organizacoes/nova")}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Building2 size={20} />
                Criar Instituição
              </button>
            )}
            {user && hasOrganization && (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
              >
                <LayoutDashboard size={20} />
                Ir para o Painel
              </button>
            )}
          </div>
        </section>

        {campaigns.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={24} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-800">
                Campanhas em Destaque
              </h2>
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    !selectedTag
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  Todas
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1 ${
                      selectedTag === tag
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    <Tag size={12} />
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((c) => {
                const pct = c.goal_cents ? ((c.raised_cents || 0) / c.goal_cents) * 100 : 0;
                const coverGrad = c.cover_color || "from-blue-600 to-indigo-700";
                return (
                  <div
                    key={c.campaign_id}
                    className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col"
                  >
                    <div
                      className="h-32 bg-gradient-to-br"
                      style={c.cover_color ? { background: c.cover_color } : {}}
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                          {(c.name || "C")[0].toUpperCase()}
                        </div>
                        <h3 className="font-bold text-slate-800">{c.name}</h3>
                      </div>

                      <div className="h-2 bg-stone-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-zinc-500 mb-3">
                        <span>{formatCents(c.raised_cents || 0)} de {formatCents(c.goal_cents)}</span>
                        <span className="font-medium text-blue-600">{pct.toFixed(0)}%</span>
                      </div>

                      {c.status && (
                        <span className="text-xs text-zinc-400 mb-3 capitalize">
                          {c.status === "active" ? "Ativa" : c.status}
                        </span>
                      )}

                      <button
                        onClick={() => navigate(`/public/donate/campaign/${c.campaign_id}`)}
                        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
                      >
                        <Heart size={16} />
                        Doar Agora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {user && (
          <section className="text-center">
            <button
              onClick={() => navigate("/minhas-instituicoes")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100 transition"
            >
              <Building2 size={20} />
              Gerenciar Minhas Instituições
            </button>
          </section>
        )}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: "Transparência", desc: "Cada doação é registrada e qualquer pessoa pode acompanhar como os recursos são utilizados." },
            { icon: Shield, title: "Segurança", desc: "Pagamentos processados com segurança. Suporte a PIX, boleto e cartão de crédito." },
            { icon: Zap, title: "Agilidade", desc: "Crie campanhas em minutos. Receba doações e preste contas em tempo real." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 border border-zinc-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </section>

        {institutions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Instituições para Doar
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((org) => (
                <div
                  key={org.organization_id}
                  className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-3">
                    {org.name?.charAt(0)?.toUpperCase() || "O"}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{org.name}</h3>
                  <span className="text-xs text-slate-400 mb-4">
                    {org.contact_email || "Instituição"}
                  </span>
                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(`/public/donate/organization/${org.organization_id}`, { state: { orgName: org.name } })}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      <ExternalLink size={14} />
                      Doar Agora
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!user && (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Faça parte dessa corrente
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Crie sua conta em segundos e comece a doar para instituições
              transparentes. Ou cadastre sua instituição e receba doações.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition"
              >
                Criar Conta Grátis
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition"
              >
                Entrar
              </button>
            </div>
          </section>
        )}

        {user && !hasOrganization && (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Transforme sua causa em realidade
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Crie sua instituição em poucos minutos e comece a receber doações
              com total transparência e credibilidade.
            </p>
            <button
              onClick={() => navigate("/organizacoes/nova")}
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition"
            >
              Criar Instituição Agora
            </button>
          </section>
        )}
      </div>
    </IndividualLayout>
  );
}
