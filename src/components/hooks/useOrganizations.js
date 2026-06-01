// hooks/useOrganizations.js
import { useEffect, useState } from "react";
import { getOrganizations, createOrganization } from "../services/organizationsService";

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minMembers, setMinMembers] = useState("");
  const [minTransactions, setMinTransactions] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
      setLoading(false);
    }

    load();
  }, []);

  function convertDate(date) {
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  }

  const filteredOrganizations = organizations.filter((org) => {
    return (
      org.nome.toLowerCase().includes(search.toLowerCase()) &&
      (status === "" || org.status === status) &&
      (minMembers === "" || org.membros >= Number(minMembers)) &&
      (minTransactions === "" || org.transacoes >= Number(minTransactions)) &&
      (dateFilter === "" || convertDate(org.dataCadastro) === dateFilter)
    );
  });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

  const currentOrganizations = filteredOrganizations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function addOrganization(nome, ativa) {
    const newOrg = await createOrganization({
      nome,
      status: ativa ? "Ativa" : "Inativa",
    });

    setOrganizations((prev) => [...prev, newOrg]);
  }

  return {
    organizations,
    currentOrganizations,
    filteredOrganizations,

    search,
    setSearch,
    status,
    setStatus,
    minMembers,
    setMinMembers,
    minTransactions,
    setMinTransactions,
    dateFilter,
    setDateFilter,

    currentPage,
    setCurrentPage,
    totalPages,

    addOrganization,
    loading,
  };
}