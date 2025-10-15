import React, { useState, useEffect, useRef, useCallback } from "react";
import { MoreVertical, MoreHorizontal, ChevronDown } from "lucide-react";
import { ActionModal } from "../../Components/Wallet/ActionModal";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
import { apiRequest } from "../../utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes"; // مسیر دقیق فایل routes را چک کنید
import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";


interface Wallet {
  name: string;
  symbol: string;
  percent?: number;
  color?: string;
  deposit: boolean;
  withdraw: boolean;
  balance: number;
  fee_toman: string;
  price: number;
  icon?: React.ReactNode;
  change?: number;
}

interface WalletsResponse {
  crypto_count: number;
  wallets_internal: Record<string, unknown>;
  wallets: Wallet[];
}

const sortOptions = [
  { label: "پیش فرض", key: "default" },
  { label: "موجودی (تعداد)", key: "stock" },
  { label: "موجودی (ارزش تومانی)", key: "balance" },
  { label: "قیمت (زیاد به کم)", key: "priceDown" },
  { label: "قیمت (کم به زیاد)", key: "priceUp" },
];

const CryptoTable: React.FC = () => {
  const [walletsData, setWalletsData] = useState<Wallet[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSortKey, setSelectedSortKey] = useState("default");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();


  // 📌 هندل ریسایز
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📌 بستن منو در کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 📌 تابع fetchData
  const fetchData = useCallback(
    async (searchTerm: string, sortKey: string) => {
      try {
        const response = await apiRequest<WalletsResponse>({
          url: "/api/wallets/crypto",
          method: "GET",
          params: { limit: 10, page: 1, search: searchTerm, sort: sortKey },
        });
        setWalletsData(response.wallets || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(search, selectedSortKey);
  }, [search, selectedSortKey, fetchData]);

  // 📌 هندل تغییر sort
  const handleSort = (key: string) => {
    setSelectedSortKey(key);
    setOpenDropdown(false);
  };

  // 📌 گرفتن اطلاعات عمومی
  const { data: generalData } = useQuery({
    queryKey: ["general-info"],
    queryFn: async () => {
      const res = await fetch("/api/get-general-info");
      if (!res.ok) throw new Error("Failed to fetch general info");
      return res.json();
    },
  });

  // 📌 ترکیب داده‌ها: merge walletsData + generalData
  const cryptoData = walletsData.map((wallet) => {
    const generalItem = generalData?.cryptocurrency.find(
      (item: any) => item.symbol === wallet.symbol
    );

    // 📌 شرط برای آیکون
    const renderIcon = generalItem?.isFont ? (
      <i
        className={`cf cf-${wallet.symbol.toLowerCase()}`}
        style={{ color: generalItem?.color || "#000", fontSize: "24px" }}
      ></i>
    ) : (
      <img
        src={
          generalItem?.icon
            ? `https://api.payfa24.org/images/currency/${generalItem.icon}`
            : "/default-coin.png"
        }
        alt={wallet.symbol}
        className="w-6 h-6 rounded-full"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/default-coin.png";
        }}
      />
    );

    return {
      ...wallet,
      name: generalItem?.locale?.fa?.name || generalItem?.name || wallet.name,
      color: generalItem.color,
      isFont: generalItem.isFont,
      icon: renderIcon,
      percent: generalItem?.percent ?? wallet.percent,
    };
  });



  return (
    <div dir="rtl" className="p-4 bg-white1 rounded-xl border border-gray21 w-full ">
      {/* Search و Dropdown */}
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          placeholder="جستجو..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-1/2 bg-white1 border-gray19"
        />

        <div className="relative  inline-block text-right max-w-[50%]" ref={dropdownRef}>
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="border border-gray19 rounded-lg px-3 py-2 flex items-center gap-2 text-sm w-full sm:w-36 lg:w-52 justify-between text-black1"
          >
            {sortOptions.find((opt) => opt.key === selectedSortKey)?.label || "گزینه‌ها"}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}
            />
          </button>

          {openDropdown && (
            <div className="absolute left-0 mt-1 w-52 bg-white6 text-black1 rounded-lg shadow-md z-10 flex flex-col">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key)}
                  className="w-full text-right px-3 py-2 hover:bg-gray-100 text-sm text-black1 whitespace-nowrap"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* جدول */}
      <div>
        <div className="w-full text-sm text-right border-collapse text-black1">
          <div>
            <div className="hidden lg:grid grid-cols-5 bg-gray41 text-black1 text-sm font-medium h-12 items-center rounded-lg">
              <span className="text-center">نام و نماد ارز</span>
              <span className="text-center">نرخ جهانی</span>
              <span className="text-center">نرخ تومان</span>
              <span className="text-center">موجودی شما</span>
              <span className="text-center">معادل موجودی</span>
            </div>
          </div>
          <div className="">
            {cryptoData.map((item, index) => (
              <div key={index} className="border-b grid grid-cols-2 lg:grid-cols-5 border rounded-lg lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b-gray21  hover:bg-gray41 last:border-b-0 mb-2 lg:m-0 ">
                <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                  {item.icon}
                  <div>
                    <div className="font-medium truncate max-w-[100px]">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.symbol}</div>
                  </div>
                </div>
                <span className="px-4 py-3 whitespace-nowrap  hidden lg:flex justify-center items-center">{item.price.toLocaleString()} </span>

                <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center">{item.fee_toman.toLocaleString()}</span>
                <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center ">{item.balance.toLocaleString()} {item.symbol}</span>


                <div className="px-2 py-3 text-center relative whitespace-nowrap group flex items-center justify-between">
                  <span></span>
                  <div className="flex flex-col items-end justify-center">
                    <span className="whitespace-nowrap">{item.price.toLocaleString()} دلار</span>
                    <span className="whitespace-nowrap lg:hidden">معادل {item.balance.toLocaleString()} تومان</span>
                  </div>
                  <button
                    className=" rounded-full hover:bg-gray-100 transition"
                    onClick={() => isMobile && setOpenModalId(index)}
                  >
                    <MoreVertical className="w-4 h-4 text-blue2 block group-hover:hidden" />
                    <MoreHorizontal className="w-4 h-4 text-blue2 hidden group-hover:block" />
                  </button>

                  {!isMobile && (
                    <div className="absolute left-[41px] mt-2 top-6 w-[226px] bg-white rounded-lg shadow-md flex flex-col z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => navigate(ROUTES.TRADE.BUY)}
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center"><ReceivedIcon /></span>
                        <span className="text-blue1">خرید</span>
                      </button>
                      <button className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => navigate(ROUTES.TRADE.SELL)}
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center"><SendIcon /></span>
                        <span className="text-blue1">فروش</span>
                      </button>
                      <button className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => navigate(ROUTES.DEPOSIT)}
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center"><WalletAddIcon /></span>
                        <span className="text-blue1">واریز</span>
                      </button>
                      <button className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => navigate(ROUTES.WITHDRAWAL)}
                      >
                        <span className="text-blue1 w-5 h-5 flex items-center justify-center"><WalletMinesIcon /></span>
                        <span className="text-blue1">برداشت</span>
                      </button>
                    </div>
                  )}

                  <ActionModal
                    open={openModalId === index}
                    onClose={() => setOpenModalId(null)}
                    name={item.name}
                    symbol={item.symbol}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;
