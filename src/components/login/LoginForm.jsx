import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../common/Button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    navigate("organization/dashboard");
  }

  //  function handleLogin(e) {
  //  e.preventDefault();

  //console.log({
  //email,
  //password,
  //});

  // depois:
  // await api.post("/auth/login", { email, password });

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white rounded-[20px] p-8 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-200 w-full max-w-md"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Bem-vindo</h2>

        <p className="text-slate-500 mt-2">Entre para acessar sua conta.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[#334155] text-xs font-bold">E-mail</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border[#334155] outline-none"
          />
        </div>

        <div>
          <label className="text-[#334155] text-xs font-bold">Senha</label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
          />
        </div>
      </div>

      <div className="mt-2 text-right">
        <button type="button" className="text-sm text-blue-600 hover:underline">
          Esqueceu sua senha?
        </button>
      </div>

      <Button type="submit" className="w-full mt-6">
        Entrar
      </Button>

      <div className="mt-6 text-center text-sm">
        Não possui conta?{" "}
        <button type="button" className="text-blue-600 font-semibold">
          Criar conta
        </button>
      </div>
    </form>
  );
}
