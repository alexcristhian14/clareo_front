import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, storeOrganization } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { IndividualLayout } from "../layouts/IndividualLayout";
import { Button } from "../components/common/Button";
import { Copy, Check, ArrowRight, Shield, Heart, Zap, TrendingUp } from "lucide-react";

export function NewOrganization() {
  const [step, setStep] = useState("info");
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const { user, setCurrentOrganization } = useAuth();
  const navigate = useNavigate();

  async function handleCreateOrg(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/organizations", {
        organization: {
          name,
          contact_email: contactEmail || undefined,
          cnpj: cnpj || undefined,
          owner_user_id: user?.user_id || user?.id,
        },
      });
      const orgData = data.organization || data;
      storeOrganization(orgData);
      setCurrentOrganization(orgData);
      setApiKey(data.api_key || null);
      setStep("success");
      toast.success("Instituição criada com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar instituição");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  if (step === "success") {
    return (
      <IndividualLayout>
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="bg-white rounded-[20px] p-8 shadow-lg border border-zinc-200 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Instituição criada!
            </h2>
            <p className="text-slate-500 mb-6">
              Agora você pode gerenciar campanhas, receber doações e prestar
              contas com total transparência.
            </p>

            {apiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-800 font-medium text-sm flex items-center gap-2 mb-2">
                  ⚠️ Guarde esta chave em local seguro.
                </p>
                <p className="text-amber-600 text-xs mb-3">
                  Ela não será mostrada novamente.
                </p>
                <div className="bg-white border border-amber-300 rounded-lg p-3 font-mono text-sm break-all select-all">
                  {apiKey}
                </div>
                <button
                  onClick={handleCopy}
                  className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copiado!" : "Copiar chave"}
                </button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Ir para o Painel <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </IndividualLayout>
    );
  }

  if (step === "form") {
    return (
      <IndividualLayout>
        <div className="max-w-lg mx-auto px-4 py-10">
          <div className="bg-white rounded-[20px] p-8 shadow-lg border border-zinc-200">
            <button
              onClick={() => setStep("info")}
              className="text-sm text-blue-600 hover:underline mb-4 block"
            >
              ← Voltar
            </button>

            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Criar Instituição
            </h2>
            <p className="text-slate-500 mb-6">
              Preencha os dados abaixo para começar.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="text-[#334155] text-xs font-bold">
                  Nome da Instituição *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Instituto Vida"
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
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contato@instituto.org"
                  className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>

              <div>
                <label className="text-[#334155] text-xs font-bold">CNPJ</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="12.345.678/0001-90"
                  className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Criando..." : "Criar Instituição"}
              </Button>
            </form>
          </div>
        </div>
      </IndividualLayout>
    );
  }

  return (
    <IndividualLayout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <section className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Heart size={32} className="text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
            Crie sua Instituição
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Transforme sua causa em uma organização transparente e confiável.
            Gerencie campanhas, receba doações e preste contas em tempo real.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: TrendingUp, title: "Mais Doações", desc: "Instituições cadastradas no Clareo transmitem mais credibilidade e recebem até 3x mais doações." },
            { icon: Shield, title: "Transparência Total", desc: "Cada real doado é rastreado. Doadores acompanham exatamente como os recursos são usados." },
            { icon: Zap, title: "Gestão Simplificada", desc: "Cadastre campanhas, despesas e membros em minutos. Tudo em um só lugar." },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Milhares de doadores esperam por causas como a sua. Crie sua
            instituição agora e comece a transformar vidas.
          </p>
          <button
            onClick={() => setStep("form")}
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition inline-flex items-center gap-2"
          >
            Quero Criar <ArrowRight size={20} />
          </button>
        </section>
      </div>
    </IndividualLayout>
  );
}
