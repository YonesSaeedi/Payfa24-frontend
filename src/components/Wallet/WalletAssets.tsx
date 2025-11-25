import React, { useCallback, useEffect, useRef, useState } from "react";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletAddIcon from "../../assets/icons/Home/WalletCardIcon/WalletAddIcon";
import WalletMinesIcon from "../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import IconMoreHorizental from "../../assets/icons/Wallet/IconMoreHorizental";
import IconChervDown from "../../assets/icons/Withdrawal/IconChervDown";
import IconSearch from "../../assets/icons/market/IconSearch";
import { ROUTES } from "../../routes/routes";
import { apiRequest } from "../../utils/apiClient";
import { ActionModal } from "./ActionModal";
import IconMoreVertical from "../../assets/icons/Wallet/IconMoreVertical";
import { Link } from "react-router-dom";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import Pagination from "../History/Pagination";
import IconEmptyWallet from "./../../assets/icons/Home/WalletCardIcon/iconEmptyWallet";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import CurrencyToggle from "../Home/WalletCard/CurrencyToggle";

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
  { label: "مرتب سازی  پیش فرض", key: "default" },
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expectedCount, setExpectedCount] = useState(10);
  const [filterMode, setFilterMode] = useState<"all" | "withBalance">("all");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = useCallback(async (searchTerm: string, sortKey: string, pageNum: number, mode: string) => {
    setIsLoading(true);

    try {
      const limit = 10;
      const response = await apiRequest<WalletsResponse>({
        url: "/wallets/crypto",
        method: "GET",
        params: {
          limit,
          page: pageNum,
          search: searchTerm,
          sort: sortKey,
          justBalance: mode === "withBalance",
        },
      });

      setWalletsData(response.wallets || []);
      setExpectedCount(response.wallets?.length || limit);

      if (mode === "withBalance") {
        setTotalPages(response.wallets && response.wallets.length > 0 ? Math.ceil(response.wallets.length / limit) : 0);
      } else {
        setTotalPages(response.crypto_count ? Math.ceil(response.crypto_count / limit) : 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(search, selectedSortKey, page, filterMode);
  }, [search, selectedSortKey, page, filterMode, fetchData]);

  const handleSort = (key: string) => {
    setSelectedSortKey(key);
    setOpenDropdown(false);
    setPage(1);
  };

  const { data: generalData } = useGetGeneralInfo();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cryptoData = walletsData.map((wallet) => {
    const generalItem = generalData?.cryptocurrency?.find((item: any) => item.symbol?.toLowerCase() === wallet.symbol?.toLowerCase());

    const renderIcon = generalItem?.isFont ? (
      <i className={`cf cf-${wallet.symbol.toLowerCase()}`} style={{ color: generalItem?.color || "#000", fontSize: "24px" }}></i>
    ) : (
      <img src={generalItem?.icon ? `https://api.payfa24.org/images/currency/${generalItem.icon}` : ""} alt={wallet.symbol} className="w-6 h-6 rounded-full" />
    );

    return {
      ...wallet,
      name: generalItem?.locale?.fa?.name || generalItem?.name || wallet.name || wallet.symbol,
      color: generalItem?.color,
      icon: renderIcon,
      percent: generalItem?.percent ?? wallet.percent,
    };
  });

  const formatNumber = (num: number, decimals = 8) => {
    return formatPersianDigits(Number(num.toFixed(decimals)).toString());
  };

  return (
    <div className="flex flex-col gap-6">
      <div dir="rtl" className="lg:p-6 bg-white1 rounded-xl lg:border border-gray21 w-full overflow-visible">
        <div className="flex-col items-center justify-between lg:mb-6 mb-3">
          <div className="flex items-center justify-between lg:mb-2 mb-3">
            <p className="text-black2 lg:pb-7 pb-3 text-right align-middle text-lg font-bold">دارایی های شما</p>
            <CurrencyToggle
              defaultValue="all"
              showIcons={false}
              options={[
                { label: "همه ارزها", value: "all" },
                { label: "ارزهای دارای موجودی", value: "withBalance" },
              ]}
              onChange={(v) => {
                setFilterMode(v as "all" | "withBalance");
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center justify-between lg:mb-6 mb-3">
            <div className="relative w-1/2">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
                <IconSearch />
              </span>
              <input
                type="text"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="border border-gray19 text-black1 rounded-lg pr-10 pl-3 py-2 text-sm w-full bg-white1 focus:border-blue2 focus:outline-none focus:ring-1 focus:ring-blue2 transition-all duration-200"
              />
            </div>
            <div className="relative inline-block text-right max-w-[50%]" ref={dropdownRef}>
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className={`border rounded-lg px-3 py-2 flex items-center gap-2 text-sm w-full sm:w-36 lg:w-52 justify-between text-black1 transition-colors duration-200 ${
                  openDropdown ? "border-blue2" : "border-gray19"
                }`}
              >
                {sortOptions.find((opt) => opt.key === selectedSortKey)?.label || "گزینه‌ها"}
                <span className={`w-4 h-4 transition-transform duration-200 text-gray12 ${openDropdown ? "rotate-180" : ""}`}>
                  <IconChervDown />
                </span>
              </button>
              {openDropdown && (
                <div className="absolute left-0 mt-1 w-52 bg-white6 text-black1 rounded-lg shadow-md z-10 flex flex-col border border-gray21">
                  {sortOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSort(option.key)}
                      className="w-full text-right px-3 py-2 hover:bg-gray27 hover:text-blue2 text-sm text-black1 whitespace-nowrap"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="w-full text-sm text-right border-collapse text-black1">
            <div className="hidden lg:grid grid-cols-5 w-full bg-gray41 text-black1  font-medium text-[14px] h-12 items-center rounded-lg">
              <span className="text-center">نام و نماد ارز</span>
              <span className="text-center">نرخ جهانی</span>
              <span className="text-center">نرخ تومان</span>
              <span className="text-center">موجودی شما</span>
              <span className="text-center">معادل موجودی</span>
            </div>
            <div>
              {isLoading ? (
                [...Array(expectedCount)].map((_, index) => (
                  <div
                    key={index}
                    className="border-b grid grid-cols-2 lg:grid-cols-5 border border-gray21 rounded-lg lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b-gray21 hover:bg-gray41 last:border-b-0 mb-2 lg:m-0 animate-pulse"
                  >
                    <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-full skeleton-bg"></div>
                      <div className="flex flex-col gap-1">
                        <div className="w-20 h-4 rounded-md skeleton-bg"></div>
                        <div className="w-12 h-3 rounded-md skeleton-bg"></div>
                      </div>
                    </div>
                    <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                      <div className="w-16 h-4 rounded-md skeleton-bg"></div>
                    </div>
                    <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                      <div className="w-16 h-4 rounded-md skeleton-bg"></div>
                    </div>
                    <div className="px-4 py-3 hidden lg:flex justify-center items-center">
                      <div className="w-24 h-4 rounded-md skeleton-bg"></div>
                    </div>
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
              ) : !isLoading && cryptoData.length === 0 ? (
                <div className="flex flex-col items-center justify-center ">
                  <div className="flex items-center justify-center icon-wrapper text-white1">
                    <IconEmptyWallet />
                  </div>
                  <span className="block text-center text-black2 mb-10 text-base font-normal">کیف پول دارایی‌های شما خالی است!</span>
                </div>
              ) : (
                cryptoData.map((item, index) => (
                  <div
                    key={index}
                    className="border-b grid grid-cols-2 lg:grid-cols-5 border border-gray21 rounded-md lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b-gray21 hover:bg-gray41 lg:last:border-b-0 mb-2 lg:m-0"
                  >
                    <div className="px-4 py-3 flex items-center gap-2 whitespace-nowrap min-w-0">
                      {item.icon}
                      <div className="flex flex-col min-w-0">
                        <div className="font-medium text-black1 truncate max-w-[120px]" title={item.name}>
                          {item.name}
                        </div>

                        <div className="text-xs text-gray-500 truncate max-w-[120px]">{item.symbol}</div>
                      </div>
                    </div>

                    <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                      {item.price < 0.0001 ? parseFloat(item.price.toFixed(5)) : parseFloat(item.price.toFixed(2))} USDT
                    </span>

                    <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                      {formatPersianDigits(item.fee_toman.toLocaleString())}
                    </span>
                    <span className="px-4 py-3 whitespace-nowrap hidden lg:flex justify-center items-center text-sm font-normal">
                      {formatNumber(item.balance, 8)} {item.symbol}
                    </span>
                    <div className="px-2 py-3 text-center relative whitespace-nowrap group flex items-center justify-between">
                      <span></span>
                      <div className="flex flex-col items-end justify-end text-xs lg:text-sm font-normal">
                        <span className="whitespace-nowrap">{formatNumber(item.price * item.balance, 2)} دلار</span>
                        <span className="whitespace-nowrap lg:hidden">معادل {item.balance} تومان</span>
                      </div>
                      <button
                        className="rounded-full transition w-4 h-4 flex items-center justify-center"
                        onClick={() => {
                          if (isMobile) {
                            setOpenModalId(openModalId === index ? null : index);
                          } else {
                            setOpenMenuId(openMenuId === index ? null : index);
                          }
                        }}
                      >
                        {isMobile ? openModalId === index ? <IconMoreVertical /> : <IconMoreHorizental /> : openMenuId === index ? <IconMoreVertical /> : <IconMoreHorizental />}
                      </button>
                      {!isMobile && openMenuId === index && (
                        <div
                          ref={menuRef}
                          className="absolute left-[25px] p-4 gap-4 mt-2 top-6 w-[226px] bg-white8 overflow-hidden border border-gray21 shadow-md rounded-lg flex flex-col z-10"
                        >
                          <Link to={`${ROUTES.TRADE.BUY}?coin=${item.symbol}`} className="flex items-center gap-2">
                            <span className="text-blue2 w-5 h-5 flex items-center justify-center">
                              <ReceivedIcon />
                            </span>
                            <span className="text-black1 hover:text-blue2 cursor-pointer">خرید</span>
                          </Link>

                          <Link to={`${ROUTES.TRADE.SELL}?coin=${item.symbol}`} className="flex items-center gap-2">
                            <span className="text-blue2 w-5 h-5 flex items-center justify-center">
                              <SendIcon />
                            </span>
                            <span className="text-black1 hover:text-blue2 cursor-pointer">فروش</span>
                          </Link>

                          <Link to={`${ROUTES.DEPOSIT}?coin=${item.symbol}&type=wallet`} className="flex items-center gap-2">
                            <span className="text-blue2 w-5 h-5 flex items-center justify-center">
                              <WalletAddIcon />
                            </span>
                            <span className="text-black1 hover:text-blue2 cursor-pointer">واریز</span>
                          </Link>

                          <Link to={`/withdraw/crypto?coin=${item.symbol}`} className="flex items-center gap-2">
                            <span className="text-blue2 w-5 h-5 flex items-center justify-center">
                              <WalletMinesIcon />
                            </span>
                            <span className="text-black1 hover:text-blue2 cursor-pointer">برداشت</span>
                          </Link>
                        </div>
                      )}
                      {isMobile && <ActionModal open={openModalId === index} onClose={() => setOpenModalId(null)} name={item.name} symbol={item.symbol} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination current={page} total={totalPages} onPageChange={(newPage) => setPage(newPage)} />
        </div>
      )}
    </div>
  );
};

export default WalletAssets;
