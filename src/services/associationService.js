let associations = [];

export async function getAssociations(userId) {
  return associations.filter(
    (item) => String(item.userId) === String(userId)
  );
}

export async function associate({ userId, organizationId }) {
  const alreadyExists = associations.some(
    (item) =>
      String(item.userId) === String(userId) &&
      String(item.organizationId) === String(organizationId)
  );

  if (alreadyExists) return;

  associations.push({
    id: Date.now(),
    userId,
    organizationId,
    createdAt: new Date().toISOString(),
  });
}

export async function unassociate({ userId, organizationId }) {
  associations = associations.filter(
    (item) =>
      !(
        String(item.userId) === String(userId) &&
        String(item.organizationId) === String(organizationId)
      )
  );
}