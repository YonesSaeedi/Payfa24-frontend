import React, { useState, useEffect, useMemo } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import Pagination from "./Pagination";
import TransactionModal, { Transaction as ModalTransaction } from "./TransactionModal";
import FilterModal from "./FilterModal";
import TrasactionHisory from "./../../assets/images/Transaction/Transactionhistory.png";
import TransactionHistoryDark from "./../../assets/images/Transaction/Transaction HistoryDark.png";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap } from "../../types/crypto";
import FilterDropdown from "./FilterDropdown";
import { ListDigitalCoin } from "../../constants/ListdigitalCoins";

// ---------------- ثابت‌ها ----------------
export const typeOptions = [
  { id: 0, name: "خرید و فروش", value: "" },
  { id: 1, name: "خرید", value: "buy" },
  { id: 2, name: "فروش", value: "sell" },
];

export const statusOptions = [
  { id: 0, name: "همه وضعیت ها", value: "" },
  { id: 1, name: "موفق", value: "success" },
  { id: 2, name: "درحال بررسی", value: "pending" },
  { id: 3, name: "ناموفق", value: "unsuccessful" },
  { id: 4, name: "رد شده", value: "reject" },
];

// ---------------- اینترفیس‌ها ----------------
export interface TypeGeneralInfo {
  id: number;
  name: string;
  symbol: string;
  icon: string;
  color: string;
  isFont: boolean;
  isDisable: boolean;
  locale: {
    fa?: { name?: string };
    en?: { name?: string };
    fr?: { name?: string };
  };
}

export interface TypeOrderTransaction {
  id: number;
  amount: number;
  amount_coin: number;
  dateTime: string;
  fee: number;
  description?: string;
  internal: string;
  name: string;
  status?: string;
  symbol?: string;
  type?: string;
  icon?: string;
}

export interface MergedTransaction {
  // ---------------- تراکنش ----------------
  id: number;
  amount: number;
  amount_coin: number;
  dateTime: string;
  fee: number;
  description?: string;
  internal: string;
  name: string;      // نام ارز یا تراکنش
  status?: string;
  symbol?: string;
  type?: string;

  // ---------------- اطلاعات ارز ----------------
  color: string | null;
  isFont: boolean;
  icon: string | null;
  locale: TypeGeneralInfo["locale"] | null;
}

// ---------------- اسکلتون ----------------
const TableSkeleton = () => (
  <div className="divide-y divide-gray21">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="grid grid-cols-6 gap-4 py-4 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full skeleton-bg"></div>
          <div className="flex flex-col gap-1">
            <div className="h-3 w-20 rounded skeleton-bg"></div>
            <div className="h-2 w-10 rounded skeleton-bg"></div>
          </div>
        </div>
        <div className="h-3 w-16 rounded skeleton-bg"></div>
        <div className="h-3 w-14 rounded skeleton-bg"></div>
        <div className="h-6 w-20 rounded-full skeleton-bg"></div>
        <div className="h-3 w-24 rounded skeleton-bg"></div>
        <div className="h-3 w-10 rounded skeleton-bg"></div>
      </div>
    ))}
  </div>
);

// ---------------- صفحه اصلی ----------------
const OrderPage: React.FC = () => {
  const [responseData, setResponseData] = useState<TypeOrderTransaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeOptions[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedTx, setSelectedTx] = useState<ModalTransaction | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data: generalData } = useGetGeneralInfo();

  // مدیریت باز/بسته شدن dropdown
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const handleToggle = (id: string) => setOpenDropdown(prev => (prev === id ? null : id));

  // ساخت map از اطلاعات ارزها
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return generalData?.cryptocurrency?.reduce((acc, item) => {
      acc[item.symbol] = item;
      return acc;
    }, {} as CryptoDataMap) ?? {};
  }, [generalData]);

  // دریافت تراکنش‌ها
  useEffect(() => {
    const fetchTransactionData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest({
          url: "/api/history/orders",
          method: "GET",
          params: {
            page,
            filterType: selectedFilterType?.value || "",
            filterStatus: selectedStatus?.value || "",
          },
        });

        setResponseData(response.orders || []);
        setTotalPages(response.orders_count || 1);
      } catch (err) {
        console.error("خطا در دریافت داده‌های تراکنش:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [page, selectedFilterType?.value, selectedStatus?.value]);

const mergedTransactions: MergedTransaction[] = useMemo(() => {
  if (!responseData.length) return [];

  return responseData.map((tx) => {
    const localCoin = ListDigitalCoin.find(
      (item) => item.symbol.toLowerCase() === (tx.symbol?.toLowerCase() || "")
    );

    if (localCoin) {
      return {
        ...tx,
        color: localCoin.colorCode || null,
        isFont: false,
        icon: localCoin.icon || tx.icon || null,
        locale: localCoin.locale || null,
        name:
          localCoin.locale?.fa?.name ||
          localCoin.locale?.en?.name ||
          localCoin.name ||
          tx.name ||
          tx.symbol ||
          "", // ← مقدار پیش‌فرض خالی
      };
    }

    const coinData = mappedGeneralData[tx.symbol || ""] || null;
    return {
      ...tx,
      color: coinData?.color || null,
      isFont: coinData?.isFont || false,
      icon: coinData?.icon || tx.icon || null,
      locale: coinData?.locale || null,
      name:
        coinData?.locale?.fa?.name ||
        coinData?.locale?.en?.name ||
        tx.name ||
        tx.symbol ||
        "", // ← مقدار پیش‌فرض خالی
    };
  });
}, [responseData, mappedGeneralData]);




  // باز کردن مودال جزئیات
const handleOpenModal = (tx: MergedTransaction) => {
  setSelectedTx({
    id: tx.id.toString(),
    source: "order",
    faName: tx.locale.fa.name || tx.name,
    image: tx.icon ? `https://api.payfa24.org/images/currency/${tx.icon}` : null,
  });
};

  return (
    <div dir="rtl">
      {/* هدر */}
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end container-style">
        <h1 className="hidden lg:block">تاریخچه تراکنش ها</h1>
        <span className="w-6 h-6 icon-wrapper text-gray12 lg:hidden" onClick={() => setIsFilterModalOpen(true)}>
          <IconFilterTable />
        </span>
      </div>

      {/* فیلترها */}
      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-6">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 icon-wrapper text-gray12"><IconFilterTable /></span>
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray-400 self-center"></div>

          {/* وضعیت */}
          <FilterDropdown
            id="status"
            label="وضعیت"
            options={statusOptions.map(o => o.name)}
            selected={selectedStatus.name}
            isOpen={openDropdown === "status"}
            onToggle={() => handleToggle("status")}
            onSelect={(id, name) =>
              setSelectedStatus(statusOptions.find(o => o.name === name) || statusOptions[0])
            }
          />

          {/* نوع تراکنش */}
          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={typeOptions.map(o => o.name)}
            selected={selectedFilterType.name}
            isOpen={openDropdown === "type"}
            onToggle={() => handleToggle("type")}
            onSelect={(id, name) =>
              setSelectedFilterType(typeOptions.find(o => o.name === name) || typeOptions[0])
            }
          />
        </div>

        {/* لیست تراکنش‌ها دسکتاپ */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-7 bg-gray41 text-black1 text-right py-4 px-3 font-medium">
            <div className="px-10">ارز</div>
            <div className="text-center">مقدار</div>
            <div className="text-center">نوع</div>
            <div className="text-center">مقدار </div>
            <div className="text-center">وضعیت</div>
            <div className="text-center">تاریخ و زمان</div>
            <div className="text-center">جزئیات</div>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : mergedTransactions.length > 0 ? (
            <div className="divide-y divide-gray21">
              {mergedTransactions.map(tx => (
                <div key={tx.id} className="grid grid-cols-7 py-4 px-3 hover:bg-gray42 items-center text-sm">
                  <div className="flex items-center gap-2 ">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont
                        ? <i className={`cf cf-${tx.symbol?.toLowerCase()} text-[35px]`} style={{ color: tx.color ?? "" }} />
                        : <img
                          src={`https://api.payfa24.org/images/currency/${tx.icon}`}
                          className="w-full h-full"
                          alt={tx.symbol}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png"; }}
                        />
                      }
                    </span>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="font-normal text-lg">{tx.locale?.fa?.name || tx.name}</span>
                      <span className="font-normal text-sm text-gray-500">{tx.symbol}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-center gap-2">
                    <span>{tx.amount_coin}</span>
                    <span>{tx.symbol}</span>
                  </div>
                  <div className="text-center">{transactionTypeMap[tx.type] || tx.type}</div>
                  <div className="text-center">{tx.amount} تومان</div>
                  <div className="text-center">
                    <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                  </div>
                  <div className="text-center">{tx.dateTime}</div>
                  <div className="text-blue-600 cursor-pointer text-center" onClick={() => handleOpenModal(tx)}>
                    جزئیات
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img src={TrasactionHisory} alt="بدون تراکنش" className="mb-3 dark:hidden mx-auto" />
              <img src={TransactionHistoryDark} alt="بدون تراکنش" className="mb-3 hidden dark:block mx-auto" />
              <p className="text-gray-500 text-lg font-medium">تاکنون تراکنشی نداشته‌اید!</p>
            </div>
          )}
        </div>

        {/* موبایل */}
        <div className="block lg:hidden space-y-4 mt-4">
          {mergedTransactions.length > 0 ? (
            mergedTransactions.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont
                        ? <i className={`cf cf-${tx.symbol?.toLowerCase()} text-[28px]`} style={{ color: tx.color ?? "" }} />
                        : <img
                          src={`https://api.payfa24.org/images/currency/${tx.icon}`}
                          className="w-8 h-8"
                          alt={tx.symbol}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png"; }}
                        />
                      }
                    </span>
                    <div>
                      <p className="font-medium text-black1">{tx.locale?.fa?.name || tx.name}</p>
                      <p className="text-xs text-gray-500">{tx.symbol}</p>
                    </div>
                  </div>
                  <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                </div>

                <div className="text-sm space-y-1">
                  <p className="flex justify-between">
                    مقدار: <span className="font-medium">{tx.amount_coin}</span>
                  </p>
                  <p className="flex justify-between">
                    نوع: <span className="font-medium">{transactionTypeMap[tx.type] || tx.type}</span>
                  </p>
                   <p className="flex justify-between">
                    قیمت: <span className="font-medium">{tx.amount} تومان</span>
                  </p>
                  <p className="flex justify-between">
                    تاریخ: <span className="font-medium">{tx.dateTime}</span>
                  </p>
                </div>

                <div
                  className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-2 text-center"
                  onClick={() => handleOpenModal(tx)}
                >
                  جزئیات تراکنش
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
              <img src={TrasactionHisory} alt="بدون تراکنش" className="mb-3 dark:hidden w-32 h-32 mx-auto" />
              <img src={TransactionHistoryDark} alt="بدون تراکنش" className="mb-3 hidden dark:block w-32 h-32 mx-auto" />
              <p className="text-gray-500 text-base">تاکنون تراکنشی نداشته‌اید!</p>
            </div>
          )}
        </div>
      </div>

      {/* صفحه‌بندی */}
      {mergedTransactions.length > 0 && !isLoading && (
        <Pagination current={page} total={Math.ceil((totalPages ?? 0) / 15)} onPageChange={setPage} />
      )}

      {/* مودال‌ها */}
      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default OrderPage;
