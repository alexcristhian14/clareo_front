let wallets = {};

function ensureWallet(userId) {
  if (!wallets[userId]) {
    wallets[userId] = {
      balance: 0,
      transactions: [],
    };
  }
  return wallets[userId];
}

export async function getBalance(userId) {
  return ensureWallet(userId).balance;
}

export async function getTransactions(userId) {
  return ensureWallet(userId).transactions;
}

export async function addBalance({ userId, amount, method }) {
  const wallet = ensureWallet(userId);

  const value = Number(amount || 0);

  wallet.balance += value;

  wallet.transactions.unshift({
    type: "recharge",
    amount: value,
    method,
    date: new Date().toISOString(),
  });

  return wallet.balance;
}

export async function donate({ userId, campaignId, amount }) {
  const wallet = ensureWallet(userId);

  const value = Number(amount || 0);

  if (value <= 0) {
    throw new Error("Valor inválido");
  }

  if (wallet.balance < value) {
    throw new Error("Saldo insuficiente");
  }

  wallet.balance -= value;

  wallet.transactions.unshift({
    type: "donation",
    campaignId,
    amount: value,
    date: new Date().toISOString(),
  });

  return wallet.balance;
}