import { useMemo, useState } from "react";
import ArrowLeftIcon from "../../assets/icons/Home/CryptoTableIcon/ArrowLeftIcon";
import { CryptoItem } from "../../types/crypto";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { Link } from "react-router";
import { ROUTES } from "../../routes/routes";

type Category = {
  name: 'all' | 'mostTraded' | 'gainers' | 'losers' | 'newest';
  label: "همه" | "بیشترین معامله" | "پر ضررترین" | "پر سودترین" | "تازه های بازار";
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
    { name: 'newest', label: 'تازه های بازار', isActive: false },
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
    <div className="w-full rounded-2xl p-4 shadow border border-gray21 overflow-hidden">
      <div className="flex justify-between items-center border-gray21 mb-6">
        <Link to={ROUTES.MARKET} className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm lg:text-xl text-blue2 ml-2 text-center hover:underline">
          <span className="w-5 h-5 lg:w-6 lg:h-6 text-blue2"><ArrowLeftIcon /></span>همه ارزها
        </Link>
        <h2 className="text-base lg:text-xl font-bold flex items-center gap-2 text-black1">بازار پی‌فا ۲۴</h2>
      </div>
      <div className="flex flex-row-reverse text-sm mb-4">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setCategories(prev => prev.map(item => item.name === category.name ? { ...item, isActive: true } : { ...item, isActive: false }))}
            className={`pb-1 mr-7 ${category.isActive ? "text-blue2 border-b-2 border-blue2" : "text-grey1"}`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <table dir="rtl" className="w-full text-right border border-gray21 border-collapse rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray32 text-black1 text-text">
            <th className="py-3 px-4">نام و نماد ارز</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
            <th className="py-3 px-4">قیمت فروش</th>
            <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
            <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
            <th className="py-3 px-4 hidden lg:table-cell"></th>
          </tr>
        </thead>
        <tbody>
          {sortedList.slice(0, 10).map(item => (
            <tr key={item?.id} className="border-b border-gray21 last:border-b-0 hover:bg-background text-right">
              <td className="py-3 px-4 flex items-start gap-2 justify-start">
                <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full">
                  {item?.isFont ?
                    <i className={`cf cf-${item?.symbol.toLowerCase()} text-[28px] lg:text-[40px]`} style={{ color: item.color }}></i>
                    :
                    <img src={`https://api.payfa24.org/images/currency/${item?.icon}`} alt={item?.symbol} className="object-contain w-full h-full" />
                  }
                </div>
                <div>
                  <div className="font-medium text-center text-black1 truncate max-w-[120px]" title={item?.locale?.fa?.name}>{item?.locale?.fa?.name}</div>
                  <span className="text-xs text-gray12 text-center p-2">{item?.symbol}</span>
                </div>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell text-black1">USDT {item?.fee}</td>
              <td className="py-3 px-4 text-black1">تومان {formatPersianDigits(parseFloat(item?.priceBuy ?? '0'))}</td>
              <td className="py-3 px-4 hidden lg:table-cell text-black1">تومان {formatPersianDigits(parseFloat(item?.priceSell ?? '0'))}</td>
              <td className="py-3 px-4 text-center text-black1">
                <span className={Number(item?.priceChangePercent) >= 0 ? "text-green-500" : "text-red-500"} dir="ltr">{formatPersianDigits(item?.priceChangePercent)}%</span>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell text-end text-black1">
                <button className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm">خرید/فروش</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;