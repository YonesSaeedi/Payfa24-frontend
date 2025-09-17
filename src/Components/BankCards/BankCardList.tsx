import React, { useState, useEffect } from "react";
import BackgroundCard from "./../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../assets/images/BankCards/BackgroundCardDark.png";
import { bankLogos } from "./bankLogos";
import IconAccept from "./../../assets/icons/BankCards/IconAccept";
import IconInProgress from "./../../assets/icons/BankCards/IconInProgress";
import IconDelete from "./../../assets/icons/BankCards/IconDelete";

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
  const [isDark, setIsDark] = useState(false);

 
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

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

  const statusIcon = (status: Card["status"]) => {
    switch (status) {
      case "confirmed":
        return <span className="w-4 h-4"><IconAccept /></span>;
      case "pending":
        return <span className="w-4 h-4"><IconInProgress /></span>;
      case "rejected":
        return <span className="w-4 h-4"><IconDelete /></span>;
      default:
        return null;
    }
  };

  return (
    <div dir="rtl">
      <h2 className="text-xl font-bold mb-8">کارت‌های من</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Logo = bankLogos[card.bankName];
          return (
            <div
              dir="rtl"
              key={card.id}
              className="rounded-xl shadow p-4 flex flex-col justify-between relative"
              style={{
                backgroundImage: `url(${isDark ? BackgroundCardDark : BackgroundCard})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
             
              <div className="flex justify-start items-center space-x-2 relative z-10">
                <div className="font-semibold mt-2">{card.bankName}</div>
                <div className="h-6 w-6 mb-2">
                  {Logo ? <Logo /> : <div className="h-6 w-6 rounded" />}
                </div>
              </div>

              <div dir="rtl" className="relative z-10 flex justify-end flex-col pt-6">
                <p className="text-sm pb-1 text-black1">شماره کارت</p>
                <div className="text-lg mb-2 text-black1">{card.number}</div>
              </div>

              <div className="relative z-10 flex justify-between flex-row-reverse pt-2 items-center">
                <div className={`text-sm font-medium flex items-center gap-1 ${statusColor(card.status)}`}>
                  {statusIcon(card.status)}
                  {card.status === "confirmed"
                    ? "تایید شده"
                    : card.status === "pending"
                    ? "درحال بررسی"
                    : "رد شده"}
                </div>

                <div className="flex flex-col">
                  <p className="text-black1">دارنده کارت</p>
                  <div className="text-sm text-black1 mb-2">{card.holder}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BankCardList;
