import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { displayToCents } from "../utils/format";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function CreditLineNew() {
  const navigate = useNavigate();
  const [limitCents, setLimitCents] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      await api.post("/credit_lines", {
        credit_line: {
          organization_id: orgId,
          limit_cents: displayToCents(limitCents),
          annual_rate: parseFloat(annualRate.replace(",", ".")) || undefined,
        },
      });
      toast.success("Linha de crédito contratada!");
      navigate("/credit-lines");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao contratar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="Nova Linha de Crédito">
      <button
        onClick={() => navigate("/credit-lines")}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Linhas de Crédito
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[10px] p-6 border border-zinc-200 max-w-lg"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Limite Desejado (R$) *
            </label>
            <input
              value={limitCents}
              onChange={(e) => setLimitCents(e.target.value)}
              placeholder="5.000,00"
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Taxa de Juros Anual (%)
            </label>
            <input
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="12,5"
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>
          <p className="text-xs text-amber-600">
            <AlertTriangle size={14} /> A taxa pode variar conforme análise de crédito. Valores finais
            serão confirmados.
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <Button type="button" variant="outline" onClick={() => navigate("/credit-lines")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Contratando..." : "Contratar"}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
