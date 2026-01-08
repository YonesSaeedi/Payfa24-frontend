
import useGetCryptoData from "../../hooks/useGetCryptoData"
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo"
import useGetCryptoWithdraw from "../../hooks/useGetCryptoWithdraw"
import { useMemo } from "react"


const useMergedCryptoList = () => {
  const generalInfo = useGetGeneralInfo()
  const cryptoData = useGetCryptoData()
  const withdrawQuery = useGetCryptoWithdraw()

  const isLoading =
    generalInfo.isLoading || cryptoData.isLoading || withdrawQuery.isLoading
  const isError =
    generalInfo.isError || cryptoData.isError || withdrawQuery.isError

  const allNetworks = withdrawQuery.data?.networks || []

  const data = useMemo(() => {
    if (isLoading || isError || !withdrawQuery.data?.coins) return []

    const coins = Object.values(withdrawQuery.data.coins)

    return coins.map((coin: any) => {
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
        balance_available: coin.balance_available,
        balance: coin.balance,
        network: coin.network || [], // ⚡ important: keep network
      }
    }).filter((item) => Number(item.balance) > 0)
  }, [isLoading, isError, withdrawQuery.data, generalInfo.data, cryptoData.data])

  return {
    data,
    isLoading,
    isError,
    allNetworks
  }
}


export default useMergedCryptoList