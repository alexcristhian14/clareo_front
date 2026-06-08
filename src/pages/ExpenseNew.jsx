import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AppLayout } from "../layouts/AppLayout";
import { Button } from "../components/common/Button";
import { displayToCents } from "../utils/format";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Alimentação",
  "Estrutura",
  "Divulgação",
  "Transporte",
  "Pessoal",
  "Material",
  "Serviço",
  "Impostos",
  "Outros",
];

export function ExpenseNew() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: "",
    amount_cents: "",
    category: "",
    expense_date: new Date().toISOString().split("T")[0],
    status: "paid",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const org = JSON.parse(localStorage.getItem("clareo_organization") || "{}");
      const orgId = org?.organization_id || org?.id;
      const amountCents = displayToCents(form.amount_cents);

      const { data: expense } = await api.post(
        `/organizations/${orgId}/campaigns/${campaignId}/expenses`,
        {
          expense: {
            description: form.description,
            amount_cents: amountCents,
            category: form.category || undefined,
            expense_date: form.expense_date || undefined,
            status: form.status,
          },
        }
      );

      const expenseId = expense.entry_id;

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        await api.post(
          `/organizations/${orgId}/campaigns/${campaignId}/expenses/${expenseId}/attachments`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Despesa criada!");
      navigate(`/campaigns/${campaignId}/expenses`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao criar despesa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="Nova Despesa">
      <button
        onClick={() => navigate(`/campaigns/${campaignId}/expenses`)}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} /> Voltar
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[10px] p-6 border border-zinc-200 max-w-2xl"
      >
        <div className="space-y-5">
          <div>
            <label className="text-[#334155] text-xs font-bold">
              Descrição *
            </label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ex: Buffet para festa junina"
              required
              minLength={3}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">
              Valor (R$) *
            </label>
            <input
              name="amount_cents"
              value={form.amount_cents}
              onChange={handleChange}
              placeholder="200,00"
              required
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">Categoria</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            >
              <option value="">Selecione...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">
              Data da Despesa
            </label>
            <input
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            />
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full mt-2 h-11 px-3 rounded-[10px] bg-slate-50 border border-[#334155] outline-none"
            >
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="text-[#334155] text-xs font-bold">
              Anexos (opcional)
            </label>
            <div className="mt-2 border-2 border-dashed border-zinc-300 rounded-[10px] p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles([...e.target.files])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
              >
                Clique para selecionar arquivos
              </label>
              {files.length > 0 && (
                <div className="mt-3 text-left space-y-1">
                  {Array.from(files).map((f, i) => (
                    <p key={i} className="text-xs text-zinc-500">
                      📎 {f.name} ({(f.size / 1024).toFixed(0)} KB)
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/campaigns/${campaignId}/expenses`)}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
