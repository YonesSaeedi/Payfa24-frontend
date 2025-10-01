import React from "react";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { Controller, useForm } from "react-hook-form";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { yupResolver } from "@hookform/resolvers/yup";
import Accordion from "../Withdrawal/Accordion";

export default function DepositwithIdentifier() {
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

        {/* =================== */}

        <div className="mb-12 ">
          <Controller
            name="bank"
            control={control}
            // rules={{ required: "زلا" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder="حساب بانکی را انتخاب کنید "
                label="حساب بانکی "
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

        {/* =================== */}

        <div className="mt-80">
          <button
            onClick={() => {
              setIsModal(true);
            }}
            className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
          >
            ارسال فیش واریز
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای واریز با شناسه">
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
        {/* ========== */}
      </div>
    </>
  );
}
