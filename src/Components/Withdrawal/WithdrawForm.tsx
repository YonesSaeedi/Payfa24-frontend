import { useForm, Controller } from "react-hook-form";
import { apiRequest } from "../../utils/apiClient";
import FloatingInput from "./../FloatingInput/FloatingInput";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
import IconBankMelliLogo from "./../../assets/icons/BankCards/IconBankMelliLogo";
import IconBankMellatLogo from "./../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";

interface BankOption {
  bank: string;
  card: string;
}

interface WithdrawFormValues {
  amount: string;
  bank: BankOption | null;
}

export default function WithdrawForm() {
  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: "",
      bank: null, // پیش‌فرض null
    },
  });

  const onSubmit = async (data: WithdrawFormValues) => {
    if (!data.bank) return;
    try {
      const response = await apiRequest({
        url: "/api/wallets/fiat/withdraw",
        method: "POST",
        data: {
          amount: data.amount,
          bank: data.bank.bank,
          card: data.bank.card,
        },
      });
      console.log("Withdraw Response:", response);
    } catch (err) {
      console.error("Withdraw Error:", err);
    }
  };

  const bankOptions: { value: BankOption; label: React.ReactNode; icon?: React.ReactNode }[] = [
    {
      value: { bank: "meli", card: "9303994045569504" },
      label: (
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span>بانک ملی ایران</span>
            <span className="w-6 h-6 icon-wrapper">
              <IconBankMelliLogo />
            </span>
          </div>
          <span className="text-sm text-gray-700">9303-9940-4556-9504</span>
        </div>
      ),
    },
    {
      value: { bank: "mellat", card: "6104331234567890" },
      label: (
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span>بانک ملت ایران</span>
            <span className="w-6 h-6 icon-wrapper">
              <IconBankMellatLogo />
            </span>
          </div>
          <span className="text-sm text-gray-700">6104-3312-3456-7890</span>
        </div>
      ),
    },
    {
      value: { bank: "noor", card: "6273819876543210" },
      label: (
        <div className="flex flex-row-reverse justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span>بانک انصار</span>
            <span className="w-6 h-6 icon-wrapper">
              <BankAnsarLogo />
            </span>
          </div>
          <span className="text-sm text-gray-700">6273-8198-7654-3210</span>
        </div>
      ),
    },
  ];

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
