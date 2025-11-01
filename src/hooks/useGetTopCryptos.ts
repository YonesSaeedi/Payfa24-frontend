import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { CryptoItem } from "../types/crypto";

const useGetTopCryptos = (sortType: number, limit: number = 5) => {
  return useQuery({
    queryKey: ["top-cryptos", sortType],
    queryFn: async () => {
      const res = await apiRequest<{ list: CryptoItem[] }>({
        url: "/list-cryptocurrencies",
        params: { sort: sortType, limit },
      });
      return res.list;
    },
  });
};

export default useGetTopCryptos;
