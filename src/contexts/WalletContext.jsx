import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  getBalance,
  getTransactions,
  addBalance as addBalanceService,
  donate as donateService,
} from "../services/walletService";
import { useAuth } from "./AuthContext";

const WalletContext = createContext({});

export function WalletProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadWallet() {
    if (!userId) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [bal, tx] = await Promise.all([
        getBalance(userId),
        getTransactions(userId),
      ]);

      setBalance(Number(bal || 0));
      setTransactions(Array.isArray(tx) ? [...tx] : []);
    } catch (error) {
      console.error("Erro ao carregar wallet:", error);
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWallet();
  }, [userId]);

  async function addBalance(amount, method) {
    if (!userId) throw new Error("Usuário não autenticado");

    await addBalanceService({
      userId,
      amount: Number(amount),
      method,
    });

    await new Promise((r) => setTimeout(r, 50));
    await loadWallet();
  }

  async function donate(campaignId, amount) {
    if (!userId) throw new Error("Usuário não autenticado");

    await donateService({
      userId,
      campaignId,
      amount: Number(amount),
    });

    await new Promise((r) => setTimeout(r, 50));
    await loadWallet();
  }

  const stats = useMemo(() => {
    const safe = Array.isArray(transactions) ? transactions : [];

    const donated = safe
      .filter((t) => t.type === "donation")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const recharges = safe
      .filter((t) => t.type === "recharge")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const campaigns = new Set(
      safe.filter((t) => t.type === "donation").map((t) => t.campaignId)
    ).size;

    return {
      donated,
      recharges,
      campaigns,
      transactionsCount: safe.length,
    };
  }, [transactions]);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        stats,
        loading,
        addBalance,
        donate,
        reload: loadWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }

  return context;
}