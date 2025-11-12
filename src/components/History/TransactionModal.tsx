import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
export interface OrderDetail {
  id: string;
  amount?: string;
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
  dateTime?: string;
}
export interface CryptoDetail {
  id: string;
  date?: string;
  amount?: string;
  amountToman?: string;
  symbol?: string;
  description?: string;
  destination?: string;
  destinationTag?: string;
  file?: string;
  network?: string;
  reason?: string;
  status?: string;
  stock?: string;
  txid?: string;
  type?: string;
  fee?: number;
  withdrawFee?: string;
  source: "crypto";
  image?: string;
  faName?: string;
  currencyIcon?: string;
  currencySymbol?: string;
  color?: string | null;
  isFont?: boolean;
  icon?: string | null;
}
export interface FiatDetail {
  id: string;
  date?: string;
  PaymentGateway?: string;
  amount?: string;
  accountNumber?: string;
  cardNumber?: string;
  iban?: string;
  description?: string;
  idInternalcurrency?: string;
  idOrder?: string;
  idTrade?: string;
  payment?: string;
  reason?: string;
  status?: string;
  stock?: string;
  traceNumber?: string;
  type?: string;
  uuid?: string;
  source: "fiat";
  image?: string;
  faName?: string;
  currencyIcon?: string;
  currencySymbol?: string;
}
export type TransactionDetail = (OrderDetail | CryptoDetail | FiatDetail) & {
  isFont?: boolean;
  color?: string | null;
  icon?: string | null;
  symbol?: string | null;
};

interface TransactionModalProps {
  tx: TransactionDetail;
  onClose: () => void;
  visibleFields?: string[];
}
const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TransactionDetail | null>(null);
  useEffect(() => {
    if (!tx.id || !tx.source) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        let url = "";
        switch (tx.source) {
          case "order":
            url = `/history/orders/${tx.id}`;
            break;
          case "crypto":
            url = `/history/crypto-transaction/${tx.id}`;
            break;
          case "fiat":
            url = `/history/fiat/${tx.id}`;
            break;
        }
        if (tx.source === "order") { 
          await apiRequest<{ order: OrderDetail }>({ url, method: "GET" });
          if (tx.source === "order") {
            const res = await apiRequest<{ order: OrderDetail }>({ url, method: "GET" });
            if (res.order) {
              setDetail({
                ...res.order,
                uVoucher: res.order.uVoucher || res.order.data?.uVoucher, 
                source: "order",
                date: res.order.dateTime,
              });
            }
          }
        } else if (tx.source === "crypto") {
          const res = await apiRequest<{ transaction: CryptoDetail }>({ url, method: "GET" });
          if (res.transaction) {
            setDetail({ ...res.transaction, source: "crypto" });
          }
        } else if (tx.source === "fiat") {
          const res = await apiRequest<{ transaction: FiatDetail }>({ url, method: "GET" });
          if (res.transaction) {
            setDetail({ ...res.transaction, source: "fiat" });
          }
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
  if (!tx) return null;

  if (tx.isFont) {
    return (
      <i
        className={`cf cf-${tx.symbol?.toLowerCase()} ${size} text-[55px]`}
        style={{ color: tx.color ?? "" }}
      />
    );
  }

  return (
    <img
      src={
        tx.icon
          ? `https://api.payfa24.org/images/currency/${tx.icon}`
          : tx.image || "/images/fallback-coin.png"
      }
      alt={tx.symbol || ""}
      className={`${size} rounded-full object-cover`}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png";
      }}
    />
  );
};




  const convertDigitsToPersian = (str: string) => {
    return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  };
  if (!tx?.id) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="bg-white8 rounded-2xl p-8 w-[90%] max-w-md relative shadow-xl text-black0 dark:text-white transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-4 ">
          <h2 className="font-semibold text-lg">جزئیات تراکنش</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition w-7">
            <IconClose />
          </button>
        </div>
        <div className="min-h-[200px] ">
          {loading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-full skeleton-bg mx-auto" />
              <div className="h-6 w-32 rounded-md skeleton-bg mx-auto" />
              <div className="h-4 w-20 rounded-md skeleton-bg mx-auto" />
              <div className="grid grid-cols-1 gap-3 mt-6 w-full">
               {(() => {
               const widths = [
    { label: "20%", value: "30%" },
    { label: "20%", value: "35%" },
    { label: "30%", value: "30%" },
    { label: "35%", value: "30%" },
    { label: "15%", value: "40%" },
    { label: "25%", value: "20%" },
  ];

  return Array.from({ length: 9 }).map((_, i) => {
    const { label, value } = widths[i % widths.length]; 
    return (
      <div key={i} className="flex justify-between items-center pb-2">
        <div
          className="h-5 rounded-md skeleton-bg"
          style={{ width: label }}
        />
        <div
          className="h-5 rounded-md skeleton-bg"
          style={{ width: value }}
        />
      </div>
    );
  });
})()}


              </div>
            </div>
          ) : detail ? (
            <>
              <div className="flex flex-col items-center mb-10 ">
  {renderIcon("w-20 h-20")}
  <h3 className="font-medium text-[24px] mt-3 text-black1">
    {tx.faName || ("name" in detail ? detail.name : undefined) || "ارز نامشخص"}
  </h3>
  {"symbol" in detail && detail.symbol && (
    <span className="text-sm text-gray-500 dark:text-gray-400">{detail.symbol}</span>
  )}
</div>

              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && <DetailRow label="وضعیت" value={<StatusBadge text={transactionStatusMap[detail.status] || detail.status} />} />}
                {detail.id && <DetailRow label="شناسه تراکنش" value={convertDigitsToPersian(`${detail.id}`)} />}
                {(detail.date || (detail as any).DateTime) && <DetailRow label="تاریخ تراکنش" value={convertDigitsToPersian(detail.date || (detail as any).DateTime)} />}
                {detail.type && <DetailRow label="نوع" value={transactionTypeMap[detail.type] || detail.type} />}
                {detail.amount !== undefined && detail.amount !== null && <DetailRow label="مبلغ" value={convertDigitsToPersian(`${detail.amount}`)} symbol="تومان" />}
                {"amountCoin" in detail && detail.amountCoin !== undefined && detail.amountCoin !== null && (
                  <DetailRow label="مقدار ارز" value={convertDigitsToPersian(`${detail.amountCoin}`)} />
                )}
                {/* کارمزد */}
                {"wage" in detail && detail.wage !== undefined && detail.wage !== null && <DetailRow label="کارمزد" value={formatPersianDigits(detail.wage)} />}

                {/* قیمت */}
                {"fee" in detail && detail.fee !== undefined && detail.fee !== null && <DetailRow label="قیمت" value={formatPersianDigits(detail.fee)} symbol={detail.symbol} />}

                {/* موجودی پس از تراکنش */}
                {"stock" in detail && detail.stock !== undefined && detail.stock !== null && (
                  <DetailRow label="موجودی پس از تراکنش" value={formatPersianDigits(detail.stock)} symbol="تومان" />
                )}
                {/*  توضیحات */}
                {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
                {"network" in detail && detail.network && <DetailRow label="شبکه" value={detail.network} />}
                {"txid" in detail && detail.txid && <DetailRow label="TXID" value={detail.txid} isCopyable />}
                {"iban" in detail && detail.iban && <DetailRow label="شماره شبا" value={detail.iban} />}
                {"cardNumber" in detail && detail.cardNumber && <DetailRow label="شماره کارت" value={detail.cardNumber} />}
                {"uVoucher" in detail && detail.uVoucher && <DetailRow label="uVoucher" value={detail.uVoucher} />}
                {"Code" in detail && detail.Code && <DetailRow label="کد ووچرز" value={detail.Code} />}
                {"Memo" in detail && detail.Memo && <DetailRow label="Memo" value={detail.Memo} />}
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


const DetailRow = ({
  label,
  value,
  symbol,
}:
{
  label: string;
  value: React.ReactNode;
  symbol?: string;
  isCopyable?: boolean;
}) => (
  <div className="flex justify-between items-center ">
    <span className="font-medium text-[16px] text-gray5">{label}:</span>
    <div className="flex items-end justify-end gap-1 min-w-[120px] text-right">
      <span className={`break-words ${typeof value === "string" && value.length > 20 ? "break-all" : ""}`}>{value}</span>
      {symbol && <span>{symbol}</span>}
    </div>
  </div>
);

export default TransactionModal;
