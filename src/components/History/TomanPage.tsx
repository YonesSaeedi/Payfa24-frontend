import React, { useState, useEffect } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconFilterTable from "../../assets/icons/transaction-history/IconFilterTable";
import Pagination from "./Pagination";
import TransactionModal, { TransactionDetail } from "./TransactionModal";
import TrasactionHisory from "./../../assets/images/Transaction/Transactionhistory.png";
import TransactionHistoryDark from "./../../assets/images/Transaction/Transaction HistoryDark.png";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import FilterDropdown from "./FilterDropdown";
import ImageIran from "./../../assets/images/Transaction/iran.png";
import { filterForTomanOptions, statusTomanOptions, typeTomanOptions, TypeTomanTransaction } from "./typeHistory";
import SkeletonTable from "./SkeletonTable";

interface FiatTransaction {
  id: number;
  type: "deposit" | "withdraw";
  amount: number;
  stock: string;
  status: "success" | "pending" | "unsuccessful" | "reject" | "return";
  description?: string;
  DateTime: string;
  symbol?: string;
  name?: string;
}

interface FiatResponse {
  transaction_count: number;
  transaction: FiatTransaction[];
}

// ---------------- صفحه اصلی ----------------
const TomanPage: React.FC = () => {
  const [responseData, setResponseData] = useState<TypeTomanTransaction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(statusTomanOptions[0]);
  const [selectedFilterFor, setSelectedFilterFor] = useState(filterForTomanOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeTomanOptions[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [selectedTx, setSelectedTx] = useState<TransactionDetail | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const handleToggle = (id: string) => setOpenDropdown((prev) => (prev === id ? null : id));

  useEffect(() => {
    const fetchTransactionData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest<FiatResponse>({
          url: "/history/fiat",
          method: "GET",
          params: {
            page,
            filterType: selectedFilterType?.value || "",
            filterFor: selectedFilterFor?.value || "",
            filterStatus: selectedStatus?.value || "",
          },
        });

        setResponseData(
          response.transaction.map((tx) => ({
            ...tx,
            symbol: tx.symbol || "",
            name: tx.name || "",
          }))
        );
        setTotalPages(response.transaction_count || 1);
      } catch (err) {
        console.error("خطا در دریافت داده‌های تراکنش:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [page, selectedFilterType?.value, selectedFilterFor?.value, selectedStatus?.value]);

const handleOpenModal = (tx: TypeTomanTransaction) => {
  setSelectedTx({
    ...tx,
    id: tx.id.toString(), // حتما string
    source: "fiat",
  });
};

  const convertDigitsToPersian = (str: string) => {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

  return (
    <div dir="rtl">
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end ">
        <h1 className="hidden lg:block font-medium text-[20px]">تاریخچه تراکنش های تومانی</h1>
      </div>
      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 p-4 text-black1">
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-6">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 icon-wrapper text-gray12">
              <IconFilterTable />
            </span>
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray-400 self-center"></div>
          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={typeTomanOptions}
            selected={selectedFilterType}
            isOpen={openDropdown === "type"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedFilterType(option)}
          />

          <FilterDropdown
            id="status"
            label="وضعیت"
            options={statusTomanOptions}
            selected={selectedStatus}
            isOpen={openDropdown === "status"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedStatus(option)}
          />

          <FilterDropdown
            id="filterFor"
            label="محدوده"
            options={filterForTomanOptions}
            selected={selectedFilterFor}
            isOpen={openDropdown === "filterFor"}
            onToggle={(id) => handleToggle(id)}
            onSelect={(_, option) => setSelectedFilterFor(option)}
          />
        </div>
        <div className="hidden lg:block">
          <div className="grid grid-cols-7 bg-gray41 text-black1 text-right py-4 px-3 font-medium rounded-lg">
            <div className="px-10">ارز</div>
            <div className="text-center">مقدار</div>
            <div className="text-center">نوع</div>
            <div className="text-center">توضیحات</div>
            <div className="text-center">وضعیت</div>
            <div className="text-center">تاریخ و زمان</div>
            <div className="text-center">جزئیات</div>
          </div>
          {isLoading ? (
            <SkeletonTable />
          ) : responseData.length > 0 ? (
            <div className="divide-y divide-gray21">
              {responseData.map((tx) => (
                <div key={tx.id} className="grid grid-cols-7 py-4 px-3 hover:bg-gray42 items-center text-sm">
                  <div className="flex items-center gap-2 ">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      <img src={ImageIran} className="w-full h-full" alt={tx.name} />
                    </span>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="font-normal text-lg">تومان</span>
                      <span className="font-normal text-sm text-gray-500">IRT</span>
                    </div>
                  </div>
                  <div className="text-center font-normal text-base">{formatPersianDigits(tx.amount)}</div>
                  <div className="text-center font-normal text-base">{transactionTypeMap[tx.type] || tx.type}</div>
                  <div className="text-center font-normal text-base">{tx.description}</div>
                  <div className="text-center font-normal text-base">
                    <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                  </div>
                  <div className="text-center">{tx.DateTime ? convertDigitsToPersian(tx.DateTime) : "-"}</div>
                  <div className="text-blue-600 cursor-pointer text-center font-normal text-[16px]" onClick={() => handleOpenModal(tx)}>
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

        {/* ---------------- Mobile Transactions ---------------- */}
        <div className="block lg:hidden space-y-4 mt-4">
          {responseData.length > 0 ? (
            responseData.map((tx) => (
              <div key={tx.id} className="border rounded-xl p-4 border-gray21">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      <img src={ImageIran} className="w-full h-full" alt={tx.name} />
                    </span>
                    <div>
                      <p className="font-medium text-black1">تومان</p>
                      <p className="text-xs text-gray-500">IRT</p>
                    </div>
                  </div>
                  <StatusBadge text={transactionStatusMap[tx.status] || "نامشخص"} />
                </div>

                <div className="text-sm space-y-1 pt-5">
                  <p className="flex justify-between pb-4 font-medium text-[12px]">
                    نوع: <span className=" font-normal text-[14px]">{transactionTypeMap[tx.type] || tx.type}</span>
                  </p>
                  <p className="flex justify-between  pb-4 font-medium text-[12px]">
                    قیمت : <span className="font-normal text-[14px]">{tx.amount}</span>
                  </p>
                  <p className="flex justify-between pb-4 font-medium text-[12px]">
                    تاریخ تراکنش:
                    <span className="font-normal text-[14px]">{tx.DateTime ? convertDigitsToPersian(tx.DateTime) : "-"}</span>
                  </p>

                  <p className="flex justify-between  pb-4 font-medium text-[12px]">
                    توضیحات: <span className="font-normal text-[14px]">{tx.description}</span>
                  </p>
                </div>
                <div className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-3 border-gray21  text-center font-bold text-[14px]" onClick={() => handleOpenModal(tx)}>
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

      {responseData.length > 0 && !isLoading && <Pagination current={page} total={Math.ceil((totalPages ?? 0) / 15)} onPageChange={setPage} />}

      {/*مودال جزیات==============================================================================================================================================*/}
      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}
    </div>
  );
};

export default TomanPage;
