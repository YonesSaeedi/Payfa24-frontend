import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";

import { formatPersianNumber } from "../../utils/formatPersianNumber";

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
   DateTime?:string;
}

interface TransactionModalFiatProps {
  tx: { id: string; source: "fiat" };
  onClose: () => void;
}

const TransactionModalFiat: React.FC<TransactionModalFiatProps> = ({ tx, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<FiatDetail | null>(null);

  useEffect(() => {
    if (!tx.id) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const url = `/history/fiat/${tx.id}`;
        const res = await apiRequest<{ transaction: FiatDetail }>({ url, method: "GET" });
        if (res.transaction) {
          setDetail({ ...res.transaction, source: "fiat",  DateTime: res.transaction.DateTime, });
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
    return (
      <img
        src={detail.image || "/images/fallback-coin.png"}
        alt={detail.currencySymbol || ""}
        className={`${size} rounded-full object-cover`}
        
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
                  {detail.faName || detail.currencySymbol || "ارز نامشخص"}
                </h3>
                {detail.currencySymbol && <span className="text-sm text-gray-500 dark:text-gray-400">{detail.currencySymbol}</span>}
              </div>
              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && <DetailRow label="وضعیت" value={<StatusBadge text={transactionStatusMap[detail.status] || detail.status} />} />}
                {detail.id && <DetailRow label="شناسه تراکنش" value={convertDigitsToPersian(`${detail.id}`)} />}
                {detail.DateTime && <DetailRow label="تاریخ تراکنش" value={convertDigitsToPersian(detail.DateTime)} />}
                {detail.type && <DetailRow label="نوع" value={transactionTypeMap[detail.type] || detail.type} />}
                {detail.amount && <DetailRow label="مقدار" value={detail.amount} symbol={detail.currencySymbol} />}
                {detail.payment && <DetailRow label="پرداخت" value={formatPersianNumber(detail.payment)} symbol="تومان" />}
                {detail.stock && <DetailRow label="موجودی پس از تراکنش" value={formatPersianNumber(detail.stock)} symbol="تومان" />}
                {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
                {detail.PaymentGateway && <DetailRow label="درگاه پرداخت" value={detail.PaymentGateway} />}
                {detail.accountNumber && <DetailRow label="شماره حساب" value={detail.accountNumber} />}
                {detail.cardNumber && <DetailRow label="شماره کارت" value={detail.cardNumber} />}
                {detail.iban && <DetailRow label="IBAN" value={detail.iban} />}
                {detail.traceNumber && <DetailRow label="شماره پیگیری" value={detail.traceNumber} />}
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

export default TransactionModalFiat;
