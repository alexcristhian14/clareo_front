import { OrganizationCard } from "./OrganizationCard";

export function OrganizationGrid({
  organizations,
  onAssociate,
  onDetails,
}) {
  if (!organizations.length) {
    return (
      <div className="bg-white rounded-[10px] border border-zinc-300 p-10 text-center text-zinc-500">
        Nenhuma organização encontrada.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6">

      {organizations.map((organization) => (
        <OrganizationCard
          key={organization.id}
          organization={organization}
          onAssociate={onAssociate}
          onDetails={onDetails}
        />
      ))}

    </div>
  );
}