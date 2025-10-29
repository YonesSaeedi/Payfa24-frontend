import { useState, useEffect, } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import FloatingInput from "../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import Accordion from "../Withdrawal/Accordion";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import IconAlert from "../../assets/icons/Login/IconAlert";
import { getValidationSchemaCardtoCard } from "../../utils/validationSchemas";
import { AxiosError } from "axios";
import { getBankLogo } from "../../utils/bankLogos";

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

interface WalletsFiatResponse {
  status: boolean;
  msg: string;
  list_cards: CreditCard[];
  cardToCard: CardToCardInfo;
}

interface CardToCardRequestData extends Record<string, any> {
  amount: number;
  card: number;
}

interface CardToCardResponse {
  status: boolean;
  msg: string;
}



const formatCardNumber = (
  cardNumber: string,
  full: boolean = false
): string => {
  if (!cardNumber) return "—";
  if (full) return cardNumber;
  const cleaned = cardNumber.replace(/\s+/g, "");
  return cleaned.replace(/(.{4})(?=.)/g, "$1-");
};

const formatTimer = (seconds: number) => {
  if (seconds < 0) return "00:00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

// --- Component ---
export default function CardToCardTransfer() {
  const amounts = [5, 10, 20, 50]; // میلیون تومان
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
    reset,
  } = useForm<CardToCardRequestData>({
    resolver: yupResolver(getValidationSchemaCardtoCard()),
    defaultValues: { card: 0 },
  });

  const selectedAmount = watch("amount");
  const selectedCardId = watch("card");
  const selectedCard = cards.find((c) => c.id === selectedCardId);

  // --- Fetch wallet & cardToCard data ---
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

          // تایمر
          if (response.cardToCard.transaction) {
            const transactionDate = new Date(
              response.cardToCard.transaction.date
            );
            const endTime = transactionDate.getTime() + 30 * 60 * 1000; // 30 دقیقه بعد
            const remaining = Math.max(
              0,
              Math.floor((endTime - Date.now()) / 1000)
            );
            setTimer(remaining);
            setShowSummary(remaining > 0);
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

  // --- Countdown timer ---
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

  // --- Submit ---
  const onSubmit = async (data: CardToCardRequestData) => {
    if (showSummary) return; // تا پایان تایمر فرم غیرفعال

    setIsSubmitting(true);
    try {
      const requestData = { amount: Number(data.amount), card: data.card };
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

        const updatedResponse = await apiRequest<WalletsFiatResponse>({
          url: "/api/wallets/fiat",
          method: "GET",
        });
        if (updatedResponse.status && updatedResponse.cardToCard.transaction) {
          setResponseData(updatedResponse);
          reset({ amount: 0, card: 0 });

          const transactionDate = new Date(
            updatedResponse.cardToCard.transaction.date
          );
          const endTime = transactionDate.getTime() + 30 * 60 * 1000;
          const remaining = Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
          );
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
      toast.error(
        axiosError.response?.data?.msg ||
          "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Transaction summary data ---
  const summarySourceCard = cards.find(
    (c) => c.id === responseData?.cardToCard?.transaction?.card
  );
  const finalSourceCard = showSummary ? summarySourceCard : selectedCard;
  const finalAmount = showSummary
    ? responseData?.cardToCard?.transaction?.amount
    : Number(selectedAmount) || 0;

  const transactionData = {
    fromCard: formatCardNumber(finalSourceCard?.card || "", true),
   fromBankIcon: finalSourceCard ? (
  <img
    src={getBankLogo(finalSourceCard.bank) || "/bank-logos/bank-sayer.png"}
    alt={finalSourceCard.bank}
    className="w-7 h-7 object-contain"
  />
) : null,


    toCard: responseData?.cardToCard?.card?.card || "—",
    toBank: responseData?.cardToCard?.card?.bank || "",
    owner: responseData?.cardToCard?.card?.name || "گروه فرهنگی و هنری",
    amount: finalAmount,
    finalAmountWithFee:
      finalAmount && finalAmount >= 100000
        ? (finalAmount - 100000).toLocaleString("fa-IR")
        : (finalAmount || 0).toLocaleString("fa-IR"),
  };

  if (loadingData) return <span className="w-7 h-4 skeleton-bg"></span>;
  if (showSummary && !responseData?.cardToCard?.card)
    return (
      <div className="text-center py-8 text-red1">
        خطا: اطلاعات کارت مقصد ناقص است. لطفاً با پشتیبانی تماس بگیرید.
      </div>
    );

  return (
    <div className="w-full" dir="rtl">
      {!showSummary ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Video guide */}
          <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
            <span className="icon-wrapper w-6 h-6 text-blue2">
              <IconVideo />
            </span>
            <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
          </div>

          {/* Card select */}
          <div className="mb-12 w-full">
            <Controller
              name="card"
              control={control}
              render={({ field }) => (
                <>
                  <FloatingSelect
                    placeholder="کارت مبدا را انتخاب کنید"
                    label="انتخاب کارت مبدا"
                    value={field.value?.toString() || ""}
                    onChange={(v) => field.onChange(Number(v))}
                    options={cards.map((card) => ({
                      value: card.id.toString(),
                      label: (
                        <div className="flex items-center justify-between w-full py-1 rounded-md">
                          <span className="text-sm text-black0">
                            {card.bank}
                          </span>
                          <span className="text-sm text-black0">
                            {formatCardNumber(card.card)}
                          </span>
                        </div>
                      ) as any,
                      icon: (
                        <img
                          src={
                            getBankLogo(card.bank) ||
                            "/bank-logos/bank-sayer.png"
                          }
                          alt={card.bank}
                          className="w-6 h-6 object-contain"
                        />
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

          {/* Amount input */}
          <div dir="rtl" className="mb-1.5 mt-8">
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <FloatingInput
                  label="مقدار واریزی"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="۰ تومان"
                  placeholderColor="text-black0"
                />
              )}
            />
            {errors.amount && (
              <p className="text-red1 text-xs py-3">
                مقدار واریزی حداقل ۵۰۰,۰۰۰ تومان می باشد
              </p>
            )}
          </div>

          {/* Preset amounts */}
          <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
            {amounts.map((amount, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPresetAmount(amount)}
                className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
              >
                {amount} میلیون
              </button>
            ))}
          </div>

          {/* Submit */}
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

            {/* Accordion guide */}
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
        <>
          {/* Summary */}
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
              <div className="flex justify-between items-center">
                <span className="text-gray5">کارت مبدا</span>
                <div className="flex gap-2 items-center">
                  <span>{transactionData.fromCard}</span>
                  <span className="icon-wrapper lg:w-7 lg:h-7 w-6 h-6">
                    {transactionData.fromBankIcon}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray5">مبلغ تراکنش</span>
                <span>
                  {transactionData.amount?.toLocaleString("fa-IR") ?? "0"} تومان
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray5">شماره کارت مقصد</span>
                <span>{transactionData.toCard}</span>
              </div>

              <div className="flex justify-between items-center lg:pb-52">
                <span className="text-gray5">مبلغ نهایی با کسر کارمزد</span>
                <span>{transactionData.finalAmountWithFee} تومان</span>
              </div>
            </div>
            {/* <button type="button" onClick={() => setShowSummary(false)} className="mt-8 text-blue2 bg-gray-100 w-full py-3 font-bold text-lg rounded-lg">
              بازگشت
            </button> */}
          </div>

          <div
            dir="rtl"
            className="bg-orange5 rounded-xl p-4 text-sm text-left mt-8"
          >
            <div className="flex text-orange1 gap-1 font-medium items-center">
              <span className="icon-wrapper w-4 h-4">
                <IconAlert />
              </span>
              <span>توجه داشته باشید</span>
            </div>
            <ul className="text-right pt-2 lg:pt-4 list-disc list-inside text-black0 lg:text-[16px] leading-relaxed text-xs space-y-2">
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
