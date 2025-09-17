import { Controller, useForm } from "react-hook-form";
import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
import Accordion from "../Withdrawal/Accordion";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { yupResolver } from "@hookform/resolvers/yup";

export default function DepositForm() {
  const amounts = [5, 10, 20, 50];

  const { control } = useForm({
    resolver: yupResolver(),
  });

  return (
    <>
      <div className="w-full lg:px-7 " dir="rtl">
        <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>

        <div dir="rtl" className="mb-1.5">
          <Controller
            name="amount"
            control={control}
            rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
            render={({ field }) => (
              <>
                <FloatingInput
                  label="مقدار واریزی"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="0 تومان "
                  placeholderColor="text-black0"
                />
              </>
            )}
          />
        </div>

        <p className="text-gray12 text-sm mb-5">
          میزان واریزی حداقل 25 هزار تومان و حداکثر تا سقف 25 میلیون تومان{" "}
        </p>
        <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
          {amounts.map((amount, index) => (
            <button
              key={index}
              className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
            >
              {amount} میلیون
            </button>
          ))}
        </div>

        <div className="mb-3">
          <Controller
            name="bank"
            control={control}
            rules={{ required: "لطفا بانک را انتخاب کنید" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder="بانک خود را انتخاب کنید"
                placeholderColor="text-sm text-gray12"
                label="انتخاب بانک"
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "meli",
                    label: "بانک ملی ایران",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper">
                        <BankMelliLogo />
                      </span>
                    ),
                  },
                  {
                    value: "mellat",
                    label: "بانک ملت ایران",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper">
                        <BankMellatLogo />
                      </span>
                    ),
                  },
                  {
                    value: "noor",
                    label: "بانک انصار",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper">
                        <BankAnsarLogo />
                      </span>
                    ),
                  },
                  {
                    value: "melal",
                    label: "مؤسسه اعتباری ملل",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper">
                        <BankAnsarLogo />
                      </span>
                    ),
                  },
                ]}
              />
            )}
          />
        </div>

        <div className="flex items-center flex-col mt-3">
          <div className="flex w-full justify-between items-center">
            <span className="text-gray5">کارمزد</span>
            <span className="text-black0">۵۰.۰۰۰ تومان</span>
          </div>
          <div className="flex w-full justify-between items-center">
            <span className="text-gray5">مبلغ نهایی واریز به کیف پول</span>
            <span className="text-black0">۹۹۵.۰۰۰.۰۰۰ تومان</span>
          </div>
        </div>

        <div className="mt-16">
          <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
            واریز
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای برداشت رمز ارز">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>
                  از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
                  شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
                </li>
                <li>
                  مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
                </li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}
