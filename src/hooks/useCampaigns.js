import { useEffect, useMemo, useState } from "react";
import {
  getOrganizations,
  createOrganization,
} from "../services/organizationsService";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtros (UI state separado)
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    minMembers: "",
    minTransactions: "",
    date: "",
  });

  // paginação (mantém, mas isolada)
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const data = await getOrganizations();
    setOrganizations(data);
    setLoading(false);
  }

  // helpers
  function normalizeDate(date) {
    if (!date) return null;
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  }

  // 🔥 FILTRO PURAMENTE DERIVADO (sem estado)
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchSearch =
        org.nome
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchStatus =
        filters.status === "" || org.status === filters.status;

      const matchMembers =
        filters.minMembers === "" ||
        org.membros >= Number(filters.minMembers);

      const matchTransactions =
        filters.minTransactions === "" ||
        org.transacoes >= Number(filters.minTransactions);

      const matchDate =
        filters.date === "" ||
        normalizeDate(org.dataCadastro) === filters.date;

      return (
        matchSearch &&
        matchStatus &&
        matchMembers &&
        matchTransactions &&
        matchDate
      );
    });
  }, [organizations, filters]);

  // paginação derivada
  const totalPages = Math.ceil(
    filteredOrganizations.length / itemsPerPage
  );

  const currentOrganizations = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrganizations.slice(
      start,
      start + itemsPerPage
    );
  }, [filteredOrganizations, page]);

  // CRUD
  async function addOrganization(nome, ativa) {
    const newOrg = await createOrganization({
      nome,
      status: ativa ? "Ativa" : "Inativa",
    });

    setOrganizations((prev) => [...prev, newOrg]);
  }

  // filtro genérico (mais escalável)
  function updateFilter(key, value) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // reset página ao filtrar
  }

  function clearFilters() {
    setFilters({
      search: "",
      status: "",
      minMembers: "",
      minTransactions: "",
      date: "",
    });
    setPage(1);
  }

  return {
    // dados
    organizations,
    filteredOrganizations,
    currentOrganizations,

    // loading
    loading,

    // filtros
    filters,
    updateFilter,
    clearFilters,

    // paginação
    page,
    setPage,
    totalPages,

    // ações
    addOrganization,
  };
}