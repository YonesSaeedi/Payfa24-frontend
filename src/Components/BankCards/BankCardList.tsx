import React from "react";
import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png"
import { bankLogos } from "./bankLogos"
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

const BankCardList: React.FC<BankCardListProps> = ({ cards }) => {
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
      <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
        {cards.map((card) => {
  const Logo = bankLogos[card.bankName];
  return (
    <div
      key={card.id}
      className=" rounded-xl shadow p-4 flex flex-col justify-between"
      style={{
        backgroundImage: `url(${BackgroundCard})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <div className="flex justify-end items-center space-x-2">
         <div className="font-semibold mt-2">{card.bankName}</div>
         <div className="h-6 w-6 mb-2">
        {Logo ? <span className="w-9 h-9 icon-wrapper"><Logo /></span> : <div className="h-6 w-6 bg-gray-200 rounded" />}
      </div>
     
      </div>
     
     
      <div  dir="rtl" className="flex justify-end flex-col pt-6">
        <p className="text-sm pb-1">شماره کارت</p>
      <div className="text-lg mb-2">{card.number}</div>
      </div>
      <div className="flex justify-between flex-row-reverse pt-2">
        <div className="flex flex-col">
           <p>دارنده کارت</p>
         <div className="text-sm text-gray-600 mb-2">{card.holder}</div>
        </div>
         <div className={`text-sm font-medium ${statusColor(card.status)}`}>
        {card.status === "confirmed"
          ? "تایید شده"
          : card.status === "pending"
          ? "درحال بررسی"
          : "رد شده"}
      </div>
      </div>
     
    
    </div>
  );
})}
      </div>

      {/* دکمه افزودن کارت جدید */}
     
    </div>
  );
};

export default BankCardList;
