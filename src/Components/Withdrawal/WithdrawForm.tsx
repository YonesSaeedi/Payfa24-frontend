
import { useForm, Controller } from "react-hook-form";
import { apiRequest } from "../../utils/apiClient";
import FloatingInput from "./../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconClose from "../../assets/Icons/Login/IconClose";
import TradeSuccessModal from "../trade/TradeSuccessModal";
import OTPInputModal from "../trade/OTPInputModal";
import { useWatch } from "react-hook-form";
import useGetUser from "../../hooks/useGetUser";


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
  const [selectedCoin, setSelectedCoin] = useState<typeof coin | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isTradeSuccessModalOpen, setIsTradeSuccessModalOpen] = useState(false);
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
    const { data: userData, isLoading: isUserLoading } = useGetUser();
  const userMobile = userData?.user?.mobile || "شماره شما";



  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: { amount: "", bank: null },
  });
const watchAmount = useWatch({ control, name: "amount" });
const watchBank = useWatch({ control, name: "bank" });
// const allFieldsFilled = watchAmount && watchBank;
const allFieldsFilled = !!watchBank && !!watchAmount && Number(watchAmount) > 0;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await apiRequest<any>({ url: "/api/wallets/fiat?withdraw=true", method: "GET" });
      setListCards(response.list_cards || []);
     setWalletBalance(Number(response.wallet.balance_available) || 0);
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
  const [isSubmitting, setIsSubmitting] = useState(false);


 const onSubmit = async (data: WithdrawFormValues) => {
  const amountNumber = Number(data.amount);
  setIsSubmitting(true);
if (amountNumber < 100000) {
  
  toast.error("حداقل مقدار برداشت 100,000 تومان میباشد.");
  setIsSubmitting(false); // ✅ باید همین‌جا باشد
  return;
}


  try {
    // درخواست اولیه بدون OTP
    const response = await apiRequest({
      url: "/api/wallets/fiat/withdraw",
      method: "POST",
      data: {
        amount: amountNumber,
        card: data.bank?.id,
      },
    });

  
      toast.success("کد تأیید ارسال شد ✅");
      setPendingWithdrawData(data);
      setIsOtpModalOpen(true);
      setResendCodeTimeLeft(120);
      setIsResending(false);
  }catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در برداشت!");
  }
finally {
    // ✅ این تضمین می‌کند که دکمه همیشه دوباره فعال شود
    setIsSubmitting(false);
  }

};


const handleOtpSubmit = async () => {
  if (!otpCode || !pendingWithdrawData) {
    toast.error("کد OTP وارد نشده است.");
    return;
  }

  try {
    const response = await apiRequest({
      url: "/api/wallets/fiat/withdraw",
      method: "POST",
      data: {
        amount: Number(pendingWithdrawData.amount),
        card: pendingWithdrawData.bank?.id,
        codeOtp: otpCode,
      },
    });

    
    toast.success("درخواست برداشت ثبت شد ✅");
    setIsOtpModalOpen(false);
    setOtpCode("");
    setIsTradeSuccessModalOpen(true);

  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در برداشت!");
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
        className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray43 flex flex-col justify-between  w-full lg:border lg:border-gray26"
      >
        <div>
          <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex flex-row justify-between items-center text-blue17">
            <div className="flex flex-row">
              <span className="w-6 h-6 icon-wrapper ml-2 text-blue17">
              <IconVideo />
            </span>
            <h2 className="font-normal text-blue17">ویدیو آموزشی برداشت تومانی</h2>
            </div>
            
            <span className="w-6 h-6 icon-wrapper  text-blue17 ">
              <IconClose/>
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
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="0 تومان"
                   borderClass="border-gray12"
                   className="text-black0"
                />
              )}
            />
             <div dir="rtl" className="flex items-center justify-between mb-4 mt-3">
                      <span className="text-gray5 text-md">موجودی قابل برداشت</span>
                      <span className="font-medium text-blue-400 text-md">
                       {walletBalance.toLocaleString()} تومان
                      </span>
                      </div>
          </div>
           

          <div className="mb-6">
            {bankOptions.length > 0 ? (
             <Controller
  name="bank"
  control={control}
  rules={{ required: "لطفا بانک را انتخاب کنید" }}
  render={({ field }) => (
    <FloatingSelect
      placeholder={bankOptions.length === 0 ? "در حال بارگذاری کارت‌ها..." : "کارت بانکی را انتخاب کنید"}
      label="کارت بانکی"
      value={field.value?.id?.toString() || ""} // مقدار را به string تبدیل کن
      onChange={(val) => {
        const selected = listCards.find((c) => c.id.toString() === val);
        field.onChange(selected || null); // حالا react-hook-form مقدار درست را دارد
        // اگر لازم است state محلی هم بروزرسانی شود
        // setSelectedCard(selected?.id || null);
      }}
      options={listCards.map((card) => ({
        value: card.id.toString(),
        label: `${card.bank} - ${card.card.replace(/(\d{4})(?=\d)/g, "$1-")}`,
      }))}
    />
  )}
/>

            ) : (
              <div className="w-full border rounded-lg p-3 text-center text-gray-500 border-gray12">
                هیچ کارت بانکی موجود نمی‌ باشد
              </div>
            )}
          </div>
          <div>
            


               <div dir="rtl" className=" text-gray-500 mt-3 space-y-2">
                    {/* ردیف اول */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-md text-gray5">کارمزد</span>
                      <span className="text-md text-gray-700">
                       
                      </span>
                    </div>
                    {/* ردیف دوم */}
                    <div className="flex items-center justify-between ">
                      <span className="text-md text-gray5">مبلغ نهایی واریز به کیف پول </span>
                      <span className="text-md text-gray-700">
                       
                      </span>
                    </div>
                  
                  </div>
          </div>
        </div>

        <div>
        <button
  type="submit"
  disabled={!allFieldsFilled || isSubmitting}
  className={`w-full py-3 rounded-lg mt-24 font-bold text-[18px] transition-colors duration-300 ${
    !allFieldsFilled || isSubmitting
      ? "bg-gray12  text-white cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
>
  {isSubmitting ? "درحال برداشت وجه" : "برداشت"}
</button>

        </div>
      </form>

      {/* مودال OTP دقیقاً با همان استایل دوستت */}
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
    mainText={`لطفاً کد ارسال شده به شماره ${userMobile} را وارد کنید`}
    submitButtonText="تأیید"
    titleText="تأیید برداشت"
  />
      </div>
 
)}

{isTradeSuccessModalOpen && (
  <div dir="rtl">
    <TradeSuccessModal
    setIsTradeSuccessModalOpen={setIsTradeSuccessModalOpen}
    isSell={false}
  />
  </div>
  
)}

    </>
  );
}
