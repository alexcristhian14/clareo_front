import { createContext, useContext, useEffect, useState } from "react";

import {
  getAssociations,
  associate as associateService,
  unassociate as unassociateService,
} from "../services/associationService";

import { useAuth } from "./AuthContext";

const AssociationContext = createContext({});

export function AssociationProvider({ children }) {
  const { user } = useAuth();

  const [associations, setAssociations] = useState([]);

  async function loadAssociations() {
    if (!user?.id) {
      setAssociations([]);
      return;
    }

    const data = await getAssociations(user.id);

    setAssociations(data);
  }

  useEffect(() => {
    loadAssociations();
  }, [user]);

  async function associate(organizationId) {
    await associateService({
      userId: user.id,
      organizationId,
    });

    await loadAssociations();
  }

  async function unassociate(organizationId) {
    await unassociateService({
      userId: user.id,
      organizationId,
    });

    await loadAssociations();
  }

  function isAssociated(organizationId) {
    return associations.some(
      (item) =>
        String(item.organizationId) === String(organizationId)
    );
  }

  return (
    <AssociationContext.Provider
      value={{
        associations,
        associate,
        unassociate,
        isAssociated,
      }}
    >
      {children}
    </AssociationContext.Provider>
  );
}

export function useAssociations() {
  return useContext(AssociationContext);
}