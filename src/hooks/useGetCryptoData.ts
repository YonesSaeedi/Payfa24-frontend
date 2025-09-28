import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/apiClient"
import { CryptoItem } from "../types/crypto"

const useGetCryptoData = () => {
  return useQuery<CryptoItem[], Error, Record<string, CryptoItem>>({
    queryKey: ['crypto-data'],
    queryFn: async () => {
      const response = await apiRequest<{ list: CryptoItem[] }>({ url: '/api/list-cryptocurrencies', params: { 'sort': 1, 'limit': 2000, 'page': 1 } })
      return response.list
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) =>
      data.reduce((acc, item) => {
        acc[item.symbol] = item
        return acc
      }, {} as Record<string, CryptoItem>)
  })
}

export default useGetCryptoData