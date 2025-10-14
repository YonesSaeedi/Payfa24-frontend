import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import Pagination from "../History/Pagination";
import { NewCryptoItem } from "./types";
import IconStarGold from "../../assets/icons/market/CryptoMarketTable.tsx/IconStarGold";
import { ROUTES } from "../../routes/routes";

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
          <div className="flex flex-row-reverse items-center w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 dark:bg-gray-800 px-3 group focus-within:border-blue-500 transition-colors duration-200">
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
        <div className="flex flex-row-reverse gap-4 text-sm text-gray24 px-4 pt-8">
          {tabs.map((tab, index) => (
            <span
              key={index}
              onClick={() => {
                setActive(index);
                setCurrentPage(1);
              }}
              className={`cursor-pointer pb-2 mr-4 ${
                active === index
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-black1"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Table */}
        <div className="px-6 mt-6">
          <table
            dir="rtl"
            className="w-full text-right border-collapse table-fixed"
          >
            <thead>
              <tr className="bg-gray0 text-black1 text-sm rounded-md">
                <th className="py-3 text-center w-48">نام و نماد ارز</th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
                <th className="py-3 px-4 text-center lg:text-right">
                  قیمت خرید
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
                <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
                <th className="py-3 px-4 hidden lg:table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? skeletonArray.map((_, idx) => (
                    <tr
                      key={idx}
                      className="animate-pulse border-b border-gray21 last:border-b-0"
                    >
                      <td className="py-3 px-4 flex items-center gap-4">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-200"></div>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="flex flex-col  gap-1">
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="h-3 w-20 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="py-3 px-4 text-center lg:text-right">
                        <div className="h-3 w-20 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="h-3 w-20 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="h-3 w-14 bg-gray-200 rounded mx-auto"></div>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="h-6 w-24 bg-gray-200 rounded mx-auto"></div>
                      </td>
                    </tr>
                  ))
                : paginatedData.map((item) => {
                    const buyPrice = Number(item.priceBuy);
                    const sellPrice = Number(item.priceSell);
                    const priceChange = Number(item.priceChangePercent);

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0"
                      >
                        {/* Name and symbol */}
                        <td className="py-3 px-4 flex items-center gap-3 pr-8">
                          {/* ستاره */}
                          <button
                            onClick={() => {
                              if (favorites.includes(item.symbol)) {
                                setFavorites(
                                  favorites.filter((s) => s !== item.symbol)
                                );
                              } else {
                                setFavorites([...favorites, item.symbol]);
                              }
                            }}
                            className=" flex-shrink-0 flex items-center justify-center transition-colors duration-200 overflow-hidden"
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
                          <div className="flex flex-col min-w-0">
                            <div className="font-medium text-black1 truncate max-w-[150px]">
                              {(item.locale?.fa?.name ?? item.name) ||
                                "0 تومان"}
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.symbol}
                            </span>
                          </div>
                        </td>

                        {/* USDT Price */}
                        <td className="py-3 px-4 text-black1 hidden lg:table-cell items-center">
                          {item.fee != null && item.fee !== ""
                            ? `${item.fee} USDT`
                            : "0 تومان"}
                        </td>

                        {/* Buy Price */}
                        <td className="py-3 px-4 text-center lg:text-right text-black1 items-center">
                          {buyPrice
                            ? `${buyPrice.toLocaleString()} تومان `
                            : "0 تومان"}
                        </td>

                        <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                          {sellPrice
                            ? `${sellPrice.toLocaleString()} تومان `
                            : "0 تومان"}
                        </td>

                        {/* Change Percent */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`${
                              priceChange >= 0 ? "text-green4" : "text-red1"
                            }`}
                          >
                            {priceChange >= 0 ? "+" : ""}
                            {priceChange}%
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-end hidden lg:table-cell">
                          <Link
                            to={ROUTES.TRADE.BUY}
                            className="inline-block bg-blue-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-blue-700 transition"
                          >
                            خرید/فروش
                          </Link>
                        </td>
                      </tr>
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
