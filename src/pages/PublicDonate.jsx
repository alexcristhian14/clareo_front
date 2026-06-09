import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { formatCents, formatDate, sanitizeDescription } from "../utils/format";
import logo from "../assets/logo.svg";
import { Zap, CreditCard, FileText, BarChart3, ExternalLink, DollarSign, MessageSquare, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ExpenseDetailModal } from "../components/common/modals/ExpenseDetailModal";

const GRADIENTS = [
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-orange-500 via-pink-600 to-rose-700",
  "from-violet-600 via-purple-600 to-fuchsia-700",
  "from-sky-600 via-blue-600 to-indigo-700",
  "from-rose-600 via-red-600 to-pink-700",
];

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function PublicDonate() {
  const { campaignId, organizationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isCampaignDonation = !!campaignId;
  const isOrgDonation = !!organizationId;
  const isAuthenticated = !!user;
  const effectiveOrgId = organizationId || location.state?.organizationId;

  const [entity, setEntity] = useState(null);
  const [orgName, setOrgName] = useState(
    isOrgDonation ? (location.state?.orgName || null) : null
  );
  const [orgId, setOrgId] = useState(effectiveOrgId || null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [installments, setInstallments] = useState("1");
  const [report, setReport] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const suggestedAmounts = [30, 50, 100, 200];

  async function loadEntity() {
    try {
      if (isCampaignDonation) {
        const { data } = await api.get(`/public/campaigns/${campaignId}/accountability`);
        setReport(data);
        setEntity(data.campaign || data);
        setOrgName(data.organization?.name || "Instituição");
        setOrgId(data.organization?.organization_id || data.organization?.id);
      } else if (isOrgDonation) {
        if (!orgName) {
          setOrgName("Instituição");
        }
        setEntity({ name: orgName || "Instituição" });
      }
    } catch {
      toast.error(isCampaignDonation ? "Campanha não encontrada" : "Instituição não encontrada");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntity();
  }, [campaignId, organizationId]);

  function getAmountCents() {
    if (customAmount) {
      return Math.round(parseFloat(customAmount.replace(",", ".")) * 100);
    }
    return amount * 100;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const idempotencyKey = `donate_${crypto.randomUUID()}_${Date.now()}`;

    try {
      if (isCampaignDonation) {
        const payload = {
          checkout: {
            campaign_id: campaignId,
            amount_cents: getAmountCents(),
            idempotency_key: idempotencyKey,
            currency: "BRL",
            contributor: { name, email, cpf: cpf || undefined, phone: phone || undefined },
            payment: { method: paymentMethod },
          },
        };

        if (paymentMethod === "card") {
          payload.checkout.payment.card_token = "tok_simulado";
          payload.checkout.payment.installments = parseInt(installments);
        }

        const { data } = await api.post("/public/checkout", payload);

        if (data.status === "ok" || data.status === "already_processed") {
          setSuccess(true);
          toast.success("Doação realizada com sucesso!");
        }
      } else if (isOrgDonation) {
        const payload = {
          donation: {
            amount_cents: getAmountCents(),
            idempotency_key: idempotencyKey,
            currency: "BRL",
            contributor: { name, email, cpf: cpf || undefined, phone: phone || undefined },
            payment: { method: paymentMethod },
          },
        };

        const { data } = await api.post(`/public/donate/${organizationId}`, payload);

        if (data.status === "ok" || data.status === "already_processed") {
          setSuccess(true);
          toast.success("Doação realizada com sucesso!");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao processar doação");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-zinc-500">Carregando...</p>
      </div>
    );
  }

  if (!entity && !orgName) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-zinc-500 mb-4">
            {isCampaignDonation ? "Campanha não encontrada" : "Instituição não encontrada"}
          </p>
          <Button onClick={() => navigate("/")}>Voltar</Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-emerald-100 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Doação confirmada!
          </h2>
          <p className="text-3xl font-bold text-emerald-600 mb-2">
            {formatCents(getAmountCents())}
          </p>
          <p className="text-lg text-zinc-600 mb-1">
            para {orgName || "Instituição"}
          </p>
          {isCampaignDonation && entity && (
            <p className="text-sm text-zinc-500 mb-6">
              Campanha: {entity.name}
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-sm text-zinc-500 mb-6">
              Recibo enviado para {email}
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setCustomAmount("");
                setAmount(50);
                if (!isAuthenticated) { setName(""); setEmail(""); }
                setCpf(""); setPhone("");
                setCardNumber(""); setCardExpiry(""); setCardCvv(""); setCardName("");
              }}
            >
              Nova Doação
            </Button>
            {isCampaignDonation && (
              <Button onClick={() => navigate(`/public/donate/campaign/${campaignId}`)}>
                <ExternalLink size={16} /> Ver Campanha
              </Button>
            )}
            <button onClick={() => navigate("/")} className="text-sm text-zinc-400 hover:text-zinc-600 underline">
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = isCampaignDonation && entity?.goal_cents
    ? Math.min(((entity.raised_cents || 0) / entity.goal_cents) * 100, 100)
    : 0;

  const gradientIdx = hashCode(campaignId || organizationId || "default") % GRADIENTS.length;
  const coverGradient = GRADIENTS[gradientIdx];
  const hasCover = entity?.cover_image || entity?.cover_color;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <img src={logo} alt="Clareo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">CLAREO</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-zinc-500 hover:text-slate-700 underline"
        >
          Voltar
        </button>
      </header>

      {/* Cover */}
      {entity?.cover_image ? (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img src={entity.cover_image} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`w-full h-48 md:h-64 bg-gradient-to-br ${hasCover ? "" : coverGradient}`}
          style={entity?.cover_color && !entity?.cover_image ? { background: entity.cover_color } : {}}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Org info card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {(orgName || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">
                    {isCampaignDonation ? "Campanha" : "Instituição"}
                  </p>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {isCampaignDonation ? entity?.name : (orgName || "Instituição")}
                  </h1>
                  {isCampaignDonation && (
                    <button
                      onClick={() => navigate(`/public/institutions/${orgId}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                    >
                      {orgName}
                    </button>
                  )}
                </div>
              </div>

              {entity?.description && (
                <p className="text-zinc-600 leading-relaxed">{entity.description}</p>
              )}
            </div>

            {/* Stats cards */}
            {isCampaignDonation && entity?.goal_cents && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Meta</p>
                  <p className="text-xl font-bold text-slate-800">{formatCents(entity.goal_cents)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Arrecadado</p>
                  <p className="text-xl font-bold text-emerald-600">{formatCents(entity.raised_cents || 0)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Progresso</p>
                  <p className="text-xl font-bold text-blue-600">{progress.toFixed(0)}%</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
                  <p className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">Status</p>
                  <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
                    entity.status === "active" ? "bg-emerald-100 text-emerald-700" :
                    entity.status === "ended" ? "bg-zinc-100 text-zinc-600" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {entity.status === "active" ? "Ativa" : entity.status === "ended" ? "Encerrada" : "Rascunho"}
                  </span>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {isCampaignDonation && entity?.goal_cents && (
              <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-600 font-medium">Progresso da arrecadação</span>
                  <span className="text-blue-600 font-bold">{progress.toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {entity.starts_at && (
                  <p className="text-xs text-zinc-400 mt-2">
                    {entity.starts_at && `${new Date(entity.starts_at).toLocaleDateString("pt-BR")}`}
                    {entity.ends_at && ` até ${new Date(entity.ends_at).toLocaleDateString("pt-BR")}`}
                  </p>
                )}
              </div>
            )}

            {/* Tags */}
            {entity?.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entity.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copiado!"); }}
              className="text-sm text-zinc-500 hover:text-zinc-700 underline flex items-center gap-1"
            >
              Compartilhar
            </button>

            {/* Updates timeline */}
            {isCampaignDonation && report?.expenses?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                  <BarChart3 size={18} />
                  Atualizações
                </div>
                <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
                  <span className="text-emerald-600 font-bold">{formatCents(report.summary?.total_raised)} arrecadado</span>
                  {report.summary?.total_spent > 0 && (
                    <span className="text-red-500 font-bold">{formatCents(report.summary?.total_spent)} gasto</span>
                  )}
                  {report.summary?.total_redemption > 0 && (
                    <span className="text-amber-600 font-bold">{formatCents(report.summary?.total_redemption)} resgatado</span>
                  )}
                  <span className="text-blue-600 font-bold">{formatCents(report.summary?.balance)} saldo</span>
                </div>
                <div className="space-y-3">
                  {report.expenses.map((e) => {
                    const entryType = e.type || (e.amount_cents > 0 ? "expense" : "update");
                    const isExpense = entryType === "expense";
                    const isAudit = entryType === "audit";
                    const isRedemption = entryType === "redemption";
                    return (
                      <button
                        key={e.entry_id}
                        onClick={() => setSelectedExpense(e)}
                        className="w-full text-left bg-white rounded-xl p-4 border border-zinc-200 hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isExpense ? "bg-red-50" : isAudit ? "bg-emerald-50" : isRedemption ? "bg-amber-50" : "bg-blue-50"
                          }`}>
                            {isExpense ? <DollarSign size={15} className="text-red-500" /> :
                             isAudit ? <ShieldCheck size={15} className="text-emerald-500" /> :
                             isRedemption ? <DollarSign size={15} className="text-amber-500" /> :
                             <MessageSquare size={15} className="text-blue-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={`text-xs font-bold ${
                                isExpense ? "text-red-600" : isAudit ? "text-emerald-600" : isRedemption ? "text-amber-600" : "text-blue-600"
                              }`}>
                                {isExpense ? "Despesa" : isAudit ? "Auditoria" : isRedemption ? "Resgate" : "Atualização"}
                              </span>
                              {e.expense_date && <span className="text-xs text-zinc-400">{formatDate(e.expense_date)}</span>}
                            </div>
                            <p className="text-sm font-medium text-slate-800">{sanitizeDescription(e.description)}</p>
                            {e.amount_cents > 0 && (
                              <p className={`text-sm font-bold mt-0.5 ${isExpense ? "text-red-500" : isRedemption ? "text-amber-600" : ""}`}>
                                {isExpense ? "-" : isRedemption ? "+" : ""}{formatCents(e.amount_cents)}
                              </p>
                            )}
                            {e.attachments?.length > 0 && (
                              <p className="text-xs text-zinc-400 mt-1">{e.attachments.length} anexo(s)</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Donation form sidebar */}
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-5">
                {isOrgDonation
                  ? "Faça sua doação"
                  : "Apoie esta campanha"}
              </h3>

              <form onSubmit={handleSubmit}>
                {/* Amount selection */}
                <div className="mb-5">
                  <p className="text-sm font-medium text-slate-700 mb-3">Escolha o valor</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {suggestedAmounts.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => { setAmount(val); setCustomAmount(""); }}
                        className={`py-3 rounded-xl text-base font-bold border transition-all ${
                          !customAmount && amount === val
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-slate-700 border-zinc-200 hover:border-blue-300 hover:shadow-sm"
                        }`}
                      >
                        R$ {val}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">R$</span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); }}
                      placeholder="Outro valor"
                      className="w-full h-11 pl-8 pr-3 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* User data */}
                {isAuthenticated ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{user?.name}</p>
                        <p className="text-sm text-zinc-500">{user?.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Doação vinculada ao seu perfil
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-5">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome Completo *" required
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email *" required
                      className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="CPF"
                        className="h-11 px-3 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm"
                      />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Telefone"
                        className="h-11 px-3 rounded-xl bg-slate-50 border border-zinc-200 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Payment method */}
                <div className="mb-5">
                  <p className="text-sm font-medium text-slate-700 mb-3">Forma de Pagamento</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "pix", label: "PIX", icon: Zap },
                      { key: "card", label: "Cartão", icon: CreditCard },
                      { key: "boleto", label: "Boleto", icon: FileText },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setPaymentMethod(m.key)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                          paymentMethod === m.key
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-slate-600 border-zinc-200 hover:border-blue-300"
                        }`}
                      >
                        <m.icon size={16} className="mr-1" />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card details */}
                {paymentMethod === "card" && (
                  <div className="space-y-3 mb-5 p-4 bg-slate-50 rounded-xl">
                    <input
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Número do Cartão"
                      className="w-full h-11 px-3 rounded-xl bg-white border border-zinc-200 outline-none text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="h-11 px-3 rounded-xl bg-white border border-zinc-200 outline-none text-sm"
                      />
                      <input
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="h-11 px-3 rounded-xl bg-white border border-zinc-200 outline-none text-sm"
                      />
                    </div>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Nome no Cartão"
                      className="w-full h-11 px-3 rounded-xl bg-white border border-zinc-200 outline-none text-sm"
                    />
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-white border border-zinc-200 outline-none text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>
                          {n}x de {formatCents(Math.round(getAmountCents() / n))}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {paymentMethod === "pix" && (
                  <p className="text-xs text-zinc-400 mb-5 flex items-center gap-1">
                    <Zap size={14} /> O QR Code PIX será gerado após a confirmação
                  </p>
                )}

                {paymentMethod === "boleto" && (
                  <p className="text-xs text-zinc-400 mb-5 flex items-center gap-1">
                    <FileText size={14} /> O boleto será gerado após a confirmação
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full !py-4 !text-base !rounded-xl"
                  disabled={submitting}
                >
                  {submitting ? "Processando..." : `Doar ${formatCents(getAmountCents())}`}
                </Button>
              </form>

              <p className="text-xs text-zinc-400 text-center mt-4">
                Pagamento processado com segurança
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center border-t border-zinc-200">
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400">
          <img src={logo} alt="" className="h-5 w-5" />
          Clareo — Doe com transparência
        </div>
      </footer>

      <ExpenseDetailModal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        expense={selectedExpense}
        orgId={orgId}
        campaignId={campaignId}
      />
    </div>
  );
}
