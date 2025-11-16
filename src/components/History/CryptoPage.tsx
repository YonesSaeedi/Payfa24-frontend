import React, { useState, useEffect, useMemo } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import Pagination from "./Pagination";
import TransactionModal, { CryptoDetail, TransactionDetail } from "./TransactionModal";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import TrasactionHisory from "./../../assets/images/Transaction/Transactionhistory.png";
import TransactionHistoryDark from "./../../assets/images/Transaction/Transaction HistoryDark.png";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap } from "../../types/crypto";
import FilterDropdown from "./FilterDropdown";
import SkeletonTable from "./SkeletonTable";
import { filterForOptions, MergedCryptoHistory, statusOptions, TypeCryptoHistory, typeOptions } from "./typeHistory";

interface CryptoTransaction {
  id: number;
  type: string;
  amount: number;
  status: string;
  description?: string;
  DateTime: string;
  coin: { name: string; symbol: string };
  fee?: number;
  memoTag?: string;
  code?: string;
}
const CryptoPage: React.FC = () => {
  const [responseData, setResponseData] = useState<TypeCryptoHistory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedFilterFor, setSelectedFilterFor] = useState(filterForOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeOptions[0]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data: generalData } = useGetGeneralInfo();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return (
      generalData?.cryptocurrency?.reduce((acc, item) => {
        acc[item.symbol] = item;
        return acc;
      }, {} as CryptoDataMap) ?? {}
    );
  }, [generalData]);

  const handleToggle = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchTransactionData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest<{
          transaction: CryptoTransaction[];
          transaction_count: number;
        }>({
          url: "/history/crypto-transaction",
          method: "GET",
          params: {
            page,
            filterType: selectedFilterType?.value || "",
            filterFor: selectedFilterFor?.value || "",
            filterStatus: selectedStatus?.value || "",
          },
        });

        setResponseData(response.transaction || []);
        setTotalPages(response.transaction_count || 1);
      } catch (err) {
        console.error("خطا در دریافت داده‌های تراکنش:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [page, selectedFilterType?.value, selectedFilterFor?.value, selectedStatus?.value]);

  const mergedTransactions: MergedCryptoHistory[] = useMemo(() => {
    if (!responseData.length) return [];
    return responseData.map((tx) => {
      const coinData = mappedGeneralData[tx.coin.symbol];
      return {
        ...tx,
        color: coinData?.color || null,
        isFont: coinData?.isFont || false,
        icon: coinData?.icon || null,
        locale: coinData?.locale || null,
        name: coinData?.locale?.en?.name || tx.coin.name,
      };
    });
  }, [responseData, mappedGeneralData]);

  const filteredTransactions = useMemo(() => {
    if (!searchText) return mergedTransactions;
    const text = searchText.toLowerCase();
    return mergedTransactions.filter(
      (tx) =>
        tx.coin.symbol.toLowerCase().includes(text) ||
        tx.coin.name.toLowerCase().includes(text) ||
        tx.locale?.fa?.name?.toLowerCase().includes(text) ||
        tx.locale?.en?.name?.toLowerCase().includes(text)
    );
  }, [mergedTransactions, searchText]);

const handleOpenModal = (tx: MergedCryptoHistory) => {
  const coinData = mappedGeneralData[tx.coin.symbol];

  const cryptoTx: CryptoDetail = {
    id: tx.id.toString(),
    source: "crypto",
    date: tx.DateTime,
    amount: tx.amount?.toString() ?? "0",
    symbol: tx.coin.symbol,
    description: tx.description,
    status: tx.status,
    type: tx.type,
    fee: tx.fee,
    faName: coinData?.locale?.fa?.name ?? tx.coin.symbol,
    color: coinData?.color ?? null,
    isFont: coinData?.isFont ?? false,
    icon: coinData?.icon ?? null,
    image: coinData?.icon
      ? `https://api.payfa24.org/images/currency/${coinData.icon}`
      : "/images/fallback-coin.png",
  };

  setSelectedTx(cryptoTx);
};
  const convertDigitsToPersian = (str: string) => {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div dir="rtl">
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end ">
        <h1 className="hidden lg:block font-medium text-[20px]">تاریخچه تراکنش های رمزارز</h1>
      </div>

      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-6 text-black1 pt-8">
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-8 ">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 icon-wrapper text-gray12">
              <IconFilterTable />
            </span>
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray12 self-center"></div>

          <input
            type="text"
            placeholder="جستجو..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border px-2 py-1 text-sm bg-white1 border-gray20 rounded-lg "
          /> 

          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={typeOptions}
            selected={selectedFilterType}
            isOpen={openDropdown === "type"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedFilterType(option)}
          />

          <FilterDropdown
            id="status"
            label="وضعیت"
            options={statusOptions}
            selected={selectedStatus}
            isOpen={openDropdown === "status"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedStatus(option)}
          />

          <FilterDropdown
            id="filterFor"
            label="محدوده"
            options={filterForOptions}
            selected={selectedFilterFor}
            isOpen={openDropdown === "filterFor"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedFilterFor(option)}
          />
        </div>

        <div className="hidden lg:block">
          <div className="grid grid-cols-6 bg-gray41 text-black1 text-right py-4 px-3 font-medium rounded-lg">
            <div className="px-10">ارز</div>
            <div className="text-center">مقدار</div>
            <div className="text-center">نوع</div>
            <div className="text-center">وضعیت</div>
            <div className="text-center">تاریخ و زمان</div>
            <div className="text-center">جزئیات</div>
          </div>

          {isLoading ? (
            <SkeletonTable />
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y divide-gray21">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-6 py-4 px-3 hover:bg-gray42 items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont ? (
                        <i className={`cf cf-${tx.coin.symbol?.toLowerCase()}  w-10 h-10 size-10 text-[35px]`} style={{ color: tx.color ?? "" }} />
                      ) : (
                        <img src={mappedGeneralData[tx.coin.symbol]?.icon? `https://api.payfa24.org/images/currency/${mappedGeneralData[tx.coin.symbol].icon}`
                        : "/images/fallback-coin.png"} alt={tx.coin.symbol}/>
                      )}
                    </span>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="font-normal text-lg">{tx.locale?.fa?.name || tx.coin.name}</span>
                      <span className="font-normal text-sm text-gray-500">{tx.coin.symbol}</span>
                    </div>
                  </div>
                  <div className="text-center font-normal text-base">{formatPersianDigits(tx.amount)}</div>
                  <div className="text-center font-normal text-base">{transactionTypeMap[tx.type] || tx.type}</div>
                  <div className="text-center">
                    <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                  </div>
                  <div className="text-center font-normal text-base">{tx.DateTime ? convertDigitsToPersian(tx.DateTime) : "-"}</div>

                  <div className="text-blue-600 cursor-pointer text-center font-normal text-base" onClick={() => handleOpenModal(tx)}>
                    جزئیات
                  </div>
                </div>
              ))}
            </div>
          ) : responseData.length === 0 ? (
            <div className="text-center py-12">
              <img src={TrasactionHisory} alt="بدون تراکنش" className="mb-3 dark:hidden mx-auto" />
              <img src={TransactionHistoryDark} alt="بدون تراکنش" className="mb-3 hidden dark:block mx-auto" />
              <p className="text-black1 text-lg font-medium">تاکنون تراکنشی نداشته‌اید!</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg font-medium">موردی یافت نشد</p>
            </div>
          )}
        </div>

        <div className="block lg:hidden space-y-4 mt-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4  border-gray21">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont ? (
                        <i className={`cf cf-${tx.coin.symbol?.toLowerCase()} text-[28px]`} style={{ color: tx.color ?? "" }} />
                      ) : (
                        <img
                          src={`https://api.payfa24.org/images/currency/${tx.icon}`}
                          className="w-8 h-8"
                          alt={tx.coin.symbol}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png";
                          }}
                        />
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-black1">{tx.locale?.fa?.name || tx.coin.name}</p>
                      <p className="text-xs text-gray-500">{tx.coin.symbol}</p>
                    </div>
                  </div>
                  <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                </div>

                <div className="text-sm space-y-1 pt-5">
                  <p className="flex justify-between">
                    مقدار: <span className="pb-4 font-normal text-[14px]">{tx.amount}</span>
                  </p>
                  <p className="flex justify-between">
                    نوع: <span className="pb-4 font-normal text-[14px]">{transactionTypeMap[tx.type] || tx.type}</span>
                  </p>
                  <p className="flex justify-between">
                    تاریخ: <span className="pb-4 font-normal text-[14px]">{tx.DateTime ? convertDigitsToPersian(tx.DateTime) : "-"}</span>
                  </p>
                </div>

                <div className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-3 border-gray21  text-center font-bold text-[14px]" onClick={() => handleOpenModal(tx)}>
                  جزئیات تراکنش
                </div>
              </div>
            ))
          ) : responseData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
              <img src={TrasactionHisory} alt="بدون تراکنش" className="mb-3 dark:hidden w-32 h-32 mx-auto" />
              <img src={TransactionHistoryDark} alt="بدون تراکنش" className="mb-3 hidden dark:block w-32 h-32 mx-auto" />
              <p className="text-gray-500 text-base">تاکنون تراکنشی نداشته‌اید!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
              <p className="text-gray-500 text-base">موردی یافت نشد</p>
            </div>
          )}
        </div>
      </div>

      {filteredTransactions.length > 0 && !isLoading && <Pagination current={page} total={Math.ceil((totalPages ?? 0) / 15)} onPageChange={setPage} />}

      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
};

export default CryptoPage;
