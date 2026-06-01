// services/organizationsService.js

export async function getOrganizations() {
  // depois troca por API real
  return [];
}

export async function createOrganization(data) {
  return {
    id: `ORG-${Date.now()}`,
    ...data,
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
    membros: 0,
    transacoes: 0,
  };
}