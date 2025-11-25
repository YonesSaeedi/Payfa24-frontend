import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatPersianDigits } from "../../utils/formatPersianDigits";

export interface CryptoDetail {
  id: string;
  date?: string;
  amount?: string;
  amount_toman?: string | null;
  symbol?: string;
  description?: string;
  destination?: string;
  destinationTag?: string;
  file?: string;
  network?: string | null;
  reason?: string;
  status?: string;
  stock?: string | null;
  txid?: string;
  type?: string;
  fee?: number;
  withdrawFee?: string | null;
  source: "crypto";
  image?: string;
  faName?: string;
  currencyIcon?: string;
  currencySymbol?: string;
  color?: string | null;
  isFont?: boolean;
  icon?: string | null;
  DateTime?:string;
}

interface TransactionModalCryptoProps {
  tx: { id: string; source: "crypto" };
  onClose: () => void;
  coinData?: {
    faName?: string;
    icon?: string;
    isFont?: boolean;
    color?: string | null;
  };
}

const TransactionModalCrypto: React.FC<TransactionModalCryptoProps> = ({ tx, onClose, coinData }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CryptoDetail | null>(null);

useEffect(() => {
  if (!tx.id) return;

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const url = `/history/crypto-transaction/${tx.id}`;
      const res = await apiRequest<{ transaction: CryptoDetail }>({ url, method: "GET" });

      console.log("API response for tx", tx.id, res); 

      if (res.transaction) {
        const mergedDetail: CryptoDetail = {
          ...res.transaction,
          source: "crypto",
          faName: coinData?.faName || res.transaction.faName || res.transaction.symbol || "ارز نامشخص",
          color: coinData?.color ?? res.transaction.color ?? null,
          isFont: coinData?.isFont ?? res.transaction.isFont ?? false,
          icon: res.transaction.icon ?? coinData?.icon ?? null,
        };

        mergedDetail.image = mergedDetail.icon
          ? `https://api.payfa24.org/images/currency/${mergedDetail.icon}`
          : "/images/fallback-coin.png";

        console.log("Merged detail", mergedDetail); 

        setDetail(mergedDetail);
      }
    } catch (err) {
      console.error("خطا در دریافت جزئیات تراکنش:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDetails();
}, [tx, coinData]);

const renderIcon = (size = "w-20 h-20") => {
  if (!detail) return null;

  if (detail.isFont) {
    return (
      <i
        className={`cf cf-${detail.symbol?.toLowerCase()} ${size} text-[55px]`}
        style={{ color: detail.color ?? "" }}
      />
    );
  }

  return (
    <img
      src={detail.image} // مسیر آماده شده از قبل
      alt={detail.faName || detail.symbol || ""}
      className={`${size} rounded-full object-cover`}
    
    />
  );
};



  const convertDigitsToPersian = (str: string) =>
    str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

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
          <h2 className="font-semibold text-lg">جزئیات تراکنش</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-blue2 transition w-7"
          >
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
                  {detail.faName || detail.symbol || "ارز نامشخص"}
                </h3>
                {detail.symbol && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {detail.symbol}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && (
                  <DetailRow
                    label="وضعیت"
                    value={
                      <StatusBadge
                        text={
                          transactionStatusMap[detail.status] || detail.status
                        }
                      />
                    }
                  />
                )}
                {detail.id && (
                  <DetailRow
                    label="شناسه تراکنش"
                    value={convertDigitsToPersian(`${detail.id}`)}
                  />
                )}
                {detail.DateTime && (
                  <DetailRow
                    label="تاریخ تراکنش"
                    value={convertDigitsToPersian(detail.DateTime)}
                  />
                )}
                {detail.type && (
                  <DetailRow
                    label="نوع"
                    value={transactionTypeMap[detail.type] || detail.type}
                  />
                )}
                {detail.amount && (
                  <DetailRow
                    label="مقدار"
                    value={detail.amount}
                    symbol={detail.symbol}
                  />
                )}
                {detail.amount_toman && (
                  <DetailRow
                    label="مبلغ به تومان"
                    value={formatPersianDigits(detail.amount_toman)}
                    symbol="تومان"
                  />
                )}
                {detail.fee && (
                  <DetailRow
                    label="کارمزد"
                    value={formatPersianDigits(detail.fee)}
                    symbol={detail.symbol}
                  />
                )}
                {detail.withdrawFee && (
                  <DetailRow
                    label="کارمزد برداشت"
                    value={detail.withdrawFee}
                    symbol={detail.symbol}
                  />
                )}
                {detail.stock && (
                  <DetailRow
                    label="موجودی پس از تراکنش"
                    value={formatPersianDigits(detail.stock)}
                    symbol={detail.symbol}
                  />
                )}
                {detail.description && (
                  <DetailRow label="توضیحات" value={detail.description} />
                )}
                {detail.destination && (
                  <DetailRow label="آدرس مقصد" value={detail.destination} />
                )}
                {detail.destinationTag && (
                  <DetailRow
                    label="Destination Tag"
                    value={detail.destinationTag}
                  />
                )}
                {detail.network && (
                  <DetailRow label="شبکه" value={detail.network} />
                )}
                {detail.txid && <DetailRow label="TXID" value={detail.txid} />}
                {detail.reason && <DetailRow label="دلیل" value={detail.reason} />}
                {detail.file && <DetailRow label="فایل" value={detail.file} />}
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
}) => (
  <div className="flex justify-between items-center">
    <span className="font-medium text-[16px] text-gray5">{label}:</span>
    <div className="flex items-end justify-end gap-1 min-w-[120px] text-right">
      <span
        className={`break-words ${
          typeof value === "string" && value.length > 20 ? "break-all" : ""
        }`}
      >
        {value}
      </span>
      {symbol && <span>{symbol}</span>}
    </div>
  </div>
);

export default TransactionModalCrypto;
