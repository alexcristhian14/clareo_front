export function ContributorsRow({ contributor }) {
  return (
    <div className="grid grid-cols-5 p-3 border-b text-sm">

      <span>{contributor.name}</span>
      <span>{contributor.email}</span>
      <span>{contributor.role}</span>
      <span>{contributor.date}</span>
      <span>{contributor.organization}</span>

    </div>
  );
}