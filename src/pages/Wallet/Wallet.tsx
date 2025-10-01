import WalletCard from "../../Components/Home/WalletCard/WalletCard";
import HeaderLayout from "../../layouts/HeaderLayout";
import WalletAssets from "../../Components/Wallet/WalletAssets"
import { apiRequest } from "../../utils/apiClient";
import { useEffect, useState } from "react";

interface BalanceResponse {
  balance: number;
  balance_available: number;
  internal: {
    id: number;
    title: string;
    symbol: string;
    percent: number;
    status: "active" | "inactive" | string; // می‌تونی دقیق‌تر محدود کنی
  };
}



export default function Wallet() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null)

  async function getBalance() {
    try {
      const response = await apiRequest<BalanceResponse>({
        url: "/api/wallets/fiat/balance",
        method: "GET",
      });
      setBalance(response); // مقدار رو داخل state ذخیره کن
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  useEffect(() => {
    getBalance();
  }, []);
  
  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="p-6 pt-16 container-style flex flex-col lg:flex-row-reverse gap-10">
          <div className="w-full lg:w-auto text-right">
            <WalletCard
                balance={balance?.balance ?? 0}
              changeAmount={5000}
              change={2.3}
              showBuySell={false}
            />
          </div>
          <div className="w-full lg:w-auto">
            <p className="pb-7 font-bold text-[18px] leading-[100%] tracking-[0%] text-right align-middle">
              دارایی های شما
            </p>

            <WalletAssets />
          </div>
        </div>
      </HeaderLayout>
    </div>
  );
}
