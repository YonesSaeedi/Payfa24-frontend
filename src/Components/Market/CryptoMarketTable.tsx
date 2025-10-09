import React, { useState, useMemo, useEffect } from "react";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import { ICryptoItem } from "../Market/types";
import Pagination from "../History/Pagination";
import { useNavigate } from "react-router-dom";

type TabType =
  | "همه"
  | "بیشترین معامله"
  | "تازه‌های بازار"
  | "مورد علاقه ها"
  | "پرضررترین"
  | "پرسودترین";

interface Props {
  data: ICryptoItem[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

const CryptoMarketTable: React.FC<Props> = ({
  data,
  active,
  setActive,
  isLoading,
}) => {
  const [search, setSearch] = useState("");
  const [cryptoList, setCryptoList] = useState<ICryptoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  // 🟡 بارگذاری داده‌ها + علاقه‌مندی‌ها از localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedData = data.map((item) => ({
      ...item,
      favorite: storedFavorites.includes(item.symbol),
    }));
    setCryptoList(updatedData);
  }, [data]);

  // 🟡 تابع تغییر علاقه‌مندی
  const toggleFavorite = (symbol: string) => {
    setCryptoList((prev) => {
      const updated = prev.map((item) =>
        item.symbol === symbol ? { ...item, favorite: !item.favorite } : item
      );

      const favorites = updated
        .filter((item) => item.favorite)
        .map((item) => item.symbol);

      localStorage.setItem("favorites", JSON.stringify(favorites));
      return updated;
    });
  };

  const tabs: TabType[] = [
    "همه",
    "مورد علاقه ها",
    "پرضررترین",
    "پرسودترین",
    "بیشترین معامله",
    "تازه‌های بازار",
  ];

  const filteredData = useMemo(() => {
    let filtered = [...cryptoList];

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (tabs[active]) {
      case "مورد علاقه ها":
        filtered = filtered.filter((item) => item.favorite);
        break;
      case "پرضررترین":
        filtered = filtered
          .sort((a, b) => a.change24h - b.change24h)
          .slice(0, 10);
        break;
      case "پرسودترین":
        filtered = filtered
          .sort((a, b) => b.change24h - a.change24h)
          .slice(0, 10);
        break;
      case "بیشترین معامله":
        filtered = filtered
          .sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
          .slice(0, 10);
        break;
      case "تازه‌های بازار":
        filtered = filtered.filter((item) => item.isNew);
        break;
      default:
        break;
    }

    return filtered;
  }, [cryptoList, active, search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // 🟢 Skeleton Loader
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-gray21">
          <td className="py-4 px-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </td>
          <td className="py-4 px-4 hidden lg:table-cell">
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4 hidden lg:table-cell">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </td>
          <td className="py-4 px-4">
            <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
          </td>
          <td className="py-4 px-4 hidden lg:table-cell">
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="w-full flex flex-col gap-6 lg:mt-16">
      <div className="items-center gap-4">
        <div className="w-full flex justify-between">
          <div className="flex flex-row-reverse items-center w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg bg-white1 px-3">
            <span className=" w-5 h-5 ml-2 text-gray-400">
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
              className="flex-1 text-sm outline-none text-right bg-transparent"
            />
          </div>
        </div>
      </div>
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
        <div className="px-6 mt-6">
          <table
            dir="rtl"
            className="w-full text-right border-collapse table-fixed"
          >
            <thead>
              <tr className="bg-gray0 text-black1 text-sm rounded-md">
                <th className="py-3 text-center rounded-tr-lg rounded-br-lg w-48">
                  نام و نماد ارز
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
                <th className="py-3 px-4">قیمت خرید</th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
                <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
                <th className="py-3 px-4 rounded-tl-lg rounded-bl-lg hidden lg:table-cell"></th>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0"
                  >
                    <td className="py-3 px-4 flex items-center gap-3 pr-8">
                      <button
                        onClick={() => toggleFavorite(item.symbol)}
                        className={`w-[22px] h-[22px] ${
                          item.favorite ? "text-yellow-400" : "text-gray-400"
                        }`}
                      >
                        <IconStar />
                      </button>
                      <span className="h-9 w-9 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <div>
                        <div className="font-medium text-black1">
                          {((item.locale?.fa ?? item.name) || "").length > 10
                            ? ((item.locale?.fa ?? item.name) || "").slice(
                                0,
                                10
                              ) + "..."
                            : (item.locale?.fa ?? item.name) || ""}
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                      USDT {item.priceUSDT.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-black1">
                      {item.buyPrice != null
                        ? `تومان ${item.buyPrice.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                      تومان {item.sellPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`${
                          item.change24h >= 0 ? "text-green4" : "text-red1"
                        }`}
                      >
                        {item.change24h >= 0 ? "+" : ""}
                        {item.change24h}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end hidden lg:table-cell">
                      <button
                        onClick={() => navigate("/trade/buy")}
                        className="bg-blue-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-blue-700 transition"
                      >
                        خرید/فروش
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      هیچ نتیجه‌ای یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <Pagination
        current={currentPage}
        total={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default CryptoMarketTable;
