// import { Controller, useForm } from "react-hook-form";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import { yupResolver } from "@hookform/resolvers/yup";

// export default function WalletDeposit() {
//      const { control } = useForm({
//         resolver: yupResolver(),
//       });
//   return (
//     <>
//       <div className="w-full" dir="rtl">
//         <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//           <span className="icon-wrapper w-6 h-6 text-blue2">
//             <IconVideo />
//           </span>
//           <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//         </div>
//         <div>
//           <Controller
//             name="bank"
//             control={control}
//             rules={{ required: "زلا" }}
//             render={({ field }) => (
//               <FloatingSelect
//                 placeholder="ونوس"
//                 label="انتخاب رمز ارز"
//                 value={field.value}
//                 onChange={field.onChange}
//                 options={[
//                   {
//                     value: "meli",
//                     label: "بانک ملی ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         {/* <BankMelliLogo /> */}
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "mellat",
//                     label: "بانک ملت ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         {/* <BankMellatLogo /> */}
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "noor",
//                     label: "بانک انصار",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         {/* <BankAnsarLogo /> */}
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "melal",
//                     label: "مؤسسه اعتباری ملل",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         {/* <BankAnsarLogo /> */}
//                       </span>
//                     ),
//                   },
//                 ]}
//               />
//             )}
//           />
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import { yupResolver } from "@hookform/resolvers/yup";
import CurrencyModal from "../../Components/Deposit/CurrencyModal"; // کامپوننت مودال رو وارد کن
import IconMonnos from "../../assets/Icons/Deposit/IconMonnos";
import Accordion from "../Withdrawal/Accordion";

// اطلاعات اولیه برای نمایش پیش‌فرض
const initialCurrency = {
  name: "مونوس",
  icon: <IconMonnos />,
};

export default function WalletDeposit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency); // استیت برای نگهداری ارز انتخاب شده
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
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
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
                label="انتخاب شبکه"
                options={[]}
                value={field.value}
                onChange={field.onChange}
                onOpen={() => setIsModalOpen(true)}
                placeholderClasses="text-black0 "
                
              />
            )}
          />
          <div className="flex justify-between mt-2 mb-10 ">
            <span className="text-sm text-gray5">حداقل واریز </span>
            <span className="text-sm text-black0">Monos‌1</span>
          </div>
        </div>
        <div className="mt-44 mb-10">
          <button className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg">
            ساخت آدرس
          </button>

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
      {isModalOpen && (
        <CurrencyModal 
          onClose={closeModal} 
          onCurrencySelect={handleCurrencySelect} // پراپ جدید را به مودال ارسال می‌کنیم
        />
      )}
    </>
  );
}