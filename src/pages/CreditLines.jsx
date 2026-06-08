import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { formatCents, statusLabel } from "../utils/format";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

export function CreditLines() {
  const navigate = useNavigate();
  const [creditLines, setCreditLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawModal, setDrawModal] = useState(null);
  const [drawAmount, setDrawAmount] = useState("");
  const [drawReference, setDrawReference] = useState("");
  const [drawing, setDrawing] = useState(false);

  async function loadCreditLines() {
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const { data } = await api.get(`/credit_lines?organization_id=${orgId}`);
      setCreditLines(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erro ao carregar linhas de crédito");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCreditLines();
  }, []);

  async function handleDraw(e) {
    e.preventDefault();
    if (!drawModal) return;
    setDrawing(true);
    try {
      const amountCents = Math.round(parseFloat(drawAmount.replace(",", ".")) * 100);
      await api.post(`/credit_lines/${drawModal.credit_line_id}/use`, {
        amount_cents: amountCents,
        reference: drawReference || undefined,
      });
      toast.success("Saque realizado!");
      setDrawModal(null);
      setDrawAmount("");
      setDrawReference("");
      loadCreditLines();
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.available_cents) {
        toast.error(
          `Saldo insuficiente. Disponível: ${formatCents(errData.available_cents)}`
        );
      } else {
        toast.error(err.response?.data?.error || "Erro ao sacar");
      }
    } finally {
      setDrawing(false);
    }
  }

  const totalLimit = creditLines.reduce((s, c) => s + (c.limit_cents || 0), 0);
  const totalAvailable = creditLines.reduce((s, c) => s + (c.available_cents || 0), 0);
  const totalUsed = totalLimit - totalAvailable;
  const overallPct = totalLimit > 0 ? (totalAvailable / totalLimit) * 100 : 0;

  return (
    <AppLayout title="Linhas de Crédito">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Suas Linhas de Crédito</h2>
        <Button onClick={() => navigate("/credit-lines/new")}>
          <Plus size={16} /> Nova
        </Button>
      </div>

      <div className="bg-white rounded-[10px] p-6 border border-zinc-200 mb-6">
        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <p className="text-xs text-zinc-500">Limite Total</p>
            <p className="text-xl font-bold text-slate-800">
              {formatCents(totalLimit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Disponível Total</p>
            <p className="text-xl font-bold text-emerald-600">
              {formatCents(totalAvailable)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Utilizado Total</p>
            <p className="text-xl font-bold text-amber-600">
              {formatCents(totalUsed)}
            </p>
          </div>
        </div>
        <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">{overallPct.toFixed(0)}% disponível</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1].map((i) => (
            <div key={i} className="bg-white rounded-[10px] p-6 border border-zinc-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : creditLines.length === 0 ? (
        <div className="bg-white rounded-[10px] p-12 border border-zinc-200 text-center">
          <p className="text-zinc-500 mb-4">
            Nenhuma linha de crédito contratada.
          </p>
          <Button onClick={() => navigate("/credit-lines/new")}>
            Contratar linha de crédito
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {creditLines.map((cl) => {
            const pct = cl.limit_cents > 0 ? (cl.available_cents / cl.limit_cents) * 100 : 0;
            return (
              <div
                key={cl.credit_line_id}
                className="bg-white rounded-[10px] p-6 border border-zinc-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-slate-800">
                      Linha de Crédito{" "}
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">
                        {statusLabel(cl.status)}
                      </span>
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Disponível: {formatCents(cl.available_cents)} | Limite:{" "}
                      {formatCents(cl.limit_cents)}
                    </p>
                    {cl.annual_rate && (
                      <p className="text-xs text-zinc-400">
                        Taxa: {cl.annual_rate}% a.a.
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDrawModal(cl)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                  >
                    Sacar
                  </button>
                </div>
                <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">{pct.toFixed(0)}% disponível</p>
              </div>
            );
          })}
        </div>
      )}

      {drawModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Sacar da Linha de Crédito</h3>
              <button onClick={() => setDrawModal(null)}>
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <p className="text-sm text-zinc-500 mb-4">
              Disponível: {formatCents(drawModal.available_cents)} | Taxa:{" "}
              {drawModal.annual_rate}% a.a.
            </p>
            <form onSubmit={handleDraw} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#334155]">
                  Valor do Saque (R$) *
                </label>
                <input
                  value={drawAmount}
                  onChange={(e) => setDrawAmount(e.target.value)}
                  placeholder="500,00"
                  required
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#334155]">
                  Referência
                </label>
                <input
                  value={drawReference}
                  onChange={(e) => setDrawReference(e.target.value)}
                  placeholder="Saque para reforma"
                  className="w-full mt-1 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setDrawModal(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={drawing}>
                  {drawing ? "Processando..." : "Sacar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
