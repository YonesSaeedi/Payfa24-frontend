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





const networkOptions = [
  { value: "trc20", label: "ترون (TRC20)" },
  { value: "ton", label: "تن (TON)" },
  { value: "erc20", label: "اتریوم (ERC20)" },
  { value: "polygon", label: "پالیگان" },
];
const initialCurrency = {
  name: "مونوس",
  icon: <IconMonnos />,
};
export default function DepositWithTxID() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency); 
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const { control ,watch} = useForm({
    resolver: yupResolver(),
  });


   const selectedNetwork = watch("network");
  const selectedNetworkLabel =
    networkOptions.find((opt) => opt.value === selectedNetwork)?.label ||
    "انتخاب شبکه";

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
                        className="h-5 w-5 text-blue2 border-gray-300 ring-blue2"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
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




// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { apiRequest } from "../../utils/apiClient";
// import CurrencyModal from "./CurrencyModal";
// import IconMonnos from "../../assets/Icons/Deposit/IconMonnos";

// export default function DepositWithTxID() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [coinsList, setCoinsList] = useState([]); // داده‌ی واقعی که از API میاد
//   const [loading, setLoading] = useState(false);
//   const [selectedCurrency, setSelectedCurrency] = useState({
//     name: "مونوس",
//     icon: <IconMonnos />,
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 📡 همزمان دو API رو صدا می‌زنیم
//         const [generalRes, depositRes] = await Promise.allSettled([
//           apiRequest({ url: "/get-general-info", method: "GET" }),
//           apiRequest({ url: "/wallets/crypto/deposit", method: "GET" }),
//         ]);

//         let generalCoins = [];
//         let depositCoins = [];

//         // ✅ بررسی پاسخ‌ها
//         if (generalRes.status === "fulfilled") {
//           generalCoins = generalRes.value?.cryptocurrency || [];
//         } else {
//           toast.error("خطا در دریافت اطلاعات عمومی ارزها");
//         }

//         if (depositRes.status === "fulfilled") {
//           depositCoins = depositRes.value?.coins || [];
//         } else {
//           console.warn("API /wallets/crypto/deposit خطا داد (500)");
//           toast.warn("برخی اطلاعات واریز در دسترس نیستند");
//         }

//         // ✅ ترکیب داده‌ها
//         const merged = generalCoins
//           .filter((c) => !c.isDisable)
//           .map((c) => {
//             const match = depositCoins.find((d) => d.symbol === c.symbol);
//             return {
//               id: c.id,
//               symbol: c.symbol,
//               name: c.locale?.fa?.name || c.name,
//               icon: c.icon,
//               color: c.color,
//               price: match?.price || 0,
//               percent: match?.priceChangePercent || 0,
//               minDeposit: match?.network?.[0]?.deposit_min || 0,
//             };
//           });

//         // ✅ ذخیره داده‌ها برای ارسال به Modal
//         setCoinsList(merged);
//       } catch (err) {
//         console.error("❌ خطا در دریافت داده‌ها:", err);
//         toast.error("خطا در ارتباط با سرور");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // 🟢 تابعی که از Modal صدا زده می‌شه
//   const handleCurrencySelect = (coin) => {
//     setSelectedCurrency(coin);
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="p-4">
//       {/* نمایش ارز انتخاب‌شده */}
//       <div
//         onClick={() => setIsModalOpen(true)}
//         className="cursor-pointer flex items-center gap-2 bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition"
//       >
//         {selectedCurrency.icon}
//         <span className="font-medium">{selectedCurrency.name}</span>
//       </div>

//       {/* نمایش مدال (بدون تغییر در خودش) */}
//       {isModalOpen && (
//         <CurrencyModal
//           onClose={() => setIsModalOpen(false)}
//           onCurrencySelect={handleCurrencySelect} // این متد رو فقط parent مدیریت می‌کنه
//           coins={coinsList} // ✅ ارسال لیست واقعی ارزها
//           loading={loading} // ✅ برای کنترل وضعیت بارگذاری
//         />
//       )}
//     </div>
//   );
// }
