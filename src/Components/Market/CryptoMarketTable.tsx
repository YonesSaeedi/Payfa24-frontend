import React, { useState, useMemo } from "react";
import IconSearch from "../../assets/icons/market/IconSearch";
import IconStar from "../../assets/icons/market/IconStar";
import { ICryptoItem } from "../Market/types";

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
}

const CryptoMarketTable: React.FC<Props> = ({ data, active, setActive }) => {
  console.log("cryptodaata", data);
  const [search, setSearch] = useState("");
  const [cryptoList, setCryptoList] = useState<ICryptoItem[]>(data); // ✅ state برای مدیریت علاقه‌مندی

  const tabs: TabType[] = [
    "همه",
    "مورد علاقه ها",
    "پرضررترین",
    "پرسودترین",
    "بیشترین معامله",
    "تازه‌های بازار",
  ];

  // تغییر وضعیت علاقه‌مندی
  const toggleFavorite = (symbol: string) => {
    setCryptoList((prev) =>
      prev.map((item) =>
        item.symbol === symbol ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

   console.log("cryptoList",cryptoList);

  // داده‌های فیلتر شده
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

  console.log("filteredData",filteredData);
  

  return (
    <div className="w-full flex flex-col gap-6 lg:mt-16">
      {/* سرچ */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full lg:w-1/3 relative">
          <input
            type="text"
            placeholder="...جستجو"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-[319px] h-[40px] border border-gray19 rounded-lg px-4 lg:py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-blue-400 text-right bg-white1"
          />
          <span className="absolute inset-y-0 lg:right-[125px] flex items-center pointer-events-none w-5 h-5 text-gray-400 top-[8px] right-[20px]">
            <IconSearch />
          </span>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="bg-white1 rounded-2xl shadow border border-gray21 overflow-hidden">
        <div className="flex flex-row-reverse gap-4 text-sm text-gray24 px-4 pt-8">
          {tabs.map((tab, index) => (
            <span
              key={index}
              onClick={() => setActive(index)}
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

        {/* جدول */}
        <div className="px-6 mt-6">
          <table
            dir="rtl"
            className="w-full text-right border-collapse table-fixed"
          >
            <thead>
              <tr className="bg-gray0 text-black1 text-sm rounded-md">
                <th className="py-3 text-center rounded-tr-lg rounded-br-lg">
                  نام و نماد ارز
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت به USDT</th>
                <th className="py-3 px-4">قیمت خرید</th>
                <th className="py-3 px-4 hidden lg:table-cell">قیمت فروش</th>
                <th className="py-3 px-4 text-center">تغییرات ۲۴h</th>
                <th className="py-3 px-4 rounded-tl-lg rounded-bl-lg hidden lg:table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
          
                
                <tr
                  key={index}
                  className="border-b border-gray21 hover:bg-gray0 text-sm last:border-b-0"
                >
                  <td className="py-3 px-4 flex items-center gap-3 pr-8">
                    {/* ⭐ ستاره علاقه‌مندی */}
                    <button
                      onClick={() => toggleFavorite(item.symbol)}
                      className={`w-[22px] h-[22px] ${
                        item.favorite ? "text-yellow-400" : "text-gray-400"
                      }`}
                    >
                      <IconStar />
                    </button>

                   <span className="h-9 w-9 flex items-center justify-center ">
  {item.isFont ? (
    <i
      className={`cf cf-${item.symbol.toLowerCase()}`}
      style={{ color: item.color, fontSize: "36px" }}
    ></i>
  ) : (
    <>
      {console.log(
        "icon url:",
        item.symbol,
        item.icon,
        item.icon
          ? `https://app.arz3.com/api/images/currency/${item.icon}`
          : "/default-coin.png"
      )}
      <img
        src={
          item.icon
            ? `https://app.arz3.com/api/images/currency/${item.icon}`
            : "/default-coin.png"
        }
        alt={item.symbol}
        className="w-8 h-8 rounded-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/default-coin.png";
        }}
      />
    </>
  )}
</span>

                    <div>
                      <div className="font-medium text-black1">{item.name}</div>
                      <span className="text-xs text-gray-500">
                        {item.symbol}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-black1 hidden lg:table-cell">
                    USDT {item.priceUSDT.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-black1">
                    {item.buyPrice != null ? `تومان ${item.buyPrice.toLocaleString()}` : "-"}

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
                    <button className="bg-blue-600 text-white rounded-lg px-4 py-1.5 text-sm hover:bg-blue-700 transition">
                      خرید/فروش
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    هیچ نتیجه‌ای یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CryptoMarketTable;
