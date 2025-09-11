import { useState } from "react";

type AddBankCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardNumber: string, bankName: string) => void;
};

// دیتابیس شش رقم اول کارت‌ها
const binDatabase: { [key: string]: string } = {
  "603799": "بانک ملی",
  "589210": "بانک ملت",
  "627353": "بانک سامان",
  // ادامه بانک‌ها
};

const getBankByCardNumber = (cardNumber: string) => {
  const bin = cardNumber.slice(0, 6);
  return binDatabase[bin] || "نامشخص";
};

const AddBankCardModal = ({ isOpen, onClose, onSave }: AddBankCardModalProps) => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [bank, setBank] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (cardNumber.trim() === "") return;
    onSave(cardNumber, bank); // شماره کارت + بانک
    setCardNumber("");
    setBank("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-medium text-right mb-4">افزودن کارت بانکی</h2>

        <div className="w-full h-32 bg-blue-50 rounded-xl relative mb-4 flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="شماره کارت"
            value={cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setCardNumber(value);
              if (value.length >= 6) {
                setBank(getBankByCardNumber(value));
              } else {
                setBank("");
              }
            }}
            className="w-3/4 p-2 rounded-md border border-gray-300 text-right placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {bank && <p className="text-gray-600 mt-2">{bank}</p>}
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSave}
        >
          ثبت کارت
        </button>
      </div>
    </div>
  );
};

export default AddBankCardModal;
