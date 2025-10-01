import { useForm, Controller } from "react-hook-form";
import { apiRequest } from "../../utils/apiClient";
import FloatingInput from "./../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
import IconBankMelliLogo from "./../../assets/icons/BankCards/IconBankMelliLogo";
import IconBankMellatLogo from "./../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

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

  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: "",
      bank: null, // پیش‌فرض null
    },
  });

  const isTwoFactorEnabled = false;

  const onSubmit = async (data: WithdrawFormValues) => {
    if (!data.bank) return;
     const amountNumber = Number(data.amount);

     // شرط ۱: حداقل مقدار برداشت
    if (amountNumber < 100000) {
    toast.error("حداقل مقدار برداشت 100,000 تومان میباشد.");
    return;
    }
     // شرط ۲: فعال بودن ورود دو مرحله‌ای
    if (!isTwoFactorEnabled) {
      toast.error("برای خرید لازم است یکی از روش‌های ورود دو مرحله‌ای را فعال کنید.");
      return;
    }


    try {
      const response = await apiRequest({
        url: "/api/wallets/fiat/withdraw",
        method: "POST",
        data: {
          amount: amountNumber,
        card: data.bank?.id,
    // codeOtp: otpValue,
        },
      });
      console.log("Withdraw Response:", response);
    } catch (err) {
      console.error("Withdraw Error:", err);
    }
  };

const bankOptions = listCards.map(card => ({
  value: card,   // ← کل کارت
  label: (
    <div className="flex flex-row-reverse justify-between items-center w-full">
      <span>{card.bank}</span>
      <span className="text-sm text-gray-700">{card.card}</span>
    </div>
  ),
}));


  return (
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
              />
            )}
          />
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
  );
}
