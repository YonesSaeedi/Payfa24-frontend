// 📁 hooks/useMergedCryptoList.ts
import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../../utils/apiClient"
import { CryptoItem } from "../../types/crypto"
import useGetCryptoData from "../../hooks/useGetCryptoData"
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo"

interface WithdrawResponse {
  coins?: {
    id: number
    symbol: string
    balance: string
    balance_available: string
    network: { id: number; withdraw_min: string }[]
  }[]
}

const useMergedCryptoList = () => {
  const generalInfo = useGetGeneralInfo()
  const cryptoData = useGetCryptoData()

  const withdrawQuery = useQuery<WithdrawResponse, Error>({
    queryKey: ["wallets-withdraw"],
    queryFn: () => apiRequest({ url: "/wallets/crypto/withdraw" }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const isLoading =
    generalInfo.isLoading || cryptoData.isLoading || withdrawQuery.isLoading
  const isError =
    generalInfo.isError || cryptoData.isError || withdrawQuery.isError

  let merged: CryptoItem[] = []

  if (!isLoading && !isError && Array.isArray(withdrawQuery.data?.coins)) {
    const coins = withdrawQuery.data.coins

    // 🔹 مرحله ۱: ساخت لیست مرج‌شده
    merged = coins.map((coin) => {
      const info = generalInfo.data?.cryptocurrency?.find(
        (c) => c.symbol === coin.symbol
      )
      const market = cryptoData.data?.[coin.symbol]

      return {
        symbol: coin.symbol,
        id: coin.id,
        name: info?.name ?? coin.symbol,
        icon: info?.icon ?? "",
        color: info?.color ?? "#999",
        withdraw: info?.withdraw ? 1 : 0,
        deposit: info?.deposit ? 1 : 0,
        buy_status: info?.buy_status ? 1 : 0,
        sell_status: info?.sell_status ? 1 : 0,
        isFont: info?.isFont,
        isDisable: market?.isDisable ?? info?.isDisable ?? false,
        percent: info?.percent,
        locale: info?.locale,
        priceBuy: market?.priceBuy,
        priceSell: market?.priceSell,
        priceChangePercent: market?.priceChangePercent,
        quoteVolume: market?.quoteVolume,
        type: "crypto",
        balance_available: coin.balance_available, // ✅ اضافه شد
        balance: coin.balance,
      } as CryptoItem
    })

    // 🔹 مرحله ۲: فیلتر فقط ارزهایی با موجودی قابل برداشت
    merged = merged.filter(
      (item) => Number(item.balance_available) > 0
    )

   
  }

  return {
    data: merged,
    isLoading,
    isError,
  }
}

export default useMergedCryptoList
