import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { getStoredOrganization } from "../../services/api";
import { Button } from "../common/Button";

export function LoginForm({ defaultRegister }) {
  const [isRegister, setIsRegister] = useState(defaultRegister || false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast.error("Senhas não conferem");
          setLoading(false);
          return;
        }
        await register(name, email, password);
        toast.success("Conta criada com sucesso!");
        navigate("/");
      } else {
        await login(email, password);
        toast.success("Login realizado!");
        const org = getStoredOrganization();
        navigate(org ? "/dashboard" : "/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "Erro ao conectar. Tente novamente.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[20px] p-8 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.21)] border border-zinc-200 w-full max-w-md"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          {isRegister ? "Criar Conta" : "Bem-vindo"}
        </h2>
        <p className="text-slate-500 mt-2">
          {isRegister
            ? "Crie sua conta para começar."
            : "Entre para acessar sua conta."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {isRegister && (
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
        )}

        <div>
          <label className="text-[#334155] text-xs font-bold">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
            className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
          />
        </div>

        <div>
          <label className="text-[#334155] text-xs font-bold">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
          />
        </div>

        {isRegister && (
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua senha"
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={loading}
      >
        {loading
          ? "Aguarde..."
          : isRegister
          ? "Criar Conta"
          : "Entrar"}
      </Button>

      <div className="mt-6 text-center text-sm">
        {isRegister ? (
          <>
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className="text-blue-600 font-semibold"
            >
              Fazer Login
            </button>
          </>
        ) : (
          <>
            Não possui conta?{" "}
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className="text-blue-600 font-semibold"
            >
              Criar conta
            </button>
          </>
        )}
      </div>
    </form>
  );
}
