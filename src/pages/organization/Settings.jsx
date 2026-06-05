import { useState, useEffect } from "react";
import OrganizationLayout from "../../layouts/OrganizationLayout";
import { Button } from "../../components/common/Button";
import { useOrganizations } from "../../contexts/OrganizationContext";

export function Settings() {
  const { getOrganizationById, updateOrganization } =
    useOrganizations();

  const organizationId = 1; // depois vem do auth

  const org = getOrganizationById(organizationId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [receiveNotifications, setReceiveNotifications] =
    useState(true);
  const [publicCampaigns, setPublicCampaigns] = useState(true);

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (!org) return;

    setName(org.name);
    setDescription(org.description);
    setEmail(org.email || "");
    setPhone(org.phone || "");
  }, [org]);

  function handleSave() {
    updateOrganization?.(organizationId, {
      name,
      description,
      email,
      phone,
    });

    console.log("SETTINGS SALVAS NO CONTEXT");
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (file) setLogo(file);
  }

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
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400">
                  Logo
                </span>
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

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />
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