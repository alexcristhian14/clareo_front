// services/organizationsService.js

const mockOrganizations = [
  {
    id: 1,
    nome: "Instituto Saúde Viva",
    dataCadastro: "12/03/2026",
    membros: 24,
    status: "Ativa",
    transacoes: 1245,
  },
  {
    id: 2,
    nome: "Casa Esperança",
    dataCadastro: "15/03/2026",
    membros: 18,
    status: "Inativa",
    transacoes: 800,
  },
  {
    id: 3,
    nome: "Projeto Futuro",
    dataCadastro: "20/03/2026",
    membros: 35,
    status: "Ativa",
    transacoes: 2500,
  },
];

// simula delay de API
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getOrganizations() {
  await delay(300);
  return mockOrganizations;
}

export async function createOrganization(data) {
  await delay(300);

  const newOrg = {
    id: `ORG-${String(mockOrganizations.length + 1).padStart(3, "0")}`,
    dataCadastro: new Date().toLocaleDateString("pt-BR"),
    membros: 0,
    transacoes: 0,
    ...data,
  };

  mockOrganizations.push(newOrg);

  return newOrg;
}