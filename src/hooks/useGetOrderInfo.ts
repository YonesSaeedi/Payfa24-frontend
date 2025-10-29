import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/apiClient"
import { OrderGetInfo } from "../types/apiResponses"

const useGetOrderInfo = () => {
  return useQuery({
    queryKey: ['order-info'],
    queryFn: async () => {
      const response = await apiRequest<OrderGetInfo>({ url: '/api/order/get-info' })
      return response
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    select: (data) => {
      const convertedCoins = data.coins?.reduce<Record<string, (typeof data.coins)[number]>>((acc, item) => {
        acc[item.symbol] = item
        return acc
      }, {}) ?? {}
      const convertedDigitalCoins = data.digitalCurrency?.reduce<Record<string, (typeof data.digitalCurrency)[number]>>((acc, item) => {
        acc[item.symbol] = item
        return acc
      }, {}) ?? {}
      return { coins: convertedCoins, digitalCurrency: convertedDigitalCoins }
    }
  })
}

export default useGetOrderInfo