// import React, { useState } from "react";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import { Controller, useForm } from "react-hook-form";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import { yupResolver } from "@hookform/resolvers/yup";
// import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
// import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
// import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import Accordion from "../Withdrawal/Accordion";
// import { toast } from "react-toastify";

// export default function CardToCardTransfer() {
//   const amounts = [5, 10, 20, 50];
//   const [showSummary, setShowSummary] = useState(false);

//   const { control, setValue, watch } = useForm({
//     resolver: yupResolver(),
//   });

//   const selectedAmount = watch("amount");
//   const selectedBank = watch("bank");

//   const bankOptions = {
//     meli: { label: "بانک ملی ایران", icon: <BankMelliLogo /> },
//     mellat: { label: "بانک ملت ایران", icon: <BankMellatLogo /> },
//     noor: { label: "بانک انصار", icon: <BankAnsarLogo /> },
//     melal: { label: "مؤسسه اعتباری ملل", icon: <BankAnsarLogo /> },
//   };

//   const transactionData = {
//     bank: selectedBank ? bankOptions[selectedBank]?.label : "—",
//     bankIcon: selectedBank ? bankOptions[selectedBank]?.icon : null,
//     fromCard: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷",
//     toCard: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷",
//     owner: "گروه فرهنگی و هنری",
//     amount: selectedAmount || 0,
//     finalAmount: selectedAmount
//       ? (selectedAmount - 100000).toLocaleString()
//       : "0",
//   };

//   const handleSubmit = () => {
//     if (!selectedBank || !selectedAmount) {
//       toast.error("لطفاً بانک و مبلغ واریزی را انتخاب کنید");
//       return;
//     }
//     setShowSummary(true);
//   };

//   return (
//     <div className="w-full lg:px-7" dir="rtl">
//       {!showSummary ? (
//         <>
//           {/* فرم اولیه */}
//           <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//             <span className="icon-wrapper w-6 h-6 text-blue2">
//               <IconVideo />
//             </span>
//             <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//           </div>

//           {/* انتخاب بانک */}
//           <div className="mb-12 ">
//             <Controller
//               name="bank"
//               control={control}
//               render={({ field }) => (
//                 <FloatingSelect
//                   placeholder="بانک مبدا را انتخاب کنید"
//                   label="انتخاب بانک مبدا"
//                   value={field.value}
//                   onChange={field.onChange}
//                   options={Object.keys(bankOptions).map((key) => ({
//                     value: key,
//                     label: bankOptions[key].label,
//                     icon: (
//                       <span className="w-6 h-6">{bankOptions[key].icon}</span>
//                     ),
//                   }))}
//                 />
//               )}
//             />
//           </div>

//           {/* مقدار واریزی */}
//           <div dir="rtl" className="mb-1.5 z-0 text-black0">
//             <Controller
//               name="amount"
//               control={control}
//               render={({ field }) => (
//                 <FloatingInput
//                   label="مقدار واریزی"
//                   value={field.value}
//                   onChange={field.onChange}
//                   type="number"
//                   placeholder="0 تومان "
//                   placeholderColor="text-black0"
//                 />
//               )}
//             />
//           </div>

//           {/* دکمه‌های  انتخاب مبلغ */}
//           <div className="flex gap-2 items-center mb-12 mt-5 flex-wrap justify-center">
//             {amounts.map((amount, index) => (
//               <button
//                 key={index}
//                 onClick={() => setValue("amount", amount * 1000000)}
//                 className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
//               >
//                 {amount} میلیون
//               </button>
//             ))}
//           </div>

//           {/* دکمه درخواست */}
//           <div className="mt-40">
//             <button
//               onClick={handleSubmit}
//               className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
//             >
//               درخواست کارت به کارت
//             </button>

//             <div className="mt-4" dir="ltr">
//               <Accordion title="راهنمای واریز کارت به کارت ">
//                 <ul className="list-disc pr-5 space-y-2 text-black1">
//                   <li>
//                     از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
//                     شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
//                   </li>
//                   <li>
//                     مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
//                   </li>
//                 </ul>
//               </Accordion>
//             </div>
//           </div>
//         </>
//       ) : (
//         <>
//           {/* بخش رسید */}
//           <div className="rounded-lg p-1 text-black0 space-y-8">
//             <div className="flex flex-col gap-3 text-black0 bg-white5 rounded-xl p-4 lg:my-8 items-center">
//               <span className="text-gray5 lg:text-lg text-xs">
//                 فرصت باقی مانده برای انجام کارت به کارت
//               </span>
//               <span className="font-bold lg:text-xl text-xs">25:13:45</span>
//             </div>
//             <div className="space-y-6 lg:text-lg text-xs ">
//               <div className="flex justify-between items-center">
//                 <span> کارت مبدا</span>
//                 <div className="flex gap-2 items-center">
//                   <span>{transactionData.fromCard}</span>
//                   <span className="icon-wrapper w-7 h-7 ">
//                     {transactionData.bankIcon}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span>مبلغ تراکنش</span>
//                 <span>{transactionData.amount.toLocaleString()} تومان</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span>شماره کارت مقصد</span>
//                 <div className="flex gap-2 items-center">
//                   <span>{transactionData.toCard}</span>
//                   <span className="icon-wrapper w-7 h-7 ">
//                     {transactionData.bankIcon}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span>نام صاحب کارت مقصد</span>
//                 <span>{transactionData.owner}</span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span>مبلغ نهایی با کسر کارمزد</span>
//                 <span>{transactionData.finalAmount} تومان</span>
//               </div>
//             </div>
//             <ul className="list-disc lg:text-lg text-xs space-y-1 pr-4">
//               <li>
//                 حتماً باید کارت مقصدی که انتخاب کرده‌اید و مبلغی که درج کرده‌اید
//                 تراکنش انجام شود.
//               </li>
//               <li>
//                 پس از انجام کارت به کارت به صورت خودکار کیف پول تومانی شما شارژ
//                 می‌شود.
//               </li>
//             </ul>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// فرض بر این است که مسیرها و کامپوننت‌های زیر در پروژه شما موجود هستند
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import FloatingInput from "../FloatingInput/FloatingInput";
import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import Accordion from "../Withdrawal/Accordion";
import { toast } from "react-toastify";
import { apiRequest, AxiosError } from "../../utils/apiClient";
import IconDanger from "../../assets/Icons/Deposit/IconDanger";
import IconAlert from "../../assets/Icons/Login/IconAlert";

// --- تعریف رابط‌ها (Interfaces) ---

interface CreditCard {
  id: number;
  card: string;
  bank: string;
  iban?: string | null;
}

interface CardToCardInfo {
  transaction: {
    id: number;
    amount: number;
    date: string;
    card: number; // ID کارت مبدا
  } | null;
  card: {
    name: string;
    card: string; // شماره کارت مقصد
    bank: string;
    iban: string | null;
  } | null;
}

interface WalletsFiatResponse {
  status: boolean;
  msg: string;
  // ... سایر فیلدها
  list_cards: CreditCard[];
  cardToCard: CardToCardInfo;
}

interface CardToCardRequestData {
  amount: number;
  card: number; // ID کارت مبدا
}

interface CardToCardResponse {
  status: boolean;
  msg: string;
}

// --- توابع کمکی ---

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("مبلغ باید عدد باشد")
    .required("وارد کردن مبلغ الزامی است")
    .min(500000, "حداقل مبلغ واریز ۵۰۰,۰۰۰ تومان است")
    .max(25000000, "حداکثر مبلغ واریز ۲۵,۰۰۰,۰۰۰ تومان است"),
  card: yup
    .number()
    .min(1, "لطفاً یک کارت معتبر انتخاب کنید")
    .required("لطفاً یک کارت معتبر انتخاب کنید"),
});

const bankIconMap: { [key: string]: JSX.Element } = {
  بلوبانک: <BankMellatLogo />,
  "بانک ملی": <BankMelliLogo />,
  "بانک ملت": <BankMellatLogo />,
  "بانک ایران زمین": <BankAnsarLogo />,
  "بانک سامان": <BankMellatLogo />,
  "بانک تجارت": <BankMellatLogo />,
  صادرات: <BankMellatLogo />,
  سایر: <BankAnsarLogo />,
};

const getBankIcon = (bankName: string): JSX.Element | null => {
  return bankIconMap[bankName] || null;
};

// نمایش چهار رقم آخر برای فرم، و نمایش کامل برای فیش (بر اساس منطق ریسپانس)
const formatCardNumber = (
  cardNumber: string,
  full: boolean = false
): string => {
  if (!cardNumber) return "—";
  if (full) return cardNumber;
  return `****${cardNumber.slice(-4)}`;
};

const formatTimer = (seconds: number) => {
  if (seconds < 0) return "00:00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  // نمایش ساعت فقط در صورتی که نیاز باشد (در اینجا حداکثر ۳۰ دقیقه است، پس فقط دقیقه و ثانیه کافی است)
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// --- کامپوننت اصلی ---

export default function CardToCardTransfer() {
  const amounts = [5, 10, 20, 50]; // به میلیون تومان
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [responseData, setResponseData] = useState<WalletsFiatResponse | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset, // برای ریست کردن مقادیر فرم بعد از ارسال موفق
  } = useForm<CardToCardRequestData>({
    resolver: yupResolver(validationSchema),
    defaultValues: { amount: 0, card: 0 },
  });

  const selectedAmount = watch("amount");
  const selectedCardId = watch("card");
  const selectedCard = cards.find((c) => c.id === selectedCardId);

  // useEffect برای دریافت داده‌های اولیه و بررسی وجود تراکنش ناتمام
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest<WalletsFiatResponse>({
          url: "/api/wallets/fiat",
          method: "GET",
        });
        if (response.status) {
          setResponseData(response);
          setCards(response.list_cards || []);

          if (response.cardToCard.transaction) {
            // یک تراکنش ناتمام وجود دارد، حالت فیش را فعال می‌کنیم
            const transactionDate = new Date(
              response.cardToCard.transaction.date
            );
            // فرصت 30 دقیقه ای برای انجام کارت به کارت
            const endTime = new Date(
              transactionDate.getTime() + 30 * 60 * 1000
            );
            const remaining = Math.max(
              0,
              Math.floor((endTime.getTime() - Date.now()) / 1000)
            );
            setTimer(remaining);
            setShowSummary(true);
          } else {
            setShowSummary(false);
          }
        } else {
          toast.error(response.msg || "خطا در بارگذاری داده‌ها.");
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ msg?: string }>;
        toast.error(axiosError.response?.data?.msg || "خطا در اتصال به سرور.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // useEffect برای مدیریت تایمر
  useEffect(() => {
    if (showSummary && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          // نیازی به ذخیره در localStorage نیست اگر داده‌ها را در رفرش از API می‌خوانیم
          if (newTimer <= 0) {
            clearInterval(interval);
            setShowSummary(false);
            // یک بار دیگر داده‌ها را دریافت کنید تا مطمئن شوید که تراکنش ناتمام حذف شده است
            // یا حداقل UI را ریست کنید
            setTimer(0);
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (showSummary && timer <= 0) {
      // اگر کامپوننت با timer=0 و showSummary=true لود شد، آن را به false تغییر دهید
      setShowSummary(false);
    }
  }, [showSummary, timer]);

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount * 1000000, { shouldValidate: true });
  };

  const onSubmit = async (data: CardToCardRequestData) => {
    // اگر یک تراکنش فعال وجود دارد، نباید امکان ارسال مجدد وجود داشته باشد
    if (showSummary) return;

    setIsSubmitting(true);
    try {
      const requestData = {
        amount: Number(data.amount),
        card: data.card,
      };
      const response = await apiRequest<
        CardToCardResponse,
        CardToCardRequestData
      >({
        url: "/api/wallets/fiat/deposit/card-to-card",
        method: "POST",
        data: requestData,
      });
      if (response.status) {
        toast.success(response.msg || "درخواست واریز با موفقیت ثبت شد. ✅");

        // دریافت اطلاعات به‌روز برای نمایش فیش
        const updatedResponse = await apiRequest<WalletsFiatResponse>({
          url: "/api/wallets/fiat",
          method: "GET",
        });

        if (updatedResponse.status && updatedResponse.cardToCard.transaction) {
          setResponseData(updatedResponse);
          // ریست کردن فرم بعد از ثبت موفق برای تمیزی
          reset({ amount: 0, card: 0 });

          const transactionDate = new Date(
            updatedResponse.cardToCard.transaction.date
          );
          const endTime = new Date(transactionDate.getTime() + 30 * 60 * 1000);
          const remaining = Math.max(
            0,
            Math.floor((endTime.getTime() - Date.now()) / 1000)
          );
          setTimer(remaining);
          setShowSummary(true);
        } else {
          // اگر در API به‌روزرسانی نشد، به حالت نمایش فرم برگردید
          setShowSummary(false);
        }
      } else {
        toast.error(response.msg || "خطا: درخواست ثبت نشد. 🚫");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<{ msg?: string }>;
      const serverMsg =
        axiosError.response?.data?.msg ||
        "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️";
      toast.error(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- محاسبه داده‌های فیش (Summary) ---

  // این شیء اطلاعات کارت مبدا را در صورت وجود تراکنش ناتمام نگهداری می‌کند (مهم برای حالت رفرش)
  const summarySourceCard = cards.find(
    (c) => c.id === responseData?.cardToCard?.transaction?.card
  );

  const finalSourceCard = showSummary ? summarySourceCard : selectedCard;
  const finalAmount = showSummary
    ? responseData?.cardToCard?.transaction?.amount
    : Number(selectedAmount) || 0;

  const transactionData = {
    // در حالت فیش، شماره کارت مبدا از داده‌های API (summarySourceCard) گرفته می‌شود
    fromCard: formatCardNumber(finalSourceCard?.card || "", true), // نمایش کامل برای فیش
    fromBankIcon: finalSourceCard ? getBankIcon(finalSourceCard.bank) : null,

    // شماره کارت مقصد و نام صاحب کارت همیشه از cardToCard.card گرفته می‌شود
    toCard: responseData?.cardToCard?.card?.card || "—",
    toBank: responseData?.cardToCard?.card?.bank || "",
    owner: responseData?.cardToCard?.card?.name || "گروه فرهنگی و هنری",

    amount: finalAmount,

    // محاسبه مبلغ نهایی با کسر کارمزد (کارمزد ثابت ۱۰۰,۰۰۰ تومان فرض شده)
    finalAmountWithFee:
      finalAmount && finalAmount >= 100000
        ? (finalAmount - 100000).toLocaleString("fa-IR")
        : (finalAmount || 0).toLocaleString("fa-IR"),
  };

  // --- رندرینگ ---

  if (loadingData) {
    return <span className="w-7 h-4 skeleton-bg"></span>;
  }

  // اگر تراکنش ناتمام وجود دارد اما اطلاعات کارت مقصد نیست، نمایش خطا
  if (showSummary && !responseData?.cardToCard?.card) {
    return (
      <div className="text-center py-8 text-red-500">
        خطا: اطلاعات کارت مقصد ناقص است. لطفاً با پشتیبانی تماس بگیرید.
      </div>
    );
  }

  return (
    <div className="w-full lg:px-7" dir="rtl">
      {!showSummary ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ... بخش ویدیو آموزشی ... */}
          <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
            <span className="icon-wrapper w-6 h-6 text-blue2">
              <IconVideo />
            </span>
            <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
          </div>

          {/* انتخاب کارت مبدا */}
          <div className="mb-12">
            <Controller
              name="card"
              control={control}
              render={({ field }) => (
                <>
                  <FloatingSelect
                    placeholder="کارت مبدا را انتخاب کنید"
                    label="انتخاب کارت مبدا"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(Number(value))}
                    options={cards.map((card) => ({
                      value: card.id.toString(),
                      label: `${card.bank} (${formatCardNumber(card.card)})`,
                      icon: (
                        <span className="w-6 h-6">
                          {getBankIcon(card.bank)}
                        </span>
                      ),
                    }))}
                  />
                  {errors.card && (
                    <p className="text-red1 text-sm mt-1">
                      {errors.card.message}
                    </p>
                  )}
                  {cards.length === 0 && (
                    <p className="text-yellow-500 text-sm mt-1">
                      هیچ کارتی یافت نشد. لطفاً کارت اضافه کنید.
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* مقدار واریزی */}
          <div dir="rtl" className="mb-1.5 z-0 text-black0">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <>
                  <FloatingInput
                    label="مقدار واریزی (تومان)"
                    value={field.value === 0 ? "" : field.value.toString()} // خالی برای صفر، وگرنه مقدار واقعی
                    onChange={(value: string) => {
                      const numericValue = value.replace(/[^0-9]/g, ""); // فقط اعداد رو نگه دار
                      const parsedValue = numericValue
                        ? parseInt(numericValue, 10)
                        : 0; // تبدیل به عدد
                      field.onChange(parsedValue); // مقدار عددی رو به فرم پاس بده
                    }}
                    type="text" // برای تایپ دستی
                    inputMode="numeric" // کیبورد عددی
                    placeholder="0 تومان"
                    placeholderColor="text-black0"
                  />
                  {errors.amount && (
                    <p className="text-red1 text-sm mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* دکمه‌های مقادیر پیش‌فرض */}
          <div className="flex gap-2 items-center mb-12 mt-5 justify-center overflow-auto">
            {amounts.map((amount, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setPresetAmount(amount)}
                className={`border rounded-lg px-7 py-2 text-sm transition ${
                  Number(selectedAmount) === amount * 1000000
                    ? "border-blue2 text-blue2"
                    : "border-gray12 text-gray12 hover:border-blue2 hover:text-blue2"
                }`}
              >
                {amount} میلیون
              </button>
            ))}
          </div>

          {/* دکمه ارسال درخواست */}
          <div className="mt-40">
            <button
              type="submit"
              disabled={isSubmitting || cards.length === 0}
              className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
                isSubmitting || cards.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? "در حال ثبت درخواست..." : "درخواست کارت به کارت"}
            </button>

            {/* آکاردئون راهنما */}
            <div className="mt-4" dir="ltr">
              <Accordion title="راهنمای واریز کارت به کارت">
                <ul className="list-disc pr-5 space-y-2 text-black1">
                  <li>از صحت شماره کارت مقصد (صرافی) واریز مطمئن شوید.</li>
                  <li>
                    پس از ثبت درخواست، فرصت محدودی (۳۰ دقیقه) برای انجام کارت به
                    کارت خواهید داشت.
                  </li>
                  <li>واریز باید حتماً از کارت انتخابی شما انجام شود.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </form>
      ) : (
        // --- حالت نمایش فیش (Summary) ---
        <>
          <div className="rounded-lg text-black0 space-y-8">
            <div className="flex flex-col gap-3 text-black0 rounded-xl py-4 lg:my-3 items-center">
              <span className="text-gray5 lg:text-lg text-sm">
                فرصت باقی مانده برای انجام کارت به کارت
              </span>
              <span className="font-bold lg:text-2xl text-lg text-black0">
                {formatTimer(timer)}
              </span>
            </div>
            <div className="space-y-6 lg:text-lg text-sm">
              {/* کارت مبدا */}
              <div className="flex justify-between items-center">
                <span>کارت مبدا</span>
                <div className="flex gap-2 items-center font-monospace">
                  <span>{transactionData.fromCard}</span>
                  <span className="icon-wrapper w-7 h-7">
                    {transactionData.fromBankIcon}
                  </span>
                </div>
              </div>

              {/* مبلغ تراکنش */}
              <div className="flex justify-between items-center">
                <span>مبلغ تراکنش</span>
                <span className="font-bold">
                  {transactionData.amount.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              {/* شماره کارت مقصد */}
              <div className="flex justify-between items-center">
                <span>شماره کارت مقصد</span>
                <div className="flex gap-2 items-center font-monospace">
                  <span>{transactionData.toCard}</span>
                  <span className="icon-wrapper w-7 h-7">
                    {getBankIcon(transactionData.toBank)}
                  </span>
                </div>
              </div>

              {/* مبلغ نهایی با کسر کارمزد */}
              <div className="flex justify-between items-center lg:pb-52">
                <span>مبلغ نهایی با کسر کارمزد</span>
                <span>{transactionData.finalAmountWithFee} تومان</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSummary(false);
                // همچنین می‌توانید reset() را اینجا فراخوانی کنید
              }}
              className="mt-8 text-blue2 bg-gray-100 w-full py-3 font-bold text-lg rounded-lg"
            >
              بازگشت
            </button>
          </div>
          <div
            dir="rtl"
            className="bg-orange5 rounded-xl p-4 text-sm text-left space-y-4"
          >
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="icon-wrapper w-4 h-4">
                <IconAlert />
              </span>
              <span>توجه داشته باشید</span>
            </div>
            <ul className="text-right list-disc list-inside">
              <li>
                حتما بایستی از کارت مقصدی که انتخاب کرده‌اید و مبلغی که درج
                کرده‌اید تراکنش انجام شود.
              </li>
              <li>
                پس از انجام کارت به کارت به صورت خودکار کیف پول تومانی شما شارژ
                می‌شود.
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
