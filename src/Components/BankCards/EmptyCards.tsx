import React from "react";
import IconPlus from "../../assets/icons/trade/IconPlus";
import BankCardImg from "../../assets/images/BankCards/BankCard (2).png";

interface EmptyStateProps {
  onAddCard: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddCard }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <img src={BankCardImg} alt="Bank Card Illustration" className="max-w-sm" />

      <p className="text-gray-700 text-lg mb-10 mt-8">
        هنوز کارت بانکی ثبت نکرده‌اید!
      </p>

      <button
        onClick={onAddCard}
        className="flex items-center gap-2 bg-blue2 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md w-[400px] justify-center"
      >
        افزودن کارت بانکی
        <span className="w-8 h-8">
          <IconPlus />
        </span>
      </button>
    </div>
  );
};

export default EmptyState;
