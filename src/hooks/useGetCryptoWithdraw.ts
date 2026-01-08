import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { CryptoWithdrawResponse, Coin } from "../types/cryptoWithdraw";

const useGetCryptoWithdraw = () => {
  return useQuery<any>({
    queryKey: ['crypto-withdraw'],
    queryFn: async () => {
      const response = await apiRequest<CryptoWithdrawResponse>({
        url: '/wallets/crypto/withdraw',
      });
      return response;
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => {
      // Keep both coins and networks
      const coinsBySymbol: Record<string, Coin> = data.coins.reduce((acc: any, coin: any) => {
        acc[coin.symbol] = coin;
        return acc;
      }, {} as Record<string, Coin>);

      return {
        coins: coinsBySymbol,
        networks: data.networks, // <-- include the networks object
        level_used: data.level_used,
      };
    },
  });
};

export default useGetCryptoWithdraw;
