import { useState } from "react";
import OrganizationLayout from "../../layouts/OrganizationLayout";
import { Button } from "../../components/common/Button";

export function Settings() {
  const [name, setName] = useState("Instituto Saúde Viva");
  const [description, setDescription] = useState(
    "Organização focada em saúde comunitária"
  );
  const [email, setEmail] = useState("contato@instituto.org");
  const [phone, setPhone] = useState("+55 (84) 98765-4321");

  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [publicCampaigns, setPublicCampaigns] = useState(true);

  const [logo, setLogo] = useState(null);

  const [paymentMethods, setPaymentMethods] = useState({
    pix: false,
    transfer: false,
    creditCard: false,
  });

  const [pixKey, setPixKey] = useState("");

  const canSavePayment =
    (paymentMethods.pix && pixKey.trim() !== "") ||
    paymentMethods.transfer ||
    paymentMethods.creditCard;

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (file) setLogo(file);
  }

  function handleSave() {
    console.log("SETTINGS SALVAS:", {
      name,
      description,
      email,
      phone,
      pixKey,
      receiveNotifications,
      publicCampaigns,
      logo,
      paymentMethods,
    });
  }

  const labelClass = "text-xs font-bold text-slate-600 mb-1";
  const inputClass =
    "w-full p-2 bg-neutral-100 rounded-[10px] outline outline-1 outline-slate-300 text-sm";

  return (
    <OrganizationLayout
      title="Configurações"
      description="Gerencie sua organização"
    >
      <div className="flex flex-col gap-6">

        {/* PERFIL */}
        <div className="bg-white rounded-[10px] border border-zinc-300 p-6 flex flex-col gap-5">

          <h2 className="text-lg font-bold text-slate-800">
            Perfil da organização
          </h2>

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border">
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400">Logo</span>
              )}
            </div>

            <label className="text-sm text-blue-600 cursor-pointer font-semibold">
              Alterar logo
              <input
                type="file"
                className="hidden"
                onChange={handleLogoChange}
              />
            </label>
          </div>

          {/* INPUTS COM LABEL */}

          <div>
            <p className={labelClass}>Nome da organização</p>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <p className={labelClass}>Descrição</p>
            <input
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <p className={labelClass}>E-mail</p>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <p className={labelClass}>Telefone</p>
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* FINANCEIRO */}
        <div className="bg-white rounded-[10px] border border-zinc-300 p-6 flex flex-col gap-4">

          <h2 className="text-lg font-bold text-slate-800">
            Dados financeiros
          </h2>

          {/* PIX */}
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">PIX</span>
            <input
              type="checkbox"
              checked={paymentMethods.pix}
              onChange={(e) =>
                setPaymentMethods((prev) => ({
                  ...prev,
                  pix: e.target.checked,
                }))
              }
            />
          </label>

          {paymentMethods.pix && (
            <div>
              <p className={labelClass}>Chave PIX</p>
              <input
                className={inputClass}
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
            </div>
          )}

          {/* TRANSFERÊNCIA */}
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Transferência bancária
            </span>
            <input
              type="checkbox"
              checked={paymentMethods.transfer}
              onChange={(e) =>
                setPaymentMethods((prev) => ({
                  ...prev,
                  transfer: e.target.checked,
                }))
              }
            />
          </label>

          {paymentMethods.transfer && (
            <div className="flex flex-col gap-2">
              <input className={inputClass} placeholder="Banco" />
              <input className={inputClass} placeholder="Agência" />
              <input className={inputClass} placeholder="Conta" />
            </div>
          )}

          {/* CARTÃO */}
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Cartão de crédito</span>
            <input
              type="checkbox"
              checked={paymentMethods.creditCard}
              onChange={(e) =>
                setPaymentMethods((prev) => ({
                  ...prev,
                  creditCard: e.target.checked,
                }))
              }
            />
          </label>

          {paymentMethods.creditCard && (
            <p className="text-xs text-zinc-500">
              Pagamentos via cartão serão processados por gateway externo.
            </p>
          )}

          <p className="text-xs text-zinc-500">
            Você pode habilitar múltiplos métodos simultaneamente.
          </p>
        </div>

        {/* PREFERÊNCIAS */}
        <div className="bg-white rounded-[10px] border border-zinc-300 p-6 flex flex-col gap-4">

          <h2 className="text-lg font-bold text-slate-800">
            Preferências
          </h2>

          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Receber notificações
            </span>
            <input
              type="checkbox"
              checked={receiveNotifications}
              onChange={(e) => setReceiveNotifications(e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Campanhas públicas
            </span>
            <input
              type="checkbox"
              checked={publicCampaigns}
              onChange={(e) => setPublicCampaigns(e.target.checked)}
            />
          </label>
        </div>

        {/* SAVE */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Salvar alterações
          </Button>
        </div>
      </div>
    </OrganizationLayout>
  );
}