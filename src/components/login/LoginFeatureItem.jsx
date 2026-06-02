export function LoginFeatureItem({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
        <Icon size={20} />
      </div>

      <span className="font-medium">
        {title}
      </span>
    </div>
  );
}