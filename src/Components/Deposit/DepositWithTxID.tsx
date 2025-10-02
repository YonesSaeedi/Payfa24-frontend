import { Controller, useForm } from "react-hook-form";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import { useState } from "react";
import IconMonnos from "../../assets/Icons/Deposit/IconMonnos";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyModal from "./CurrencyModal";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import QrCode from "../../assets/images/QRcode.png";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import TextField from "../InputField/TextField";
import Accordion from "../Withdrawal/Accordion";

const initialCurrency = {
  name: "مونوس",
  icon: <IconMonnos />,
};
export default function DepositWithTxID() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency); 
  const { control } = useForm({
    resolver: yupResolver(),
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency); // به‌روزرسانی استیت با ارز انتخاب شده از مودال
    closeModal();
  };
  return (
    <>
      <div className="w-full" dir="rtl">
        <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با TxID</span>
        </div>
        <div>
          <Controller
            name="currency"
            control={control}
            rules={{ required: "لطفا یک ارز انتخاب کنید" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder={selectedCurrency.name} // نمایش نام ارز انتخاب شده
                label="انتخاب رمز ارز"
                options={[]}
                value={field.value}
                onChange={field.onChange}
                onOpen={() => setIsModalOpen(true)}
                placeholderIcon={
                  <span className="icon-wrapper w-7 h-7">
                    {selectedCurrency.icon} {/* نمایش آیکون ارز انتخاب شده */}
                  </span>
                }
                placeholderClasses="text-black font-bold"
              />
            )}
          />
          <div className="flex justify-between mt-2 mb-10">
            <span className="text-sm text-gray5">موجودی مونوس</span>
            <span className="text-sm text-black0">0 Monos</span>
          </div>

          <Controller
            name="currency"
            control={control}
            rules={{ required: "لطفا یک ارز انتخاب کنید" }}
            render={({ field }) => (
              <FloatingSelect
                placeholder="ترون (TRC20)"
                label=" انتخاب شبکه "
                options={[]}
                value={field.value}
                onChange={field.onChange}
                onOpen={() => setIsModalOpen(true)}
                placeholderClasses="text-black0 "
              />
            )}
          />
          <div className="flex justify-between mt-2 mb-10">
            <span className="text-sm text-gray5">حداقل واریز </span>
            <span className="text-sm text-black0">Monos‌1</span>
          </div>

          <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
            <img className="w-32 h-32" src={QrCode} alt="QrCode" />
            <div className="flex justify-between w-full">
              <span className="text-gray5 text-xs lg:text-sm">آدرس ولت</span>
              <div className="flex items-center gap-1 justify-between ">
                <span className="text-black0 lg:text-sm text-xs">
                  373HD32HDKDIUWUEuyei877IIJDD
                </span>
                <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5">
                  <IconCopy />
                </span>
              </div>
            </div>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                label="لینک تراکنش TxID"
                onIconClick={() => setShowPassword((prev) => !prev)}
                {...field}
                labelBgClass="lg:bg-gray43 bg-white4"
                inputBgClass="lg:bg-gray43 bg-white4"
              />
            )}
          />
          <div className="lg:mt-14 mt-8 mb-10">
            <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
              ثبت اطلاعات
            </button>

            <div className="mt-4" dir="ltr">
              <Accordion title="TxID راهنمای واریز رمز ارز با  ">
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
      </div>
      {isModalOpen && (
        <CurrencyModal
          onClose={closeModal}
          onCurrencySelect={handleCurrencySelect}
        />
      )}
    </>
  );
}
