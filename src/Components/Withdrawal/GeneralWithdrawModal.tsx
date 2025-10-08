
import React, { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import IconClose from "../../assets/Icons/Login/IconClose";
import IconSearch from "../../assets/icons/market/IconSearch";
import CurrenciesVirtualizedList from "../trade/CurrenciesVirtualizedList";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import useGetCryptoWithdraw from "../../hooks/useGetCryptoWithdraw";
import { CryptoItem } from "../../types/crypto";
import { Coin } from "../../types/cryptoWithdraw";

type GeneralWithdrawModalProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentCryptoCurrency: (cryptocurrency: CryptoItem) => void;
};

const GeneralWithdrawModal = ({
  setIsModalOpen,
  setCurrentCryptoCurrency,
}: GeneralWithdrawModalProps) => {
  const [isDollarCurrencies, setIsDollarCurrencies] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CryptoItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------------------------------------------------
  // 📡 Fetch data from APIs
  const { data: generalData, isLoading: isGeneralInfoLoading } = useGetGeneralInfo();
  const { data: cryptoWithdrawData, isLoading: isWithdrawLoading } = useGetCryptoWithdraw();

  const isLoading = isGeneralInfoLoading || isWithdrawLoading;

  // -------------------------------------------------------------------
  // 🔁 Merge general info with withdraw data
  const mergedData: CryptoItem[] = useMemo(() => {
    if (!generalData?.cryptocurrency || !cryptoWithdrawData) return [];

    return generalData.cryptocurrency.map((item) => {
      const withdrawInfo: Coin | undefined = cryptoWithdrawData[item.symbol];
      return {
        ...item,
        balance: withdrawInfo?.balance || "0",
        balance_available: withdrawInfo?.balance_available || "0",
        networks: withdrawInfo?.network || [],
      };
    });
  }, [generalData, cryptoWithdrawData]);

  // -------------------------------------------------------------------
  // 🔍 Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    if (value === "") {
      setSearchResults([]);
      return;
    }
    const filtered = mergedData.filter(
      (cryptoItem) =>
        cryptoItem?.symbol?.toLowerCase().includes(value.toLowerCase()) ||
        cryptoItem?.name?.toLowerCase().includes(value.toLowerCase()) ||
        cryptoItem?.locale?.fa?.name?.toLowerCase().includes(value.toLowerCase()) ||
        cryptoItem?.locale?.en?.name?.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const displayList = isLoading
    ? Array(10).fill(null)
    : searchTerm
    ? searchResults
    : mergedData;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation();

  // -------------------------------------------------------------------
  return (
    <div dir="rtl"
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={handleModalClick}
        className="bg-white8 rounded-2xl border border-white6 pt-4 px-4 lg:pt-8 lg:px-6 flex flex-col gap-5 w-[328px] lg:w-[480px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium lg:text-lg lg:font-bold text-black1">
            انتخاب ارز برای برداشت
          </span>
          <span
            onClick={() => setIsModalOpen(false)}
            className="icon-wrapper h-6 w-6 cursor-pointer text-gray12 hover:text-blue1 transition duration-200"
          >
            <IconClose />
          </span>
        </div>

        {/* Search box */}
        <div
          onClick={() => searchInputRef.current?.focus()}
          className="rounded-lg px-4 py-2.5 lg:py-3 flex items-center gap-2 border border-gray15 cursor-text focus-within:border-blue1 transition duration-200"
        >
          <span className="w-5 h-5 lg:w-6 lg:h-6 text-gray15">
            <IconSearch />
          </span>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="جستجو..."
            ref={searchInputRef}
            className="bg-transparent outline-none text-black1 placeholder:text-gray15"
          />
        </div>

        {/* Type toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setIsDollarCurrencies(false)}
            className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg ${
              isDollarCurrencies
                ? "border-gray21 text-gray1 font-medium"
                : "text-blue2 border-blue2 font-bold"
            }`}
          >
            رمزارز
          </button>
          <button
            onClick={() => setIsDollarCurrencies(true)}
            className={`w-1/2 border-b-2 py-1.5 lg:py-2 hover:text-blue2 transition duration-300 text-sm lg:text-lg ${
              !isDollarCurrencies
                ? "border-gray21 text-gray1 font-medium"
                : "text-blue2 border-blue2 font-bold"
            }`}
          >
            ارز‌های دلاری
          </button>
        </div>

        {/* Currency list */}
        <CurrenciesVirtualizedList
          items={displayList}
          height={400}
          itemHeight={60}
          width="100%"
          setCurrentCryptoCurrency={setCurrentCryptoCurrency}
          closeModal={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default GeneralWithdrawModal;
