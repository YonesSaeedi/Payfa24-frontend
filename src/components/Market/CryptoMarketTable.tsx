
import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import IconStarGold from "../../assets/icons/market/CryptoMarketTable.tsx/IconStarGold";
import Pagination from "../History/Pagination";
import { ROUTES } from "../../routes/routes";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { NewCryptoItem } from "./types";
import { formatEnglishNumber, formatPersianNumber } from "../../utils/formatPersianNumber";

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
 

  return (
    <div className="w-full flex flex-col gap-6 lg:mt-16">
      {/* Search */}
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
      <div className="bg-white1 rounded-2xl lg:shadow lg:border border-gray21 overflow-hidden">
       <div className="flex flex-row-reverse justify-between items-center px-6 pt-8">
  {/* تب‌ها */}
  <div className="flex flex-row-reverse gap-4 text-sm text-gray24 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth">
    {tabs.map((tab, index) => (
      <span
        key={index}
        onClick={() => {
          setActive(index);
          setCurrentPage(1);
        }}
        className={`cursor-pointer pb-2 pr-2 text-base font-normal flex-shrink-0 hover:text-blue2 ${
          active === index ? "text-blue2 border-b-2 border-blue2" : "text-gray5"
        }`}
      >
        {tab}
      </span>
    ))}
  </div>

  {/* کادر جستجو سمت چپ */}
  <div
    onClick={() => inputRefDesktop.current?.focus()}
    className="hidden lg:flex flex-row-reverse items-center w-[319px]  h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200 cursor-text"
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

        
        <div className="hidden lg:block px-6 mt-6 overflow-x-auto">
          <table dir="rtl" className="w-full text-right border-collapse table-fixed">
            <thead>
              <tr className="bg-gray41 text-black1 rounded-lg">
                <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base rounded-r-lg mr-11">نام و نماد ارز</th>
                <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت به USDT</th>
                <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base text-center lg:text-right align-middle">قیمت خرید</th>
                <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت فروش</th>
                <th className="py-2.5 lg:py-4 px-4 text-center lg:w-[32px] lg:text-nowrap font-medium text-xs lg:text-base lg:rounded-none rounded-bl-lg">تغییرات ۲۴h</th>
              
                <th className="py-3 px-4 hidden lg:table-cell text-end"></th>
                
              </tr>
            </thead>
          <tbody>
  {isLoading ? (
    [...Array(12)].map((_, index) => (
      <tr key={index} className="border-b border-gray21 last:border-b-0 hover:bg-gray41 animate-pulse">
        {/* ستون نام و نماد */}
        <td className="py-3 px-4 flex items-right gap-3">
          <div className="w-8 h-8 rounded-full skeleton-bg"></div>
          <div className="flex flex-col gap-1">
            <div className="w-20 h-4 rounded-md skeleton-bg"></div>
            <div className="w-12 h-3 rounded-md skeleton-bg"></div>
          </div>
        </td>
        {/* ستون قیمت USDT */}
        <td className="py-3 px-4 hidden lg:table-cell text-center">
          <div className="w-16 h-4 rounded-md skeleton-bg mx-auto"></div>
        </td>
        {/* ستون قیمت خرید */}
        <td className="py-3 px-4 text-center">
          <div className="w-16 h-4 rounded-md skeleton-bg mx-auto"></div>
        </td>
        {/* ستون قیمت فروش */}
        <td className="py-3 px-4 hidden lg:table-cell text-center">
          <div className="w-16 h-4 rounded-md skeleton-bg mx-auto"></div>
        </td>
        {/* ستون تغییرات ۲۴h */}
        <td className="py-3 px-4 text-center">
          <div className="w-12 h-3 rounded-md skeleton-bg mx-auto"></div>
        </td>
        {/* ستون دکمه خرید/فروش */}
        <td className="py-3 px-4 hidden lg:table-cell text-center">
          <div className="w-20 h-6 rounded-md skeleton-bg mx-auto"></div>
        </td>
      </tr>
    ))
  ) : paginatedData.length > 0 ? (
    paginatedData.map((item, index) => {
      const id = item.id ?? index;
      const symbol = item.symbol ?? "";
      const name = item.locale?.fa?.name ?? item.name ?? "نام نامشخص";
      const priceBuy = parseFloat(item.priceBuy ?? "0");
      const priceSell = parseFloat(item.priceSell ?? "0");
      const change24h = parseFloat(item.priceChangePercent ?? "0");

      return (
        <tr key={id} className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0 items-start justify-start lg:cursor-default">
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
              <div className="w-[22px] h-[22px] text-gray12 mt-1">
                {favorites.includes(symbol) ? <IconStarGold /> : <IconStar />}
              </div>
            </button>

            <div className="w-8 h-8 flex-shrink-0 rounded-full">
              {item.isFont ? (
                <i className={`cf cf-${symbol.toLowerCase()}`} style={{ color: item.color, fontSize: "32px" }}></i>
              ) : (
                <img src={`https://api.payfa24.com/images/currency/${item.icon}`} alt={symbol} className="object-contain w-full h-full" />
              )}
            </div>

            <div className="flex flex-col min-w-0 items-start justify-start">
              <div className="text-black1 text-xs lg:text-base overflow-hidden text-ellipsis whitespace-nowrap w-full text-[18px] font-normal" title={name}>
                {name}
              </div>
              <span className="text-[11px] lg:text-xs text-gray-500">{symbol}</span>
            </div>
          </td>

        <td className="py-3 px-4 hidden lg:table-cell text-black1 font-normal text-base">
  USDT {formatEnglishNumber(item?.fee ?? "0")}</td>

          <td className="py-3 px-4 hidden lg:table-cell text-black1 font-normal text-base">{formatPersianNumber(priceBuy)} تومان</td>
          <td className="py-3 px-4 hidden lg:table-cell text-black1 font-normal text-base">{formatPersianNumber(priceSell)} تومان</td>
          <td className="py-3 px-4 hidden lg:table-cell text-center font-normal text-base">
            <span className={`${change24h >= 0 ? "text-green9" : "text-red6"}`}>
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
      );
    })
  ) : (
    <tr>
      <td colSpan={6} className="text-center py-12 text-gray-500">
        موردی یافت نشد
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

       
        <div className="block lg:hidden space-y-4 mt-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => {
              const symbol = item.symbol ?? "";
              const name = item.locale?.fa?.name ?? item.name ?? "نام نامشخص";
              const priceBuy = parseFloat(item.priceBuy ?? "0");
              const priceSell = parseFloat(item.priceSell ?? "0");
              const change24h = parseFloat(item.priceChangePercent ?? "0");

              return (
                <div dir="rtl" key={item.id} className="border rounded-xl p-4 border-gray21 bg-white1 dark:bg-gray-800 shadow-sm flex flex-col text-right">
                  <div className="flex justify-between mb-3">
                    <div className="flex  items-center">
                      <span className="w-10 h-10 flex items-center justify-center object-cover">
                        {item.isFont ? (
                          <i className={`cf cf-${symbol.toLowerCase()} text-[28px]`} style={{ color: item.color ?? "" }} />
                        ) : (
                          <img
                            src={`https://api.payfa24.com/images/currency/${item.icon}`}
                            className="w-8 h-8 rounded-full"
                            alt={symbol}
                            
                          />
                        )}
                      </span>
                      <div className="flex flex-col min-w-0 text-right">
                        <p className="font-medium text-black1 truncate">{name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{symbol}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm space-y-1 mb-3 gap-3 flex flex-col">
                    <p className="flex justify-between text-black1">قیمت خرید: <span>{formatPersianDigits(priceBuy)}</span></p>
                    <p className="flex justify-between text-black1">قیمت فروش: <span>{formatPersianDigits(priceSell)}</span></p>
                    <p className="flex justify-between text-black1">تغییرات ۲۴h: <span className={`${change24h >= 0 ? "text-green-500" : "text-red-500"}`}>{formatPersianDigits(change24h)}%</span></p>
                  </div>

                  <Link
                    to={`${ROUTES.TRADE.BUY}?coin=${symbol}`}
                    className=" text-blue2 rounded-lg px-4 py-2 text-sm border border-blue2 hover:bg-blue2 hover:text-white1 transition duration-200 ease-in block text-center"
                  >
                    خرید/فروش
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
              <p className="text-gray-500 text-base">هیچ داده‌ای موجود نیست</p>
            </div>
          )}
        </div>
      </div>

      <Pagination current={currentPage} total={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default CryptoMarketTable;
