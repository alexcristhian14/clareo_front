export function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1 && !totalItems) return null;
  if (totalPages <= 1 && totalItems <= 10) return null;

  function getPageNumbers() {
    const pages = [];
    const siblingCount = 1;
    const rangeStart = Math.max(1, currentPage - siblingCount);
    const rangeEnd = Math.min(totalPages, currentPage + siblingCount);
    const showStartEllipsis = rangeStart > 2;
    const showEndEllipsis = rangeEnd < totalPages - 1;

    if (showStartEllipsis) pages.push(1, "...");
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (showEndEllipsis) pages.push("...", totalPages);
    return pages;
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {totalItems && (
        <span className="text-sm text-zinc-500">{totalItems} registro(s)</span>
      )}
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-sm
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          ←
        </button>
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="text-zinc-400 text-sm px-1">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === p
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-sm
            disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}