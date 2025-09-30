import { SearchIcon } from "lucide-react";
import { useMemo } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import useGetCryptoData from "../../hooks/useGetCryptoData";
import { CryptoDataMap } from "../../types/crypto";

export default function CurrencyModal() {
  const { data: generalData, isLoading: isGeneralInfoLoading } = useGetGeneralInfo()
  const { data: cryptocurrenciesData, isLoading: isCryptocurrenciesLoading } = useGetCryptoData()
  const isLoading = isGeneralInfoLoading || isCryptocurrenciesLoading
  // computes an object with keys of crypto symbols and memoize it =======================================================================================
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item
      return acc
    }, {} as CryptoDataMap) ?? {}
  }, [generalData]) // only recalculates when generalData changes  
  // function that returns merged data (general info + list-cryptocurrencies) about crypto currencies; and memoizing ======================================
  function mergeCryptoData(cryptosConstantInfo: CryptoDataMap, cryptosVariableInfo: CryptoDataMap) {
    const result: CryptoDataMap = {}
    for (const key of Object.keys(cryptosVariableInfo)) {
      if (cryptosConstantInfo[key]) result[key] = { ...cryptosConstantInfo[key], ...cryptosVariableInfo[key] }
    }
    return result
  }
  const mergedCryptosData = useMemo(() => {
    if (mappedGeneralData && cryptocurrenciesData) {
      return mergeCryptoData(mappedGeneralData, cryptocurrenciesData)
    }
  }, [mappedGeneralData, cryptocurrenciesData])
  console.log('merged => ', mergedCryptosData);

  return (
    <div dir="ltr" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white1 rounded-xl shadow-lg w-full max-w-md px-4 pt-4">
        {/* Modal Header ============================================================================================================================ */}
        <div className="flex justify-between flex-row-reverse items-center mb-4">
          <h2 className="text-lg font-bold text-black0">انتخاب ارز</h2>
          <span onClick={() => null} className="icon-wrapper w-6 h-6">
            <IconClose />
          </span>
        </div>
        {/* Search Bar ============================================================================================================================== */}
        <div className="relative w-full mb-4 ">
          <input
            type="text"
            placeholder="... جستجو "
            className="w-full pl-10 pr-8 py-3 bg-transparent border border-gray5 rounded-lg focus:outline-none focus:border-blue2 text-right"
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 icon-wrapper text-gray5">
            <SearchIcon />
          </span>
        </div>
        {/* Currency List ============================================================================================================================ */}
        <div className="space-y-3 max-h-96 overflow-y-auto px-5">

        </div>
      </div>
    </div>
  );
}