import { useState } from "react";
import BackgroundCard from "./../../../assets/images/BankCards/BackgroundCard.png"
import IconAlarmLogo from "../../../assets/icons/BankCards/IconAlarmLogo"
import IconShetab from "../../../assets/icons/BankCards/IconShetab";

type BankCardFormProps = {
  onSave: (cardNumber: string, bankName: string) => void;
};

const binDatabase: { [key: string]: string } = {
  "603799": "بانک ملی",
  "589210": "بانک ملت",
  "627353": "بانک سامان",
  "627381": "بانک انصار",
  "636214": "موسسه مالی ملل",
};

const getBankByCardNumber = (cardNumber: string) => {
  const bin = cardNumber.replace(/-/g, "").slice(0, 6);
  return binDatabase[bin] || "نامشخص";
};

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(.{4})/g, "$1-").slice(0, 19).replace(/-$/, "");
};

const BankCardForm = ({ onSave }: BankCardFormProps) => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [bank, setBank] = useState<string>("");

  const handleSave = () => {
    if (!cardNumber.trim()) return;
    onSave(cardNumber.replace(/-/g, ""), bank);
    setCardNumber("");
    setBank("");
  };



  
  return (
    <>
      {/* بخش هشدار */}
      <div dir="rtl" className="flex flex-col mb-4">
        <div className="flex items-center mb-1">
          <span className="w-6 h-6"><IconAlarmLogo/></span>
          <p className="text-orange-500 text-sm mr-2">توجه داشته باشید</p>
        </div>
        <p className="text-sm text-gray-700">
          کارت بانکی باید به کد ملی 99999 و شماره تلفن 99999 تعلق داشته باشد.
        </p>
      </div>

      {/* بخش ورودی کارت */}
      <div
        className="h-[263px] rounded-xl relative flex flex-col justify-center items-center p-4 mb-4"
        style={{
          backgroundImage: `url(${BackgroundCard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        <span><IconShetab/></span>
        <input
          type="text"
          
          value={cardNumber}
          onChange={(e) => {
            const formatted = formatCardNumber(e.target.value);
            setCardNumber(formatted);
            if (formatted.replace(/-/g, "").length >= 6) {
              setBank(getBankByCardNumber(formatted));
            } else {
              setBank("");
            }
          }}
           placeholder="---- ---- ---- ----"
          className="w-full p-3 rounded-md border  bg-transparent border-gray-300 text-center  tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
        />
        {bank && <p className="text-gray-600 mt-2 text-sm">{bank}</p>}

        <button
          className="absolute bottom-4 w-11/12 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-lg"
          onClick={handleSave}
        >
          ثبت کارت
        </button>
      </div>
    </>
  );
};

export default BankCardForm;
