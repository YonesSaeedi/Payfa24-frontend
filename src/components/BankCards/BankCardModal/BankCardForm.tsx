import { useState, useEffect } from "react";
import BackgroundCard from "./../../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../../assets/images/BankCards/BackgroundCardDark.png";
import IconAlarmLogo from "../../../assets/icons/BankCards/IconAlarmLogo";
import IconShetab from "../../../assets/icons/BankCards/IconShetab";
import useGetUser from "../../../hooks/useGetUser";
import { formatPersianDigits } from "../../../utils/formatPersianDigits";

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
  return cleaned
    .replace(/(.{4})/g, "$1-")
    .slice(0, 19)
    .replace(/-$/, "");
};

const BankCardForm = ({ onSave }: BankCardFormProps) => {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [bank, setBank] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSave = async () => {
    const digitsOnly = cardNumber.replace(/-/g, "");
    if (digitsOnly.length !== 16) return;

    try {
      setIsSubmitting(true);
      await onSave(digitsOnly, bank);
      setCardNumber("");
      setBank("");
    } catch (err) {
      // خطا نادیده گرفته شد
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: userData } = useGetUser();

    const toPersianDigits = (input: string | number): string => {
    if (input === null || input === undefined) return "";
    const persianMap = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
    return String(input).replace(/[0-9]/g, d => persianMap[+d]);
  };

 

  return (
    <div dir="rtl" className="flex flex-col w-full  ">
      <div className="flex flex-col mb-4">
        <div className="flex items-center mb-1">
          <span className="w-5 h-5 text-orange1">
            <IconAlarmLogo />
          </span>
          <p className="text-orange1  mr-2 text-[16px] font-normal">
            توجه داشته باشید
          </p>
        </div>
       <p className="text-sm text-black1 leading-6 text-[12px] lg:text-[14px] font-normal">
  {userData ? (
    <>
      کارت بانکی باید به کد ملی <span className="font-semibold">
        {userData.user.national_code
          ? toPersianDigits(userData.user.national_code)
          :   " شما " }
      </span> و شماره موبایل      <span className="font-semibold"> 
        {userData.user.mobile
          ? formatPersianDigits(
              `${userData.user.mobile.slice(-3)} ****${userData.user.mobile.slice(0, 3)}`
            )
          : " شما  " } {" "}
      </span>
      تعلق داشته باشد
    </>
  ) : (
    "در حال بارگذاری اطلاعات کاربر..."
  )}
</p>

      </div>

      <div
        className=" rounded-xl relative flex flex-col  px-6 w-full
    lg:max-w-[600px]  shadow-md"
        style={{
          backgroundImage: `url(${
            isDark ? BackgroundCardDark : BackgroundCard
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 right-2 w-[114px] h-[79px] mt-4">
          <IconShetab />
        </div>

        <div className="relative w-full mb-10 mt-[143px]">
  <input
  dir="rtl"
  id="cardNumber"
  type="text"
  value={cardNumber}
  // onChange={(e) => {
  
  //   const inputValue = e.target.value;
  //   const persianDigits = inputValue.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  //   const onlyDigits = persianDigits.replace(/[^۰-۹]/g, "");
  //   const englishDigits = onlyDigits.replace(/[۰-۹]/g, (d) =>
  //     "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]
  //   );
  //   const formatted = formatCardNumber(englishDigits);
  //   const persianFormatted = formatted.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);
  //   setCardNumber(persianFormatted);
  //   if (englishDigits.length >= 6) {
  //     setBank(getBankByCardNumber(englishDigits));
  //   } else {
  //     setBank("");
  //   }
  // }}
  onChange={(e) => {
  const inputValue = e.target.value.replace(/\D/g, ""); // فقط اعداد انگلیسی
  const formatted = formatCardNumber(inputValue);
  setCardNumber(formatted);

  if (inputValue.length >= 6) {
    setBank(getBankByCardNumber(inputValue));
  } else {
    setBank("");
  }
}}

  placeholder="____ ____ ____ ____"
  className="
    peer
    w-full
    h-[56px]
    rounded-md
    border border-gray12
    placeholder:leading-[56px]
    flex items-center justify-center
    bg-transparent
    text-center
    text-base text-black0
    placeholder:text-gray12
    placeholder:text-2xl
    placeholder:tracking-[0.1em]
    [&::placeholder]:text-center
    focus:outline-none
    focus:ring-2 focus:ring-blue2
    focus:border-none
  "
/>
          <label
            htmlFor="cardNumber"
            className="absolute -top-[13px] right-3 text-gray12 px-1 bg-[#eaf2ff] dark:bg-[#13223a] font-medium text-[18px]"
          >
            شماره کارت
          </label>
        </div>

        <button
          disabled={isSubmitting || cardNumber.replace(/-/g, "").length !== 16}
          className={` mb-8 w-full py-3 rounded-xl font-medium text-base transition ${
            isSubmitting || cardNumber.replace(/-/g, "").length !== 16
              ? "bg-gray12 cursor-not-allowed text-white"
              : "bg-[#197BFF] hover:bg-blue-700 text-white"
          }`}
          onClick={handleSave}
        >
          {isSubmitting ? "در حال ثبت کارت..." : "ثبت کارت"}
        </button>
      </div>
    </div>
  );
};

export default BankCardForm;
