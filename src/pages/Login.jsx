import logo from "../assets/logo.svg";

import {
  HeartHandshake,
  ShieldCheck,
  Megaphone,
  Building2,
} from "lucide-react";

import { LoginForm } from "../components/login/LoginForm";
import { LoginFeatureItem } from "../components/login/LoginFeatureItem";

export function Login() {
  return (
    <div className="relative min-h-screen bg-slate-100 flex overflow-hidden">


      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2563eb 1px, transparent 1px),
              linear-gradient(to bottom, #2563eb 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* LADO ESQUERDO */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 bg-[#334155] text-white px-16 relative z-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Clareo" className="h-14 w-14" />

          <span className="text-3xl font-bold text-white">
            CLAREO
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Conectando pessoas, organizações e causas.
        </h1>

        <p className="text-lg text-white/90 max-w-lg mb-10">
          Doe, acompanhe campanhas e contribua para transformar vidas através de
          uma plataforma transparente e acessível.
        </p>

        <div className="flex flex-col gap-5">
          <LoginFeatureItem
            icon={ShieldCheck}
            title="Transparência nas doações"
          />

          <LoginFeatureItem
            icon={Megaphone}
            title="Acompanhamento de campanhas"
          />

          <LoginFeatureItem
            icon={Building2}
            title="Gestão para organizações"
          />

          <LoginFeatureItem
            icon={HeartHandshake}
            title="Impacto social real"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">R$ 2,5M</div>
            <div className="text-sm text-white/80">arrecadados</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">142</div>
            <div className="text-sm text-white/80">campanhas</div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">12k+</div>
            <div className="text-sm text-white/80">doadores</div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <LoginForm />
      </div>
    </div>
  );
}