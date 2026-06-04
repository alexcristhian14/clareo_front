import { useState } from "react";
import DonorLayout from "../../layouts/DonorLayout";
import { Button } from "../../components/common/Button";
import { User, Bell, Shield } from "lucide-react";

export function Settings() {
  const [name, setName] = useState("Alex Cristhian");
  const [email, setEmail] = useState("alex@email.com");

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);

  function handleSave() {
    console.log({
      name,
      email,
      notifications,
      emailUpdates,
    });
  }

  return (
    <DonorLayout
      title="Configurações"
      description="Gerencie sua conta e preferências"
    >
      {/* CONTAINER CENTRALIZADO (CORRETO) */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl flex flex-col gap-6">

          {/* HEADER PERFIL */}
          <div className="bg-white rounded-[10px] border border-zinc-300 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={20} className="text-slate-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {name}
              </h2>
              <p className="text-sm text-zinc-500">{email}</p>
            </div>
          </div>

          {/* INFORMAÇÕES */}
          <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Informações pessoais
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-500">
                  Nome
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 p-3 rounded-[8px] bg-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-500">
                  E-mail
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 p-3 rounded-[8px] bg-slate-100 outline-none"
                />
              </div>
            </div>
          </div>

          {/* NOTIFICAÇÕES */}
          <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} />
              <h2 className="text-lg font-bold text-slate-800">
                Notificações
              </h2>
            </div>

            <div className="flex flex-col gap-4">

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">
                    Notificações do sistema
                  </p>
                  <p className="text-xs text-zinc-500">
                    Atualizações de campanhas e doações
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() =>
                    setNotifications((prev) => !prev)
                  }
                />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">
                    E-mails
                  </p>
                  <p className="text-xs text-zinc-500">
                    Receber relatórios por e-mail
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={() =>
                    setEmailUpdates((prev) => !prev)
                  }
                />
              </div>

            </div>
          </div>

          {/* SEGURANÇA */}
          <div className="bg-white rounded-[10px] border border-zinc-300 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} />
              <h2 className="text-lg font-bold text-slate-800">
                Segurança
              </h2>
            </div>

            <div className="text-sm text-zinc-600 space-y-1">
              <p>Último login: hoje</p>
              <p>Sessão ativa neste dispositivo</p>
            </div>

            <div className="mt-4">
              <Button variant="danger">
                Encerrar sessões
              </Button>
            </div>
          </div>

          {/* SALVAR */}
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>

        </div>
      </div>
    </DonorLayout>
  );
}