import { createContext, useContext, useMemo, useState } from "react";


const OrganizationContext = createContext({});

export function OrganizationProvider({ children, userId }) {
  const [organizations] = useState([
    {
      id: 1,
      name: "Instituto Saúde Viva",
      description:
        "Organização focada em saúde comunitária e atendimento de populações em situação de vulnerabilidade.",

      campaignsCount: 15,
      supporters: 2134,
      raised: 850000,
      years: 8,
    },

    {
      id: 2,
      name: "Projeto Futuro",
      description: "Educação para jovens em situação de vulnerabilidade.",

      campaignsCount: 9,
      supporters: 1240,
      raised: 420000,
      years: 5,
    },

    {
      id: 3,
      name: "Rede Esperança",
      description: "Combate à insegurança alimentar.",

      campaignsCount: 12,
      supporters: 980,
      raised: 310000,
      years: 6,
    },
  ]);

  function getOrganizationById(id) {
    return organizations.find((org) => Number(org.id) === Number(id));
  }

  const value = useMemo(
    () => ({
      organizations,
      getOrganizationById,
    }),
    [organizations],
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizations() {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      "useOrganizations must be used within OrganizationProvider",
    );
  }

  return context;
}
