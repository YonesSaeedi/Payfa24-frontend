import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

// export interface OrderDetail {
//   id: string;
//   amount?: string | null;
//   amount_coin?: string | null;
//   amountCoin?: string | null;
//   name?: string;
//   symbol?: string;
//   uVoucher?: string;
//   dateTime?: string;
//   description?: string;
//   fee?: string | number;
//   status?: string;
//   type?: string;
//   wage?: string | number;
//   source: "order";
//   coin?: { symbol?: string } | null;
//   image?: string;
//   faName?: string;
// }
export interface OrderDetail {
  id: string;
  amount?: string;
  amount_coin?: string;
  amountCoin?: string;
  name?: string;
  symbol?: string;
  uVoucher?: string;
  Code?: string;
  Memo?: string;
  Amount?: string;
  date?: string;
  description?: string;
  fee?: string;
  status?: string;
  type?: string;
  wage?: string;
  source: "order";
  image?: string;
  faName?: string;
  currencyIcon?: string;
  currencySymbol?: string;
  data?: { uVoucher?: string };

  coin?: { symbol?: string };   
  dateTime?:string;
  isFont?: boolean;
  icon?: string;
  color?: string;
}


interface TransactionModalOrderProps {
  tx: { id: string; source: "order" };
  onClose: () => void;
}

const TransactionModalOrder: React.FC<TransactionModalOrderProps> = ({ tx, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OrderDetail | null>(null);

  useEffect(() => {
    if (!tx.id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const url = `/history/orders/${tx.id}`;
        const res = await apiRequest<{ order: OrderDetail }>({ url, method: "GET" });
        if (res.order) {
          setDetail({
            ...res.order,
            uVoucher: res.order.uVoucher || res.order.uVoucher,
            amountCoin: res.order.amount_coin,
            symbol: res.order.coin?.symbol,
            source: "order",
          
          });
        }
      } catch (err) {
        console.error("خطا در دریافت جزئیات تراکنش:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [tx]);

  
const renderIcon = (size = "w-20 h-20") => {
  if (!detail) return null;

  // اگر فونت باشد
  if (detail.isFont) {
    return (
      <i
        className={`cf cf-${detail.symbol?.toLowerCase()} ${size} text-[55px]`}
        style={{ color: detail.color ?? "" }}
      />
    );
  }

  // اگر تصویر باشد
  return (
    <img
      src={
        detail.icon
          ? `https://api.payfa24.org/images/currency/${detail.icon}`
          : detail.image || "/images/fallback-coin.png"
      }
      alt={detail.faName || detail.symbol || ""}
      className={`${size} rounded-full object-cover`}
      onError={(e) => {
        // اگر تصویر اصلی لود نشد، تصویر پیش‌فرض نمایش داده شود
        (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png";
      }}
    />
  );
};




  const convertDigitsToPersian = (str: string) => str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

  if (!tx?.id) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white8 rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl text-black0 dark:text-white transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-4">
          <h2 className="font-semibold text-lg">جزئیات تراکنش</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-blue2 transition w-7">
            <IconClose />
          </button>
        </div>
        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-full skeleton-bg mx-auto" />
              <div className="h-6 w-32 rounded-md skeleton-bg mx-auto" />
              <div className="h-4 w-20 rounded-md skeleton-bg mx-auto" />
            </div>
          ) : detail ? (
            <>
              <div className="flex flex-col items-center mb-10">
                {renderIcon()}
                <h3 className="font-medium text-[24px] mt-3 text-black1">
                  {detail.faName || detail.name || "ارز نامشخص"}
                </h3>
                {detail.symbol && <span className="text-sm text-gray-500 dark:text-gray-400">{detail.symbol}</span>}
              </div>
              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && <DetailRow label="وضعیت" value={<StatusBadge text={transactionStatusMap[detail.status] || detail.status} />} />}
                {detail.id && <DetailRow label="شناسه تراکنش" value={convertDigitsToPersian(`${detail.id}`)} />}
                {detail.dateTime && <DetailRow label="تاریخ تراکنش" value={convertDigitsToPersian(detail.dateTime)} />}
                {detail.type && <DetailRow label="نوع" value={transactionTypeMap[detail.type] || detail.type} />}
                {detail.amount && <DetailRow label="مقدار" value={detail.amount} symbol={detail.symbol} />}
                {detail.amountCoin && <DetailRow label="مقدار ارز" value={detail.amountCoin} symbol={detail.symbol} />}
                {detail.fee && <DetailRow label="کارمزد" value={formatPersianDigits(detail.fee)} symbol={detail.symbol} />}
                {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">داده‌ای برای نمایش وجود ندارد</div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, symbol }: { label: string; value: React.ReactNode; symbol?: string }) => (
  <div className="flex justify-between items-center">
    <span className="font-medium text-[16px] text-gray5">{label}:</span>
    <div className="flex items-end justify-end gap-1 min-w-[120px] text-right">
      <span className={`break-words ${typeof value === "string" && value.length > 20 ? "break-all" : ""}`}>{value}</span>
      {symbol && <span>{symbol}</span>}
    </div>
  </div>
);

export default TransactionModalOrder;
