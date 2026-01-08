import { useForm, Controller } from "react-hook-form";
import { apiRequest } from "../../utils/apiClient";
import FloatingInput from "../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import IconClose from "../../assets/icons/Login/IconClose";
import TradeSuccessModal from "../trade/TradeSuccessModal";
import OTPInputModal from "../trade/OTPInputModal";
import { useWatch } from "react-hook-form";
import useGetUser from "../../hooks/useGetUser";
import { getBankLogo } from "../../utils/bankLogos";
import { AxiosError } from "axios";
import { ROUTES } from "../../routes/routes";
import { formatPersianNumber } from "../../utils/formatPersianNumber";

interface WithdrawRequestResponse {
  transaction_id: number;
  msg?: string;
  msgOtp?: string; 
  otp?: boolean;    
  status?: boolean; 
}

interface PendingWithdrawData {
  amount: number;
  bank: BankOption;
  transactionId: number;
}

interface WalletResponse {
  list_cards: { id: number; card: string; bank: string }[];
  wallet: {
    balance_available: number;
  };
}

interface BankOption {
  bank: string;
  card: string;
  id: number;
}
interface WithdrawFormValues {
  amount: string;
  bank: BankOption | null;
  transactionId?: number;
}

export default function WithdrawForm() {
  const [listCards, setListCards] = useState<{ id: number; card: string; bank: string }[]>([]);
  const [isOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [resendTimer, setResendTimer] = useState(120);
  const [, setCanResend] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isTradeSuccessModalOpen, setIsTradeSuccessModalOpen] = useState(false);
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [, setSelectedCard] = useState<number | null>(null);
  const [pendingWithdrawData, setPendingWithdrawData] = useState<PendingWithdrawData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData } = useGetUser();
  const userMobile = userData?.user?.mobile || "شماره شما";

  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: { amount: "", bank: null },
  });
  const watchAmount = useWatch({ control, name: "amount" });
  const watchBank = useWatch({ control, name: "bank" });
  const allFieldsFilled = !!watchBank && !!watchAmount && Number(watchAmount) > 0;
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
 const [otpMessage, setOtpMessage] = useState<string>('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await apiRequest<WalletResponse>({
          url: "/wallets/fiat",
          params: { withdraw: 'true' }
        });
        setListCards(response.list_cards || []);
        setWalletBalance(Number(response.wallet.balance_available) || 0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, []);

  const toPersianDigits = (num: string) => num.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

  const toEnglishDigits = (num: string) => num.replace(/[۰-۹]/g, (d) => "0123456789"["۰۱۲۳۴۵۶۷۸۹".indexOf(d)]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: WithdrawFormValues) => {
    const amountNumber = Number(data.amount);
    setIsSubmitting(true);

    if (amountNumber < 100000) {
      toast.error("حداقل مقدار برداشت 100,000 تومان میباشد.");
      setIsSubmitting(false);
      return;
    }

    if (!data.bank) {
      toast.error("لطفاً یک کارت بانکی انتخاب کنید");
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      amount: amountNumber,
      card: data.bank.id,
    };

    try {
      const response = await apiRequest<WithdrawRequestResponse, { amount: number; card: number}>({
        url: "/wallets/fiat/withdraw/request",
        method: "POST",
        data: requestData,
      });

      const transactionId = response.transaction_id;

      setPendingWithdrawData({
        amount: amountNumber,
        bank: data.bank,
        transactionId,
      });

    setOtpMessage(response.msgOtp || `لطفاً کد ارسال شده به شماره ${userMobile} را وارد کنید`);
setIsOtpModalOpen(true);
toast.success("کد تأیید ارسال شد");

      setResendCodeTimeLeft(120);
      setIsResending(false);
    } catch (err: unknown) {
  let message = "در ارسال درخواست برداشت مشکلی پیش آمده است";

  if (err instanceof AxiosError) {
    message = err.response?.data?.msg || message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  toast.error(message);
}
finally {
      setIsSubmitting(false);
    }
  };
 const handleOtpSubmit = async () => {
  if (!otpCode || !pendingWithdrawData) {
    toast.error("کد OTP وارد نشده است.");
    return;
  }

  setIsSubmittingOtp(true); // ← دکمه OTP غیرفعال شود

  try {
    await apiRequest({
      url: "/wallets/fiat/withdraw/confirm",
      method: "POST",
      data: {
        transaction_id: pendingWithdrawData.transactionId,
        codeOtp: otpCode,
      },
    });

    toast.success("درخواست برداشت ثبت شد");
    setIsOtpModalOpen(false);
    setOtpCode("");
    setIsTradeSuccessModalOpen(true);
  } catch (err: unknown) {
    let message = "خطا در برداشت!";
    if (err instanceof AxiosError && err.response?.data?.msg) {
      message = err.response.data.msg;
    } else if (err instanceof Error) {
      message = err.message;
    }
    toast.error(message);
  } finally {
    setIsSubmittingOtp(false); // ← بعد از دریافت پاسخ API، دکمه دوباره فعال می‌شود
  }
};

  const handleResendCode = () => {
    setResendCodeTimeLeft(120);
    setIsResending(true);
    toast.success("کد جدید ارسال شد");
    setIsResending(false);
  };

  useEffect(() => {
    if (!isOtpModalOpen) return;
    let timer: NodeJS.Timeout;
    if (resendCodeTimeLeft > 0) {
      timer = setInterval(() => {
        setResendCodeTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpModalOpen, resendCodeTimeLeft]);

  const bankOptions = listCards.map((card) => ({
    value: { ...card, bankName: card.bank },
    label: (
      <div className="flex justify-between items-center w-full">
        <span>{card.bank}</span>
        <span className="text-sm text-gray-700">{card.card.replace(/(\d{4})(?=\d)/g, "$1-")}</span>
      </div>
    ),
  }));

  const formatPersianInteger = (num: number) => {
    const integerPart = Math.trunc(num);
    const withCommas = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return toPersianDigits(withCommas);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray43 flex flex-col justify-between  w-full lg:border lg:border-gray26">
        <div>
          <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex flex-row justify-between items-center text-blue17">
            <div className="flex flex-row">
              <span className="w-6 h-6 icon-wrapper ml-2 text-blue17">
                <IconVideo />
              </span>
              <h2 className="font-normal text-blue17">ویدیو آموزشی برداشت تومانی</h2>
            </div>
            <span className="w-6 h-6 icon-wrapper  text-blue17 ">
              <IconClose />
            </span>
          </div>

          <div dir="rtl" className="mb-6">
            <Controller
              name="amount"
              control={control}
              rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
              render={({ field }) => (
                <FloatingInput
                  label="مقدار برداشت (تومان)"
                  value={field.value ? formatPersianInteger(Number(field.value)) : ""}
                  onChange={(e) => {
                    let value = e.target.value;
                    value = toEnglishDigits(value.replace(/,/g, ""));
                    if (/^\d*$/.test(value)) {
                      field.onChange(value);
                    } else {
                      field.onChange(field.value);
                    }
                  }}
                  type="text"
                  placeholder="۰ تومان"
                  className="text-black0 border-gray12"
                />
              )}
            />

            <div dir="rtl" className="flex items-center justify-between mb-4 mt-3">
              <span className="text-gray5 text-md text-[14px] font-normal">موجودی قابل برداشت</span>
              {isLoading ? (
                <div className="h-5 w-20 skeleton-bg rounded animate-pulse"></div>
              ) : (
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <span
                      className="text-blue2 text-md font-normal text-[14px] cursor-pointer"
                      onClick={() => {
                        field.onChange(Math.trunc(walletBalance).toString());
                      }}
                    >
                      {formatPersianNumber(walletBalance)} تومان
                    </span>
                  )}
                />
              )}
            </div>
          </div>

          <div className="mb-6">
            {bankOptions.length > 0 ? (
              <Controller
                name="bank"
                control={control}
                rules={{ required: "لطفاً کارت بانکی را انتخاب کنید" }}
                render={({ field }) => (
                  <FloatingSelect
                    label="کارت بانکی"
                    value={field.value?.id.toString() || ""}
                    onChange={(val) => {
                      const selected = listCards.find((c) => c.id === Number(val)) || null;
                      field.onChange(selected);
                      setSelectedCard(selected ? selected.id : null);
                    }}
                    options={listCards.map((card) => ({
                      value: card.id.toString(),
                      label: `${card.bank} - ${card.card}`,
                      icon: <img src={getBankLogo(card.bank) || "/bank-logos/bank-sayer.png"} alt={card.bank} className="w-6 h-6 object-contain" />,
                    }))}
                  />
                )}
              />
            ) : (
              <div className="w-full border rounded-lg p-3 text-center text-gray-500 border-gray12">هیچ کارت بانکی موجود نمی‌ باشد</div>
            )}
          </div>
          <div>
            <div dir="rtl" className=" text-gray-500 mt-3 space-y-2">
              {/* ردیف اول */}
            <div className="flex items-center justify-between mb-4">
  <span className=" text-gray5 text-[14px] font-normal">کارمزد</span>
  <span className="text-md text-gray-700">
    {formatPersianNumber(0)} تومان
  </span>
</div>

              {/* ردیف دوم */}
             <div className="flex items-center justify-between ">
  <span className=" text-gray5 text-[14px] font-normal">
    مبلغ نهایی واریز به کیف پول
  </span>
  <span className="text-md text-gray-700">
    {watchAmount && Number(watchAmount) > 0
      ? `${formatPersianInteger(Number(watchAmount))} تومان`
      : ""}
  </span>
</div>

            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={!allFieldsFilled || isSubmitting}
            className={`w-full py-3 rounded-lg mt-24 font-bold text-[18px] transition-colors duration-300 ${!allFieldsFilled || isSubmitting ? "bg-blue2  text-white cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {isSubmitting ? "درحال برداشت وجه" : "برداشت"}
          </button>
        </div>
      </form>

      {isOtpModalOpen && (
        <div dir="rtl" className="flex justify-end">
          <OTPInputModal
            closeModal={() => {
              setIsOtpModalOpen(false);
              setOtpCode("");
            }}
            onChange={(value: string) => setOtpCode(value)}
            onSubmit={handleOtpSubmit}
            OTPLength={6}
            handleResendCode={handleResendCode}
            resendCodeIsSubmitting={isResending}
            resendCodeTimeLeft={resendCodeTimeLeft}
             mainText={otpMessage} 
            submitButtonText="تأیید"
            titleText="تأیید برداشت"
            isSubmitting={isSubmittingOtp}
            isSubmittingText="درحال ارسال..."
          />
        </div>
      )}

      {isTradeSuccessModalOpen && (
        <div dir="rtl">
          <TradeSuccessModal setIsTradeSuccessModalOpen={setIsTradeSuccessModalOpen} linkTo={ROUTES.TRANSACTION.TOMAN_HISTORY} successMsg="درخواست برداشت شما با موفقیت ثبت شد" />
        </div>
      )}
    </>
  );
}
