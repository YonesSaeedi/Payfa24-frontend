import React from "react";
import StatusBadge from "../UI/Button/StatusBadge";
import IconClose from "../../assets/Icons/Login/IconClose";

export interface Transaction {
  id: string;
  currencyName: string;
  currencySymbol: string;
  currencyIcon: React.ReactNode;
  amount: string;
  type: string;
  status: "انجام شده" | "درحال بررسی" |"رد شده";
  date: string;
  time: string;
  total: string;  
  fee: string;     
  memoTag?: string;
  code?: string;
}

interface TransactionModalProps {
  tx: Transaction | null;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ tx, onClose }) => {
  if (!tx) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white8 rounded-2xl p-6 w-[90%] max-w-lg relative shadow-lg "
        onClick={(e) => e.stopPropagation()}
      >
           <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-base text-black1">جزئیات تراکنش</h2>
          <button
            onClick={onClose}
            className="text-xl w-6 h-6"
          >
            <IconClose/>
          </button>
        </div>

        
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100">
            {tx.currencyIcon}
          </div>
          <h3 className="font-bold text-lg text-black1">{tx.currencyName}</h3>
          <span className="text-sm text-gray-500">{tx.currencySymbol}</span>
        </div>


<div className="space-y-3 text-sm text-gray3 p-2">
 
  <div className="flex justify-between items-center">
    <span className="font-medium">وضعیت:</span>
    <StatusBadge text={tx.status} />
  </div>

  <div className="flex justify-between  pt-2">
    <span className="font-medium">شناسه تراکنش:</span>
    <span className="text-black1">{tx.id}</span>
  </div>

  <div className="flex justify-between  pt-2">
    <span className="font-medium">تاریخ تراکنش:</span>
    <span className="text-black1">
      {tx.date} | {tx.time}
    </span>
  </div>

  <div className="flex justify-between pt-2">
    <span className="font-medium">نوع:</span>
    <span className="text-black1">{tx.type}</span>
  </div>

  <div className="flex justify-between  pt-2">
    <span className="font-medium">مقدار:</span>
    <span className="text-black1">{tx.amount}</span>
  </div>

  <div className="flex justify-between  pt-2">
    <span className="font-medium">مبلغ:</span>
    <span className="text-black1">{tx.amount}</span>
  </div>

  <div className="flex justify-between  pt-2">
    <span className="font-medium">کارمزد:</span>
    <span className="text-black1">{tx.fee}</span>
  </div>


    <div className="flex justify-between pt-2">
      <span className="font-medium">تگ / Memo:</span>
      <span className="text-black1">{tx.memoTag}</span>
    </div>



    <div className="flex justify-between  pt-2">
      <span className="font-medium">کد:</span>
      <span className="text-black1 break-all">{tx.code}</span>
    </div>

</div>

      </div>
    </div>
  );
};

export default TransactionModal;
