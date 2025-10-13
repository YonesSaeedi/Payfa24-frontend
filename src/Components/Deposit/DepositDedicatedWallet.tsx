import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyModal from "./CurrencyModal";
import IconMonnos from "../../assets/Icons/Deposit/IconMonnos";
import Accordion from "../Withdrawal/Accordion";
import QrCode from "../../assets/images/QRcode.png";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import IconMoneyTime from "../../assets/Icons/Deposit/IconMoneyTime";
import IconTimer from "../../assets/Icons/Deposit/IconTimer";
// اطلاعات اولیه برای نمایش پیش‌فرض
const initialCurrency = {
  name: "مونوس",
  icon: <IconMonnos />,
};

// گزینه‌های شبکه
const networkOptions = [
  { value: "trc20", label: "ترون (TRC20)" },
  { value: "ton", label: "تن (TON)" },
  { value: "erc20", label: "اتریوم (ERC20)" },
  { value: "polygon", label: "پالیگان" },
];

export default function DepositDedicatedWallet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressCreated, setIsAddressCreated] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);

  const { control, watch, setValue } = useForm({
    // ⭐️ اضافه شدن setValue و watch
    resolver: yupResolver(),
    defaultValues: {
      // ⭐️ تعریف مقدار پیش‌فرض برای network
      currency: "",
      network: "trc20",
    },
  });

  // ⭐️ مشاهده مقدار انتخاب شده network
  const selectedNetwork = watch("network");
  const selectedNetworkLabel =
    networkOptions.find((opt) => opt.value === selectedNetwork)?.label ||
    "انتخاب شبکه";

  const handleCreateAddress = () => {
    // در یک سناریوی واقعی، باید اعتبارسنجی و فراخوانی API انجام شود
    setIsAddressCreated(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setValue("currency", currency.value, { shouldValidate: true }); // ⭐️ به‌روزرسانی مقدار فرم
    closeModal();
  };

  return (
    <>
      <div className="w-full" dir="rtl">
        {/* بخش ویدیو آموزشی */}
        <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>

        {/* انتخاب ارز */}
        <Controller
          name="currency"
          control={control}
          rules={{ required: "لطفا یک ارز انتخاب کنید" }}
          render={({ field }) => (
            <FloatingSelect
              placeholder={selectedCurrency.name}
              label="انتخاب رمز ارز"
              options={[]}
              value={field.value}
              onChange={field.onChange}
              onOpen={() => setIsModalOpen(true)}
              placeholderIcon={
                <span className="icon-wrapper w-7 h-7">
                  {selectedCurrency.icon}
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

        {/* ======================= انتخاب شبکه (با FloatingSelect و منوی سفارشی) ======================= */}
        <Controller
          name="network" // ⭐️ نام فیلد به network تغییر داده شد
          control={control}
          rules={{ required: "لطفا یک شبکه انتخاب کنید" }}
          render={({ field }) => (
            <div className="relative">
              <FloatingSelect
                placeholder={selectedNetworkLabel}
                label="انتخاب شبکه"
                options={[]}
                value={field.value}
                onChange={field.onChange}
                onOpen={() => setIsNetworkDropdownOpen((prev) => !prev)}
                placeholderClasses="text-black0"
              />

              {isNetworkDropdownOpen && (
                <div
                  // ⭐️ تنظیم top-[68px] برای قرارگیری دقیق زیر FloatingSelect (تقریباً 14px فاصله از بالای عنصر relative)
                  // ⭐️ اضافه کردن bg-white تا شفاف نباشد و روی متن زیر نیفتد
                  className="absolute top-[68px] left-0 right-0 z-50 lg:bg-gray43 border border-gray-300 rounded-lg shadow-lg p-2"
                >
                  {networkOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-end gap-3 p-3 flex-row-reverse rounded-md transition-colors w-full cursor-pointer
                      ${field.value === option.value ? " text-blue2" : ""}`}
                      onClick={() => {
                        field.onChange(option.value);
                        setIsNetworkDropdownOpen(false);
                      }}
                    >
                      <span className="text-base text-black0 ">
                        {option.label}
                      </span>
                      <input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        readOnly
                        className="h-5 w-5 text-blue2 border-gray-300 focus:ring-blue2"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        />

        {/* ⭐️ این بخش به صورت عادی زیر Controller قرار می‌گیرد و توسط منوی absolute پوشانده می‌شود */}
        <div className="flex justify-between mt-2 mb-10 ">
          <span className="text-sm text-gray5">حداقل واریز </span>
          <span className="text-sm text-black0">Monos‌1</span>
        </div>

        {isAddressCreated && (
          <>
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
              <div className="flex justify-between items-center w-full">
                <span className="text-gray5">
                  زمان باقی‌مانده تا انقضای آدرس
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-black0 text-sm">06:00:00</span>
                  <span className="icon-wrapper w-4 h-4 text-gray5">
                    <IconTimer />
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* دکمه ساخت آدرس */}
        <div className=" mb-10">
          {!isAddressCreated && (
            <button
              onClick={handleCreateAddress}
              className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
            >
              ساخت آدرس
            </button>
          )}

          {/* آکاردئون راهنما */}
          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای واریز رمز ارز">
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

      {/* مودال انتخاب ارز */}
      {isModalOpen && (
        <CurrencyModal
          onClose={closeModal}
          onCurrencySelect={handleCurrencySelect}
        />
      )}
    </>
  );
}
