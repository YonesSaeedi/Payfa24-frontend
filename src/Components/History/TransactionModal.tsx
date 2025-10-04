import React, { useEffect, useState } from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/Icons/Login/IconClose";
import { apiRequest } from "../../utils/apiClient";
import { transactionStatusMap, transactionTypeMap } from "../../utils/statusMap";

export interface Transaction {
  id: string;
  source: "order" | "crypto" | "fiat";
  currencyName?: string;
  currencySymbol?: string;
  currencyIcon?: string | React.ReactNode;
  amount?: string;
  type?: string;
  status?: string;
  date?: string;
  time?: string;
  total?: string;
  fee?: string;
  memoTag?: string;
  code?: string;
  faName?: string | null;
  image?: string | React.ReactNode;
  description?: string;
}

interface TransactionModalProps {
  tx: Transaction;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Transaction | null>(null);

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
            id: o.id?.toString(),
            source: "order",
            currencyName: o.coin?.name,
            currencySymbol: o.coin?.symbol,
            amount: o.amount?.toString(),
            total: o.amount_coin?.toString(),
            type: o.type,
            fee: o.fee?.toString(),
            status: o.status,
            date: o.dateTime,
            memoTag: o.data?.uVoucher,
            description: o.description,
          });
        } else if (tx.source === "crypto" && res.transaction) {
          const c = res.transaction;
          setDetail({
            id: c.id?.toString(),
            source: "crypto",
            currencyName: c.coin?.symbol,
            currencySymbol: c.coin?.symbol,
            amount: c.amount?.toString(),
            total: c.stock?.toString(),
            type: c.type,
            fee: c.withdraw_fee?.toString(),
            status: c.status,
            date: c.DateTime,
            memoTag: c.destination_tag || c.reason,
            code: c.txid,
          });
        } else if (tx.source === "fiat" && res.transaction) {
          const f = res.transaction;
          setDetail({
            id: f.id?.toString(),
            source: "fiat",
            currencyName: f.PaymentGateway || "تومان",
            currencySymbol: f.stock?.toString(),
            amount: f.amount?.toString(),
            total: f.stock?.toString(),
            type: f.type,
            fee: "0",
            status: f.status,
            date: f.DateTime,
            memoTag: f.description,
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

  console.log("detail", detail);
  

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
  className="bg-white8 rounded-2xl p-6 w-[90%] max-w-lg relative shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-base text-black1">جزئیات تراکنش</h2>
          <button onClick={onClose} className="text-xl w-6 h-6">
            <IconClose />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">در حال دریافت اطلاعات...</div>
        ) : detail ? (
          <>
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
                {renderIcon()}
              </div>
              <h3 className="font-bold text-lg text-black1">{tx.faName || detail.currencyName}</h3>
              {detail.currencySymbol && <span className="text-sm text-gray-500">{detail.currencySymbol}</span>}
            </div>

            <div className="space-y-3 text-sm text-gray3 p-2">
              {detail.status && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">وضعیت:</span>
                    <StatusBadge text={transactionStatusMap[detail.status] || "نامشخص"} />
                </div>
              )}
              {detail.id && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">شناسه تراکنش:</span>
                  <span className="text-black1">{detail.id}</span>
                </div>
              )}
              {detail.date && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">تاریخ تراکنش:</span>
                  <span className="text-black1">{detail.date}</span>
                </div>
              )}
              {detail.type && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">نوع:</span>
                  <span className="text-black1">{detail.type}</span>
                </div>
              )}
              {detail.amount && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">مقدار:</span>
                  <span className="text-black1">{detail.amount}</span>
                </div>
              )}
              {detail.total && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">مبلغ کل:</span>
                  <span className="text-black1">{detail.total}</span>
                </div>
              )}
              {detail.fee && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">کارمزد:</span>
                  <span className="text-black1">{detail.fee}</span>
                </div>
              )}
              {detail.description && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">توضیحات:</span>
                  <span className="text-black1">{detail.description}</span>
                </div>
              )}
              {detail.memoTag && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">Memo:</span>
                  <span className="text-black1">{detail.memoTag}</span>
                </div>
              )}
              {detail.code && (
                <div className="flex justify-between pt-2">
                  <span className="font-medium">کد:</span>
                  <span className="text-black1 break-all">{detail.code}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">داده‌ای برای نمایش وجود ندارد</div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
