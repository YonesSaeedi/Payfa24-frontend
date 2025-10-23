import React, { useState, useEffect, useRef, useCallback } from "react";
import { ActionModal } from "./ActionModal";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
import { apiRequest } from "../../utils/apiClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes"; // مسیر دقیق فایل routes را چک کنید
import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import IconMoreHorizental from "../../assets/icons/Wallet/IconMoreHorizental";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import IconSearch from "../../assets/icons/market/IconSearch";


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

const WalletAssets: React.FC = () => {
  const [walletsData, setWalletsData] = useState<Wallet[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSortKey, setSelectedSortKey] = useState("default");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModalId, setOpenModalId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      setIsLoading(true)
      try {
        const response = await apiRequest<WalletsResponse>({
          url: "/api/wallets/crypto",
          method: "GET",
          params: { limit: 10, page: 1, search: searchTerm, sort: sortKey, justBalance: true },
        });
        setWalletsData(response.wallets || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false)
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
      color: generalItem?.color,
      isFont: generalItem.isFont,
      icon: renderIcon,
      percent: generalItem?.percent ?? wallet.percent,
    };
  });



  return (
    <div dir="rtl" className="p-4 bg-white1 rounded-xl border border-gray21 w-full overflow-visible">
      {/* Search و Dropdown */}
      <div className="flex items-center justify-between mb-3">
        {/* Input با آیکون داخل */}
<div className="relative w-1/2">
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
    <IconSearch />
  </span>

  <input
    type="text"
    placeholder="جستجو..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray19 rounded-lg pr-10 pl-3 py-2 text-sm w-full bg-white1 focus:border-blue2 focus:outline-none focus:ring-1 focus:ring-blue2 transition-all duration-200"
  />
</div>


        <div className="relative  inline-block text-right max-w-[50%]" ref={dropdownRef}>
         <button
  onClick={() => setOpenDropdown(!openDropdown)}
  className={`
    border rounded-lg px-3 py-2 flex items-center gap-2 text-sm w-full sm:w-36 lg:w-52 justify-between text-black1
    transition-colors duration-200
    ${openDropdown ? "border-blue2" : "border-gray19"}
  `}
>
  {sortOptions.find((opt) => opt.key === selectedSortKey)?.label || "گزینه‌ها"}
  <span className={`w-4 h-4 transition-transform duration-200 ${openDropdown ? "rotate-180" : ""}`}>
    <IconChervDown />
  </span>
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
       
            <div className="hidden lg:grid grid-cols-5 w-full bg-gray41 text-black1 text-sm font-medium h-12 items-center rounded-lg">
              <span className="text-center">نام و نماد ارز</span>
              <span className="text-center">نرخ جهانی</span>
              <span className="text-center">نرخ تومان</span>
              <span className="text-center">موجودی شما</span>
              <span className="text-center">معادل موجودی</span>
            </div>
       
          <div>
            {isLoading ? (
              // 👇 اسکلتون
              [...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="border-b grid grid-cols-2 lg:grid-cols-5 border rounded-lg lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b-gray21 hover:bg-gray41 last:border-b-0 mb-2 lg:m-0 animate-pulse"
                >
                  {/* ستون ۱: نام و آیکون */}
                  <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                    <div className="w-8 h-8 rounded-full skeleton-bg"></div>
                    <div className="flex flex-col gap-1">
                      <div className="w-20 h-4 rounded-md skeleton-bg"></div>
                      <div className="w-12 h-3 rounded-md skeleton-bg"></div>
                    </div>
                  </div>

                  {/* ستون ۲: قیمت */}
                  <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                    <div className="w-16 h-4 rounded-md skeleton-bg"></div>
                  </div>

                  {/* ستون ۳: کارمزد */}
                  <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                    <div className="w-16 h-4 rounded-md skeleton-bg"></div>
                  </div>

                  {/* ستون ۴: بالانس */}
                  <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                    <div className="w-24 h-4 rounded-md skeleton-bg"></div>
                  </div>

                  {/* ستون ۵: مجموع و منو */}
                  <div className="px-2 py-3 text-center relative whitespace-nowrap flex items-center justify-between">
                    <span></span>
                    <div className="flex flex-col items-end justify-center gap-2">
                      <div className="w-24 h-4 rounded-md skeleton-bg"></div>
                      <div className="w-20 h-3 rounded-md skeleton-bg lg:hidden"></div>
                    </div>
                    <div className="w-6 h-6 rounded-full skeleton-bg"></div>
                  </div>
                </div>
              ))
            ) : cryptoData.length === 0 ? (
              <div className="flex flex-col items-center justify-center ">
                <div className=" flex items-center justify-center text-[#75A4FE] w-20 h-20 m-10 ">
                    <WalletMinesIcon />
                </div>
                <span className="block text-center text-black2 mb-10 text-base font-normal">کیف پول دارایی‌های شما خالی است!</span>
              </div>
            ) : (
              // 👇 حالت عادی با داده
              cryptoData.map((item, index) => (
                <div
                  key={index}
                  className="border-b grid grid-cols-2 lg:grid-cols-5 border rounded-lg lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b-gray21 hover:bg-gray41 lg:last:border-b-0 mb-2 lg:m-0"
                >
                  <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                    {item.icon}
                    <div>
                      <div className="font-medium truncate max-w-[100px]">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.symbol}</div>
                    </div>
                  </div>

                  <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                    {item.price.toLocaleString()}
                  </span>

                  <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                    {item.fee_toman.toLocaleString()}
                  </span>

                  <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                    {item.balance.toLocaleString()} {item.symbol}
                  </span>

                  <div className="px-2 py-3 text-center relative whitespace-nowrap group flex items-center justify-between">
                    <span></span>
                    <div className="flex flex-col items-end justify-center text-xs lg:text-sm font-normal">
                      <span className="whitespace-nowrap">
                        {(item.price * item.balance).toFixed(2)} دلار
                      </span>
                      <span className="whitespace-nowrap lg:hidden">
                        معادل {item.balance} تومان
                      </span>
                    </div>

                    <button
                      className="rounded-full  transition"
                      onClick={() => isMobile && setOpenModalId(index)}
                    >
                      <span className="w-4 h-4 text-blue2 block group-hover:hidden"><IconMoreHorizental/></span>
                     
                      <span  className="w-4 h-4 text-blue2 hidden group-hover:block"><IconMoreHorizental/></span>
                    
                    </button>

                    {!isMobile && (
                      <div className="absolute left-[41px] mt-2 top-6 w-[226px] bg-white8 border border-gray21 shadow-md rounded-lg shadow-md flex flex-col z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button
                          className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => navigate(ROUTES.TRADE.BUY)}
                        >
                          <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                            <ReceivedIcon />
                          </span>
                          <span className="text-blue1">خرید</span>
                        </button>
                        <button
                          className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => navigate(ROUTES.TRADE.SELL)}
                        >
                          <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                            <SendIcon />
                          </span>
                          <span className="text-blue1">فروش</span>
                        </button>
                        <button
                          className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => navigate(ROUTES.DEPOSIT)}
                        >
                          <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                            <WalletAddIcon />
                          </span>
                          <span className="text-blue1">واریز</span>
                        </button>
                        <button
                          className="px-3 py-2 text-sm text-black1 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => navigate(ROUTES.WITHDRAWAL_FIAT)}
                        >
                          <span className="text-blue1 w-5 h-5 flex items-center justify-center">
                            <WalletMinesIcon />
                          </span>
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
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default WalletAssets;
