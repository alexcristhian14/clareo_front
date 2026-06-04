import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";

import { WalletBalanceCard } from "../../components/donor/wallet/WalletBalanceCard";
import { WalletStats } from "../../components/donor/wallet/WalletStats";
import { PaymentMethodsCard } from "../../components/donor/wallet/PaymentMethodsCard";
import { TransactionHistory } from "../../components/donor/wallet/TransactionHistory";
import { AddBalanceModal } from "../../components/common/modals/AddBalanceModal";
import { AddPaymentMethodModal } from "../../components/common/modals/AddPaymentMethodModal";

export function Wallet() {
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

  const [balance, setBalance] = useState(1000);

  const [transactions, setTransactions] = useState([]);

  const [methods, setMethods] = useState([
    {
      type: "PIX",
      value: "alex@email.com",
    },
    {
      type: "CARD",
      value: "**** **** **** 4821",
    },
  ]);

  const stats = {
    donated: 520,
    recharges: 870,
    campaigns: 7,
  };

  // =========================
  // ADD BALANCE (API READY)
  // =========================
  function handleAddBalance({ amount, method }) {
    const value = Number(amount);

    if (!value || value <= 0) return;

    setBalance((prev) => prev + value);

    setTransactions((prev) => [
      {
        id: Date.now(),
        type: "credit",
        title: "Recarga de saldo",
        amount: value,
        method,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  // =========================
  // ADD PAYMENT METHOD
  // =========================
  function handleAddMethod(data) {
    const newMethod = {
      type: data.type?.toUpperCase(),
      value:
        data.pixKey ||
        data.cardNumber ||
        `${data.bank || ""} ${data.account || ""}`,
    };

    setMethods((prev) => [newMethod, ...prev]);
  }

  return (
    <DonorLayout
      title="Carteira"
      description="Gerencie seu saldo e acompanhe suas movimentações"
    >
      <div className="flex flex-col gap-6">
        <WalletBalanceCard
          balance={balance}
          onAddBalance={() => setIsBalanceOpen(true)}
        />

        <WalletStats stats={stats} />

        <PaymentMethodsCard
          methods={methods}
          onAddMethod={() => setIsMethodOpen(true)}
        />

        <TransactionHistory transactions={transactions} />

        {/* MODAIS */}
        <AddBalanceModal
          isOpen={isBalanceOpen}
          onClose={() => setIsBalanceOpen(false)}
          onSubmit={handleAddBalance}
        />

        <AddPaymentMethodModal
          isOpen={isMethodOpen}
          onClose={() => setIsMethodOpen(false)}
          onSubmit={handleAddMethod}
        />
      </div>
    </DonorLayout>
  );
}
