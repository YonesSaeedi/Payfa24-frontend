import React from "react";
import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png"
type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirmed" | "pending" | "rejected";
};

type BankCardListProps = {
  cards: Card[];
  onAddCard: () => void;
};

const BankCardList: React.FC<BankCardListProps> = ({ cards, onAddCard }) => {
  const statusColor = (status: Card["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-500";
      case "pending":
        return "text-orange-500";
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">کارت‌های شما:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-[335px] h-[183px] rounded-xl shadow p-4 flex flex-col justify-between"
            style={{ backgroundImage: `url(${BackgroundCard})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {/* جای لوگوی بانک */}
            <div className="h-6 w-6 bg-gray-200 rounded mb-2"></div>

            {/* نام بانک */}
            <div className="font-semibold mb-2">{card.bankName}</div>

            {/* شماره کارت */}
            <div className="text-lg mb-2">{card.number}</div>

            {/* دارنده کارت */}
            <div className="text-sm text-gray-600 mb-2">{card.holder}</div>

            {/* وضعیت کارت */}
            <div className={`text-sm font-medium ${statusColor(card.status)}`}>
              {card.status === "confirmed"
                ? "تایید شده"
                : card.status === "pending"
                ? "درحال بررسی"
                : "رد شده"}
            </div>
          </div>
        ))}
      </div>

      {/* دکمه افزودن کارت جدید */}
      <button
        onClick={onAddCard}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        افزودن کارت جدید
      </button>
    </div>
  );
};

export default BankCardList;
