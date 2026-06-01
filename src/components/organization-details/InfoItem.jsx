export  function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-zinc-400 text-sm font-semibold">
        {label}
      </span>
      <span className="text-slate-700 text-sm">
        {value}
      </span>
    </div>
  );
}