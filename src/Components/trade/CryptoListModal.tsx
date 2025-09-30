import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";
import useGetCryptoData from "../../hooks/useGetCryptoData";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap } from "../../types/crypto";
import IconSearch from "../../assets/icons/market/IconSearch";
import CurrenciesVirtualizedList from "./CurrenciesVirtualizedList";

type CryptoListModalProps = {
  setIsCryptoListModalOpen: Dispatch<SetStateAction<boolean>>;
}

const fakeData = [
  { name: 'btc', symbol: 'btc' },
  { name: 'xrp', symbol: 'btc' },
  { name: 'eth', symbol: 'btc' },
  { name: 'ada', symbol: 'btc' },
]

const CryptoListModal = ({ setIsCryptoListModalOpen }: CryptoListModalProps) => {
  const [isDollarCurrencies, setIsDollarCurrencies] = useState<boolean>(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
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
    if (
      mappedGeneralData &&
      Object.keys(mappedGeneralData).length > 0 &&
      cryptocurrenciesData &&
      typeof cryptocurrenciesData === "object"
    ) {
      return mergeCryptoData(mappedGeneralData, cryptocurrenciesData)
    }
    return {}
  }, [mappedGeneralData, cryptocurrenciesData])
  console.log('merged => ', mergedCryptosData);
  // =======================================================================================================================================================
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div onClick={() => setIsCryptoListModalOpen(false)} className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center">
      <div onClick={handleModalClick} className="bg-white8 rounded-2xl border border-white6 pt-4 px-4 lg:pt-8 lg:px-6 flex flex-col gap-5 w-[328px] lg:w-[480px]">
        {/* modal header ================================================================================================================================== */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium lg:text-lg lg:font-bold text-black1">انتخاب ارز</span>
          <span onClick={() => setIsCryptoListModalOpen(false)} className="icon-wrapper h-6 w-6 cursor-pointer text-gray12 hover:text-blue1 transition duration-200"><IconClose /></span>
        </div>
        {/* modal body ==================================================================================================================================== */}
        <div className="flex flex-col gap-4">
          {/* search box */}
          <div onClick={() => searchInputRef.current?.focus()} className="rounded-lg px-4 py-2.5 lg:py-3 flex items-center gap-2 border border-gray15 cursor-text focus-within:border-blue1 transition duration-200">
            <span className="w-5 h-5 lg:w-6 lg:h-6 text-gray15"><IconSearch /></span>
            <input type="text" placeholder="جستجو..." ref={searchInputRef} className="bg-transparent outline-none text-black1 placeholder:text-gray15" />
          </div>
          {/* currency type toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setIsDollarCurrencies(false)}
              className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg ${isDollarCurrencies ? 'border-gray21 text-gray1 font-medium' : 'text-blue2 border-blue2 font-bold'}`}
            >
              رمزارز
            </button>
            <button
              onClick={() => setIsDollarCurrencies(true)}
              className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg ${!isDollarCurrencies ? 'border-gray21 text-gray1 font-medium' : 'text-blue2 border-blue2 font-bold'}`}
            >
              ارز‌های دلاری
            </button>
          </div>
          {/* crypto currencies list */}
          <CurrenciesVirtualizedList items={Object.values(mergedCryptosData)} height={400} itemHeight={60} width='100%' />
        </div>
      </div>
    </div>
  )
}

export default CryptoListModal