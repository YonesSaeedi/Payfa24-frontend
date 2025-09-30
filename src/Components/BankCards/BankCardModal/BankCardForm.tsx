import { useState, useEffect } from "react";
import BackgroundCard from "./../../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../../assets/images/BankCards/backgroundCardDark.png";
import IconAlarmLogo from "../../../assets/icons/BankCards/IconAlarmLogo";
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
  return binDatabase[bin] || "";
};

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  return cleaned.replace(/(.{4})/g, "$1-").slice(0, 19).replace(/-$/, "");
};

const BankCardForm = ({ onSave }: BankCardFormProps) => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [bank, setBank] = useState<string>("");

  // حالت دارک رو چک می‌کنیم
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // مقدار اولیه
    updateTheme();

    // گوش دادن به تغییر کلاس‌ها روی html
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    if (!cardNumber.trim()) return;
    onSave(cardNumber.replace(/-/g, ""), bank);
    setCardNumber("");
    setBank("");
  };



  
  return (
    <div dir="rtl" className="flex flex-col w-full  ">
      {/* بخش هشدار */}
      <div className="flex flex-col mb-4">
        <div className="flex items-center mb-1">
          <span className="w-5 h-5 text-orange-500">
            <IconAlarmLogo />
          </span>
          <p className="text-orange-500 text-sm mr-2 font-medium">
            توجه داشته باشید
          </p>
        </div>
        <p className="text-sm text-black1 leading-6">
          کارت بانکی باید با کد ملی ۹۳۹۰۳۸۵۸۳۸۳ و شماره موبایل ۹۰۴****۹۵۵ تعلق
          داشته باشد
        </p>
      </div>

      {/* کارت */}
      <div
        className="h-[263px] rounded-xl relative flex flex-col justify-end px-6"
        style={{
          backgroundImage: `url(${isDark ? BackgroundCardDark : BackgroundCard})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* لوگوی شتاب بالا سمت راست */}
        <div className="absolute top-0 right-2 w-24 h-24">
          <IconShetab />
        </div>

        {/* شماره کارت با label ثابت بالا */}
        <div className="relative w-full mb-2">
       <input
  id="cardNumber"
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
  placeholder=" ____ ____ ____ "
  className="peer w-full  rounded-md border-gray15 bg-transparent text-center border h-[56px]  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-none  text-base placeholder-transparent text-black1"
/>
<label
  htmlFor="cardNumber"
  className="absolute -top-2 right-3 text-gray1 px-1 bg-[#eaf2ff] dark:bg-[#25354d] font-medium text-base "
>
  شماره کارت
</label>

        </div>
         {/* دکمه ثبت کارت */}
      <button
        className="mt-4 mb-8 w-full bg-[#197BFF] text-white py-3 rounded-lg font-medium text-base hover:bg-blue-700 transition"
        onClick={handleSave}
      >
        ثبت کارت
      </button>
      </div>

     
    </div>
  );
};

export default BankCardForm;
