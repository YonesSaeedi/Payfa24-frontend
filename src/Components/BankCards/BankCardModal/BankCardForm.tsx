import { useState, useEffect } from "react";
import BackgroundCard from "./../../../assets/images/BankCards/BackgroundCard.png";
import BackgroundCardDark from "./../../../assets/images/BankCards/backgroundCardDark.png";
import IconAlarmLogo from "../../../assets/icons/BankCards/IconAlarmLogo";
import IconShetab from "../../../assets/icons/BankCards/IconShetab";
import useGetUser from "../../../hooks/useGetUser";

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
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: userData } = useGetUser();

  return (
    <div dir="rtl" className="flex flex-col w-full  ">
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
          {userData ? (
            <>
              کارت بانکی باید به کد ملی{" "}
              <span className="font-semibold">
                {userData.user.national_code}
              </span>{" "}
              و شماره موبایل{" "}
              <span className="font-semibold">
                {userData.user.mobile
                  ? `${userData.user.mobile.slice(
                      -3
                    )} ****${userData.user.mobile.slice(0, 3)}`
                  : ""}
              </span>{" "}
              تعلق داشته باشد
            </>
          ) : (
            "در حال بارگذاری اطلاعات کاربر..."
          )}
        </p>
      </div>

      <div
        className="h-[263px] rounded-xl relative flex flex-col justify-end px-6 max-w-[600px]"
        style={{
          backgroundImage: `url(${
            isDark ? BackgroundCardDark : BackgroundCard
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 right-2 w-24 h-24">
          <IconShetab />
        </div>

        <div className="relative w-full mb-2">
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);

              const digitsOnly = formatted.replace(/-/g, "");
              if (digitsOnly.length >= 6) {
                setBank(getBankByCardNumber(formatted));
              } else {
                setBank("");
              }
            }}
            placeholder=" ____ ____ ____ ____ "
            className="
    peer
    w-full
    h-[56px]
    rounded-md
    border border-gray-300
     placeholder:leading-[56px]
      flex items-center justify-center
    bg-transparent
    text-center
    text-base text-black0
    placeholder:text-gray-400
    placeholder:text-2xl
     placeholder:tracking-[0.1em]
    placeholder:text-center
    focus:outline-none
    focus:ring-2 focus:ring-blue-400
    focus:border-none
  "
          />

          <label
            htmlFor="cardNumber"
            className="absolute -top-2 right-3 text-gray1 px-1 bg-[#eaf2ff] dark:bg-[#25354d] font-medium text-base "
          >
            شماره کارت
          </label>
        </div>

        <button
          disabled={isSubmitting || cardNumber.replace(/-/g, "").length !== 16}
          className={`mt-4 mb-8 w-full py-3 rounded-lg font-medium text-base transition ${
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
