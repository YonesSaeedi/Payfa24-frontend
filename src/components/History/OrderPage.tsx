import React, { useState, useEffect, useMemo } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import Pagination from "./Pagination";
import TransactionModalOrder from "./TransactionModalOrder";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import TrasactionHisory from "../../assets/images/Transaction/Transactionhistory.png";
import TransactionHistoryDark from "../../assets/images/Transaction/Transaction HistoryDark.png";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoDataMap, UnifiedCryptoItem } from "../../types/crypto";
import FilterDropdown from "./FilterDropdown";
import { ListDigitalCoin } from "../../constants/ListdigitalCoins";
import { useLocation } from "react-router-dom";

import {
  MergedOrderHistory,
  statusOrderOptions,
  TypeOrderHistory,
  typeOrderOptions,
} from "./typeHistory";
import { formatEnglishNumber, formatPersianNumber } from "../../utils/formatPersianNumber";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";

interface OrdersResponse {
  orders: TypeOrderHistory[];
  orders_count: number;
}

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

const OrderPage: React.FC = () => {
  const [responseData, setResponseData] = useState<TypeOrderHistory[]>([]);
  const [selectedStatus, setSelectedStatus] = useState(statusOrderOptions[0]);
  const [selectedFilterType, setSelectedFilterType] = useState(typeOrderOptions[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { data: generalData } = useGetGeneralInfo();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
 const query = new URLSearchParams(location.search);
  const orderIdFromUrl = query.get("id");


  const handleToggle = (id: string) => setOpenDropdown((prev) => (prev === id ? null : id));

  // مپ اطلاعات عمومی ارزها
  const mappedGeneralData: CryptoDataMap = useMemo(() => {
    return (
      generalData?.cryptocurrency?.reduce((acc, item) => {
        acc[item.symbol] = item;
        return acc;
      }, {} as CryptoDataMap) ?? {}
    );
  }, [generalData]);

  useEffect(() => {
    const fetchTransactionData = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest<OrdersResponse>({
          url: "/history/orders",
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
         // خطا نادیده گرفته شد
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [page, selectedFilterType?.value, selectedStatus?.value]);

  const mergedTransactions: MergedOrderHistory[] = useMemo(() => {
    if (!responseData.length) return [];

    return responseData.map((tx) => {
  
      const localCoin = ListDigitalCoin.find(
        (item) => item.symbol.toLowerCase() === (tx.symbol?.toLowerCase() || "")
      );

 const coinSource = (localCoin || mappedGeneralData[tx.symbol || ""]) as UnifiedCryptoItem;


      return {
        ...tx,
        color: coinSource?.colorCode || coinSource?.color || null,
        isFont: coinSource?.isFont ?? false,
        icon: coinSource?.icon || tx.icon || null,
        locale: coinSource?.locale || null,
        name:
          coinSource?.locale?.fa?.name ||
          coinSource?.locale?.en?.name ||
          tx.name ||
          tx.symbol ||
          "",
      };
    });
  }, [responseData, mappedGeneralData]);

 
  const handleOpenModal = (order: any) => {
    setSelectedTx({
      id: order.id.toString(),
      source: "order",
      coin: { symbol: order.symbol },
      fullData: order,
    });
  };
  useEffect(() => {
  if (!orderIdFromUrl || !responseData.length) return;

  const order = responseData.find((item) => String(item.id) === String(orderIdFromUrl));

  if (order) {
    setSelectedTx({
      id: order.id.toString(),
      source: "order",
      coin: { symbol: order.symbol },
      fullData: order,
    });
  }
}, [orderIdFromUrl, responseData]);


  const convertDigitsToPersian = (str: string) => {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };

const MobileSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="border rounded-xl p-4 border-gray21"
      >
        {/* Header با فاصله دقیق */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-full skeleton-bg"></span>

            <div className="flex flex-col gap-1">
              <div className="h-4 w-24 rounded skeleton-bg"></div> {/* برابر title واقعی */}
              <div className="h-3 w-14 rounded skeleton-bg"></div> {/* برابر symbol */}
            </div>
          </div>

          <div className="h-6 w-20 rounded-full skeleton-bg"></div> {/* برابر StatusBadge */}
        </div>

        {/* Info بخش وسط */}
        <div className="text-sm space-y-1 pt-5">

          {/* مقدار */}
          <div className="flex justify-between items-center h-6">
            <span className="h-3 w-14 rounded skeleton-bg"></span>
            <span className="h-4 w-20 rounded skeleton-bg"></span>
          </div>

          {/* نوع */}
          <div className="flex justify-between items-center h-6">
            <span className="h-3 w-14 rounded skeleton-bg"></span>
            <span className="h-4 w-16 rounded skeleton-bg"></span>
          </div>

          {/* قیمت */}
          <div className="flex justify-between items-center h-6">
            <span className="h-3 w-14 rounded skeleton-bg"></span>
            <span className="h-4 w-24 rounded skeleton-bg"></span>
          </div>

          {/* تاریخ */}
          <div className="flex justify-between items-center h-6">
            <span className="h-3 w-14 rounded skeleton-bg"></span>
            <span className="h-4 w-28 rounded skeleton-bg"></span>
          </div>
        </div>

        {/* Footer ثابت، بدون اسکلتون */}
        <div
          className="text-blue2 text-sm mt-3 cursor-default border-t pt-3 text-center border-gray21 font-bold text-[14px]"
        >
          جزئیات تراکنش
        </div>
      </div>
    ))}
  </div>
);




  return (
    <div dir="rtl">
      <div className="text-black1 flex lg:mb-4 font-medium lg:justify-between justify-end ">
        <h1 className="hidden lg:block font-medium text-[20px]">تاریخچه خرید و فروش</h1>
      </div>

      <div className="bg-white1 rounded-2xl lg:border lg:border-gray21 lg:p-6 text-black1 pt-8">

        {/* فیلترها */}
        <div className="hidden lg:flex flex-wrap gap-2 justify-start mb-8">
          <div className="flex items-center gap-1">
            <span className="text-gray12">فیلترها</span>
          </div>
          <div className="w-px h-6 bg-gray12 self-center"></div>

          <FilterDropdown
            id="status"
            label="وضعیت"
            options={statusOrderOptions}
            selected={selectedStatus}
            isOpen={openDropdown === "status"}
            onToggle={() => handleToggle("status")}
            onSelect={(_, option) => {
              setPage(1);
              setSelectedStatus(option);
            }}
          />

          <FilterDropdown
            id="type"
            label="نوع تراکنش"
            options={typeOrderOptions}
            selected={selectedFilterType}
            isOpen={openDropdown === "type"}
            onToggle={() => handleToggle("type")}
            onSelect={(_, option) => {
              setPage(1);
              setSelectedFilterType(option);
            }}
          />
        </div>

        {/* جدول دسکتاپ */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-7 bg-gray41 text-black1 text-right py-4 px-3 font-medium rounded-lg">
            <div className="px-10">ارز</div>
            <div className="text-center">مقدار</div>
            <div className="text-center">نوع</div>
            <div className="text-center">قیمت</div>
            <div className="text-center">وضعیت</div>
            <div className="text-center">تاریخ و زمان</div>
            <div className="text-center">جزئیات</div>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : mergedTransactions.length > 0 ? (
            <div className="divide-y divide-gray21">
              {mergedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="grid grid-cols-7 py-4 px-3 hover:bg-gray42 items-center text-sm"
                >
                  <div className="flex items-center gap-2 ">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont ? (
                        <i
                          className={`cf cf-${tx.symbol?.toLowerCase()} text-[35px]`}
                          style={{ color: tx.color ?? "" }}
                        />
                      ) : (
                        <img
                          src={tx.icon ? `https://api.payfa24.com/images/currency/${tx.icon}` : "/images/fallback-coin.png"}
                          className="w-full h-full"
                          alt={tx.symbol}
                        />
                      )}
                    </span>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="font-normal text-lg ">
                        {tx.locale?.fa?.name || tx.name}
                      </span>
                      <span className="font-normal text-sm text-gray-500">
                        {tx.symbol}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-center gap-2">
                    <span>{formatEnglishNumber(tx.amount_coin)}</span>
                    <span>{tx.symbol}</span>
                  </div>

                <div className="text-center font-normal text-base">
  <div
    className={`inline-flex items-center gap-1 w-[108px] h-[29px] justify-center rounded-[4px] ${
      tx.type === "buy" ? "bg-green8 text-green-600" : tx.type === "sell" ? "bg-red7 text-red6" : "bg-gray-200 text-gray-500"
    }`}
  >
    {tx.type === "buy" ? (
      <span className="w-5 h-5 icon-wrapper">
        <ReceivedIcon /> 
      </span>
    ) : tx.type === "sell" ? (
      <span className="w-5 h-5 icon-wrapper">
        <SendIcon /> 
      </span>
    ) : null}
    <span className="text-[14px] font-normal">
      {transactionTypeMap[tx.type ?? ""] || tx.type || "نامشخص"}
    </span>
  </div>
</div>


                  <div className="text-center font-normal text-base">
                    {formatPersianDigits(tx.amount)} تومان
                  </div>

                  <div className="text-center font-normal text-base">
                    <StatusBadge
                      text={
                        transactionStatusMap[tx.status ?? ""] ||
                        tx.status ||
                        "نامشخص"
                      }
                    />
                  </div>

                  <div className="text-center font-normal text-base">
                    {tx.dateTime ? convertDigitsToPersian(tx.dateTime) : "-"}
                  </div>

                  <div
                    className="text-blue2 cursor-pointer text-center font-normal text-base"
                    onClick={() => handleOpenModal(tx)}
                  >
                    جزئیات
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img
                src={TrasactionHisory}
                alt="بدون تراکنش"
                className="mb-3 dark:hidden mx-auto"
              />
              <img
                src={TransactionHistoryDark}
                alt="بدون تراکنش"
                className="mb-3 hidden dark:block mx-auto"
              />
              <p className="text-black1 text-lg font-medium">
                تاکنون تراکنشی نداشته‌اید!
              </p>
            </div>
          )}
        </div>

        {/* نسخه موبایل */}
        <div className="block lg:hidden space-y-4 lg:mt-4">
              {isLoading ? (
    <MobileSkeleton />
  ) : mergedTransactions.length > 0 ? (
            mergedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="border rounded-xl p-4 border-gray21"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 flex items-center justify-center object-cover">
                      {tx.isFont ? (
                        <i
                          className={`cf cf-${tx.symbol?.toLowerCase()} text-[28px]`}
                          style={{ color: tx.color ?? "" }}
                        />
                      ) : (
                        <img
                          src={tx.icon ? `https://api.payfa24.com/images/currency/${tx.icon}` : "/images/fallback-coin.png"}
                          className="w-8 h-8"
                          alt={tx.symbol}
                          onError={(e) => {
                            e.currentTarget.src = "/images/fallback-coin.png";
                          }}
                        />
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-black1">
                        {tx.locale?.fa?.name || tx.name}
                      </p>
                      <p className="text-xs text-gray-500">{tx.symbol}</p>
                    </div>
                  </div>

                  <StatusBadge
                    text={
                      transactionStatusMap[tx.status ?? ""] ||
                      tx.status ||
                      "نامشخص"
                    }
                  />
                </div>

                <div className="text-sm space-y-1 pt-5">
                  <p className="flex justify-between font-medium text-[12px]">
                    مقدار:
                    <span dir="ltr" className="flex pb-4 font-normal text-[14px]">
                      {formatEnglishNumber(tx.amount_coin)}
                      <span className="pl-1"> {tx.symbol}</span>
                    </span>
                   
                  </p>

                 <p className="flex justify-between font-medium text-[12px] pb-4">
  نوع:
  <div
    className={`inline-flex items-center gap-1 w-[108px] h-[29px] justify-center rounded-[4px] ${
      tx.type === "buy" ? "bg-green8 text-green-600" : tx.type === "sell" ? "bg-red7 text-red6" : "bg-gray-200 text-gray-500"
    }`}
  >
    {tx.type === "buy" ? (
      <span className="w-5 h-5 icon-wrapper">
        <ReceivedIcon />
      </span>
    ) : tx.type === "sell" ? (
      <span className="w-5 h-5 icon-wrapper">
        <SendIcon />
      </span>
    ) : null}
    <span className=" text-[14px] font-normal">{transactionTypeMap[tx.type ?? ""] || tx.type || "-"}</span>
  </div>
</p>


                  <p className="flex justify-between font-medium text-[12px]">
                    قیمت کل:
                    <span className="pb-4 font-normal text-[14px]">
                      {formatPersianNumber(tx.amount)} تومان
                    </span>
                  </p>

                  <p className="flex justify-between font-medium text-[12px]">
                    تاریخ:
                    <span className="pb-4 font-normal text-[14px]">
                      {tx.dateTime ? convertDigitsToPersian(tx.dateTime) : "-"}
                    </span>
                  </p>
                </div>

                <div
                  className="text-blue-600 text-sm mt-3 cursor-pointer border-t pt-3 text-center border-gray21 font-bold text-[14px]"
                  onClick={() => handleOpenModal(tx)}
                >
                  جزئیات تراکنش
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
              <img
                src={TrasactionHisory}
                alt="بدون تراکنش"
                className="mb-3 dark:hidden w-32 h-32 mx-auto"
              />
              <img
                src={TransactionHistoryDark}
                alt="بدون تراکنش"
                className="mb-3 hidden dark:block w-32 h-32 mx-auto"
              />
              <p className="text-black1 text-base">
                تاکنون تراکنشی نداشته‌اید!
              </p>
            </div>
          )}
        </div>
      </div>

      {mergedTransactions.length > 0 && !isLoading && (
        <Pagination
          current={page}
          total={Math.ceil((totalPages ?? 0) / 15)}
          onPageChange={setPage}
        />
      )}

      {/* مودال */}
      {selectedTx && (
        <TransactionModalOrder
          key={selectedTx.id}
          tx={selectedTx.fullData}
          onClose={() => setSelectedTx(null)}
          coinData={
            selectedTx.coin && selectedTx.coin.symbol
              ? mappedGeneralData[selectedTx.coin.symbol]
              : undefined
          }
        />
      )}
    </div>
  );
};

export default OrderPage;
