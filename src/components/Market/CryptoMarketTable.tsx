import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import IconStarGold from "../../assets/icons/market/CryptoMarketTable.tsx/IconStarGold";
import { ROUTES } from "../../routes/routes";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import Pagination from "../History/Pagination";
import { NewCryptoItem } from "./types";
import IconArrowDetails from "../../assets/icons/market/CryptoMarketTable.tsx/IconArrowDetails";




interface Props {
  data: NewCryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
}

const CryptoMarketTable: React.FC<Props> = ({ data, active, setActive, isLoading = false }) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(() => {
  const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });
const inputRefMobile = useRef<HTMLInputElement | null>(null);
const inputRefDesktop = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const itemsPerPage = 12;
  

  const tabs: string[] = ["همه", "مورد علاقه ها", "پرضررترین", "پرسودترین", "بیشترین معامله", "تازه‌های بازار"];

  const filteredByTab = useMemo(() => {
    switch (active) {
      case 1:
        return data.filter((item) => favorites.includes(item.symbol ?? ""));
      case 2:
        return [...data].sort((a, b) => parseFloat(a.priceChangePercent ?? "0") - parseFloat(b.priceChangePercent ?? "0"));
      case 3:
        return [...data].sort((a, b) => parseFloat(b.priceChangePercent ?? "0") - parseFloat(a.priceChangePercent ?? "0"));
      case 4:
        return [...data].sort((a, b) => parseFloat(b.quoteVolume ?? "0") - parseFloat(a.quoteVolume ?? "0"));
      case 5:
        return [...data].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
      default:
        return data;
    }
  }, [active, data, favorites]);

  const filteredBySearch = useMemo(() => {
    return filteredByTab.filter((item) => {
      const query = search.toLowerCase();
      return (
        (item.name?.toLowerCase().includes(query) ?? false) ||
        (item.symbol?.toLowerCase().includes(query) ?? false) ||
        (item.locale?.fa?.name?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [search, filteredByTab]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBySearch.slice(start, start + itemsPerPage);
  }, [filteredBySearch, currentPage]);

  const totalPages = Math.ceil(filteredBySearch.length / itemsPerPage);
  const skeletonArray = Array.from({ length: itemsPerPage });
  const [allExpanded, setAllExpanded] = useState(false);

const toggleAllRows = () => {
  setAllExpanded((prev) => !prev);
};


  return (
    <div className="w-full flex flex-col gap-6 lg:mt-16">
      <div className="items-center gap-4">
        <div className="w-full flex justify-between">
          <div
  onClick={() => inputRefMobile.current?.focus()}
  className="lg:hidden flex flex-row-reverse items-center w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200 cursor-text"
>
  <span className="w-5 h-5 ml-2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
    <IconSearch />
  </span>
  <input
    ref={inputRefMobile}
    type="text"
    placeholder="...جستجو"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="flex-1 text-sm outline-none text-right bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
  />
</div>

        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white1 rounded-2xl shadow border border-gray21 overflow-hidden">
        <div className="flex flex-row-reverse justify-between items-center px-4 pt-8">
          <div className="flex flex-row-reverse gap-4 text-sm text-gray24 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
            {tabs.map((tab, index) => (
              <span
                key={index}
                onClick={() => {
                  setActive(index);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer pb-2 pr-2 text-base font-normal flex-shrink-0 ${active === index ? "text-blue-600 border-b-2 border-blue-600" : "text-gray5"}`}
              >
                {tab}
              </span>
            ))}
          </div>

         <div
  onClick={() => inputRefDesktop.current?.focus()}
  className="hidden lg:flex flex-row-reverse items-center lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200 cursor-text"
>
  <span className="w-5 h-5 ml-2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
    <IconSearch />
  </span>
  <input
    ref={inputRefDesktop}
    type="text"
    placeholder="...جستجو"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    }}
    className="flex-1 text-sm outline-none text-right bg-transparent text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
  />
</div>

        </div>

        {/* Table */}
        <div className="px-6 mt-6 overflow-x-auto">
          <table dir="rtl" className="w-full text-right border-collapse  table-fixed">
         <thead>
  <tr className="bg-gray41 text-black1 rounded-lg">
    {/* نام و نماد ارز */}
    <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base rounded-r-lg mr-11">
      نام و نماد ارز
    </th>

  
    <th className={`py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base`}>
      قیمت به USDT
    </th>

    <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base text-center lg:text-right align-middle">
      {allExpanded ? "قیمت فروش" : "قیمت خرید"}
    </th>

    {/* ستون فروش / hidden در موبایل */}
    <th className={`py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base`}>
      قیمت فروش
    </th>

    {/* ستون تغییرات 24h / یا USDT در موبایل */}
    <th className="py-2.5 lg:py-4 px-4 text-center lg:w-[32px] lg:text-nowrap font-medium text-xs lg:text-base lg:rounded-none rounded-bl-lg">
      {allExpanded ? "قیمت به USDT" : "تغییرات ۲۴h"}
    </th>

    {/* ستون خرید/فروش دسکتاپ */}
    <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell rounded-l-lg"></th>

    {/* ستون toggle موبایل */}
    <th className="py-2.5 px-4 lg:hidden text-center font-medium text-xs lg:text-base">
      جزئیات
    </th>
  </tr>
</thead>

            <tbody>
              {isLoading
                ? skeletonArray.map((_, idx) => (
                    <tr key={idx} className="border-b border-gray21 last:border-b-0 hover:bg-background text-right">
                      <td className="py-3 px-4 flex items-start lg:gap-2 gap-1 justify-start">
                        <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full skeleton-bg"></div>
                        <div className="flex flex-col gap-0.5 lg:gap-2">
                          <div className="skeleton-bg h-3 lg:h-4 w-8 lg:w-16 rounded"></div>
                          <span className="skeleton-bg h-2 lg:h-3 w-6 lg:w-8 rounded"></span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="skeleton-bg h-3 lg:h-4 w-10 lg:w-20 rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="skeleton-bg h-3 lg:h-4 lg:w-20 w-16 rounded"></div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="skeleton-bg h-3 w-10 lg:h-4 lg:w-20 rounded"></div>
                      </td>
                      <td className="py-3 px-4 flex justify-center">
                        <div className="self-center skeleton-bg w-7 h-3 rounded"></div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="skeleton-bg h-3 lg:h-4 w-8 lg:w-10 rounded"></div>
                      </td>
                    </tr>
                  ))
                : paginatedData.map((item, index) => {
                    const id = item.id ?? index;
                    const symbol = item.symbol ?? "";
                    const name = item.locale?.fa?.name ?? item.name ?? "نام نامشخص";
                    const priceBuy = parseFloat(item.priceBuy ?? "0");
                    const priceSell = parseFloat(item.priceSell ?? "0");
                    const change24h = parseFloat(item.priceChangePercent ?? "0");

                    return (
                     <React.Fragment key={id}>
 <tr className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0 items-start justify-start lg:cursor-default">
  {/* Name and symbol */}
  <td className="py-3 px-4 flex gap-3 items-start justify-start min-w-0 max-w-[900px]">
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (favorites.includes(symbol)) {
          setFavorites(favorites.filter((s) => s !== symbol));
        } else {
          setFavorites([...favorites, symbol]);
        }
      }}
      className="flex-shrink-0 flex items-center justify-center transition-colors duration-200 overflow-hidden"
    >
      <div className="w-[22px] h-[22px]  text-gray12 mt-1">
        {favorites.includes(symbol) ? <IconStarGold /> : <IconStar />}
      </div>
    </button>

    <div className="w-8 h-8 flex-shrink-0 rounded-full">
      {item.isFont ? (
        <i className={`cf cf-${symbol.toLowerCase()}`} style={{ color: item.color, fontSize: "32px" }}></i>
      ) : (
        <img src={`https://api.payfa24.org/images/currency/${item.icon}`} alt={symbol} className="object-contain w-full h-full" />
      )}
    </div>

    <div className="flex flex-col min-w-0 items-start justify-start">
      <div className="font-medium text-black1 text-xs lg:text-base overflow-hidden text-ellipsis whitespace-nowrap w-full" title={name}>
        {name}
      </div>
      <span className="text-[11px] lg:text-xs text-gray-500">{symbol}</span>
    </div>
  </td>

{/* ستون موبایل اول (Price Buy / Price Sell) */}
<td className="py-3 px-4 text-black1 text-xs text-center lg:hidden">
  {allExpanded ? formatPersianDigits(priceSell) : formatPersianDigits(priceBuy)}
</td>

{/* ستون موبایل دوم (Change 24h / Price USDT) */}
<td className="py-3 px-4 text-black1 text-center lg:hidden">
  {allExpanded ? (item.fee ? `${item.fee} USDT` : "0 تومان") : (
    <span className={`${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
      {formatPersianDigits(change24h)}%
    </span>
  )}
</td>

{/* Toggle Column */}
<td
  className="py-3 px-4 text-center lg:hidden cursor-pointer"
  onClick={toggleAllRows} // تغییر همه ردیف‌ها
>
  <span className="text-gray-400 text-lg flex items-center justify-center">{allExpanded ? <span className="w-2 h-2 icon-wrraper"><IconArrowDetails/></span> :<span className="w-4 h-4"><IconArrowDetails/></span> }</span>
</td>


  {/* نسخه دسکتاپ بدون تغییر */}
 <td className="py-3 px-4 hidden lg:table-cell text-black1">{item.fee ? `${formatPersianDigits(item.fee)} USDT` : "۰ تومان"}</td>
  <td className="py-3 px-4 hidden lg:table-cell text-black1">{formatPersianDigits(priceBuy)} تومان</td>
  <td className="py-3 px-4 hidden lg:table-cell text-black1">{formatPersianDigits(priceSell)} تومان</td>
  <td className="py-3 px-4 hidden lg:table-cell text-center">
    <span className={`${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
      {formatPersianDigits(change24h)}%
    </span>
  </td>
  <td className="py-3 px-4 hidden lg:table-cell text-end">
    <Link
      to={`${ROUTES.TRADE.BUY}?coin=${symbol}`}
      className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in"
    >
      خرید/فروش
    </Link>
  </td>
</tr>

</React.Fragment>

                    );
                  })}

              {!isLoading && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    هیچ داده‌ای موجود نیست
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination current={currentPage} total={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default CryptoMarketTable;
