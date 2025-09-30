import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import IconClose from "../../assets/Icons/Login/IconClose";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import useGetCryptoWithdraw from "../../hooks/useGetCryptoWithdraw";
import { Coin } from "../../types/cryptoWithdraw";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (symbol: string) => void;
}

export default function CurrencyWithdrawModal({ open, onClose, onSelect }: Props) {
  const { data: generalData, isLoading: isGeneralInfoLoading } = useGetGeneralInfo();
  const { data: withdrawData, isLoading: isWithdrawLoading } = useGetCryptoWithdraw();
  const [query, setQuery] = useState("");

  const isLoading = isGeneralInfoLoading || isWithdrawLoading;

 const mergedCryptosData = useMemo(() => {
  if (!generalData || !withdrawData) return {};

  const iconMap: Record<string, string> = {};
  generalData.cryptocurrency?.forEach((c: any) => {
    iconMap[c.symbol.toUpperCase()] = c.icon;
  });

 console.log("IconMap:", iconMap); 

const BASE_ICON_URL = "https://api.payfa24.org/images/currency/";

const result: Record<string, Coin & { icon?: string; name?: string }> = {};
Object.keys(withdrawData).forEach((symbol) => {
  const coin = withdrawData[symbol];
  const symbolKey = coin.symbol.toUpperCase();
  result[symbolKey] = {
    ...coin,
    name: coin.symbol,
    icon: iconMap[symbolKey] ? `${BASE_ICON_URL}${iconMap[symbolKey]}` : "/default-coin.png",
  };
});


  return result;
}, [generalData, withdrawData]);


  // فیلتر و مرتب‌سازی
  const filtered = useMemo(() => {
    let list = Object.values(mergedCryptosData);
    if (query) {
      list = list.filter(
        (c) =>
          c.symbol?.toLowerCase().includes(query.toLowerCase()) ||
          c.name?.toLowerCase().includes(query.toLowerCase())
      );
    }
    // مرتب‌سازی بر اساس نام یا ترتیب دلخواه (اینجا فقط بر اساس نام)
    return list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [query, mergedCryptosData]);

  if (!open) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md px-4 pt-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">انتخاب ارز</h2>
          <button onClick={onClose} className="w-6 h-6">
            <IconClose />
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="... جستجو"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-3 bg-transparent border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-right"
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </span>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto px-2">
          {isLoading && <p className="text-center text-gray-500">در حال بارگذاری...</p>}

          {!isLoading &&
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelect(c.symbol);
                  onClose();
                }}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.icon} // آیکون
                    alt={c.symbol}
                    className="w-7 h-7 rounded-full border"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{c.name}</span>
                    <span className="text-gray-500 text-xs">{c.symbol}</span>
                  </div>
                </div>

                {/* نمایش موجودی */}
                <p>قیمت خرید</p>
                <span className="text-sm font-medium text-gray-700">
                  {c.balance_available ? `${c.balance_available} ${c.symbol}` : "--"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
