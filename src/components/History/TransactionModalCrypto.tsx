import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { Tx } from "./CryptoPage";
import ReceivedIcon from "../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../assets/icons/Home/WalletCardIcon/SendIcon";
import { formatEnglishNumber } from "../../utils/formatPersianNumber";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import { toast } from "react-toastify";



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
  DateTime?: string;
}

interface TransactionModalCryptoProps {
  tx: Tx;
  onClose: () => void;
  coinData?: {
    faName?: string;
    icon?: string;
    isFont?: boolean;
    color?: string | null;
    symbol?: string;
  };
}

const TransactionModalCrypto: React.FC<TransactionModalCryptoProps> = ({ tx, onClose, coinData }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<CryptoDetail | null>(null);
  const [copied, setCopied] = useState(false);

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.info("لینک کپی شد");

    setTimeout(() => setCopied(false), 1200);
  } catch {
    toast.error("خطا در کپی کردن");
  }
};

  useEffect(() => {
    if (!tx.id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const url = `/history/crypto-transaction/${tx.id}`;
        const res = await apiRequest<{ transaction: CryptoDetail }>({ url, method: "GET" });

        if (res.transaction) {
          const mergedDetail: CryptoDetail = {
            ...res.transaction,
            source: "crypto",
            symbol: coinData?.symbol || res.transaction.symbol || "unknown",
            faName: coinData?.faName || tx.faName || res.transaction.faName || res.transaction.symbol || "ارز نامشخص",
            color: coinData?.color ?? res.transaction.color ?? null,
            isFont: coinData?.isFont ?? res.transaction.isFont ?? false,
            icon: coinData?.icon ?? res.transaction.icon ?? null,
          };

          mergedDetail.image = mergedDetail.icon
            ? `https://api.payfa24.org/images/currency/${mergedDetail.icon}`
            : "/images/fallback-coin.png";

          setDetail(mergedDetail);
        }
      } catch (err) {
         // خطا نادیده گرفته شد
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [tx, coinData]);

  const renderIcon = (size = "w-20 h-20") => {
    if (!detail) return null;

    return (
      <span className={`${size} rounded-full flex items-center justify-center`}>
        {detail.isFont && detail.symbol ? (
          <i
            className={`cf cf-${detail.symbol.toLowerCase()}`}
            style={{
              color: detail.color ?? "",
              fontSize: size.includes("w-20") ? "55px" : "28px",
            }}
          />
        ) : (
          <img
            src={detail.icon ? `https://api.payfa24.org/images/currency/${detail.icon}` : "/images/fallback-coin.png"}
            alt={detail.faName ?? detail.symbol ?? ""}
            className="object-contain rounded-full"
            onError={(e) => (e.currentTarget.src = "/images/fallback-coin.png")}
          />
        )}
      </span>
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
          <button onClick={onClose} className="text-gray-500 hover:text-blue2 transition w-7">
            <IconClose />
          </button>
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center gap-6 animate-pulse">
              <div className="w-24 h-24 rounded-full skeleton-bg" />
              <div className="h-6 w-36 rounded-md skeleton-bg" />
              <div className="h-4 w-20 rounded-md skeleton-bg" />

              <div className="w-full mt-6 flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-28 h-4 skeleton-bg rounded-md" />
                    <div className="w-24 h-4 skeleton-bg rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ) : detail ? (
            <>
              <div className="flex flex-col items-center mb-10">
                {renderIcon()}
                <h3 className="font-medium text-[24px] mt-3 text-black1">
                  {detail.faName || detail.symbol || "ارز نامشخص"}
                </h3>
                {detail.symbol && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{detail.symbol}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 text-sm">
                {detail.status && <DetailRow label="وضعیت" value={<StatusBadge text={transactionStatusMap[detail.status] || detail.status} />} />}
                {detail.type && <DetailRow label="نوع" value={transactionTypeMap[detail.type] || detail.type} />}
                {detail.id && <DetailRow label="شناسه تراکنش" value={convertDigitsToPersian(`${detail.id}`)} />}
                {detail.DateTime && <DetailRow label="تاریخ تراکنش" value={convertDigitsToPersian(detail.DateTime)} />}
                
                {detail.amount && <DetailRow label="مقدار" value={detail.amount} symbol={detail.symbol} />}
                {detail.amount_toman && <DetailRow label="مبلغ به تومان" value={formatPersianDigits(detail.amount_toman)} symbol="تومان" />}
                {detail.fee && <DetailRow label="کارمزد" value={formatPersianDigits(detail.fee)} symbol={detail.symbol} />}
                {detail.withdrawFee && <DetailRow label="کارمزد برداشت" value={detail.withdrawFee} symbol={detail.symbol} />}
                {detail.stock && <DetailRow label="موجودی پس از تراکنش" value={formatEnglishNumber(detail.stock)} symbol={detail.symbol} />}
                {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
                {detail.destination && <DetailRow label="آدرس مقصد" value={detail.destination} />}
                {detail.destinationTag && <DetailRow label="Destination Tag" value={detail.destinationTag} />}
                {detail.network && <DetailRow label="شبکه" value={detail.network} />}
    {detail.txid && (
  <DetailRow
    label="TXID"
    value={
      <div className="flex items-center  max-w-[300px]">
        <span className="break-all text-[13px] leading-5">{detail.txid}</span>

        <span
          onClick={() => handleCopy(detail.txid!)}
          className={`cursor-pointer  transition w-8 h-8 mr-2 ${
            copied ? "text-blue-500 scale-110" : "text-gray-600"
          }`}
        >
         <IconCopy />
          
        </span>
        
      </div>
    }
  />
)}


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


const DetailRow = ({ label, value, symbol }: { label: string; value: React.ReactNode; symbol?: string }) => {
 
  if (label === "نوع" && typeof value === "string") {
    const isDeposit = value === "deposit" || value === "واریز";

    return (
      <div className="flex justify-between items-center">
        <span className="font-medium text-[16px] text-gray5">{label}:</span>
        <div
          className={`inline-flex items-center gap-1 w-[108px] h-[29px] justify-center rounded-[4px] ${
            isDeposit ? "bg-green8 text-green-600" : "bg-red7 text-red6"
          }`}
        >
          {isDeposit ? (
            <span className="w-5 h-5 icon-wrapper">
              <ReceivedIcon />
            </span>
          ) : (
            <span className="w-5 h-5 icon-wrapper">
              <SendIcon />
            </span>
          )}
          <span className="text-[14px] font-normal">{transactionTypeMap[value] || value}</span>
        </div>
      </div>
    );
  }


  return (
    <div className="flex justify-between items-center">
      <span className="font-medium text-[16px] text-gray5">{label}:</span>
      <div className="flex items-end justify-end gap-1 min-w-[120px] text-left">
        <span className={`break-words ${typeof value === "string" && value.length > 20 ? "break-all" : ""}`}>
          {value}
        </span>
        {symbol && <span>{symbol}</span>}
      </div>
    </div>
  );
};

export default TransactionModalCrypto;
