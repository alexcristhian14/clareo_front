import { useEffect } from "react";
import OrganizationLayout from "../../layouts/OrganizationLayout";
import { Button } from "../../components/common/Button";
import { useOrganizations } from "../../contexts/OrganizationContext";
import { useSettings } from "../../contexts/SettingsContext";

export function Settings() {
  const organizationId = 1; // depois vem do auth

  const { getOrganizationById } = useOrganizations();
  const {
    organizationSettings,
    updateOrganizationSettings,
    saveOrganizationSettings,
  } = useSettings();

  const org = getOrganizationById(organizationId);

  // sync org → settings context
  useEffect(() => {
    if (!org) return;

    updateOrganizationSettings("name", org.name || "");
    updateOrganizationSettings("description", org.description || "");
    updateOrganizationSettings("email", org.email || "");
    updateOrganizationSettings("phone", org.phone || "");
  }, [org]);

  function handleSave() {
    saveOrganizationSettings();
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

          <input
            value={organizationSettings.name}
            onChange={(e) =>
              updateOrganizationSettings("name", e.target.value)
            }
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={organizationSettings.description}
            onChange={(e) =>
              updateOrganizationSettings("description", e.target.value)
            }
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={organizationSettings.email}
            onChange={(e) =>
              updateOrganizationSettings("email", e.target.value)
            }
            className="w-full p-2 bg-neutral-100 rounded-[10px]"
          />

          <input
            value={organizationSettings.phone}
            onChange={(e) =>
              updateOrganizationSettings("phone", e.target.value)
            }
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