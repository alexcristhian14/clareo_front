import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/common/Button";
import { formatCents } from "../utils/format";
import logo from "../assets/logo.svg";
import { toast } from "sonner";


export function PublicDonate() {
  const { campaignId, organizationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isCampaignDonation = !!campaignId;
  const isOrgDonation = !!organizationId;
  const isAuthenticated = !!user;

  const [entity, setEntity] = useState(null);
  const [orgName, setOrgName] = useState(
    isOrgDonation ? (location.state?.orgName || null) : null
  );
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [installments, setInstallments] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const suggestedAmounts = [30, 50, 100, 200];

  async function loadEntity() {
    try {
      if (isCampaignDonation) {
        const { data } = await api.get(`/public/campaigns/${campaignId}/accountability`);
        setEntity(data.campaign || data);
        setOrgName(data.organization?.name || "Instituição");
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[20px] p-8 shadow-lg border border-zinc-200 w-full max-w-md text-center">
          <div className="text-5xl mb-4">&#10004;&#65039;</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Doação confirmada!
          </h2>
          <p className="text-lg text-zinc-600 mb-2">
            {formatCents(getAmountCents())} para {orgName || "Instituição"}
          </p>
          {isCampaignDonation && entity && (
            <p className="text-sm text-zinc-500 mb-6">
              Campanha: {entity.name}
            </p>
          )}
          {isOrgDonation && (
            <p className="text-sm text-zinc-500 mb-6">
              Doação direta para a instituição
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-sm text-zinc-500 mb-6">
              Recibo enviado para {email}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setCustomAmount("");
                setAmount(50);
                if (!isAuthenticated) {
                  setName("");
                  setEmail("");
                }
                setCpf("");
                setPhone("");
                setCardNumber("");
                setCardExpiry("");
                setCardCvv("");
                setCardName("");
              }}
            >
              Nova Doação
            </Button>
            {isCampaignDonation && (
              <Button onClick={() => navigate(`/public/accountability/${campaignId}`)}>
                Ver Prestação de Contas
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = isCampaignDonation && entity?.goal_cents
    ? ((entity.raised_cents || 0) / entity.goal_cents) * 100
    : 0;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-lg mx-auto p-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Clareo" className="h-8 w-8" />
          <span className="text-lg font-bold text-slate-800">CLAREO</span>
        </div>

        <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
          <h2 className="text-sm text-zinc-500 uppercase tracking-wide font-medium mb-1">
            Sua doação será destinada a:
          </h2>
          <h1 className="text-xl font-bold text-slate-800 mb-1">
            {orgName || "Instituição"}
          </h1>
          {isCampaignDonation && entity && (
            <p className="text-sm text-blue-600 font-medium">
              Campanha: {entity.name}
            </p>
          )}
          {isCampaignDonation && entity?.goal_cents && (
            <div className="mt-3">
              <div className="h-3 bg-stone-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-zinc-500">
                {formatCents(entity.raised_cents || 0)} arrecadados de{" "}
                {formatCents(entity.goal_cents)}
              </p>
            </div>
          )}
          {isOrgDonation && (
            <p className="text-sm text-zinc-500 mt-2">
              Doação direta — sem campanha vinculada
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[10px] p-6 border border-zinc-200">
          <h3 className="font-bold text-slate-800 mb-4">
            Qual valor você quer doar?
          </h3>

          <div className="flex gap-2 mb-4 flex-wrap">
            {suggestedAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => { setAmount(val); setCustomAmount(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  !customAmount && amount === val
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-zinc-200 hover:bg-gray-50"
                }`}
              >
                R$ {val}
              </button>
            ))}
            <input
              type="text"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Outro valor"
              className="h-10 w-24 px-3 rounded-lg bg-slate-50 border border-zinc-200 outline-none text-sm"
            />
          </div>

          {isAuthenticated ? (
            <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{user?.name}</p>
                  <p className="text-sm text-zinc-500">{user?.email}</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Doação vinculada ao seu perfil — seus dados serão preenchidos automaticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium text-slate-700 text-sm">Seus Dados</h4>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome Completo *" required
                className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email *" required
                className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF (opcional)"
                className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefone (opcional)"
                className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
              />
            </div>
          )}

          <div className="mt-6">
            <h4 className="font-medium text-slate-700 text-sm mb-3">Forma de Pagamento</h4>
            <div className="flex gap-2 mb-4">
              {["card", "pix", "boleto"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    paymentMethod === method
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-zinc-200"
                  }`}
                >
                  {method === "card" ? "Cartão" : method === "pix" ? "PIX" : "Boleto"}
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Número do Cartão"
                  className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/AA"
                    className="h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  />
                  <input
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                  />
                </div>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Nome no Cartão"
                  className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
                <select
                  value={installments}
                  onChange={(e) => setInstallments(e.target.value)}
                  className="w-full h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
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
              <p className="text-sm text-zinc-500">
                Você receberá o QR Code PIX após confirmar.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={submitting}>
            {submitting ? "Processando..." : `Doar ${formatCents(getAmountCents())}`}
          </Button>
        </form>

        {isCampaignDonation && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(`/public/accountability/${campaignId}`)}
              className="text-sm text-blue-600 hover:underline"
            >
              Ver Prestação de Contas &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
