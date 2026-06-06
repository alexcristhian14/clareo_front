import DonorLayout from "../../layouts/DonorLayout";
import { Button } from "../../components/common/Button";
import { User, Bell, Shield } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

export function Settings() {
  const {
    donorSettings,
    updateDonorSettings,
    saveDonorSettings,
  } = useSettings();

  return (
    <DonorLayout title="Configurações" description="Gerencie sua conta">

      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl flex flex-col gap-6">

          {/* HEADER */}
          <div className="bg-white rounded-[10px] border p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold">
                {donorSettings.name}
              </h2>
              <p className="text-sm text-zinc-500">
                {donorSettings.email}
              </p>
            </div>
          </div>

          {/* INFO */}
          <div className="bg-white rounded-[10px] border p-6">
            <h2 className="text-lg font-bold mb-4">
              Informações pessoais
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                value={donorSettings.name}
                onChange={(e) =>
                  updateDonorSettings("name", e.target.value)
                }
                className="p-3 bg-slate-100 rounded-[8px]"
              />

              <input
                value={donorSettings.email}
                onChange={(e) =>
                  updateDonorSettings("email", e.target.value)
                }
                className="p-3 bg-slate-100 rounded-[8px]"
              />
            </div>
          </div>

          {/* NOTIFICAÇÕES */}
          <div className="bg-white rounded-[10px] border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} />
              <h2 className="text-lg font-bold">
                Notificações
              </h2>
            </div>

            <div className="flex justify-between">
              <span>Sistema</span>
              <input
                type="checkbox"
                checked={donorSettings.notifications}
                onChange={() =>
                  updateDonorSettings(
                    "notifications",
                    !donorSettings.notifications
                  )
                }
              />
            </div>

            <div className="flex justify-between mt-4">
              <span>E-mails</span>
              <input
                type="checkbox"
                checked={donorSettings.emailUpdates}
                onChange={() =>
                  updateDonorSettings(
                    "emailUpdates",
                    !donorSettings.emailUpdates
                  )
                }
              />
            </div>
          </div>

          {/* SEGURANÇA */}
          <div className="bg-white rounded-[10px] border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} />
              <h2 className="text-lg font-bold">
                Segurança
              </h2>
            </div>

            <p className="text-sm text-zinc-600">
              Sessão ativa neste dispositivo
            </p>
          </div>

          {/* SALVAR */}
          <div className="flex justify-end">
            <Button onClick={saveDonorSettings}>
              Salvar alterações
            </Button>
          </div>

        </div>
      </div>

    </DonorLayout>
  );
}