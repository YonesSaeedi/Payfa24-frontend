import React from "react";

interface TransactionModalProps {
  tx: any;
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
        className="bg-white rounded-2xl p-6 w-[90%] max-w-md relative"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

      
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="w-14 h-14">{tx.currencyIcon}</span>
          <h2 className="font-bold text-lg">{tx.currencyName}</h2>
          <span className="text-sm text-gray-500">{tx.currencySymbol}</span>
        </div>

        <div className="space-y-3 text-sm">
          <p>
            <span className="font-medium">وضعیت:</span> {tx.status}
          </p>
          <p>
            <span className="font-medium">شناسه:</span> {tx.id}
          </p>
          <p>
            <span className="font-medium">تاریخ:</span> {tx.date} | {tx.time}
          </p>
          <p>
            <span className="font-medium">نوع:</span> {tx.type}
          </p>
          <p>
            <span className="font-medium">مقدار:</span> {tx.amount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
