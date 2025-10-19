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
import SkeletonTable from "./SkeletonTable";
import { filterForOptions, MergedCryptoHistory, statusOptions, TypeCryptoHistory, typeOptions } from "./typeHistory";


// صفحه اصلی
const CryptoPage: React.FC = () => {
  const [responseData, setResponseData] = useState<TypeCryptoHistory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [selectedFilterFor, setSelectedFilterFor] = useState(filterForOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeOptions[0]);
  const [searchText, setSearchText] = useState<string>("");

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
          url: "/api/history/crypto-transaction",
          method: "GET",
          params: {
            page,
            search: searchText,
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

  // ادغام داده‌های ارز و تراکنش
  const mergedTransactions: MergedCryptoHistory[] = useMemo(() => {
    if (!responseData.length) return [];
    return responseData.map(tx => {
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

  // فیلتر سمت کلاینت برای جستجو
  const filteredTransactions = useMemo(() => {
    if (!searchText) return mergedTransactions;
    const text = searchText.toLowerCase();
    return mergedTransactions.filter(tx =>
      tx.coin.symbol.toLowerCase().includes(text) ||
      tx.coin.name.toLowerCase().includes(text) ||
      tx.locale?.fa?.name?.toLowerCase().includes(text) ||
      tx.locale?.en?.name?.toLowerCase().includes(text)
    );
  }, [mergedTransactions, searchText]);

  // باز کردن مودال جزئیات
  // const handleOpenModal = (tx: MergedCryptoHistory) => {
  //   setSelectedTx({
  //     id: tx.id.toString(),
  //     source: "crypto",
  //     faName: tx.locale?.fa?.name || tx.name,
  //     image: tx.icon ? `https://api.payfa24.org/images/currency/${tx.icon}` : null,
  //   });
  // };

  const handleOpenModal = (tx: MergedCryptoHistory) => {
  setSelectedTx({
    id: tx.id.toString(),
    source: "crypto",
    faName: tx.locale?.fa?.name || tx.name,
    image: tx.icon ? `https://api.payfa24.org/images/currency/${tx.icon}` : null,
    date: tx.DateTime,
    symbol: tx.coin.symbol,
    description: tx.description,
    amount: tx.amount,
    status: tx.status,
    type: tx.type,
    fee: tx.fee,
    // اگر فیلدهای دیگه‌ای لازم داری اضافه کن
  });
};


  return (
    <div dir="rtl">
      {/* هدر */}
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end container-style">
        <h1 className="hidden lg:block">تاریخچه تراکنش ها</h1>
      
      </div>

      {/* فیلترها */}
      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-6">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 icon-wrapper text-gray12"><IconFilterTable /></span>
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray-400 self-center"></div>

          {/* جستجو */}
          <input
            type="text"
            placeholder="جستجو..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="border px-2 py-1 text-sm bg-white1 border-gray20 rounded-lg "
          />

          {/* Dropdown ها */}
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
          <FilterDropdown
            id="filterFor"
            label="محدوده"
            options={filterForOptions.map(o => o.name)}
            selected={selectedFilterFor.name}
            isOpen={openDropdown === "filterFor"}
            onToggle={() => handleToggle("filterFor")}
            onSelect={(id, name) =>
              setSelectedFilterFor(filterForOptions.find(o => o.name === name) || filterForOptions[0])
            }
          />
        </div>

        {/* لیست تراکنش‌ها */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 bg-gray41 text-black1 text-right py-4 px-3 font-medium">
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
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="grid grid-cols-6 py-4 px-3 hover:bg-gray42 items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont
                        ? <i className={`cf cf-${tx.coin.symbol?.toLowerCase()}  w-10 h-10 size-10 text-[35px]`} style={{ color: tx.color ?? "" }} />
                        : <img
                          src={`https://api.payfa24.org/images/currency/${tx.icon}`}
                          className="w-full h-full"
                          alt={tx.coin.symbol}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png"; }}
                        />
                      }
                    </span>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="font-normal text-lg">{tx.locale?.fa?.name || tx.coin.name}</span>
                      <span className="font-normal text-sm text-gray-500">{tx.coin.symbol}</span>
                    </div>
                  </div>
                  <div className="text-center">{tx.amount}</div>
                  <div className="text-center">{transactionTypeMap[tx.type] || tx.type}</div>
                  <div className="text-center">
                    <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                  </div>
                  <div className="text-center">{tx.DateTime}</div>
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
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont
                        ? <i className={`cf cf-${tx.coin.symbol?.toLowerCase()} text-[28px]`} style={{ color: tx.color ?? "" }} />
                        : <img
                          src={`https://api.payfa24.org/images/currency/${tx.icon}`}
                          className="w-8 h-8"
                          alt={tx.coin.symbol}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png"; }}
                        />
                      }
                    </span>
                    <div>
                      <p className="font-medium text-black1">{tx.locale?.fa?.name || tx.coin.name}</p>
                      <p className="text-xs text-gray-500">{tx.coin.symbol}</p>
                    </div>
                  </div>
                  <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                </div>

                <div className="text-sm space-y-1">
                  <p className="flex justify-between">مقدار: <span className="font-medium">{tx.amount}</span></p>
                  <p className="flex justify-between">نوع: <span className="font-medium">{transactionTypeMap[tx.type] || tx.type}</span></p>
                  <p className="flex justify-between">تاریخ: <span className="font-medium">{tx.DateTime}</span></p>
                </div>

                <div className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-2 text-center" onClick={() => handleOpenModal(tx)}>
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
      {filteredTransactions.length > 0 && !isLoading && (
        <Pagination current={page} total={Math.ceil((totalPages ?? 0) / 15)} onPageChange={setPage} />
      )}

     {/* مودال جزییات تراکنش */}
{selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}



    </div>
  );
};

export default CryptoPage;
