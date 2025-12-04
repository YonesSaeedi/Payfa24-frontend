import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import FloatingInput from "../FloatingInput/FloatingInput";
import Accordion from "../Withdrawal/Accordion";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import IconAlert from "../../assets/icons/Login/IconAlert";
import { getValidationSchemaCardtoCard } from "../../utils/validationSchemas";
import { AxiosError } from "axios";
import { getBankLogo } from "../../utils/bankLogos";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconClose from "../../assets/icons/Login/IconClose";

// --- Interfaces ---
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
    card: number;
  } | null;
  card: {
    name: string;
    card: string;
    bank: string;
    iban: string | null;
  } | null;
}

interface CardToCardRequestData extends Record<string, any> {
  amount: number;
  card: number;
}

interface CardToCardResponse {
  status: boolean;
  msg: string;
}

interface CardToCardTransferProps {
  cards: CreditCard[];
  cardToCardInfo: CardToCardInfo;
  minDeposit: number;
  maxDeposit: number;
  loadingBankCards?: boolean;
}

export function formatPersianCardNumber(input: string | number): string {
  if (input === null || input === undefined || input === "") return "";

  const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const digitsOnly = String(input)
    .replace(/[^\d۰-۹]/g, "")
    .replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]); // فارسی → انگلیسی

  const grouped = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1-");
  const persianGrouped = grouped.replace(/[0-9]/g, (d) => persianMap[+d]);

  return persianGrouped;
}

export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return "";
  const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(input).replace(/[0-9]/g, (d) => persianMap[+d]);
}

const formatTimer = (seconds: number): string => {
  if (seconds < 0) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function calculateFee(amount: number): number {
  if (!amount || amount <= 0) return 0;
  const feePercentage = 0.001; // 0.1%
  const minFee = 1000;
  const calculatedFee = amount * feePercentage;
  // گرد کردن و سپس مقایسه با مینیمم
  const finalFee = Math.max(Math.round(calculatedFee), minFee);
  return finalFee;
}

// --- Component ---
export default function CardToCardTransfer({ loadingBankCards, cards: initialCards, cardToCardInfo: initialCardToCardInfo }: CardToCardTransferProps) {
  const amounts = [1, 5, 10, 15]; // میلیون تومان
  const [showSummary, setShowSummary] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [cards, setCards] = useState<CreditCard[]>(initialCards);
  const [cardToCardData, setCardToCardData] = useState<CardToCardInfo>(initialCardToCardInfo);

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<CardToCardRequestData>({
    resolver: yupResolver(getValidationSchemaCardtoCard()),

    defaultValues: { card: 0 },
    mode: "onChange",
  });

  const selectedAmount = watch("amount");
  const selectedCardId = watch("card");
  const selectedCard = cards.find((c) => c.id === selectedCardId);

  useEffect(() => {
    if (initialCardToCardInfo.transaction) {
      const transactionDate = new Date(initialCardToCardInfo.transaction.date);
      const endTime = transactionDate.getTime() + 30 * 60 * 1000; // 30 دقیقه بعد
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimer(remaining);
      setShowSummary(remaining > 0);
    }
    setCards(initialCards);
    setCardToCardData(initialCardToCardInfo);
  }, [initialCardToCardInfo, initialCards]);

  useEffect(() => {
    if (showSummary && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            clearInterval(interval);
            setShowSummary(false);
            return 0;
          }
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSummary, timer]);

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount * 1000000, { shouldValidate: true });
  };

  const onSubmit = async (data: CardToCardRequestData) => {
    if (showSummary) return;

    setIsApiLoading(true);
    try {
      const requestData = { amount: Number(data.amount), card: data.card };
      const response = await apiRequest<CardToCardResponse, CardToCardRequestData>({
        url: "/wallets/fiat/deposit/card-to-card",
        method: "POST",
        data: requestData,
      });

      if (response.status) {
        toast.success(response.msg || "درخواست واریز با موفقیت ثبت شد. ✅");

        const updatedResponse = await apiRequest<{
          status: boolean;
          cardToCard: CardToCardInfo;
        }>({
          url: "/wallets/fiat",
          method: "GET",
        });
        if (updatedResponse.status && updatedResponse.cardToCard.transaction) {
          setCardToCardData(updatedResponse.cardToCard);
          reset({ amount: 0, card: 0 });

          const transactionDate = new Date(updatedResponse.cardToCard.transaction.date);
          const endTime = transactionDate.getTime() + 30 * 60 * 1000;
          const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
          setTimer(remaining);
          setShowSummary(remaining > 0);
        } else {
          setShowSummary(false);
        }
      } else {
        toast.error(response.msg || "خطا: درخواست ثبت نشد. 🚫");
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<{ msg?: string }>;
      toast.error(axiosError.response?.data?.msg || "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️");
    } finally {
      // setIsSubmitting(false);
    }
  }; // --- Transaction summary data ---

  const summarySourceCard = cards.find((c) => c.id === cardToCardData?.transaction?.card);
  const finalSourceCard = showSummary ? summarySourceCard : selectedCard;
  const finalAmount: number = showSummary ? cardToCardData?.transaction?.amount ?? 0 : Number(selectedAmount ?? 0) || 0;

  const computedFee = calculateFee(finalAmount);
  const computedFinalAmountAfterFee = Math.max(0, finalAmount - computedFee);

  const transactionData = {
    fromCard: formatPersianCardNumber(finalSourceCard?.card || ""),
    fromBankIcon: finalSourceCard ? (
      <img src={getBankLogo(finalSourceCard.bank) || "/bank-logos/bank-sayer.png"} alt={finalSourceCard.bank} className="w-7 h-7 object-contain" />
    ) : null,

    toCard: cardToCardData?.card?.card || "—",
    toBank: cardToCardData?.card?.bank || "",
    owner: cardToCardData?.card?.name || "گروه فرهنگی و هنری",
    amount: finalAmount,
    fee: computedFee,
    finalAmountWithFee: computedFinalAmountAfterFee,
  };

  if (showSummary && !cardToCardData?.card) return <div className="text-center py-8 text-red1">خطا: اطلاعات کارت مقصد ناقص است. لطفاً با پشتیبانی تماس بگیرید.</div>;

  return (
    <div className="w-full" dir="rtl">
      {!showSummary ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Video guide */}
          <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="icon-wrapper w-6 h-6 text-blue2">
                <IconVideo />
              </span>
              <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با درگاه پرداخت</span>
            </div>
            <span className="icon-wrapper w-5 h-5 text-blue2">
              <IconClose />
            </span>
          </div>

          {/* Card select */}
          <div className="mb-12 w-full">
            <Controller
              name="card"
              control={control}
              render={({ field }) => {
                const hasCards = cards.length > 0;
                return (
                  <>
                    <FloatingSelect
                      placeholder={
                        loadingBankCards ? (
                          <span className="skeleton-bg w-40 h-4 rounded-sm"></span>
                        ) : hasCards ? (
                          "کارت مبدا را انتخاب کنید "
                        ) : (
                          <span className="text-gray5 text-xs lg:text-sm">هیچ کارت ثبت‌ شده‌ای ندارید</span>
                        )
                      }
                      label="انتخاب کارت مبدا"
                      value={hasCards ? field.value?.toString() || "" : ""}
                      onChange={field.onChange}
                      disabled={!hasCards}
                      options={
                        hasCards
                          ? cards.map((card) => ({
                              value: card.id.toString(),
                              label: (
                                <div className="flex items-center justify-between w-full py-1 rounded-md">
                                  <span className="lg:text-sm text-xs text-black0">{card.bank}</span>
                                  <span className="lg:text-sm text-xs text-black0">{formatPersianCardNumber(card.card)}</span>
                                </div>
                              ),
                              icon: <img src={getBankLogo(card.bank) || "/bank-logos/bank-sayer.png"} alt={card.bank} className="w-6 h-6 object-contain" />,
                            }))
                          : []
                      }
                    />

                    {errors.card && <p className="text-red1 text-sm mt-1">{errors.card.message}</p>}
                  </>
                );
              }}
            />
          </div>

          {/* Amount input */}
          <div dir="rtl" className="mb-1.5 mt-8">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="مقدار واریزی (تومان)"
                  value={formatPersianDigits(field.value?.toString() ?? "")}
                  type="text"
                  onChange={(e) => {
                    const rawValue = e.target.value;
                    const englishValue = rawValue.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()).replace(/[^0-9]/g, "");
                    field.onChange(englishValue ? Number(englishValue) : undefined);
                    trigger("amount");
                  }}
                  placeholder="۰ تومان"
                  placeholderColor="text-black0"
                />
              )}
            />
          </div>
          {errors.amount && <p className="text-red1 text-xs py-3">{errors.amount.message}</p>}

          {/* Preset amounts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
            {amounts.map((amount, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPresetAmount(amount)}
                className="border border-gray12 rounded-lg w-full py-2 lg:text-sm text-xs transition-all text-gray12 hover:text-blue2 hover:border-blue2"
              >
                {formatPersianDigits(amount)} میلیون
              </button>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-40">
            <button
              type="submit"
              disabled={isApiLoading || !isValid || cards.length === 0}
              className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all 
                ${isApiLoading || !isValid || cards.length === 0 ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1"}`}
            >
              {isApiLoading ? "در حال ثبت درخواست..." : "درخواست کارت به کارت"}
            </button>

            {/* Accordion guide */}
            <div className="mt-4" dir="ltr">
              <Accordion title="راهنمای واریز کارت به کارت">
                <ul className="list-disc pr-5 space-y-2 text-black1">
                  <li>از صحت شماره کارت مقصد (صرافی) واریز مطمئن شوید.</li>
                  <li>پس از ثبت درخواست، فرصت محدودی (۳۰ دقیقه) برای انجام کارت به کارت خواهید داشت.</li>
                  <li>واریز باید حتماً از کارت انتخابی شما انجام شود.</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </form>
      ) : (
        <>
          {/* Summary */}
          <div className="rounded-lg text-black0 space-y-8">
            <div className="flex flex-col gap-3 text-black0 rounded-xl  py-4 items-center bg-gray47">
              <span className=" lg:text-base text-sm">فرصت باقی مانده برای انجام کارت به کارت</span>
              <span className="font-bold lg:text-xl text-base ">{toPersianDigits(formatTimer(timer))}</span>
            </div>

            <div className="space-y-6 ">
              <div className="flex justify-between items-center">
                <span className="text-gray5 lg:text-lg text-sm">کارت مبدا</span>
                <div className="flex gap-2 items-center">
                  <span className="text-sm lg:text-base">{transactionData.fromCard}</span>
                  <span className="icon-wrapper lg:w-7 lg:h-7 w-6 h-6">{transactionData.fromBankIcon}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray5 lg:text-lg text-sm">مبلغ تراکنش</span>
                <span className="text-sm lg:text-base">{formatPersianDigits(transactionData.amount ?? 0)} تومان</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray5 lg:text-lg text-sm">شماره کارت مقصد</span>
                <span className="text-sm lg:text-base">{formatPersianCardNumber(transactionData.toCard)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray5 lg:text-lg text-sm">شماره کارت مقصد</span>
                <span className="text-sm lg:text-base">{transactionData.owner}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray5 lg:text-lg text-sm">کارمزد</span>
                <span className="text-sm lg:text-base">{formatPersianDigits(transactionData.fee)} تومان</span>
              </div>
              <div className="flex justify-between items-center lg:pb-52">
                <span className="text-gray5 lg:text-lg text-sm">مبلغ نهایی با کسر کارمزد</span>
                <span className="text-sm lg:text-base">{formatPersianDigits(transactionData.finalAmountWithFee)} تومان</span>
              </div>
            </div>
            {/* <button type="button" onClick={() => setShowSummary(false)} className="mt-8 text-blue2 bg-gray-100 w-full py-3 font-bold text-lg rounded-lg">
              بازگشت
            </button> */}
          </div>

          <div dir="rtl" className="bg-orange5 rounded-xl p-4 text-sm text-left mt-8">
            <div className="flex text-orange1 gap-1 font-medium items-center">
              <span className="icon-wrapper w-4 h-4">
                <IconAlert />
              </span>
              <span>توجه داشته باشید</span>
            </div>
            <ul className="text-right pt-2 lg:pt-4 list-disc list-inside text-black0 lg:text-[16px] leading-relaxed text-xs space-y-2">
              <li>حتما بایستی از کارت مقصدی که انتخاب کرده‌اید و مبلغی که درج کرده‌اید تراکنش انجام شود.</li>
              <li>پس از انجام کارت به کارت به صورت خودکار کیف پول تومانی شما شارژ می‌شود.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
