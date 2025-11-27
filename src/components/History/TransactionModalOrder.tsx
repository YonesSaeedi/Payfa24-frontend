import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import { formatEnglishNumber } from "../../utils/formatPersianNumber";
import { Tx } from "./CryptoPage";
import { mappedDigitalGeneralData } from "../../constants/ListdigitalCoins";
 

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
    color?: string;
    isFont?: boolean;
  };
  data?: Record<string, any> | null;
}

interface TransactionModalOrderProps {
  tx: Tx;
  onClose: () => void;
  coinData?: OrderDetail["coin"];
}

const TransactionModalOrder: React.FC<TransactionModalOrderProps> = ({ tx, onClose, coinData }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<OrderDetail | null>(null);

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
          const baseCoin = res.order.coin ?? {};
          const digitalCoin = mappedDigitalGeneralData[tx.symbol || ""] ?? {};

          const mergedCoin: OrderDetail["coin"] = {
            ...baseCoin,
            ...digitalCoin && {
              faName: digitalCoin.cryptoNameFa,
              color: digitalCoin.colorCode ? `#${digitalCoin.colorCode}` : baseCoin.color ?? "#000",
              icon: digitalCoin.icon ?? baseCoin.icon,
              isFont: false,
            },
            ...coinData,
            faName: coinData?.faName ?? digitalCoin.cryptoNameFa ?? baseCoin?.faName ?? baseCoin?.name ?? tx.symbol ?? "ارز نامشخص",
            color: coinData?.color ?? digitalCoin.colorCode ? `#${digitalCoin.colorCode}` : baseCoin?.color ?? "#000",
            icon: coinData?.icon ?? digitalCoin.icon ?? baseCoin?.icon ?? "/images/fallback-coin.png",
            isFont: coinData?.isFont ?? baseCoin?.isFont ?? false,
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
  }, [tx, coinData]);

  const convertDigitsToPersian = (str: string | number) =>
    String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

  const getVoucherCode = () => detail?.data?.uVoucher ?? detail?.data?.Code ?? null;

  const renderCoinIcon = (size = "w-20 h-20") => {
    if (!detail?.coin) return null;
    const coin = detail.coin;

    return (
      <span className={`${size} rounded-full flex items-center justify-center`}>
        {coin.isFont && coin.symbol ? (
          <i
            className={`cf cf-${coin.symbol.toLowerCase()}`}
            style={{
              color: coin.color,
              fontSize: size.includes("w-20") ? "55px" : "28px",
            }}
          />
        ) : (
          <img
            src={coin.icon ?? "/images/fallback-coin.png"}
            alt={coin.faName ?? coin.symbol ?? ""}
            className="object-contain rounded-full"
           
          />
        )}
      </span>
    );
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
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-20 h-20 rounded-full skeleton-bg mx-auto" />
              <div className="h-6 w-32 rounded-md skeleton-bg mx-auto" />
              <div className="h-4 w-20 rounded-md skeleton-bg mx-auto" />
            </div>
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
                {detail.id && <DetailRow label="شناسه سفارش" value={convertDigitsToPersian(detail.id)} />}
                {detail.dateTime && <DetailRow label="تاریخ و زمان" value={convertDigitsToPersian(detail.dateTime)} />}
                {detail.type && <DetailRow label="نوع سفارش" value={transactionTypeMap[detail.type] ?? detail.type} />}
                {detail.amount_coin !== undefined && (
                  <DetailRow label="تعداد" value={formatEnglishNumber(detail.amount_coin)} symbol={detail.coin?.symbol} />
                )}
                {detail.fee !== undefined && (
                  <DetailRow label="قیمت واحد" value={formatEnglishNumber(detail.fee)} symbol={detail.coin?.symbol} />
                )}
                {detail.amount !== undefined && (
                  <DetailRow label="قیمت کل" value={formatEnglishNumber(detail.amount)} symbol={detail.coin?.symbol} />
                )}
                {detail.wage !== undefined && <DetailRow label="کارمزد" value={convertDigitsToPersian(detail.wage)} symbol="تومان" />}
                {getVoucherCode() && <DetailRow label="کد ووچر" value={getVoucherCode()} />}
                {detail.description && <DetailRow label="توضیحات" value={detail.description} />}
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
      <span className={`break-words ${typeof value === "string" && value.length > 20 ? "break-all" : ""}`}>{value}</span>
      {symbol && <span>{symbol}</span>}
    </div>
  </div>
);

export default TransactionModalOrder;
