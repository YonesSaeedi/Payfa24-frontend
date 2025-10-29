// hooks/useGetCryptoWithdraw.ts
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { CryptoWithdrawResponse, Coin } from "../types/cryptoWithdraw";

const useGetCryptoWithdraw = () => {
  return useQuery<CryptoWithdrawResponse, Error, Record<string, Coin>>({
    queryKey: ['crypto-withdraw'],
    queryFn: async () => {
      const response = await apiRequest<CryptoWithdrawResponse>({
        url: '/api/wallets/crypto/withdraw',
      });
      return response;
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) =>
      // آرایه coins را به یک object با key = symbol تبدیل می‌کنیم
      data.coins.reduce((acc, coin) => {
        acc[coin.symbol] = coin;
        return acc;
      }, {} as Record<string, Coin>)
  });
};

export default useGetCryptoWithdraw;
