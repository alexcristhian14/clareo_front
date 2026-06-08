import { format as dateFnsFormat, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatCents(cents) {
  if (cents == null) return "R$ 0,00";
  return `R$ ${(cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function centsToDisplay(cents) {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function displayToCents(display) {
  const cleaned = display.replace(/\./g, "").replace(",", ".");
  return Math.round(parseFloat(cleaned) * 100);
}

export function relativeTime(isoDate) {
  if (!isoDate) return "";
  return formatDistanceToNow(new Date(isoDate), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function formatDate(isoDate, fmt = "dd/MM/yyyy") {
  if (!isoDate) return "";
  return dateFnsFormat(new Date(isoDate), fmt, { locale: ptBR });
}

export function formatDateTime(isoDate) {
  return formatDate(isoDate, "dd/MM/yyyy 'às' HH:mm");
}

export function statusLabel(status) {
  const map = {
    active: "Ativa",
    inactive: "Inativa",
    ended: "Encerrada",
    draft: "Rascunho",
    paid: "Pago",
    pending: "Pendente",
    cancelled: "Cancelado",
    captured: "Capturada",
    failed: "Falhou",
    authorized: "Autorizada",
    refunded: "Reembolsada",
    reversed: "Estornada",
    credit: "Crédito",
    debit: "Débito",
    transfer: "Transferência",
    external_in: "Entrada Externa",
    external_out: "Saída Externa",
    withdrawal: "Saque",
  };
  return map[status] || status;
}

export function statusColor(status) {
  const map = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-500",
    ended: "bg-gray-200 text-gray-600",
    draft: "bg-yellow-100 text-yellow-700",
    paid: "bg-emerald-100 text-emerald-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-600",
    captured: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-600",
    authorized: "bg-blue-100 text-blue-700",
    refunded: "bg-purple-100 text-purple-700",
    reversed: "bg-orange-100 text-orange-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}
