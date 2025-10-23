import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";
import SkeletonTransactionModal from "./SkeletonTransactionModal";

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
  withdrawFee?: string;
  source: "crypto";
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
}

export type TransactionDetail = OrderDetail | CryptoDetail | FiatDetail;


interface TransactionModalProps {
  tx: TransactionDetail;
  onClose: () => void;
  visibleFields?: string[]; // مثلا ["status","id","date","type","amount","stock","description","cardNumber"]
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
            url = `/api/history/orders/${tx.id}`;
            break;
          case "crypto":
            url = `/api/history/crypto-transaction/${tx.id}`;
            break;
          case "fiat":
            url = `/api/history/fiat/${tx.id}`;
            break;
        }

        const res = await apiRequest({ url, method: "GET" });

        if (tx.source === "order" && res.order) {
          const o = res.order;
          setDetail({
            amount: o.amount?.toString(),
            amountCoin: o.amount_coin?.toString(),
            name: o?.coin?.name,
            symbol: o?.coin?.symbol,
            uVoucher: o?.data?.uVoucher,
            Memo: o?.data?.Memo,
            Code: o?.data?.Code,
            Amount: o?.data?.Amount,
            date: o?.dateTime,
            description: o?.description,
            fee: o?.fee,
            id: o.id?.toString(),
            status: o.status,
            type: o?.type,
            wage: o?.wage,
            source: "order",
          });
        } else if (tx.source === "crypto" && res.transaction) {
          const c = res.transaction;
          setDetail({
            date: c.DateTime,
            amount: c.amount?.toString(),
            amountToman: c?.amount_toman?.toString(),
            symbol: c?.coin?.symbol,
            description: c?.description,
            destination: c?.destination,
            destinationTag: c?.destination_tag,
            file: c?.file,
            id: c.id?.toString(),
            network: c?.network,
            reason: c?.reason,
            status: c?.status,
            stock: c?.stock,
            txid: c?.txid,
            type: c.type,
            withdrawFee: c?.withdraw_fee,
            source: "crypto",
          });
        } else if (tx.source === "fiat" && res.transaction) {
          const f = res.transaction;
          setDetail({
            date: f.DateTime,
            PaymentGateway: f.PaymentGateway,
            amount: f.amount?.toString(),
            accountNumber: f?.cardbank?.account_number,
            cardNumber: f?.cardbank?.card_number,
            iban: f?.cardbank?.iban,
            description: f?.description,
            id: f?.id?.toString(),
            idInternalcurrency: f?.id_internalcurrency,
            idOrder: f?.id_order,
            idTrade: f?.id_trade,
            payment: f?.payment,
            reason: f?.reason,
            status: f?.status,
            stock: f?.stock,
            traceNumber: f?.trace_number,
            type: f?.type,
            uuid: f?.uuid,
            source: "fiat",
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

  const renderIcon = () => {
    const img = tx.image || detail?.currencyIcon;
    if (!img) return null;

    if (typeof img === "string") {
      return (
        <img
          src={img}
          alt={tx.faName || detail?.currencySymbol || ""}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) =>
            ((e.currentTarget as HTMLImageElement).src = "/images/fallback-coin.png")
          }
        />
      );
    }
    return img;
  };

  if (!tx) return null;

  

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white8 rounded-2xl p-6 w-[90%] max-w-md relative shadow-xl  max-h-[85vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center   pb-4 mb-4">
          <h2 className="font-semibold text-lg text-black0">جزئیات تراکنش</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition w-7"
          >
            <IconClose />
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <SkeletonTransactionModal/>
        ) : detail ? (
          <>
            {/* Icon and Title */}
            <div className="flex flex-col items-center mb-6">
              {renderIcon()}
              <h3 className="font-bold text-lg mt-3 text-gray-800">
                {tx.faName || (detail as any).name || "ارز نامشخص"}
              </h3>
              {"symbol" in detail && detail.symbol && (
                <span className="text-sm text-gray-500">{detail.symbol}</span>
              )}
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 gap-3 text-sm text-black0">
              {detail.status && (
                <DetailRow
                  label="وضعیت"
                  value={
                    <StatusBadge
                      text={transactionStatusMap[detail.status] || detail.status}
                    />
                  }
                />
              )}
              {detail.id && <DetailRow label="شناسه تراکنش" value={detail.id} />}
              {detail.date && <DetailRow label="تاریخ تراکنش" value={detail.date} />}
              {detail.type && (
                <DetailRow
                  label="نوع تراکنش"
                  value={transactionTypeMap[detail.type] || detail.type}
                />
              )}
              {"amount" in detail && detail.amount && (
                <DetailRow label="مقدار" value={detail.amount} symbol={detail?.symbol} />
              )}
              {"amountCoin" in detail && detail.amountCoin && (
                <DetailRow label="مقدار ارز" value={detail.amountCoin} />
              )}
              {"fee" in detail && detail.fee && (
                <DetailRow label="قیمت" value={detail.fee} symbol={detail?.symbol} />
              )}
              {"wage" in detail && detail.wage && (
                <DetailRow label="کارمزد" value={detail.wage} />
              )}
              {"stock" in detail && detail.stock && (
                <DetailRow label="موجودی بعد از تراکنش" value={detail.stock} symbol="تومان" />
              )}
              {detail.description && (
                <DetailRow label="توضیحات" value={detail.description} />
              )}
              {"network" in detail && detail.network && (
                <DetailRow label="شبکه" value={detail.network} />
              )}
              {"txid" in detail && detail.txid && (
                <DetailRow label="TXID" value={detail.txid} isCopyable />
              )}
              {"iban" in detail && detail.iban && (
                <DetailRow label="شماره شبا" value={detail.iban} />
              )}
              {"cardNumber" in detail && detail.cardNumber && (
                <DetailRow label="شماره کارت" value={detail.cardNumber} />
              )}
              {"uVoucher" in detail && detail.uVoucher && (
                <DetailRow label="uVoucher" value={detail.uVoucher} />
              )}
              {"Code" in detail && detail.Code && (
                <DetailRow label="کد ووچرز" value={detail.Code} />
              )}
              {"Memo" in detail && detail.Memo && (
                <DetailRow label="Memo" value={detail.Memo} />
              )}

            </div>
          </>
        ) : (
          <div className="text-center py-10 text-black0">
            داده‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </div>
  );
};

// 🧩 Subcomponent for cleaner layout
const DetailRow = ({
  label,
  value,
  symbol,
  isCopyable = false,
}: {
  label: string;
  value: React.ReactNode;
  symbol?: string;
  isCopyable?: boolean;
}) => (
  <div className="flex justify-between items-center pb-2">
    <span className="font-medium text-gray12">{label}:</span>
    <div className="flex items-end justify-end gap-1 min-w-[120px] text-right">
      <span
        className={`break-words ${typeof value === "string" && value.length > 20 ? "break-all" : ""
          }`}
      >
        {value}
      </span>
      {symbol && <span>{symbol}</span>}
    </div>
  </div>
);


export default TransactionModal;
