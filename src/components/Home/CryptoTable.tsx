import { useMemo, useState } from "react";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { CryptoItem } from "../../types/crypto";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";
import { formatEnglishNumber, formatPersianNumber } from "../../utils/formatPersianNumber";

type Category = {
  name: 'all' | 'mostTraded' | 'gainers' | 'losers' | 'newest';
  label: "همه" | "بیشترین معامله" | "پر ضررترین" | "پر سودترین" | "تازه‌های بازار";
  isActive: boolean;
}

interface CryptoTableProps {
  data: CryptoItem[];
  isLoading: boolean
}

const CryptoTable = ({ data, isLoading }: CryptoTableProps) => {
  const [categories, setCategories] = useState<Category[]>([
    { name: 'all', label: 'همه', isActive: true },
    { name: 'mostTraded', label: 'بیشترین معامله', isActive: false },
    { name: 'losers', label: 'پر ضررترین', isActive: false },
    { name: 'gainers', label: 'پر سودترین', isActive: false },
    { name: 'newest', label: 'تازه‌های بازار', isActive: false },
  ])
  // crypto sorters =====================================================================================================================================================
  // this is brilliant; we have used [...list].sort() instead of simple list.sort() cause we dont want to mutate the original list. [...list].sort() will create a copy of the list actually
  const sorters = {
    all: (list: CryptoItem[]) => list,
    mostTraded: (list: CryptoItem[]) => [...list].sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume)),
    losers: (list: CryptoItem[]) => [...list].sort((a, b) => Number(a.priceChangePercent) - Number(b.priceChangePercent)),
    gainers: (list: CryptoItem[]) => [...list].sort((a, b) => Number(b.priceChangePercent) - Number(a.priceChangePercent)),
    newest: (list: CryptoItem[]) => [...list].sort((a, b) => Number(b.id) - Number(a.id)),
  }
  // compute sorted list =================================================================================================================================================
  const activeCategory = categories.find(c => c.isActive)?.name || 'all'
  const sortedList = useMemo(() => sorters[activeCategory](data), [data, activeCategory])

  return (
    <div className="w-full rounded-2xl shadow border border-gray21 overflow-hidden lg:p-[30px] pt-5 px-[15px]">
      <div className="flex justify-between items-center border-gray21 lg:mb-6 mb-4">
        <Link to={ROUTES.MARKET} className="flex items-center gap-2  py-1 rounded-xl text-sm lg:text-xl text-blue2 ml-2 text-center hover:underline">
          <span className="w-5 h-5 lg:w-6 lg:h-6 text-blue2"><ArrowLeftIcon /></span>همه ارزها
        </Link>
        <h2 className="text-base lg:text-xl font-bold flex items-center gap-2 text-black1">بازار پی‌فا ۲۴</h2>
      </div>
      <div dir="rtl" className="flex text-xs lg:text-base mb-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) =>
          <button
            key={category.name}
            onClick={() => setCategories(prev => prev.map(item => item.name === category.name ? { ...item, isActive: true } : { ...item, isActive: false }))}
            className={`py-1.5 lg:py-2 px-3 lg:px-4 text-nowrap hover:text-blue2 ${category.isActive ? "text-blue2 border-b-2 border-blue2 font-medium" : "text-gray3 font-normal"}`}
          >
            {category.label}
          </button>
        )}
      </div>
      <table dir="rtl" className="w-full text-right border border-gray21 border-collapse rounded-lg overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray41 text-black1 rounded-lg">
            <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base rounded-r-lg">نام و نماد ارز</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت به USDT</th>
            <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base">قیمت خرید</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت فروش</th>
            <th className="py-2.5 lg:py-4 px-4 text-center lg:w-[32px] lg:text-nowrap font-medium text-xs lg:text-base lg:rounded-none rounded-bl-lg">تغییرات ۲۴h</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell rounded-l-lg"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ?
            // loadings =============================================================================================================================
            [...Array(10)].map((_, i) =>
              <tr key={i} className="border-b border-gray21 last:border-b-0 hover:bg-background text-right">
                <td className="py-3 px-4 flex items-start lg:gap-2 gap-1 justify-start">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full skeleton-bg"></div>
                  <div className="flex flex-col gap-0.5 lg:gap-2">
                    <div className="skeleton-bg h-3 lg:h-4 w-8 lg:w-16 rounded"></div>
                    <span className="skeleton-bg h-2 lg:h-3 w-6 lg:w-8 rounded"></span>
                  </div>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell"><div className="skeleton-bg h-3 lg:h-4 w-10 lg:w-20 rounded"></div></td>
                <td className="py-3 px-4"><div className="skeleton-bg h-3 lg:h-4 lg:w-20 w-16 rounded"></div></td>
                <td className="py-3 px-4 hidden lg:table-cell"><div className="skeleton-bg h-3 w-10 lg:h-4 lg:w-20 rounded"></div></td>
                <td className="py-3 px-4 flex justify-center"><div className='self-center skeleton-bg w-7 h-3 rounded'></div></td>
                <td className="py-3 px-4 hidden lg:table-cell"><div className="skeleton-bg h-3 lg:h-4 w-8 lg:w-10 rounded"></div></td>
              </tr>
            )
            :
            // real data mapping =========================================================================================================================
            sortedList.slice(0, 10).map(item => (
              <tr key={item?.id} className="border-b border-gray21 last:border-b-0 hover:bg-background text-right">
                <td className="py-3 px-4 flex items-center lg:gap-2 gap-1 justify-start ">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full">
                    {item?.isFont ?
                      <i className={`cf cf-${item?.symbol.toLowerCase()} text-[28px] lg:text-[40px]`} style={{ color: item.color }}></i>
                      :
                      <img src={`https://api.payfa24.org/images/currency/${item?.icon}`} alt={item?.symbol} className="object-contain w-full h-full" />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="font-normal text-black1 truncate max-w-[120px] text-xs lg:text-lg" title={item?.locale?.fa?.name}>{item?.locale?.fa?.name}</div>
                    <span className="text-[10px] lg:text-sm font-normal text-gray12">{item?.symbol}</span>
                  </div>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-black1">USDT {formatEnglishNumber(item?.fee?? "0")}</td>
                <td className="py-3 px-4 text-black1 text-xs lg:text-base font-normal">
                  {formatPersianNumber(parseFloat(item?.priceBuy ?? '0'))}
                  <span className="hidden lg:inline"> تومان </span>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-black1">{formatPersianNumber(parseFloat(item?.priceSell ?? '0'))} تومان</td>
                <td className="py-3 px-4 text-center text-black1">
                  <span
                    className={`font-normal text-xs lg:text-base ${Number(item?.priceChangePercent) >= 0 ? "text-green-500" : "text-red-500"}`}
                    dir="ltr"
                  >
                    {formatPersianNumber(item?.priceChangePercent ?? '0')}%
                  </span>
                </td>
                <td className="py-3 px-4 hidden lg:table-cell text-end text-black1">
                  <Link
                    to={`${ROUTES.TRADE.BUY}?coin=${item?.symbol}`}
                    className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in text-sm font-bold"
                  >
                    خرید/فروش
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;