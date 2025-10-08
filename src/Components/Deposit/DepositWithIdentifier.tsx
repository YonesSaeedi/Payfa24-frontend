// import React, { useState } from "react";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import { Controller, useForm } from "react-hook-form";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
// import { yupResolver } from "@hookform/resolvers/yup";
// import Accordion from "../Withdrawal/Accordion";
// import { toast } from "react-toastify";
// import IconCopy from "../../assets/Icons/AddFriend/IconCopy";

// export default function DepositwithIdentifier() {
//   const { control, watch } = useForm({
//     resolver: yupResolver(),
//   });

//   const [showReceipt, setShowReceipt] = useState(false);

//   // دریافت مقدار انتخاب‌شده از بانک
//   const selectedBank = watch("bank");

//   return (
//     <div className="w-full lg:px-7 " dir="rtl">
//       <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//         <span className="icon-wrapper w-6 h-6 text-blue2">
//           <IconVideo />
//         </span>
//         <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//       </div>

//       {/* =================== */}
//       <div className="mb-12">
//         <Controller
//           name="bank"
//           control={control}
//           render={({ field }) => (
//             <FloatingSelect
//               placeholder="حساب بانکی را انتخاب کنید "
//               label="حساب بانکی "
//               value={field.value}
//               onChange={field.onChange}
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

//       {/* =================== */}
//       {showReceipt && (
//         <>
//           <p className=" text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
//           <div className=" p-4 border rounded-lg border-gray19  flex w-full justify-between">
//             {/* right */}
//             <div className="flex flex-col gap-5 text-gray5 text-sm">
//               <span>بانک</span>
//               <span>نام صاحب حساب</span>
//               <span>شبا</span>
//               <span>شماره حساب</span>
//               <span>شناسه واریز</span>
//             </div>
//             {/* left */}
//             <div className="flex flex-col gap-5 items-end text-sm text-black0">
//               <div className="flex gap-1 items-center">
//                 <span>بانک ملی</span>
//                 <span className="icon-wrapper w-5 h-5">
//                   <BankMellatLogo />
//                 </span>
//               </div>
//               <span>گروه فرهنگی و هنری </span>
//               <div className="flex gap-1 items-center">
//                 <span>152898338738846474981</span>
//                 <span className="icon-wrapper w-5 h-5 text-gray5">
//                   <IconCopy />
//                 </span>
//               </div>
//               <div className="flex gap-1 items-center">
//                 <span>833873884647</span>
//                 <span className="icon-wrapper w-5 h-5 text-gray5">
//                   <IconCopy />
//                 </span>
//               </div>
//               <div className="flex gap-1 items-center">
//                 <span>8384647</span>
//                 <span className="icon-wrapper w-5 h-5 text-gray5">
//                   <IconCopy />
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//       <div className={`${showReceipt ? "mt-6" : "mt-80"}`}>
//         <button
//           onClick={() => {
//             if (selectedBank) {
//               setShowReceipt(true);
//             } else {
//               {
//                 toast.error("لطفا ابتدا کارت بانکی خود را انتخاب کنید ");
//               }
//             }
//           }}
//           className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
//         >
//           ساخت شناسه واریز
//         </button>

//         {/* نمایش بخش وسط فقط بعد از انتخاب بانک و کلیک روی دکمه */}

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












// کد پایین با api هست ولی بالایی بدون api



import React, { useState } from "react";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import { Controller, useForm } from "react-hook-form";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { toast } from "react-toastify";
import IconCopy from "../../assets/Icons/AddFriend/IconCopy";
// فرض می‌کنیم apiClient شما در این مسیر قرار دارد
import { apiRequest } from "../../utils/apiClient";
import Accordion from "../Withdrawal/Accordion";

// =================== تعریف Types و تابع API ===================

// تعریف نوع (Type) برای داده‌های ارسالی به API
interface DepositIdentifierRequestData {
  id: number; // ID بانک مقصد که در API مورد نیاز است (مثلاً 5 برای ملل یا 12 برای ملی)
}

// تعریف نوع (Type) برای پاسخ موفقیت‌آمیز API (مشخصات حساب مقصد)
interface DepositIdentifierResponse {
  bank: string; // نام بانک مقصد (مثل "بانک ملی")
  ownerName: string; // نام صاحب حساب (مثل "گروه فرهنگی و هنری")
  shaba: string; // شماره شبا
  accountNumber: string; // شماره حساب
  identifier: string; // شناسه واریز
}

// نگاشت (Mapping) بین مقدار انتخابی (value) در دراپ‌داون و ID عددی مورد نیاز API
const bankIdMap: Record<string, number> = {
  meli: 12, // فرضی: ID بانک ملی در سیستم بک‌اند
  mellat: 14, // فرضی: ID بانک ملت
  noor: 16, // فرضی: ID بانک انصار
  melal: 18, // فرضی: ID مؤسسه اعتباری ملل
};

/**
 * ارسال درخواست برای ایجاد شناسه و دریافت مشخصات حساب مقصد
 * @param data شامل ID بانک مقصد
 */
async function createDepositIdentifier(
  data: DepositIdentifierRequestData
): Promise<DepositIdentifierResponse> {
  // مسیر API را استفاده می‌کنیم: /wallets/fiat/deposit/gateway-id
  return apiRequest<DepositIdentifierResponse, DepositIdentifierRequestData>({
    url: "/api/wallets/fiat/deposit/gateway-id",
    method: "POST",
    data: data,
  });
}
// =============================================================

// تابع کمکی کپی
const copyToClipboard = (text: string | number, label: string) => {
  const textToCopy = String(text);
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => toast.info(`${label} کپی شد. ✅`))
    .catch(() => toast.error(`خطا در کپی کردن ${label}. ❌`));
};

export default function DepositwithIdentifier() {
  const { control, watch } = useForm({});

  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponseData, setApiResponseData] =
    useState<DepositIdentifierResponse | null>(null); // دریافت مقدار انتخاب‌شده از بانک (value: meli, mellat, ...)

  const selectedBankValue = watch("bank"); // تابع اصلی برای فراخوانی API

  const handleCreateIdentifier = async () => {
    if (isLoading) return;

    if (!selectedBankValue) {
      toast.error("لطفاً ابتدا کارت بانکی مقصد را انتخاب کنید. 💳");
      return;
    }

    // نگاشت value به ID مورد نیاز API
    const bankId = bankIdMap[selectedBankValue];
    if (!bankId) {
      toast.error("شناسه‌ی بانک انتخابی یافت نشد. 🤔");
      return;
    }

    setIsLoading(true);

    try {
      // فراخوانی تابع API
      const response = await createDepositIdentifier({
        id: bankId, // ارسال ID بانک مقصد
      });

      // **توجه:** با فرض اینکه API مشخصات کامل را برمی‌گرداند.
      // اگر پاسخ API شما ساده بود (مثل Swagger)، باید از داده‌های ثابت یا API دوم استفاده کنید.
      // من از داده‌های Mock (نمونه‌ای شبیه به تصویر شما) برای پر کردن UI استفاده می‌کنم:
      const mockResponse: DepositIdentifierResponse = {
        bank: "بانک ملی",
        ownerName: "گروه فرهنگی و هنری",
        shaba: "152898338738846474981",
        accountNumber: "833873884647",
        identifier: "8384647",
      };

      setApiResponseData(mockResponse); // در محیط واقعی، از `response` واقعی استفاده کنید.
      setShowReceipt(true);
      toast.success("مشخصات حساب مقصد و شناسه واریز با موفقیت دریافت شد. 🎉");
    } catch (error: any) {
      // مدیریت خطاها از API Client
      const errorMessage =
        error.response?.data?.msg ||
        "خطا در ایجاد شناسه واریز. لطفاً سطح احراز هویت را بررسی کنید.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:px-7 " dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
                <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
      </div>
            {/* انتخاب حساب بانکی (مقصد) */}     {" "}
      <div className="mb-12">
               {" "}
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder="حساب بانکی را انتخاب کنید "
              label="حساب بانکی "
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                // با تغییر بانک، رسید قبلی مخفی شود
                setShowReceipt(false);
                setApiResponseData(null);
              }}
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
      {/* =================== بخش نمایش مشخصات حساب گیرنده (رسید) =================== */}
      {showReceipt && apiResponseData && (
        <>
          <p className=" text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
          <div className=" p-4 border rounded-lg border-gray19 flex w-full justify-between">
                        {/* right */}           {" "}
            <div className="flex flex-col gap-5 text-gray5 text-sm">
                <span>بانک</span>              <span>نام صاحب حساب</span>       
                    <span>شبا</span>              <span>شماره حساب</span>       
                    <span>شناسه واریز</span> 
            </div>
            {/* left */}
            <div className="flex flex-col gap-5 items-end text-sm text-black0">
                           {" "}
              <div className="flex gap-1 items-center">
                {/* از داده‌ی API استفاده کنید */}               {" "}
                <span>{apiResponseData.bank}</span>               {" "}
                <span className="icon-wrapper w-5 h-5">
                                    <BankMelliLogo />{" "}
                  {/* در اینجا باید منطقی برای نمایش آیکون مناسب بر اساس نام بانک اضافه کنید */}
                                 {" "}
                </span>
                             {" "}
              </div>
              {/* از داده‌ی API استفاده کنید */}             {" "}
              <span>{apiResponseData.ownerName}</span>             {" "}
              <div className="flex gap-1 items-center">
                {/* از داده‌ی API استفاده کنید */}               {" "}
                <span>{apiResponseData.shaba}</span>
                {/* افزودن دکمه کپی */}               {" "}
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() => copyToClipboard(apiResponseData.shaba, "شبا")}
                >
                                    <IconCopy />               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <div className="flex gap-1 items-center">
                {/* از داده‌ی API استفاده کنید */}               {" "}
                <span>{apiResponseData.accountNumber}</span>
                {/* افزودن دکمه کپی */}               {" "}
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(apiResponseData.accountNumber, "شماره حساب")
                  }
                >
                                    <IconCopy />               {" "}
                </button>
                             {" "}
              </div>
                           {" "}
              <div className="flex gap-1 items-center">
                {/* از داده‌ی API استفاده کنید */}               {" "}
                <span>{apiResponseData.identifier}</span>
                {/* افزودن دکمه کپی */}               {" "}
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(apiResponseData.identifier, "شناسه واریز")
                  }
                >
                                    <IconCopy />               {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </>
      )}
                  {/* دکمه اصلی */}     {" "}
      <div className={`${showReceipt ? "mt-6" : "mt-80"}`}>
               {" "}
        <button
          onClick={handleCreateIdentifier}
          disabled={isLoading}
          className={`w-full py-3 font-bold text-lg rounded-lg transition ${
            isLoading
              ? "bg-blue-300 cursor-not-allowed"
              : "text-white2 bg-blue2 hover:bg-blue-600"
          }`}
        >
                    {isLoading ? "در حال دریافت..." : "ساخت شناسه واریز"}       {" "}
        </button>
                {/* بخش راهنما */}       {" "}
        <div className="mt-4" dir="ltr">
                   {" "}
          <Accordion title="راهنمای واریز با شناسه">
                       {" "}
            <ul className="list-disc pr-5 space-y-2 text-black1">
                           {" "}
              <li>
                                از صحت آدرس صفحه‌ پرداخت و بودن در یکی از
                سایت‌های سامانه‌ی                 شاپرک مطمئن شوید. (صفحه درگاه
                الزاما .shaparak.ir باشد)              {" "}
              </li>
                           {" "}
              <li>
                                مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت
                درست باشد.              {" "}
              </li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
