import React, { useState, useEffect, useRef } from "react";
import TravelaIcon from "../../assets/icons/Home/CryptoTableIcon/TravelaIcon";
import VeChainIcon from "../../assets/icons/Home/CryptoTableIcon/VeChainIcon";
import AltraPurple from "../../assets/icons/market/CryptoMarketTable.tsx/AltraPurple";
import { MoreVertical, MoreHorizontal, ChevronDown } from "lucide-react";
import {ActionModal} from "../../Components/Wallet/ActionModal";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";

type Crypto = {
  name: string;
  symbol: string;
  price: number;
  change: number;
  icon: React.ReactNode;
};

const initialData: Crypto[] = [
  { name: "تراوالا", symbol: "AVA", price: 48870.3, change: 1.1, icon: <span className="w-8 h-8"><VeChainIcon /></span> },
  { name: "الترا", symbol: "UOS", price: 48870.3, change: -1.3, icon: <span className="w-8 h-8"><AltraPurple /></span> },
  { name: "وی چین", symbol: "VET", price: 48870.3, change: -1.3, icon: <span className="w-8 h-8"><VeChainIcon /></span> },
  { name: "ویلی", symbol: "WLY", price: 48870.3, change: -1.3, icon: <span className="w-8 h-8"><TravelaIcon /></span> },
];

const CryptoTable: React.FC = () => {
  const [data, setData] = useState<Crypto[]>(initialData);
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Crypto | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedSort, setSelectedSort] = useState("گزینه‌ها (تعداد)");
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024); 
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSort = (field: keyof Crypto) => {
    let order: "asc" | "desc" = sortOrder;
    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
    } else {
      order = "asc";
    }
    setSortField(field);
    setSortOrder(order);

    const sorted = [...data].sort((a, b) => {
      if (field === "icon") return 0;
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setData(sorted);
  };

  const sortOptions = [
    "پیش فرض",
    "موجودی (تعداد)",
    "موجودی (ارزش تومانی)",
    "قیمت (زیاد به کم)",
    "قیمت (کم به زیاد)",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.name.includes(search) ||
      item.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      dir="rtl"
      className="p-4 bg-white1 rounded-xl border border-gray21 w-full max-w-2xl mx-auto"
    >
   
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-1/2 bg-white1 border-gray19"
        />

        <div className="relative inline-block text-right" ref={dropdownRef}>
          <button
            onClick={() =>
              setOpenDropdownId(openDropdownId === -1 ? null : -1)
            }
            className="border border-gray19 rounded-lg px-3 py-2 flex items-center gap-2 text-sm w-52 justify-between text-black1"
          >
            {selectedSort}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openDropdownId === -1 ? "rotate-180" : ""
              }`}
            />
          </button>

          {openDropdownId === -1 && (
            <div className="absolute left-0 mt-1 w-52 bg-white6 text-black1 rounded-lg shadow-md z-10 flex flex-col">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    setOpenDropdownId(null);
                    switch (option) {
                      case "موجودی (ارزش تومانی)":
                        handleSort("price");
                        setSortOrder("asc");
                        break;
                      case "قیمت (زیاد به کم)":
                        handleSort("price");
                        setSortOrder("desc");
                        break;
                      case "قیمت (کم به زیاد)":
                        handleSort("price");
                        setSortOrder("asc");
                        break;
                      case "موجودی (تعداد)":
                        handleSort("price");
                        setSortOrder("asc");
                        break;
                      default:
                        break;
                    }
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-gray-100 text-sm text-black1 whitespace-nowrap"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="">
        <table className="w-full text-sm text-right border-collapse text-black1">
          <thead>
            <tr className="bg-gray41 text-black1">
              <th className="px-4 py-3 text-[14px] font-medium text-center whitespace-nowrap">نام و نماد ارز</th>
              <th className="px-4 py-3 text-[14px] font-medium text-center whitespace-nowrap">قیمت تومانی</th>
              <th className="px-4 py-3 text-[14px] font-medium text-center whitespace-nowrap">تغییرات ۲۴h</th>
              <th className="px-4 py-3 text-[12px] font-medium text-center whitespace-nowrap"></th>
              <th className="py-3 text-[12px] font-medium text-center whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item: Crypto, index: number) => (
              <tr key={index} className="border-b border-b-gray21 hover:bg-gray41 last:border-b-0">
                <td className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                  {item.icon}
                  <div>
                    <div className="font-medium truncate max-w-[100px]">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.symbol}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.price.toLocaleString()} تومان</td>
                <td className={`px-4 py-3 whitespace-nowrap ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {item.change > 0 ? "+" : ""}
                  {item.change}%
                </td>
                <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                  <button className="w-[84px] h-[34px] rounded-[8px] border text-sm text-blue2 hover:bg-blue-100 border-blue2">واریز</button>
                  <button className="w-[84px] h-[34px] rounded-[8px] text-sm bg-blue2 text-white1 hover:bg-blue-100">برداشت</button>
                </td>
                <td className="px-4 py-3 text-center relative whitespace-nowrap group">
              
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={() => {
                      if (isMobile) {
                        setOpenModalId(index); 
                      }
                    }}
                  >
                    <MoreVertical className="w-4 h-4 text-blue2 block group-hover:hidden" />
                    <MoreHorizontal className="w-4 h-4 text-blue2 hidden group-hover:block" />
                  </button>

                  {!isMobile && (
                    <div className="absolute left-[41px] mt-2 top-6 w-[226px] bg-white rounded-lg shadow-md flex flex-col z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={() => console.log("خرید", item.symbol)}
                        className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                          <ReceivedIcon />
                        </span>
                        <span>خرید</span>
                      </button>
                      <button
                        onClick={() => console.log("فروش", item.symbol)}
                        className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                          <SendIcon />
                        </span>
                        <span>فروش</span>
                      </button>
                    </div>
                  )}
                  <ActionModal
                    open={openModalId === index}
                    onClose={() => setOpenModalId(null)}
                    name={item.name}
                    symbol={item.symbol}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;
