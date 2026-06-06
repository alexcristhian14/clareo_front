import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";

const OrganizationContext = createContext(null);

const initialOrganizations = [
  {
    id: 1,
    name: "Instituto Saúde Viva",
    description: "...",

    campaignsCount: 15,
    supporters: 2134,
    raised: 850000,
    years: 8,

    createdAt: "05/06/2026",
    members: 24,
    status: "Ativa",
    transactions: 1245,
  },
];

const initialContributors = [
  {
    id: 1,
    name: "Caaaarlos Silva",
    email: "carlos@email.com",
    organizationId: 1,
    totalDonated: 350,
    campaigns: 2,
    lastDonation: "2026-05-20",
  },
];

const initialTransactions = [
  {
    id: 1,
    organizationId: 1,
    date: "28/05/2026",
    time: "07:15:35",
    member: "00525",
    type: "Crédito",
    value: "R$ 500,00",
    status: "Efetivada",
  },
  {
    id: 2,
    organizationId: 1,
    date: "28/05/2026",
    time: "09:42:10",
    member: "00412",
    type: "Crédito",
    value: "R$ 120,00",
    status: "Pendente",
  },
  {
    id: 3,
    organizationId: 1,
    date: "27/05/2026",
    time: "18:05:22",
    member: "00981",
    type: "Débito",
    value: "R$ 75,50",
    status: "Cancelada",
  },
  {
    id: 4,
    organizationId: 1,
    date: "27/05/2026",
    time: "14:33:01",
    member: "00219",
    type: "Crédito",
    value: "R$ 1.250,00",
    status: "Efetivada",
  },
];

export function OrganizationProvider({ children }) {
  // 🟢 TODOS OS STATES CORRETAMENTE DENTRO DO COMPONENTE
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [contributors, setContributors] = useState(initialContributors);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currentOrgId] = useState(1); // Simula o ID da organização logada por padrão

  // =====================
  // ORGANIZATION
  // =====================

  const getOrganizationById = useCallback(
    (id) => {
      return organizations.find((o) => String(o.id) === String(id));
    },
    [organizations],
  );

  const updateOrganization = useCallback((id, data) => {
    setOrganizations((prev) =>
      prev.map((o) => (String(o.id) === String(id) ? { ...o, ...data } : o)),
    );
  }, []);

  // =====================
  // CONTRIBUTORS
  // =====================

  const addContributor = useCallback((data) => {
    const newContributor = {
      id: Date.now(),
      date: new Date().toLocaleDateString("pt-BR"),
      ...data,
    };
    setContributors((prev) => [newContributor, ...prev]);
  }, []);

  const getContributorsByOrganization = useCallback(
    (orgId) => {
      return contributors.filter(
        (c) => String(c.organizationId) === String(orgId),
      );
    },
    [contributors],
  );

  const getTransactionsByOrganization = useCallback(
    (orgId) => {
      return transactions.filter(
        (t) => String(t.organizationId) === String(orgId),
      );
    },
    [transactions],
  );

  // =====================
  // ALERTS (DASHBOARD)
  // =====================

  const getAlerts = useCallback(() => {
    return [
      { type: "success", text: "Campanha atingiu 90% da meta." },
      { type: "info", text: "Nova doação recebida." },
      { type: "warning", text: "Campanha encerra em 3 dias." },
    ];
  }, []);

  // =====================
  // VALORES DO CONTEXTO
  // =====================
  const value = useMemo(
    () => ({
      organizations,
      contributors,
      transactions,

      currentOrgId,

      getOrganizationById,
      updateOrganization,

      addContributor,
      getContributorsByOrganization,

      getTransactionsByOrganization,

      getAlerts,
    }),
    [
      organizations,
      contributors,
      transactions,
      currentOrgId,
      getOrganizationById,
      updateOrganization,
      addContributor,
      getContributorsByOrganization,
      getTransactionsByOrganization,
      getAlerts,
    ],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations() {
  const ctx = useContext(OrganizationContext);
  if (!ctx) {
    throw new Error(
      "useOrganizations must be used within OrganizationProvider",
    );
  }
  return ctx;
}
