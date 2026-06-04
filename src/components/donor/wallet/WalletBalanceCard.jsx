import { Wallet } from "lucide-react";
import { Button } from "../../common/Button";

export function WalletBalanceCard({ balance, onAddBalance }) {
  return (
    <div className="bg-white rounded-[10px] border border-zinc-300 p-6 shadow-[0px_7px_30px_-4px_rgba(0,0,0,0.12)]">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-400 text-sm font-extrabold">
            SALDO DISPONÍVEL
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-2">
            R$ {balance.toLocaleString("pt-BR")}
          </h2>
        </div>

        <Wallet size={40} className="text-blue-600" />
      </div>

      <div className="mt-6">
        <Button onClick={onAddBalance}>Adicionar saldo</Button>
      </div>
    </div>
  );
}
