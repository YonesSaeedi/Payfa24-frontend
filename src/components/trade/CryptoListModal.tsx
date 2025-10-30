import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import IconClose from "../../assets/icons/Login/IconClose";
import { CryptoItem } from "../../types/crypto";
import IconSearch from "../../assets/icons/market/IconSearch";
import CurrenciesVirtualizedList from "./CurrenciesVirtualizedList";

type CryptoListModalProps = {
  setIsCryptoListModalOpen: Dispatch<SetStateAction<boolean>>;
  cryptoListData: CryptoItem[]
  setCurrentCryptoCurrency: (cryptocurrency: CryptoItem) => void
  isCryptoListLoading?: boolean
  digitalCryptoListData?: CryptoItem[]
}

const CryptoListModal = ({ setIsCryptoListModalOpen, cryptoListData, setCurrentCryptoCurrency, isCryptoListLoading, digitalCryptoListData }: CryptoListModalProps) => {
  const [isDollarCurrencies, setIsDollarCurrencies] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchResults, setSearchResults] = useState<CryptoItem[]>([])
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  // =======================================================================================================================================================
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }
  const handleSwitch = (value: boolean) => {
    setIsDollarCurrencies(value);
    setSearchTerm('');
    setSearchResults([]);
  };
  // search functionality ===================================================================================================================================
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setSearchTerm(value)
    if (value === '') {
      setSearchResults([]) // reset to show full list
      return
    }
    const filtered = (isDollarCurrencies ? digitalCryptoListData : cryptoListData)?.filter((cryptoItem: CryptoItem) =>
      cryptoItem?.symbol?.toLowerCase().includes(value.toLowerCase()) ||
      cryptoItem?.locale?.fa?.name?.toLowerCase().includes(value.toLowerCase()) ||
      cryptoItem?.locale?.en?.name?.toLowerCase().includes(value.toLowerCase())
    ) ?? []
    setSearchResults(filtered)
  }
  const displayList = isCryptoListLoading
    ? Array(10).fill(null)
    : searchTerm
      ? searchResults
      : isDollarCurrencies
        ? digitalCryptoListData ?? [] // safe fallback
        : cryptoListData;

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
          <div
            onClick={() => searchInputRef.current?.focus()}
            className="rounded-lg px-4 py-2.5 lg:py-3 flex items-center gap-2 border border-gray15 cursor-text focus-within:border-blue2 focus-within:shadow-[0_0_8px_rgba(33,107,232,0.3)] transition duration-200 ease-in group"
          >
            <span className="w-5 h-5 lg:w-6 lg:h-6 text-gray15 group-focus-within:text-blue2 transition duration-200 ease-in"><IconSearch /></span>
            <input onChange={handleSearch} type="text" placeholder="جستجو..." ref={searchInputRef} className="bg-transparent outline-none text-black1 placeholder:text-gray15" />
          </div>
          {/* currency type toggle */}
          <div className={`items-center ${digitalCryptoListData ? 'flex' : 'hidden'}`}>
            <button
              onClick={() => handleSwitch(false)}
              className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg
                ${isDollarCurrencies ? 'border-gray21 text-gray1 font-medium' : 'text-blue2 border-blue2 font-bold'}`}
            >
              رمزارز
            </button>
            <button
              onClick={() => handleSwitch(true)}
              className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg
                ${!isDollarCurrencies ? 'border-gray21 text-gray1 font-medium' : 'text-blue2 border-blue2 font-bold'}`}
            >
              ارز‌های دلاری
            </button>
          </div>
          {/* crypto currencies list */}
          <CurrenciesVirtualizedList
            items={displayList}
            height={400}
            itemHeight={60}
            width='100%'
            setCurrentCryptoCurrency={setCurrentCryptoCurrency}
            closeModal={() => setIsCryptoListModalOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}

export default CryptoListModal