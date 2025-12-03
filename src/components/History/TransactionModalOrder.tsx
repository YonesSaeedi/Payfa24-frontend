import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatEnglishNumber, formatPersianNumber } from "../../utils/formatPersianNumber";
import { Tx } from "./CryptoPage";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { ListDigitalCoin } from "../../constants/ListdigitalCoins";
import { UnifiedCoin } from "../../types/crypto";
import IconCopy from "../../assets/icons/AddFriend/IconCopy"; 
import { toast } from "react-toastify";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";

export interface OrderDetail {
  id: number;
  type?: string;
  amount?: number;
  amount_coin?: number;
  wage?: number;
  fee?: number;
  description?: string;
  status?: string;
  dateTime?: string;
  internal?: string;
  coin?: {
    name?: string;
    faName?: string;
    symbol?: string;
    icon?: string;
    isFont?: boolean;
    color?: string | null;
  };
  data?: Record<string, any> | null;
}

interface TransactionModalOrderProps {
  tx: Tx;
  onClose: () => void;
  coinData?: OrderDetail["coin"];
}

const SkeletonRow = () => (
  <div className="flex justify-between items-center animate-pulse">
    <span className="w-24 h-4 rounded-md skeleton-bg"></span>
    <span className="w-32 h-4 rounded-md skeleton-bg"></span>
  </div>
);

const TransactionModalOrder: React.FC<TransactionModalOrderProps> = ({ tx, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OrderDetail | null>(null);

  const { data: generalData } = useGetGeneralInfo();

  const mappedGeneralData = React.useMemo(() => {
    return (
      generalData?.cryptocurrency?.reduce((acc, item) => {
        acc[item.symbol] = item;
        return acc;
      }, {} as Record<string, typeof generalData.cryptocurrency[0]>) ?? {}
    );
  }, [generalData]);

  useEffect(() => {
    if (!tx?.id) return;

    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const res = await apiRequest<{ order: OrderDetail }>({
          url: `/history/orders/${tx.id}`,
          method: "GET",
        });

        if (res.order) {
          const localCoin = ListDigitalCoin.find(
            (item) => item.symbol.toLowerCase() === (tx.symbol?.toLowerCase() || "")
          );
          const coinSource = (localCoin || mappedGeneralData[tx.symbol || ""]) as UnifiedCoin;

          const mergedCoin: OrderDetail["coin"] = {
            name: coinSource?.name ?? res.order.coin?.name,
            faName:
              coinSource?.locale?.fa?.name ??
              res.order.coin?.faName ??
              res.order.coin?.name,
            symbol: coinSource?.symbol ?? res.order.coin?.symbol,
            icon: coinSource?.icon ?? res.order.coin?.icon ?? "/images/fallback-coin.png",
            isFont: coinSource?.isFont ?? res.order.coin?.isFont ?? false,
            color: coinSource?.color ?? res.order.coin?.color ?? null,
          };

          setDetail({
            ...res.order,
            coin: mergedCoin,
          });
        }
      } catch (err) {
        console.error("خطا در دریافت جزئیات سفارش:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [tx, mappedGeneralData]);

  const convertDigitsToPersian = (str: string | number) =>
    String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

  const getVoucherCode = () => detail?.data?.uVoucher ?? detail?.data?.Code ?? null;

  const renderCoinIcon = (size = "w-20 h-20") => {
    if (!detail?.coin) return null;
    const coin = detail.coin;

    const localCoin = ListDigitalCoin.find(
      (item) => item.symbol.toLowerCase() === (coin.symbol?.toLowerCase() || "")
    );

    const src = localCoin?.icon
      ? `https://api.payfa24.org/images/currency/${localCoin.icon}`
      : coin.symbol
      ? `https://api.payfa24.org/images/currency/${coin.symbol.toLowerCase()}.png`
      : "/images/fallback-coin.png";

    return (
      <span className={`${size} rounded-full flex items-center justify-center`}>
        {coin.isFont && coin.symbol ? (
          <i
            className={`cf cf-${coin.symbol.toLowerCase()}`}
            style={{
              fontSize: size.includes("w-20") ? "55px" : "28px",
              color: coin.color ?? "",
            }}
          />
        ) : (
          <img
            src={src}
            alt={coin.faName ?? coin.symbol ?? ""}
            className="object-contain rounded-full"
            onError={(e) => (e.currentTarget.src = "/images/fallback-coin.png")}
          />
        )}
      </span>
    );
  };


const handleCopyVoucher = (voucher?: string) => {
  if (!voucher) return;
  navigator.clipboard.writeText(voucher);
  toast.info("کد ووچر کپی شد.");
};

  if (!tx?.id) return null;

 


  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white8 rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl text-black0 dark:text-white transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-4">
          <h2 className="font-semibold text-lg">جزئیات سفارش</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-blue2 transition w-7">
            <IconClose />
          </button>
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <>
              <div className="flex flex-col items-center mb-8 animate-pulse">
                <div className="w-20 h-20 rounded-full skeleton-bg mx-auto" />
                <div className="h-6 w-32 rounded-md skeleton-bg mt-3" />
                <div className="h-4 w-20 rounded-md mt-2" />
              </div>

              <div className="grid grid-cols-1 gap-6 text-sm">
                {Array.from({ length: 9 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </>
          ) : detail ? (
            <>
              <div className="flex flex-col items-center mb-8">
                {renderCoinIcon()}
                <h3 className="font-medium text-[24px] mt-3 text-black1">
                  {detail.coin?.faName}
                </h3>
                {detail.coin?.symbol && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {detail.coin.symbol}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && (
                  <DetailRow
                    label="وضعیت"
                    value={<StatusBadge text={transactionStatusMap[detail.status] ?? detail.status} />}
                  />
                )}
                {detail.type && (
                  <DetailRow label="نوع سفارش" value={transactionTypeMap[detail.type] ?? detail.type} />
                )}
                {detail.id && <DetailRow label="شناسه سفارش" value={convertDigitsToPersian(detail.id)} />}
                {detail.dateTime && (
                  <DetailRow label="تاریخ و زمان" value={convertDigitsToPersian(detail.dateTime)} />
                )}
                
                {detail.amount_coin !== undefined && (
                  <DetailRow
                    label="تعداد"
                    value={formatEnglishNumber(detail.amount_coin)}
                    symbol={detail.coin?.symbol}
                  />
                )}
                {detail.fee !== undefined && (
                  <DetailRow
                    label="قیمت واحد"
                    value={formatPersianNumber(detail.fee)}
                    symbol="تومان"
                  />
                )}
                {detail.amount !== undefined && (
                  <DetailRow
                    label="قیمت کل"
                    value={formatPersianNumber(detail.amount)}
                    symbol="تومان"
                  />
                )}
                {detail.wage !== undefined && (
  <DetailRow
    label="کارمزد"
    value={
      detail.type === "sell"
        ? convertDigitsToPersian(detail.wage) 
        : formatEnglishNumber(detail.wage)   
    }
    symbol={detail.type === "sell" ? "تومان" : detail.coin?.symbol} 
  />
)}

                 {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
       {getVoucherCode() && (
  <DetailRow
    label="کد ووچر"
    value={
      <div className="flex items-center  w-full">
        <span dir="ltr" className="truncate w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {getVoucherCode()}
        </span>

        <button
          onClick={() => handleCopyVoucher(getVoucherCode())}
          className="text-gray-500 mr-1 hover:text-blue2 transition w-5 h-5 flex-shrink-0"
        >
          <IconCopy />
        </button>
      </div>
    }
  />
)}

               
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              داده‌ای برای نمایش وجود ندارد
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  symbol,
}: {
  label: string;
  value: React.ReactNode;
  symbol?: string;
}) => {
 
  if (label === "نوع سفارش" && typeof value === "string") {
    const normalizedType = value.toLowerCase();
    const isBuy = normalizedType === "buy" || normalizedType === "خرید";
    const isSell = normalizedType === "sell" || normalizedType === "فروش";

    const bgClass = isBuy ? "bg-green8" : isSell ? "bg-red7" : "bg-gray21";
    const textClass = isBuy ? "text-green-600" : isSell ? "text-red6" : "text-gray-500";

    return (
      <div className="flex justify-between items-center">
        <span className="font-medium text-[16px] text-gray5">{label}:</span>
        <div className={`inline-flex items-center gap-1 w-[108px] h-[29px] justify-center rounded-[4px] ${bgClass} ${textClass}`}>
          {isBuy &&  <span className="w-5 h-5 icon-wrapper">
                 <ReceivedIcon />
            </span>}
          {isSell &&<span className="w-5 h-5 icon-wrapper">
        <SendIcon />
      </span>}
          <span className="text-[14px] font-normal">{transactionTypeMap[value] || value}</span>
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-[16px] text-gray5 whitespace-nowrap">{label}:</span>
      <div className="flex items-end justify-end gap-1 min-w-[120px] text-left">
        <div className="flex items-center justify-end gap-1 min-w-[120px] text-left">
          {value}
          {symbol && <span>{symbol}</span>}
        </div>
      </div>
    </div>
  );
};



export default TransactionModalOrder;
