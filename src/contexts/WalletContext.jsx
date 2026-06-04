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

    const [bal, tx] = await Promise.all([
      getBalance(userId),
      getTransactions(userId),
    ]);

    setBalance(Number(bal));
    setTransactions(Array.isArray(tx) ? tx : []);

    setLoading(false);
  }

  useEffect(() => {
    loadWallet();
  }, [userId]);

  async function addBalance(amount, method) {
    if (!userId) return;

    await addBalanceService({
      userId,
      amount: Number(amount),
      method,
    });

    await loadWallet();
  }

  async function donate(campaignId, amount, campaignTitle) {
    if (!userId) return;

    await donateService({
      userId,
      campaignId,
      amount: Number(amount),
    });

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

    return {
      donated,
      recharges,
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
  return useContext(WalletContext);
}
