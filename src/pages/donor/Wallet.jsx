import { useState } from "react";

import DonorLayout from "../../layouts/DonorLayout";

import { useWallet } from "../../contexts/WalletContext";

import { WalletBalanceCard } from "../../components/donor/wallet/WalletBalanceCard";
import { WalletStats } from "../../components/donor/wallet/WalletStats";
import { PaymentMethodsCard } from "../../components/donor/wallet/PaymentMethodsCard";
import { TransactionHistory } from "../../components/donor/wallet/TransactionHistory";
import { AddBalanceModal } from "../../components/common/modals/AddBalanceModal";
import { AddPaymentMethodModal } from "../../components/common/modals/AddPaymentMethodModal";

export function Wallet() {
  const { balance, transactions, stats, addBalance } = useWallet();

  console.log("WALLET PAGE", {
    balance,
    transactions,
    stats,
  });

  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

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

  // 💰 RECARGA (COMPATÍVEL COM CONTEXT)
  async function handleAddBalance(data) {
    console.log("MODAL ENVIOU", data);

    if (!data) return;

    const amount = Number(data.amount);
    const method = data.method;

    console.log("CHAMANDO addBalance", amount, method);

    await addBalance(amount, method);

    console.log("addBalance FINALIZOU");

    setIsBalanceOpen(false);
  }

  // 💳 MÉTODOS
  function handleAddMethod(data) {
    const newMethod = {
      type: data.type?.toUpperCase(),
      value:
        data.pixKey ||
        data.cardNumber ||
        `${data.bank || ""} ${data.account || ""}`.trim(),
    };

    setMethods((prev) => [newMethod, ...prev]);
    setIsMethodOpen(false);
  }

  return (
    <DonorLayout
      title="Carteira"
      description="Gerencie seu saldo e acompanhe suas movimentações"
    >
      <div className="flex flex-col gap-6">
        {/* SALDO */}
        <WalletBalanceCard
          balance={balance}
          onAddBalance={() => setIsBalanceOpen(true)}
        />

        {/* STATS */}
        <WalletStats stats={stats} />

        {/* MÉTODOS */}
        <PaymentMethodsCard
          methods={methods}
          onAddMethod={() => setIsMethodOpen(true)}
        />

        {/* HISTÓRICO */}
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
