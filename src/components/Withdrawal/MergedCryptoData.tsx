
import { CryptoItem } from "../../types/crypto"
import useGetCryptoData from "../../hooks/useGetCryptoData"
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo"
import useGetCryptoWithdraw from "../../hooks/useGetCryptoWithdraw"


const useMergedCryptoList = () => {
  const generalInfo = useGetGeneralInfo()
  const cryptoData = useGetCryptoData()
   const withdrawQuery = useGetCryptoWithdraw()
  

  const isLoading =
    generalInfo.isLoading || cryptoData.isLoading || withdrawQuery.isLoading
  const isError =
    generalInfo.isError || cryptoData.isError || withdrawQuery.isError

    
console.log("🔹 useMergedCryptoList running")
console.log("🔹 generalInfo:", generalInfo)
console.log("🔹 cryptoData:", cryptoData)
console.log("🔹 withdrawQuery:", withdrawQuery)
console.log("💡 withdrawQuery.data raw:", withdrawQuery.data)


let merged: CryptoItem[] = []

const coins = withdrawQuery.data ? Object.values(withdrawQuery.data) : [];


if (!isLoading && !isError && coins.length > 0) {
  merged = coins.map((coin) => {
    const info = generalInfo.data?.cryptocurrency?.find((c) => c.symbol === coin.symbol)
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
    } as CryptoItem
  })

  // فقط ارزهایی که موجودی بیشتر از صفر دارند
  merged = merged.filter(item => Number(item.balance) > 0)

  console.log("🔹 mergedCryptosData filtered by balance:", merged)
}




  return {
    data: merged,
    isLoading,
    isError,
  }
}

export default useMergedCryptoList
