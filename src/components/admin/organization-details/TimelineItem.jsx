import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  Flag,
  FileCheck,
} from "lucide-react";

const typeConfig = {
  expense: {
    icon: BanknoteArrowDown,
    bg: "bg-[#F8623F]",
    valueColor: "text-red-500",
  },
  income: {
    icon: BanknoteArrowUp,
    bg: "bg-green-500",
    valueColor: "text-green-600",
  },
  milestone: {
    icon: Flag,
    bg: "bg-[#4269B4]",
    valueColor: "text-blue-600",
  },
  info: {
    icon: FileCheck,
    bg: "bg-zinc-400",
    valueColor: "text-zinc-600",
  },
};

export function TimelineItem({
  type = "info",
  title,
  description,
  value,
  date,
  receiptText,
}) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

    return (
    <div className="flex gap-4">
      {/* ICON */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${config.bg}`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>

        <div className="w-px flex-1 bg-zinc-200 mt-2" />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col gap-1">
        {/* HEADER */}
        <div className="flex justify-between">
          <h3 className="text-sm font-semibold text-stone-900">
            {title}
          </h3>

          <span className="text-[10px] text-zinc-500">
            {date}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-zinc-600">
          {description}
        </p>

        {/* VALUE + RECEIPT */}
        <div className="flex justify-between items-center mt-1">
          <span className={`text-xs font-semibold ${config.valueColor}`}>
            {value}
          </span>

          {receiptText && (
            <button className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline">
              <FileCheck className="w-3.5 h-3.5" />
              {receiptText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}