// import { useQueries } from "@tanstack/react-query"
// import { apiRequest } from "../utils/apiClient"
// import { CryptoItem } from "../types/crypto"

// const useMergedCryptoList = () => {
//   const results = useQueries({
//     queries: [
//       {
//         queryKey: ['withdraw-info'],
//         queryFn: () => apiRequest({ url: '/api/wallets/crypto/withdraw' }),
//       },
//       {
//         queryKey: ['general-info'],
//         queryFn: () => apiRequest({ url: '/api/get-general-info' }),
//       },
//       {
//         queryKey: ['crypto-prices'],
//         queryFn: async () => {
//           const response = await apiRequest<{ list: CryptoItem[] }>({
//             url: '/api/list-cryptocurrencies',
//             params: { limit: 2000, page: 1 },
//           })
//           return response.list || []
//         },
//       },
//     ],
//   })

//   const [withdrawRes, generalRes, pricesRes] = results

//   const isLoading = withdrawRes.isLoading || generalRes.isLoading || pricesRes.isLoading
//   const isError = withdrawRes.isError || generalRes.isError || pricesRes.isError

//   const mergedCryptosData: CryptoItem[] = (() => {
//     if (!withdrawRes.data || !generalRes.data) return []

//     const coins = withdrawRes.data.coins || []
//     const general = generalRes.data.cryptocurrency || []
//     const prices = pricesRes.data || []

//     return coins
//       .filter((coin: any) => Number(coin.balance_available) > 0) // ✅ فقط ارزهایی با موجودی
//       .map((coin: any): CryptoItem => {
//         const g = general.find((c: any) => c.symbol === coin.symbol)
//         const p = prices.find((c: any) => c.symbol === coin.symbol)

//         return {
//           id: g?.id || coin.id,
//           symbol: coin.symbol,
//           name: g?.name || coin.symbol,
//           icon: g?.icon || null,
//           color: g?.color || "#ccc",
//           balance: coin.balance,
//           balance_available: coin.balance_available,
//           deposit: g?.deposit ? 1 : 0,
//           withdraw: g?.withdraw ? 1 : 0,
//           buy_status: g?.buy_status ? 1 : 0,
//           sell_status: g?.sell_status ? 1 : 0,
//           isFont: g?.isFont || false,
//           isDisable: g?.isDisable || p?.isDisable || false,
//           type: "crypto",

//           // 🔹 قیمت‌ها از API سوم
//           priceBuy: p?.priceBuy || null,
//           priceSell: p?.priceSell || null,
//           priceChangePercent: p?.priceChangePercent || null,
//           quoteVolume: p?.quoteVolume || null,
//         }
//       })
//   })()

//   return { data: mergedCryptosData, isLoading, isError }
// }

// export default useMergedCryptoList
