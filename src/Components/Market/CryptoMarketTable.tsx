import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import Pagination from "../History/Pagination";
import { NewCryptoItem } from "./types";
import IconStarGold from "../../assets/icons/market/CryptoMarketTable.tsx/IconStarGold";
import { ROUTES } from "../../routes/routes";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

interface Props {
  data: NewCryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean; // اضافه شد
}

const CryptoMarketTable: React.FC<Props> = ({
  data,
  active,
  setActive,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const itemsPerPage = 12;
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const tabs: string[] = [
    "همه",
    "مورد علاقه ها",
    "پرضررترین",
    "پرسودترین",
    "بیشترین معامله",
    "تازه‌های بازار",
  ];

  const filteredByTab = useMemo(() => {
    switch (active) {
      case 1:
        return data.filter((item) => favorites.includes(item.symbol));
      case 2:
        return [...data].sort(
          (a, b) =>
            parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
        );
      case 3:
        return [...data].sort(
          (a, b) =>
            parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        );
      case 4:
        return [...data].sort(
          (a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
        );
      case 5:
        return [...data].sort((a, b) => b.id - a.id);
      default:
        return data;
    }
  }, [active, data, favorites]);

  const filteredBySearch = useMemo(() => {
    return filteredByTab.filter((item) => {
      const query = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(query) ||
        item.symbol?.toLowerCase().includes(query) ||
        item.locale?.fa?.name?.includes(query)
      );
    });
  }, [search, filteredByTab]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBySearch.slice(start, start + itemsPerPage);
  }, [filteredBySearch, currentPage]);

  const totalPages = Math.ceil(filteredBySearch.length / itemsPerPage);

  // اسکلتون
  const skeletonArray = Array.from({ length: itemsPerPage });

  return (
    <div className="w-full flex flex-col gap-6 lg:mt-16">
      {/* Search input */}
      <div className="items-center gap-4">
        <div className="w-full flex justify-between">
          <div className="lg:hidden flex flex-row-reverse items-center w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200">
            <span className="w-5 h-5 ml-2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
              <IconSearch />
            </span>
            <input
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
        {/* Tabs + Search */}
        <div className="flex flex-row-reverse justify-between items-center px-4 pt-8">
          {/* Tabs */}
          <div className="flex flex-row-reverse gap-4 text-sm text-gray24">
            {tabs.map((tab, index) => (
              <span
                key={index}
                onClick={() => {
                  setActive(index);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer pb-2 pr-2 text-base font-normal ${
    active === index
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-gray5"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Search input */}
          <div className="hidden lg:flex flex-row-reverse items-center  lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200">
            <span className="w-5 h-5 ml-2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
              <IconSearch />
            </span>
            <input
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
          <table dir="rtl" className="w-full text-right border-collapse min-w-[500px] table-fixed">

            <thead>
              <tr className="bg-gray41 text-black1 rounded-lg">
            <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base rounded-r-lg mr-11">نام و نماد ارز</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت به USDT</th>
            <th className="py-2.5 lg:py-4 px-4 font-medium text-xs lg:text-base">قیمت خرید</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell font-medium text-xs lg:text-base">قیمت فروش</th>
            <th className="py-2.5 lg:py-4 px-4 text-center lg:w-[32px] lg:text-nowrap font-medium text-xs lg:text-base lg:rounded-none rounded-bl-lg">تغییرات ۲۴h</th>
            <th className="py-2.5 lg:py-4 px-4 hidden lg:table-cell rounded-l-lg"></th>
          </tr>
            </thead>
            <tbody>
              {isLoading
                ? skeletonArray.map((_, idx) => (
                     <tr key={idx} className="border-b border-gray21 last:border-b-0 hover:bg-background text-right">
                <td className="py-3 px-4 flex items-start lg:gap-2 gap-1 justify-start">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full skeleton-bg">
                  </div>
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
                  ))
                : paginatedData.map((item) => {
  const buyPrice = Number(item.priceBuy);
  const sellPrice = Number(item.priceSell);
  const priceChange = Number(item.priceChangePercent);

  return (
    <React.Fragment key={item.id}>
      {/* ردیف اصلی */}
      <tr
        className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0 items-start justify-start lg:cursor-default cursor-pointer"
        onClick={() => toggleRow(item.id)}
      >
        {/* Name and symbol */}
        <td className="py-3 px-4 flex gap-3 items-start justify-start">
          {/* ستاره */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ جلوگیری از باز شدن ردیف هنگام کلیک روی ستاره
              if (favorites.includes(item.symbol)) {
                setFavorites(favorites.filter((s) => s !== item.symbol));
              } else {
                setFavorites([...favorites, item.symbol]);
              }
            }}
            className="flex-shrink-0 flex items-center justify-center transition-colors duration-200 overflow-hidden"
          >
            <div className="w-[22px] h-[22px]">
              {favorites.includes(item.symbol) ? (
                <span className="border-gray-400 text-gray-400 w-[22px] h-[22px]">
                  <IconStarGold />
                </span>
              ) : (
                <span className="border-gray-400 text-gray-400 w-[22px] h-[22px]">
                  <IconStar />
                </span>
              )}
            </div>
          </button>

          {/* آیکون */}
          <div className="w-8 h-8 flex-shrink-0 rounded-full">
            {item.isFont ? (
              <i
                className={`cf cf-${item.symbol.toLowerCase()}`}
                style={{ color: item.color, fontSize: "32px" }}
              ></i>
            ) : (
              <img
                src={`https://api.payfa24.org/images/currency/${item.icon}`}
                alt={item.symbol}
                className="object-contain w-full h-full"
              />
            )}
          </div>

          {/* نام و نماد */}
          <div className="flex flex-col min-w-0 items-start justify-start">
            <div className="font-medium text-black1 truncate max-w-[150px]">
              {(item.locale?.fa?.name ?? item.name) || "0 تومان"}
            </div>
            <span className="text-xs text-gray-500">{item.symbol}</span>
          </div>
        </td>

        {/* USDT Price */}
        <td className="py-3 px-4 text-black1 hidden lg:table-cell items-center text-xs lg:text-base font-normal">
          {item.fee != null && item.fee !== ""
            ? `${item.fee} USDT`
            : "0 تومان"}
        </td>

        {/* Buy Price */}
        <td className="py-3 px-4 text-black1 text-xs lg:text-base font-normal lg:table-cell">
          {formatPersianDigits(parseFloat(item?.priceBuy ?? "0"))}
          <span className="hidden lg:inline"> تومان </span>
        </td>

        {/* Sell Price */}
        <td className="py-3 px-4 hidden lg:table-cell text-black1">
          {formatPersianDigits(parseFloat(item?.priceSell ?? "0"))} تومان
        </td>

        {/* 24h Change */}
        <td className="py-3 px-4 text-center text-black1">
          <span
            className={`font-normal text-xs lg:text-base ${
              Number(item?.priceChangePercent) >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
            dir="ltr"
          >
            {formatPersianDigits(item?.priceChangePercent ?? "0")}%
          </span>
        </td>

        {/* Action */}
        <td className="py-3 px-4 hidden lg:table-cell text-end text-black1">
          <Link
            to={`${ROUTES.TRADE.BUY}?coin=${item?.symbol}`}
            className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in"
          >
            خرید/فروش
          </Link>
        </td>
      </tr>

      {/* جزئیات موبایل (بازشونده) */}
      {expandedRows.includes(item.id) && (
        <tr className="lg:hidden bg-gray0 border-b border-gray21">
          <td colSpan={6} className="px-4 py-3 text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>قیمت خرید:</span>
              <span>
                {formatPersianDigits(parseFloat(item?.priceBuy ?? "0"))} تومان
              </span>
            </div>
            <div className="flex justify-between">
              <span>قیمت فروش:</span>
              <span>
                {formatPersianDigits(parseFloat(item?.priceSell ?? "0"))} تومان
              </span>
            </div>
            <div className="flex justify-between">
              <span>قیمت USDT:</span>
              <span>{item.fee ?? "0"} USDT</span>
            </div>
            <div className="text-center pt-2">
              <Link
                to={`${ROUTES.TRADE.BUY}?coin=${item?.symbol}`}
                className="bg-blue2 text-white rounded-lg px-4 py-1.5 text-sm border border-transparent hover:bg-transparent hover:border-blue2 hover:text-blue2 transition duration-200 ease-in"
              >
                خرید/فروش
              </Link>
            </div>
          </td>
        </tr>
      )}
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

      {/* Pagination */}
      <Pagination
        current={currentPage}
        total={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default CryptoMarketTable;
