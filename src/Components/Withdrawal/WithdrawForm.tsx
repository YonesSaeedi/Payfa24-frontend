import { useForm, Controller } from "react-hook-form";
import FloatingInput from "./../FloatingInput/FloatingInput";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconBankMelliLogo from "./../../assets/icons/BankCards/IconBankMelliLogo"
import IconBankMellatLogo from "./../../assets/icons/BankCards/IconBankMellatLogo"
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
interface WithdrawFormValues {
  amount: string;
  bank: string;
}

export default function WithdrawForm() {
  const { handleSubmit, control } = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: "",
      bank: "",
    },
  });

  const onSubmit = (data: WithdrawFormValues) => {
    console.log("Form Data:", data);
   
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 rounded-xl shadow-sm bg-gray47 flex flex-col justify-between h-[644px]"
    >
    
      <div>
      
        <div
          dir="rtl"
          className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center"
        >
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
              <>
                <FloatingInput
                  label="مقدار برداشت (تومان)"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="0 تومان"
                  placeholderColor="text-black0"
                  
                />
                <div className="flex justify-between pt-2">
                  <p className="text-xs text-gray-500 mt-1">
                    کل موجودی: ۳۲۰,۰۰۰ تومان
                  </p>
                  <button
                    type="button"
                    className="text-blue-500 text-xs mt-1"
                    onClick={() => field.onChange(320000)}
                  >
                    همه موجودی
                  </button>
                </div>
              </>
            )}
          />
        </div>

       
        <div className="mb-6">
          <Controller
            name="bank"
            control={control}
            rules={{ required: "لطفا بانک را انتخاب کنید" }}
            render={({ field }) => (
              <FloatingSelect
                label="انتخاب بانک"
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "meli",
                    label: "بانک ملی ایران",
                    icon: <span className="w-6 h-6 icon-wrapper"><IconBankMelliLogo/></span>,
                  },
                  {
                    value: "mellat",
                    label: "بانک ملت ایران",
                    icon: <span className="w-6 h-6 icon-wrapper"><IconBankMellatLogo/></span>,
                  },
                  {
                    value: "noor",
                    label: "بانک انصار",
                    icon:<span className="w-6 h-6 icon-wrapper"><BankAnsarLogo/></span>,
                  },
                  {
                    value: "melal",
                    label: "مؤسسه اعتباری ملل",
                    icon: <span className="w-6 h-6 icon-wrapper"><BankAnsarLogo/></span>,
                  },
                ]}
               
              />
            )}
          />
        </div>

        
        <div dir="rtl" className="mb-4 text-sm text-gray-600 flex flex-col">
          <div className="flex justify-between text-sm">
            <p className="text-gray45">کارمزد</p>
            <p  className="text-black1">500 تومان</p>
          </div>
          <div className="flex justify-between pt-4 text-sm">
            <p className="text-gray45">مبلغ نهایی واریز به کیف پول</p>
            <p  className="text-black1">500 تومان</p>
          </div>
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
