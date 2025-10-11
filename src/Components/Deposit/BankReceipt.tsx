// import { Controller, useForm } from "react-hook-form";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
// import { yupResolver } from "@hookform/resolvers/yup";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import { useEffect, useRef, useState } from "react";
// import UploadImage from "../../assets/Icons/authentication/UploadImage";
// import Accordion from "../Withdrawal/Accordion";
// // 💡 توجه: مطمئن شوید مسیرهای Import برای آیکون‌های محلی (مثل UploadImage) درست باشند.

// type Props = {
//   onNext: () => void;
//   onFileChange: (file: File | null) => void;
//   initialPreviewUrl: string | null;
// };

// export default function BankReceipt({
//   onFileChange,
//   initialPreviewUrl,
// }: Props) {
//   const amounts = [5, 10, 20, 50];
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [IsOpenModalReceipt, setIsOpenModalReceipt] = useState(false);
//   const { control, setValue } = useForm({
//     resolver: yupResolver(),
//   });

//   const [previewURL, setPreviewURL] = useState<string | null>(
//     initialPreviewUrl
//   );

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files ? event.target.files[0] : null;

//     // تمیزکاری URL موقت قبلی
//     if (previewURL && previewURL.startsWith("blob:")) {
//       URL.revokeObjectURL(previewURL);
//     }


//     if (file) {
//       const newPreviewURL = URL.createObjectURL(file);
//       setPreviewURL(newPreviewURL);

//       // تنظیم فیلد مقدار واریزی به خالی یا صفر پس از انتخاب فیش
//       setValue("amount", "", { shouldValidate: true });
//     } else {
//       setPreviewURL(null);
//       setValue("amount", "", { shouldValidate: true });
//     }
//   };

//   useEffect(() => {
//     setPreviewURL(initialPreviewUrl);

//     return () => {
//       if (previewURL && previewURL.startsWith("blob:")) {
//         URL.revokeObjectURL(previewURL);
//       }
//     };
//   }, [initialPreviewUrl]);

//   const handleAmountClick = (amount: number) => {
//     setValue("amount", (amount * 1000000).toString(), { shouldValidate: true });
//   };

//   return (
//     <>
//       <div className="w-full lg:px-7 " dir="rtl">
//         <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//           <span className="icon-wrapper w-6 h-6 text-blue2">
//             <IconVideo />
//           </span>
//           <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//         </div>

//         {/* ... (انتخاب حساب مبدا و مقصد) ... */}

//         <div className="mb-12 ">
//           <Controller
//             name="bank"
//             control={control}
//             render={({ field }) => (
//               <FloatingSelect
//                 placeholder="حساب مبدا را انتخاب کنید"
//                 label="حساب مبدا "
//                 value={field.value}
//                 onChange={field.onChange}
//                 options={[
//                   {
//                     value: "meli",
//                     label: "بانک ملی ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper ">
//                         <BankMelliLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "mellat",
//                     label: "بانک ملت ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankMellatLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "noor",
//                     label: "بانک انصار",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankAnsarLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "melal",
//                     label: "مؤسسه اعتباری ملل",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankAnsarLogo />
//                       </span>
//                     ),
//                   },
//                 ]}
//               />
//             )}
//           />
//         </div>

//         <div className="mb-3">
//           <Controller
//             name="destinationBank" // ⭐️ نام برای حساب مقصد باید متفاوت باشد
//             control={control}
//             render={({ field }) => (
//               <FloatingSelect
//                 placeholder="حساب مقصد را انتخاب کنید"
//                 label="حساب مقصد "
//                 value={field.value}
//                 onChange={field.onChange}
//                 options={[
//                   {
//                     value: "meli",
//                     label: "بانک ملی ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper ">
//                         <BankMelliLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "mellat",
//                     label: "بانک ملت ایران",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankMellatLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "noor",
//                     label: "بانک انصار",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankAnsarLogo />
//                       </span>
//                     ),
//                   },
//                   {
//                     value: "melal",
//                     label: "مؤسسه اعتباری ملل",
//                     icon: (
//                       <span className="w-6 h-6 icon-wrapper">
//                         <BankAnsarLogo />
//                       </span>
//                     ),
//                   },
//                 ]}
//               />
//             )}
//           />
//         </div>

//         {/* ... (متن حداقل واریز) ... */}
//         <p className="text-gray5">
//           حداقل واریز با فیش بانکی , 1,000,000 تومان می‌باشد.
//         </p>

//         {/* ... (مقدار واریزی - FloatingInput) ... */}
//         <div dir="rtl" className="mb-1.5 mt-8">
//           <Controller
//             name="amount"
//             control={control}
//             rules={{ required: "لطفا مقدار واریزی را وارد کنید" }}
//             render={({ field }) => (
//               <>
//                 <FloatingInput
//                   label="مقدار واریزی"
//                   value={field.value}
//                   onChange={field.onChange}
//                   type="number"
//                   placeholder="0 تومان "
//                   placeholderColor="text-black0"
//                 />
//               </>
//             )}
//           />
//         </div>

//         {/* ⭐️ دکمه‌های سریع مبلغ (متصل به handleAmountClick) */}
//         <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
//           {amounts.map((amount, index) => (
//             <button
//               key={index}
//               type="button"
//               onClick={() => handleAmountClick(amount)}
//               className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
//             >
//               {amount} میلیون
//             </button>
//           ))}
//         </div>

//         {/* ============تصویر رسید (بخش آپلود) ========= */}
//         <p className="font-medium mb-3 text-gray5">تصویر رسید</p>

//         {/* ⭐️ ورودی فایل واقعی (مخفی) */}
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         {/* ⭐️ کادر ظاهری آپلود (ظاهر حفظ شده) */}
//         <div
//           className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
//           onClick={handleClick} // 👈 اجرای کلیک روی input واقعی
//         >
//           <div className="flex flex-col items-center justify-center h-48">
//             {previewURL ? (
//               <div className="flex justify-center items-center w-full h-full">
//                 <img
//                   src={previewURL}
//                   alt="پیش نمایش فیش بانکی"
//                   className="max-h-full max-w-full rounded-lg object-contain"
//                 />
//               </div>
//             ) : (
//               <>
//                 <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
//                   <UploadImage />
//                 </span>
//                 <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
//                   بارگذاری تصویر فیش بانکی
//                 </p>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="mt-14">
//           <button
//             onClick={() => {
//               setIsOpenModalReceipt(true);
//             }}
//             className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
//           >
//           ثبت اطلاعات
//           </button>

//           <div className="mt-4" dir="ltr">
//             <Accordion title="راهنمای فیش بانکی">
//               <ul className="list-disc pr-5 space-y-2 text-black1">
//                 <li>
//                   از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
//                   شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
//                 </li>
//                 <li>
//                   مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
//                 </li>
//               </ul>
//             </Accordion>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }






import { Controller, useForm } from "react-hook-form";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { yupResolver } from "@hookform/resolvers/yup";
import FloatingInput from "../FloatingInput/FloatingInput";
import { useEffect, useRef, useState } from "react";
import UploadImage from "../../assets/Icons/authentication/UploadImage";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Props = {
  onNext: () => void;
  onFileChange: (file: File | null) => void;
  initialPreviewUrl: string | null;
};

export default function BankReceipt({
  onFileChange,
  initialPreviewUrl,
}: Props) {
  const amounts = [5, 10, 20, 50];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [IsOpenModalReceipt, setIsOpenModalReceipt] = useState(false);
  const { control, setValue, getValues, reset } = useForm({
    resolver: yupResolver(),
  });
  const [previewURL, setPreviewURL] = useState<string | null>(initialPreviewUrl);
  const [activeReceipts, setActiveReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (previewURL && previewURL.startsWith("blob:")) {
      URL.revokeObjectURL(previewURL);
    }

    if (file) {
      const newPreviewURL = URL.createObjectURL(file);
      setPreviewURL(newPreviewURL);
      onFileChange(file);
      setValue("amount", "", { shouldValidate: true });
    } else {
      setPreviewURL(null);
      onFileChange(null);
      setValue("amount", "", { shouldValidate: true });
    }
  };

  useEffect(() => {
    setPreviewURL(initialPreviewUrl);

    return () => {
      if (previewURL && previewURL.startsWith("blob:")) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [initialPreviewUrl]);

  const handleAmountClick = (amount: number) => {
    setValue("amount", (amount * 1000000).toString(), { shouldValidate: true });
  };

  // ✅ تابع ارسال فیش بانکی به API
  const handleSubmitReceipt = async () => {
    try {
      const values = getValues();
      const file = fileInputRef.current?.files?.[0];

      if (!values.amount || !values.destinationBank) {
        toast.error("لطفاً تمام فیلدها را تکمیل کنید");
        return;
      }

      const formData = new FormData();
      formData.append("amount", values.amount);
      formData.append("payee", values.destinationBank);
      formData.append("card", "2"); // 👈 مقدار تستی (در آینده از کاربر گرفته میشه)
      if (file) formData.append("file", file);

      setLoading(true);

      // ارسال فیش به API
      await apiRequest({
        url: "/api/wallets/fiat/deposit/receipt",
        method: "POST",
        data: formData,
        isFormData: true,
      });

      toast.success("فیش بانکی با موفقیت ثبت شد ✅");

      // دریافت فیش‌های فعال
      const res = await apiRequest({
        url: "/wallets/fiat/deposit/receipt/active",
        method: "GET",
      });

      setActiveReceipts(res?.data || []);
      reset();
      setPreviewURL(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error("خطا در ثبت فیش بانکی ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full lg:px-7 " dir="rtl">
        <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>

        {/* انتخاب حساب مبدا */}
        <div className="mb-12 ">
          <Controller
            name="bank"
            control={control}
            render={({ field }) => (
              <FloatingSelect
                placeholder="حساب مبدا را انتخاب کنید"
                label="حساب مبدا "
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "meli",
                    label: "بانک ملی ایران",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper ">
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

        {/* انتخاب حساب مقصد */}
        <div className="mb-3">
          <Controller
            name="destinationBank"
            control={control}
            render={({ field }) => (
              <FloatingSelect
                placeholder="حساب مقصد را انتخاب کنید"
                label="حساب مقصد "
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "meli",
                    label: "بانک ملی ایران",
                    icon: (
                      <span className="w-6 h-6 icon-wrapper ">
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

        <p className="text-gray5">
          حداقل واریز با فیش بانکی , 1,000,000 تومان می‌باشد.
        </p>

        {/* مقدار واریزی */}
        <div dir="rtl" className="mb-1.5 mt-8">
          <Controller
            name="amount"
            control={control}
            rules={{ required: "لطفا مقدار واریزی را وارد کنید" }}
            render={({ field }) => (
              <FloatingInput
                label="مقدار واریزی"
                value={field.value}
                onChange={field.onChange}
                type="number"
                placeholder="0 تومان "
                placeholderColor="text-black0"
              />
            )}
          />
        </div>

        {/* دکمه‌های سریع مبلغ */}
        <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
          {amounts.map((amount, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAmountClick(amount)}
              className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
            >
              {amount} میلیون
            </button>
          ))}
        </div>

        {/* آپلود فیش بانکی */}
        <p className="font-medium mb-3 text-gray5">تصویر رسید</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
          onClick={handleClick}
        >
          <div className="flex flex-col items-center justify-center h-48">
            {previewURL ? (
              <div className="flex justify-center items-center w-full h-full">
                <img
                  src={previewURL}
                  alt="پیش نمایش فیش بانکی"
                  className="max-h-full max-w-full rounded-lg object-contain"
                />
              </div>
            ) : (
              <>
                <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
                  <UploadImage />
                </span>
                <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
                  بارگذاری تصویر فیش بانکی
                </p>
              </>
            )}
          </div>
        </div>

        {/* دکمه ثبت اطلاعات */}
        <div className="mt-14">
          <button
            onClick={handleSubmitReceipt}
            disabled={loading}
            className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "در حال ارسال..." : "ثبت اطلاعات"}
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای فیش بانکی">
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

        {/* نمایش فیش‌های فعال */}
        {activeReceipts.length > 0 && (
          <div className="mt-10 border-t border-gray-200 pt-5">
            <h3 className="font-bold text-lg mb-4 text-center">
              فیش‌های فعال شما
            </h3>
            {activeReceipts.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 flex justify-between text-sm mb-2"
              >
                <span>مبلغ: {item.amount}</span>
                <span>وضعیت: {item.status || "در انتظار بررسی"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}





