import { useForm, Controller } from "react-hook-form";
import FloatingInput from "./../FloatingInput/FloatingInput";
import IconVideo from "./../../assets/icons/Withdrawal/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";

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
    // اینجا می‌تونی API فراخوانی کنی
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 rounded-xl shadow-sm bg-gray44 flex flex-col justify-between h-[644px]"
    >
      {/* بخش بالایی (فیلدها) */}
      <div>
        {/* عنوان */}
        <div
          dir="rtl"
          className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center"
        >
          <span className="w-6 h-6 icon-wrapper ml-2">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت تومانی</h2>
        </div>

        {/* مقدار برداشت */}
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

        {/* انتخاب بانک */}
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
                    icon: <img src="/meli.png" className="w-5 h-5" />,
                  },
                  {
                    value: "mellat",
                    label: "بانک ملت ایران",
                    icon: <img src="/mellat.png" className="w-5 h-5" />,
                  },
                  {
                    value: "noor",
                    label: "بانک نور",
                    icon: <img src="/noor.png" className="w-5 h-5" />,
                  },
                  {
                    value: "melal",
                    label: "مؤسسه اعتباری ملل",
                    icon: <img src="/melal.png" className="w-5 h-5" />,
                  },
                ]}
              />
            )}
          />
        </div>

        {/* کارمزد و مبلغ نهایی */}
        <div dir="rtl" className="mb-4 text-sm text-gray-600 flex flex-col">
          <div className="flex justify-between">
            <p>کارمزد</p>
            <p>500 تومان</p>
          </div>
          <div className="flex justify-between">
            <p>مبلغ نهایی واریز به کیف پول</p>
            <p>500 تومان</p>
          </div>
        </div>
      </div>

      {/* دکمه ثبت */}
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
