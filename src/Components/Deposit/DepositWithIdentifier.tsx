// import React, { useState } from "react";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import { Controller, useForm } from "react-hook-form";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
// import { toast } from "react-toastify";
// import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
// // فرض می‌کنیم apiClient شما در این مسیر قرار دارد
// import { apiRequest } from "../../utils/apiClient";
// import Accordion from "../Withdrawal/Accordion";

// // =================== تعریف Types و تابع API ===================

// interface DepositIdentifierRequestData {
//   id: number;
// }

// interface DepositIdentifierResponse {
//   bank: string; // نام بانک مقصد (مثل "بانک ملی")
//   ownerName: string;
//   shaba: string; // شماره شبا
//   accountNumber: string; // شماره حساب
//   identifier: string; // شناسه واریز
// }

// // نگاشت (Mapping) بین مقدار انتخابی (value) در دراپ‌داون و ID عددی مورد نیاز API
// const bankIdMap: Record<string, number> = {
//   meli: 12, // فرضی: ID بانک ملی در سیستم بک‌اند
//   mellat: 14, // فرضی: ID بانک ملت
//   noor: 16, // فرضی: ID بانک انصار
//   melal: 18,
// };

// /**
//  * ارسال درخواست برای ایجاد شناسه و دریافت مشخصات حساب مقصد
//  * @param data شامل ID بانک مقصد
//  */
// async function createDepositIdentifier(
//   data: DepositIdentifierRequestData
// ): Promise<DepositIdentifierResponse> {
//   // مسیر API را استفاده می‌کنیم: /wallets/fiat/deposit/gateway-id
//   return apiRequest<DepositIdentifierResponse, DepositIdentifierRequestData>({
//     url: "/api/wallets/fiat/deposit/gateway-id",
//     method: "POST",
//     data: data,
//   });
// }
// // =============================================================

// // تابع کمکی کپی
// const copyToClipboard = (text: string | number, label: string) => {
//   const textToCopy = String(text);
//   navigator.clipboard
//     .writeText(textToCopy)
//     .then(() => toast.info(`${label} کپی شد. ✅`))
//     .catch(() => toast.error(`خطا در کپی کردن ${label}. ❌`));
// };

// export default function DepositwithIdentifier() {
//   const { control, watch } = useForm({});

//   const [showReceipt, setShowReceipt] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiResponseData, setApiResponseData] =
//     useState<DepositIdentifierResponse | null>(null); // دریافت مقدار انتخاب‌شده از بانک (value: meli, mellat, ...)

//   const selectedBankValue = watch("bank"); // تابع اصلی برای فراخوانی API

//   const handleCreateIdentifier = async () => {
//     if (isLoading) return;

//     if (!selectedBankValue) {
//       toast.error("لطفاً ابتدا کارت بانکی مقصد را انتخاب کنید. 💳");
//       return;
//     }

//     // نگاشت value به ID مورد نیاز API
//     const bankId = bankIdMap[selectedBankValue];
//     if (!bankId) {
//       toast.error("شناسه‌ی بانک انتخابی یافت نشد. 🤔");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // فراخوانی تابع API
//       const response = await createDepositIdentifier({
//         id: bankId, // ارسال ID بانک مقصد
//       });

//       // **توجه:** با فرض اینکه API مشخصات کامل را برمی‌گرداند.
//       // اگر پاسخ API شما ساده بود (مثل Swagger)، باید از داده‌های ثابت یا API دوم استفاده کنید.
//       // من از داده‌های Mock (نمونه‌ای شبیه به تصویر شما) برای پر کردن UI استفاده می‌کنم:
//       const mockResponse: DepositIdentifierResponse = {
//         bank: "بانک ملی",
//         ownerName: "گروه فرهنگی و هنری",
//         shaba: "152898338738846474981",
//         accountNumber: "833873884647",
//         identifier: "8384647",
//       };

//       setApiResponseData(mockResponse); // در محیط واقعی، از `response` واقعی استفاده کنید.
//       setShowReceipt(true);
//       toast.success("مشخصات حساب مقصد و شناسه واریز با موفقیت دریافت شد. 🎉");
//     } catch (error: any) {
//       // مدیریت خطاها از API Client
//       const errorMessage =
//         error.response?.data?.msg ||
//         "خطا در ایجاد شناسه واریز. لطفاً سطح احراز هویت را بررسی کنید.";
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full lg:px-7 " dir="rtl">
//       <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//         <span className="icon-wrapper w-6 h-6 text-blue2">
//           <IconVideo />
//         </span>
//         <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//       </div>
//       {/* انتخاب حساب بانکی (مقصد) */}
//       <div className="mb-12">
//         <Controller
//           name="bank"
//           control={control}
//           render={({ field }) => (
//             <FloatingSelect
//               placeholder="حساب بانکی را انتخاب کنید "
//               label="حساب بانکی "
//               value={field.value}
//               onChange={(val) => {
//                 field.onChange(val);
//                 // با تغییر بانک، رسید قبلی مخفی شود
//                 setShowReceipt(false);
//                 setApiResponseData(null);
//               }}
//               options={[
//                 {
//                   value: "meli",
//                   label: "بانک ملی ایران",
//                   icon: (
//                     <span className="w-6 h-6 icon-wrapper">
//                       <BankMelliLogo />
//                     </span>
//                   ),
//                 },
//                 {
//                   value: "mellat",
//                   label: "بانک ملت ایران",
//                   icon: (
//                     <span className="w-6 h-6 icon-wrapper">
//                       <BankMellatLogo />
//                     </span>
//                   ),
//                 },
//                 {
//                   value: "noor",
//                   label: "بانک انصار",
//                   icon: (
//                     <span className="w-6 h-6 icon-wrapper">
//                       <BankAnsarLogo />
//                     </span>
//                   ),
//                 },
//                 {
//                   value: "melal",
//                   label: "مؤسسه اعتباری ملل",
//                   icon: (
//                     <span className="w-6 h-6 icon-wrapper">
//                       <BankAnsarLogo />
//                     </span>
//                   ),
//                 },
//               ]}
//             />
//           )}
//         />
//       </div>
//       {/* =================== بخش نمایش مشخصات حساب گیرنده (رسید) =================== */}
//       {showReceipt && apiResponseData && (
//         <>
//           <p className=" text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
//           <div className=" p-4 border rounded-lg border-gray19 flex w-full justify-between">
//             {/* right */}
//             <div className="flex flex-col gap-5 text-gray5 text-sm">
//               <span>بانک</span>
//               <span>نام صاحب حساب</span>
//               <span>شبا</span> <span>شماره حساب</span>
//               <span>شناسه واریز</span>
//             </div>
//             {/* left */}
//             <div className="flex flex-col gap-5 items-end text-sm text-black0">
//               <div className="flex gap-1 items-center">
//                 {/* از داده‌ی API استفاده کنید */}
//                 <span>{apiResponseData.bank}</span>
//                 <span className="icon-wrapper w-5 h-5">
//                   <BankMelliLogo />
//                   {/* در اینجا باید منطقی برای نمایش آیکون مناسب بر اساس نام بانک اضافه کنید */}
//                 </span>
//               </div>
//               {/* از داده‌ی API استفاده کنید */}
//               <span>{apiResponseData.ownerName}</span>
//               <div className="flex gap-1 items-center">
//                 {/* از داده‌ی API استفاده کنید */}
//                 <span>{apiResponseData.shaba}</span>
//                 {/* افزودن دکمه کپی */}
//                 <button
//                   className="icon-wrapper w-5 h-5 text-gray5"
//                   onClick={() => copyToClipboard(apiResponseData.shaba, "شبا")}
//                 >
//                   <IconCopy />
//                 </button>
//               </div>
//               <div className="flex gap-1 items-center">
//                 {/* از داده‌ی API استفاده کنید */}
//                 <span>{apiResponseData.accountNumber}</span>
//                 {/* افزودن دکمه کپی */}
//                 <button
//                   className="icon-wrapper w-5 h-5 text-gray5"
//                   onClick={() =>
//                     copyToClipboard(apiResponseData.accountNumber, "شماره حساب")
//                   }
//                 >
//                   <IconCopy />
//                 </button>
//               </div>

//               <div className="flex gap-1 items-center">
//                 {/* از داده‌ی API استفاده کنید */}
//                 <span>{apiResponseData.identifier}</span>
//                 {/* افزودن دکمه کپی */}
//                 <button
//                   className="icon-wrapper w-5 h-5 text-gray5"
//                   onClick={() =>
//                     copyToClipboard(apiResponseData.identifier, "شناسه واریز")
//                   }
//                 >
//                   <IconCopy />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       {/* دکمه اصلی */}
//       <div className={`${showReceipt ? "mt-6" : "mt-80"}`}>
//         <button
//           onClick={handleCreateIdentifier}
//           disabled={isLoading}
//           className={`w-full py-3 font-bold text-lg rounded-lg transition ${
//             isLoading
//               ? "bg-blue-300 cursor-not-allowed"
//               : "text-white2 bg-blue2 hover:bg-blue-600"
//           }`}
//         >
//           {isLoading ? "در حال دریافت..." : "ساخت شناسه واریز"}
//         </button>
//         {/* بخش راهنما */}
//         <div className="mt-4" dir="ltr">
//           <Accordion title="راهنمای واریز با شناسه">
//             <ul className="list-disc pr-5 space-y-2 text-black1">
//               <li>
//                 از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
//                 شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
//               </li>
//               <li>
//                 مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
//               </li>
//             </ul>
//           </Accordion>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import { apiRequest } from "../../utils/apiClient";

interface BankCard {
  id: number;
  card: string;
  bank: string;
  iban: string | null;
}

interface DepositIdentifierResponse {
  destination_bank: string;
  destination_owner_name: string;
  destination_iban: string;
  destination_account_number: string;
  deposit_id: string;
}

interface DepositIdItem {
  deposit_id: string;
  id_card: number;
}

const copyToClipboard = (text: string | number, label: string) => {
  navigator.clipboard
    .writeText(String(text))
    .then(() => toast.info(`${label} کپی شد ✅`))
    .catch(() => toast.error(`خطا در کپی ${label}`));
};

export default function DepositwithIdentifier() {
  const { control, watch } = useForm();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [depositIds, setDepositIds] = useState<DepositIdItem[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [apiResponseData, setApiResponseData] = useState<DepositIdentifierResponse | null>(null);
  const [depositId,setDepositId]=useState()

  const selectedBank = watch("bank");



  const fetchDepositId= async()=>{
      setLoadingCards(true);
      try {
        const res = await apiRequest({
          url: "/api/wallets/fiat",
          method: "GET",
        });
        setCards(res?.list_cards || []);
        setDepositIds(res?.list_deposit_id || []);
        setDepositId(res.deposit_id || null)
      } catch (error: any) {
        toast.error("خطا در دریافت لیست کارت‌ها ❌");
      } finally {
        setLoadingCards(false);
      }
  }

  useEffect(() => {
    fetchDepositId();
  }, []);

  const handleCreateIdentifier = async () => {
    if (!selectedCard) {
      toast.error("لطفاً ابتدا کارت بانکی خود را انتخاب کنید 💳");
      return;
    }
    setIsLoading(true);
    try {
      const response = await apiRequest({
        url: "/api/wallets/fiat/deposit/gateway-id",
        method: "POST",
        data: { id: selectedCard },
      });
      console.log("API Response:", response); // دیباگ برای چک کردن response
      if (response && (response.deposit_id || response.data?.deposit_id)) {
        setDepositId(response.deposit_id || null)
        // چک کردن دو حالت ممکن برای deposit_id
        const depositData = response.deposit_id
          ? response
          : response.data || {
              destination_bank: "ملت",
              destination_owner_name: "شرکت آذر تبادل",
              destination_iban: "IR820540102680020817909002",
              destination_account_number: "0123456789012345",
              deposit_id: "DP123456",
            };
        setApiResponseData(depositData);
        setShowReceipt(true);
        setDepositIds([...depositIds, { deposit_id: depositData.deposit_id, id_card: selectedCard }]);
        toast.success("شناسه واریز با موفقیت ساخته شد 🎉");
      } else if (response?.message || response?.error) {
        toast.error(response.message || response.error || "این کارت قبلاً ثبت شده است ❌");
      }
      fetchDepositId()
    } catch (error: any) {
      console.error("API Error:", error); // دیباگ برای خطاها
      const msg =
        error.response?.data?.message ||
        error.message ||
        "خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید ❌";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:px-7" dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
      </div>

      <div className="mb-12">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder={
                loadingCards ? "در حال بارگذاری کارت‌ها..." : "کارت بانکی را انتخاب کنید"
              }
              label="کارت بانکی"
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                const selected = cards.find((c) => c.id === Number(val));
                setSelectedCard(selected ? selected.id : null);
                setShowReceipt(false); // ریست فیش موقع انتخاب کارت
                // setApiResponseData(null);
              }}
              options={cards.map((card) => ({
                value: card.id.toString(),
                label: `${card.bank} - ${card.card}`,
                icon: (
                  <span className="w-6 h-6 icon-wrapper">
                    <BankMelliLogo />
                  </span>
                ),
              }))}
            />
          )}
        />
      </div>

      { depositId && (
        <>
          <p className="text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
          <div className="p-4 border rounded-lg border-gray19 flex w-full justify-between">
            <div className="flex flex-col gap-5 text-gray5 text-sm">
              <span>بانک</span>
              <span>نام صاحب حساب</span>
              <span>شبا</span>
              <span>شماره حساب</span>
              <span>شناسه واریز</span>
            </div>
            <div className="flex flex-col gap-5 items-end text-sm text-black0">
              <div className="flex gap-1 items-center">
                <span>{depositId.destination_bank}</span>
              </div>
              <span>{depositId.destination_owner_name}</span>
              <div className="flex gap-1 items-center">
                <span>{depositId.destination_iban}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(depositId.destination_iban, "شبا")
                  }
                >
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{depositId.destination_account_number}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(
                      depositId.destination_account_number,
                      "شماره حساب"
                    )
                  }
                >
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{depositId.deposit_id}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(depositId.deposit_id, "شناسه واریز")
                  }
                >
                  <IconCopy />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`${showReceipt ? "mt-6" : "mt-80"}`}>
        {!showReceipt && (
          <button
            onClick={handleCreateIdentifier}
            disabled={isLoading}
            className={`w-full py-3 font-bold text-lg rounded-lg transition ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "text-white2 bg-blue2 hover:bg-blue-600"
            }`}
          >
            {isLoading ? "در حال دریافت..." : "ساخت شناسه واریز"}
          </button>
        )}
        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با شناسه">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>آدرس درگاه باید shaparak.ir باشد.</li>
              <li>مبلغ پرداختی را قبل از تأیید بررسی کنید.</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}