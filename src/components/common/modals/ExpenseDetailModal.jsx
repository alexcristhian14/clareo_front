import { formatCents, formatDate, statusLabel, sanitizeDescription } from "../../../utils/format";
import { X, Download, Paperclip, Tag, Calendar, DollarSign, MessageSquare, ShieldCheck, FileText } from "lucide-react";

const TYPE_CONFIG = {
  expense: { icon: DollarSign, label: "Despesa", color: "text-red-600", bg: "bg-red-50" },
  update: { icon: MessageSquare, label: "Atualização", color: "text-blue-600", bg: "bg-blue-50" },
  audit: { icon: ShieldCheck, label: "Auditoria", color: "text-emerald-600", bg: "bg-emerald-50" },
  redemption: { icon: DollarSign, label: "Resgate", color: "text-amber-600", bg: "bg-amber-50" },
};

export function ExpenseDetailModal({ isOpen, onClose, expense, orgId, campaignId }) {
  if (!isOpen || !expense) return null;

  const type = expense.type || "expense";
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.expense;
  const DetailIcon = cfg.icon;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
              <DetailIcon size={20} className={cfg.color} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{cfg.label}</h2>
              <p className="text-xs text-zinc-400">{formatDate(expense.expense_date || expense.created_at)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-lg">
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-sm text-zinc-500 mb-1">Descrição</p>
            <p className="text-base font-medium text-slate-800">{sanitizeDescription(expense.description)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(type === "expense" || expense.amount_cents > 0) && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <DollarSign size={14} /> Valor
                </div>
                <p className={`text-lg font-bold ${type === "redemption" ? "text-amber-600" : "text-red-600"}`}>{formatCents(expense.amount_cents)}</p>
              </div>
            )}
            {expense.category && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Tag size={14} /> Categoria
                </div>
                <p className="text-base font-medium text-slate-800">{expense.category}</p>
              </div>
            )}
            {expense.expense_date && (
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Calendar size={14} /> Data
                </div>
                <p className="text-base font-medium text-slate-800">{formatDate(expense.expense_date)}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">Status</div>
              <span className="inline-block text-sm font-medium text-emerald-600">{statusLabel(expense.status)}</span>
            </div>
          </div>

          {expense.attachments?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-1">
                <Paperclip size={14} /> Anexos ({expense.attachments.length})
              </p>
              <div className="space-y-2">
                {expense.attachments.map((att) => (
                  <a
                    key={att.attachment_id}
                    href={`/api/v1/organizations/${orgId}/campaigns/${campaignId}/expenses/${expense.entry_id}/attachments/${att.attachment_id}/download`}
                    target="_blank"
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{att.original_filename}</p>
                      <p className="text-xs text-zinc-400">{(att.file_size / 1024).toFixed(0)} KB</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
