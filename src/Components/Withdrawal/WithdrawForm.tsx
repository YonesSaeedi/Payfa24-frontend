// import { useForm, Controller } from "react-hook-form";
// import { apiRequest } from "../../utils/apiClient";
// import FloatingInput from "./../FloatingInput/FloatingInput";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
// import IconBankMelliLogo from "./../../assets/icons/BankCards/IconBankMelliLogo";
// import IconBankMellatLogo from "./../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
// import { toast } from "react-toastify";
// import { useEffect, useState } from "react";

// interface BankOption {
//   bank: string;
//   card: string;
//    id: number;
   
// }

// interface WithdrawFormValues {
//   amount: string;
//  bank: BankOption | null;
// }

// export default function WithdrawForm() {

//   const [listCards, setListCards] = useState<{ id: number; card: string; bank: string }[]>([]);

//   useEffect(() => {
//   const fetchCards = async () => {
//     try {
//       const response = await apiRequest<any>({ url: "/api/wallets/fiat?withdraw=true", method: "GET" });
//       setListCards(response.list_cards || []);
//     } catch (err) {
//       console.error("Failed to fetch cards", err);
//     }
//   };
//   fetchCards();
// }, []);

//   const { handleSubmit, control } = useForm<WithdrawFormValues>({
//     defaultValues: {
//       amount: "",
//       bank: null, // پیش‌فرض null
//     },
//   });

//   const isTwoFactorEnabled = false;

//   const onSubmit = async (data: WithdrawFormValues) => {
//     if (!data.bank) return;
//      const amountNumber = Number(data.amount);

//      // شرط ۱: حداقل مقدار برداشت
//     if (amountNumber < 100000) {
//     toast.error("حداقل مقدار برداشت 100,000 تومان میباشد.");
//     return;
//     }
//      // شرط ۲: فعال بودن ورود دو مرحله‌ای
//     if (!isTwoFactorEnabled) {
//       toast.error("برای خرید لازم است یکی از روش‌های ورود دو مرحله‌ای را فعال کنید.");
//       return;
//     }


//     try {
//       const response = await apiRequest({
//         url: "/api/wallets/fiat/withdraw",
//         method: "POST",
//         data: {
//           amount: amountNumber,
//         card: data.bank?.id,
//     // codeOtp: otpValue,
//         },
//       });
//       console.log("Withdraw Response:", response);
//     } catch (err) {
//       console.error("Withdraw Error:", err);
//     }
//   };

// const bankOptions = listCards.map(card => ({
//   value:  {
//     ...card,
//     bankName: card.bank, // ← اضافه کردن بانک داخل value
//   },
//   label: (
//    <div className="flex  justify-between items-center w-full">
//         <span>{card.bank}</span>
//       <span className="text-sm text-gray-700">{card.card.replace(/(\d{4})(?=\d)/g, "$1-")}</span>
    
//     </div>
//   ),
// }));


//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray43 flex flex-col justify-between h-[644px] w-full"
//     >
//       <div>
//         <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center">
//           <span className="w-6 h-6 icon-wrapper ml-2">
//             <IconVideo />
//           </span>
//           <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت تومانی</h2>
//         </div>

//         <div dir="rtl" className="mb-6">
//           <Controller
//             name="amount"
//             control={control}
//             rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
//             render={({ field }) => (
//               <FloatingInput
//                 label="مقدار برداشت (تومان)"
//                 value={field.value}
//                 onChange={field.onChange}
//                 type="number"
//                 placeholder="0 تومان"
//               />
//             )}
//           />
//         </div>

//       <div className="mb-6">
//   {bankOptions.length > 0 ? (
//     <Controller
//       name="bank"
//       control={control}
//       rules={{ required: "لطفا بانک را انتخاب کنید" }}
//       render={({ field }) => (
//         <FloatingSelect<BankOption>
//           label="انتخاب بانک"
//           value={field.value}
//           onChange={field.onChange}
//           options={bankOptions}
//           isBankSelect={true}
//         />
//       )}
//     />
//   ) : (
//     <div className="w-full border rounded-lg p-3 text-center text-gray-500 bg-gray-100">
//       هیچ کارت بانکی موجود نمی‌ باشد
//     </div>
//   )}
// </div>

//       </div>

//       <div>
//         <button
//           type="submit"
//           className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
//         >
//           برداشت
//         </button>
//       </div>
//     </form>
//   );
// }
import { useForm, Controller } from "react-hook-form";
import { apiRequest } from "../../utils/apiClient";
import FloatingInput from "./../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
// import IconClose from "./../../assets/icons/";
// import IconAgain from "./../../assets/icons/IconAgain";
import OTPModal from "../OTPModal";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconClose from "../../assets/Icons/Login/IconClose";
import IconAgain from "../../assets/Icons/Login/IconAgain";

interface BankOption {
  bank: string;
  card: string;
  id: number;
}

interface WithdrawFormValues {
  amount: string;
  bank: BankOption | null;
}

export default function WithdrawForm() {
  const [listCards, setListCards] = useState<{ id: number; card: string; bank: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pendingWithdrawData, setPendingWithdrawData] = useState<WithdrawFormValues | null>(null);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: { amount: "", bank: null },
  });

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await apiRequest<any>({ url: "/api/wallets/fiat?withdraw=true", method: "GET" });
        setListCards(response.list_cards || []);
      } catch (err) {
        console.error("Failed to fetch cards", err);
      }
    };
    fetchCards();
  }, []);

  // تایمر ارسال مجدد کد
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const isTwoFactorEnabled = true;

  const onSubmit = (data: WithdrawFormValues) => {
    const amountNumber = Number(data.amount);
    if (amountNumber < 100000) {
      toast.error("حداقل مقدار برداشت 100,000 تومان میباشد.");
      return;
    }
    if (!isTwoFactorEnabled) {
      toast.error("برای برداشت لازم است ورود دو مرحله‌ای فعال باشد.");
      return;
    }

    // فرضاً در اینجا درخواست ارسال OTP به کاربر می‌فرستیم
    setPendingWithdrawData(data);
    setIsOpen(true);
    setResendTimer(120);
    setCanResend(false);
  };

  const handleModalConfirm = async () => {
    if (!otpCode || otpCode.length < 5) {
      toast.error("کد تایید را کامل وارد کنید.");
      return;
    }

    try {
      const response = await apiRequest({
        url: "/api/wallets/fiat/withdraw",
        method: "POST",
        data: {
          amount: Number(pendingWithdrawData?.amount),
          card: pendingWithdrawData?.bank?.id,
          codeOtp: otpCode,
        },
      });
      toast.success("برداشت با موفقیت انجام شد!");
      console.log("Withdraw Response:", response);
      setIsOpen(false);
    } catch (err) {
      console.error("Withdraw Error:", err);
      toast.error("کد تایید اشتباه است یا منقضی شده.");
    }
  };

  const handleModalResend = () => {
    setResendTimer(120);
    setCanResend(false);
    toast.info("کد جدید ارسال شد.");
  };

  const bankOptions = listCards.map(card => ({
    value: { ...card, bankName: card.bank },
    label: (
      <div className="flex justify-between items-center w-full">
        <span>{card.bank}</span>
        <span className="text-sm text-gray-700">{card.card.replace(/(\d{4})(?=\d)/g, "$1-")}</span>
      </div>
    ),
  }));

  return (
    <>
      {/* فرم برداشت */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray43 flex flex-col justify-between h-[644px] w-full"
      >
        <div>
          <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center">
            <span className="w-6 h-6 icon-wrapper ml-2">
              <IconVideo />
            </span>
            <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت تومانی</h2>
          </div>

          <div dir="rtl" className="mb-6">
            <Controller
              name="amount"
              control={control}
              rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
              render={({ field }) => (
                <FloatingInput
                  label="مقدار برداشت (تومان)"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="0 تومان"
                />
              )}
            />
          </div>

          <div className="mb-6">
            {bankOptions.length > 0 ? (
              <Controller
                name="bank"
                control={control}
                rules={{ required: "لطفا بانک را انتخاب کنید" }}
                render={({ field }) => (
                  <FloatingSelect<BankOption>
                    label="انتخاب بانک"
                    value={field.value}
                    onChange={field.onChange}
                    options={bankOptions}
                    isBankSelect={true}
                  />
                )}
              />
            ) : (
              <div className="w-full border rounded-lg p-3 text-center text-gray-500 bg-gray-100">
                هیچ کارت بانکی موجود نمی‌ باشد
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
          >
            برداشت
          </button>
        </div>
      </form>

      {/* مودال OTP دقیقاً با همان استایل دوستت */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* هدر مودال */}
              <div className="flex items-center flex-row-reverse justify-between">
                <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                  تایید دو مرحله‌ای برداشت
                </h2>
                <span
                  className="icon-wrapper h-6 w-6 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <IconClose />
                </span>
              </div>

              <p
                className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
                dir="rtl"
              >
                لطفا کد ارسال شده به شماره موبایل خود را وارد کنید.
              </p>

              <div className="mt-[32px] mb-[48px]">
                <OTPModal length={5} onChange={(code) => setOtpCode(code)} />
              </div>

              {/* ارسال مجدد */}
              <div className="flex justify-between flex-row-reverse mb-4">
                <div
                  className={`flex gap-2 items-center ${
                    canResend ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={canResend ? handleModalResend : undefined}
                >
                  <span className="text-gray12">ارسال مجدد</span>
                  <span className="icon-wrapper h-5 w-5">
                    <IconAgain />
                  </span>
                </div>
                <p className="text-gray12">
                  ارسال مجدد کد تا {Math.floor(resendTimer / 60)}:
                  {String(resendTimer % 60).padStart(2, "0")}
                </p>
              </div>

              {/* دکمه‌ها */}
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
                >
                  ویرایش شماره
                </button>
                <Link to="">
                  <button
                    onClick={handleModalConfirm}
                    className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
                  >
                    تایید
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
