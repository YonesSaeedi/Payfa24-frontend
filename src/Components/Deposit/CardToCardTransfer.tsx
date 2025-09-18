import React, { useState } from "react";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { Controller, useForm } from "react-hook-form";
import FloatingInput from "../FloatingInput/FloatingInput";
import { yupResolver } from "@hookform/resolvers/yup";
import BankAnsarLogo from "../../assets/Icons/BankCards/IconBankAnsarLogo";
import BankMellatLogo from "../../assets/Icons/BankCards/IconBankMellatLogo";
import BankMelliLogo from "../../assets/Icons/BankCards/IconBankMelliLogo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import Accordion from "../Withdrawal/Accordion";
import IconConvertCard from "../../assets/Icons/Deposit/IconConvertCard";

interface TransactionDetail {
  label: string;
  value: string;
}
export default function CardToCardTransfer() {
  const [IsModal, setIsModal] = useState(false);
  const { control } = useForm({
    resolver: yupResolver(),
  });

  const transactionData: TransactionDetail[] = [
    { label: "کارت مبدا", value: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷" },
    { label: "کارت مقصد", value: "۸۳۷۸۳۷۸۳۸۸۱۴۷۷۴۶۴۷" },
    { label: "به نام", value: "گروه فرهنگی و هنری" },
  ];

  return (
    <>
      <div className="w-full lg:px-7 " dir="rtl">
        <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>

        {/* ========بانک مبدا====== */}
        <div className="mb-12 ">
          <Controller
            name="bank"
            control={control}
            rules={{ required: "زلا" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder="بانک مبدا را انتخاب کنید"
                label="انتخاب بانک مبدا"
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
        {/* ======= بانک مقصد ====== */}
        <div className="mb-2">
          <Controller
            name="bank"
            control={control}
            rules={{ required: "زلا" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder="بانک مقصد را انتخاب کنید"
                label="انتخاب بانک مقصد"
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

        <p className="lg:text-sm text-xs text-gray5 ">
          حالا با اپلیکیشن بانکی و یا دستگاه خودپرداز ATM مراجعه کنید و با
          استفاده از اطلاعات زیر مبلغ دلخواه را کارت به کارت کنید.
        </p>

        <div className="mt-40">
          <button
            onClick={() => {
              setIsModal(true);
            }}
            className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
          >
            ارسال فیش واریز
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای واریز با درگاه پرداخت">
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

        {IsModal && (
          <>
            <div className="bg-black bg-opacity-20 fixed inset-0  z-45">
              <div
                onClick={() => {
                  setIsModal(false);
                }}
                className="fixed inset-0 flex items-center flex-col justify-center z-50 "
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-lg lg:py-8 lg:px-10 p-4 relative bg-white8  flex flex-col"
                >
                  <span className="icon-wrapper w-14 h-14 text-blue2">
                    <IconConvertCard />
                  </span>
                  <span className="text-center">جزئیات تراکنش</span>
                  <div className="space-y-4">
                    {transactionData.map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-600">{item.label}:</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
