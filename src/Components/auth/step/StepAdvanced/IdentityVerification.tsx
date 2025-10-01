// import { useForm } from "react-hook-form";
// import IconAlert from "../../../../assets/Icons/Login/IconAlert";
// import StepperComponent from "../Stepper";
// import { useRef, useState, useEffect } from "react";
// import UploadImage from "../../../../assets/Icons/authentication/UploadImage";
// import IconCloseChervon from "../../../../assets/Icons/authentication/IconCloseChervon";
// import IconOpenChervon from "../../../../assets/Icons/authentication/IconOpenChervon";
// import previewURLImage2 from "../../../../assets/previewURLImage (2).png";
// import IconClose from "../../../../assets/Icons/Login/IconClose";

// type Props = {
//   onNext: () => void;
//   onFileChange: (file: File | null) => void;
// };

// type FormData = {
//   document: FileList;
// };

// export default function IdentityVerification({ onNext }: Props) {
//   const { handleSubmit, setValue } = useForm<FormData>();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewURL, setPreviewURL] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [isOpenModal, setIsOpenModal] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const onSubmit = () => {
//     if (!selectedFile) {
//       return;
//     }
//     setError(null);
//     setIsOpenModal(true);
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];
//       setSelectedFile(file);
//       onFileChange(file);
//       setValue("document", files);
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewURL(objectUrl);
//       setError(null);
//     }
//   };

//   useEffect(() => {
//     if (isOpenModal && window.innerWidth <= 768) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isOpenModal]);

//   return (
//     <>
//       <div className="w-full rounded-2xl">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="lg:bg-gray36 lg:rounded-2xl lg:px-8 w-full z-0"
//         >
//           <div className="flex flex-col text-right">
//             <StepperComponent currentStep={1} isAdvance={true} />
//             <p className="lg:text-xl font-medium text-black1 hidden lg:flex self-end mb-5">
//               لطفا مدرک شناسایی خود را بارگذاری کنید
//             </p>
//             <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-6 mb-4 rounded-lg">
//               <div className="flex text-orange1 gap-1 self-end font-medium">
//                 <span className="lg:text-base text-xs">توجه داشته باشید</span>
//                 <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
//                   <IconAlert />
//                 </span>
//               </div>
//               <ul
//                 className="list-disc list-inside text-right text-black1 lg:text-base text-xs"
//                 dir="rtl"
//               >
//                 <li>
//                   تصاویر و مدارک ارائه‌شده واضح، خوانا و کامل باشند و در صورت
//                   تار بودن یا ناقص بودن، مورد تأیید قرار نگیرند.
//                 </li>
//                 <li>تعهدنامه بدون امضا و تاریخ فاقد اعتبار است.</li>
//                 <li>
//                   متن این تعهدنامه عیناً مطابق نمونه نوشته شود و هرگونه تغییر،
//                   حذف یا خلاصه‌نویسی موجب رد آن می‌شود.
//                 </li>
//                 <li>
//                   نام صرافی [پی فا 24] به صورت صحیح ذکر شود و در صورت وجود غلط
//                   املایی، تعهدنامه رد خواهد شد.
//                 </li>
//               </ul>
//             </div>
//             {/* نمایش پیام خطا */}
//             {error && (
//               <p className="text-red1 text-sm text-right mb-4">{error}</p>
//             )}
//             {/* ///////////////// اینپوت بارگذاری ///////////// */}
//             <div
//               className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
//               onClick={handleClick}
//             >
//               <div className="flex flex-col items-center justify-center h-48">
//                 {!previewURL && (
//                   <>
//                     <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
//                       <UploadImage />
//                     </span>
//                     <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
//                       بارگذاری تصویر مدرک شناسایی
//                     </p>
//                   </>
//                 )}
//                 {previewURL && (
//                   <div className="flex justify-center items-center w-full h-full">
//                     <img
//                       src={previewURL}
//                       alt="پیش نمایش"
//                       className="max-h-full max-w-full rounded-lg object-contain"
//                     />
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*"
//               />
//             </div>
//             <button className="text-blue2 lg:text-lg text-base font-bold rounded-lg border border-blue2 lg:h-[56px] h-[40px]">
//               متن تعهد نامه
//             </button>
//             {/* نمایش تعهد نامه - اصلاح‌شده برای شبیه‌سازی اکوردیون */}
//             <div className="mt-4 mb-14 border border-gray12 rounded-lg">
//               <div
//                 className="flex justify-between items-center flex-row-reverse p-4 cursor-pointer"
//                 onClick={() => setIsOpen(!isOpen)}
//               >
//                 <h2 className="text-base font-medium text-black1">تعهد نامه</h2>
//                 <span className="icon-wrapper w-5 h-5 text-gray15">
//                   {isOpen ? <IconCloseChervon /> : <IconOpenChervon />}
//                 </span>
//               </div>
//               {isOpen && (
//                 <div>
//                   <img
//                     src={previewURLImage2}
//                     alt="تعهد نامه"
//                     className="w-full h-64 object-fill rounded-lg mb-2 px-4"
//                   />
//                 </div>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="bg-blue1 lg:h-[56px] h-[40px] rounded-lg text-white2 font-bold text-xl mb-8"
//             >
//               تأیید
//             </button>
//           </div>
//         </form>
//       </div>
//       {isOpenModal && (
//         <>
//           <div
//             onClick={() => setIsOpenModal(false)}
//             className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-40"
//           >
//             <div
//               className={
//                 window.innerWidth <= 768
//                   ? "fixed bottom-0 left-0  z-50 "
//                   : "fixed inset-0 flex items-center justify-center z-50"
//               }
//             >
//               <div
//                 className="lg:w-[448px] w-full lg:rounded-lg lg:p-8 p-4 relative bg-white8"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center flex-row justify-between text-black1">
//                   <span
//                     className="icon-wrapper h-6 w-6 cursor-pointer"
//                     onClick={() => setIsOpenModal(false)}
//                   >
//                     <IconClose />
//                   </span>
//                   <span className="font-normal text-base">متن تعهدنامه</span>
//                 </div>
//                 <p className="text-right mt-12 mb-6 text-lg font-medium text-black1">
//                   اینجانب (نام و نام خانوادگی) فرزند (نام پدر) با پذیرش تمام
//                   شرایط و قوانین مندرج در وبسایت payfa24.com اقدام به ثبت نام و
//                   فعالیت نموده و کاربری و حساب خود را اجاره نخواهم داد
//                 </p>
//                 <span className="text-lg font-medium text-black1">
//                   تاریخ + امضا
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// import React, { useRef, useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// // ... (سایر import ها)
// import UploadImage from "../../../../assets/Icons/authentication/UploadImage";
// import IconAlert from "../../../../assets/Icons/Login/IconAlert";
// import { toast } from "react-toastify";
// import StepperComponent from "../Stepper";
// import IconCloseChervon from "../../../../assets/Icons/authentication/IconCloseChervon";
// import IconOpenChervon from "../../../../assets/Icons/authentication/IconOpenChervon";
// import IconClose from "../../../../assets/Icons/Login/IconClose";
// // ⚠️ نکته: previewURLImage2 باید به صورت واقعی یک آدرس در دسترس باشد!
// import previewURLImage2 from "../../../../assets/previewURLImage (2).png";
// // ⬅️ نیاز به آیکون موفقیت برای مدال نهایی
// import IconCheck from "../../../../assets/Icons/authentication/IconCheckmark";
// import IconVerify from "../../../../assets/Icons/authentication/IconVerify";
// import { useNavigate } from "react-router";

// type Props = {
//   onNext: () => void; // برای رفتن به مرحله بعد
//   onFileChange: (file: File | null) => void; // برای ذخیره فایل در والد
// };

// type FormData = {
//   document: FileList;
// };

// export default function IdentityVerification({ onNext, onFileChange }: Props) {
//   const { handleSubmit, setValue } = useForm<FormData>();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewURL, setPreviewURL] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isOpenAccordion, setIsOpenAccordion] = useState(false); // نام را برای وضوح تغییر دادم
//   const [isOpenTextModal, setIsOpenTextModal] = useState(false); // مدال متن تعهدنامه (تاریخ و امضا)
//   const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false); // مدال موفقیت نهایی

//   // مدیریت Object URL برای پیش‌نمایش
//   useEffect(() => {
//     return () => {
//       if (previewURL) {
//         URL.revokeObjectURL(previewURL);
//       }
//     };
//   }, [previewURL]);

//   const onSubmit = () => {
//     if (!selectedFile) {
//       toast.error("لطفا تصویر تعهدنامه را بارگذاری کنید.");
//       return;
//     }

//     // ⭐️⭐️ تغییر مهم: ابتدا مدال تعهدنامه باز می‌شود ⭐️⭐️
//     setIsOpenTextModal(true);
//     // onNext() باید بعد از تأیید نهایی در مدال موفقیت فراخوانی شود.
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const file = files[0];

//       if (previewURL) {
//         URL.revokeObjectURL(previewURL);
//       }

//       const objectUrl = URL.createObjectURL(file);

//       setSelectedFile(file);
//       setValue("document", files);
//       onFileChange(file);
//       setPreviewURL(objectUrl);

//       // نکته: اگر با این کار هم پیش نمایش دیده نشد، احتمالاً مشکل از Tailwind CSS و کلاس‌های
//       // max-h-full max-w-full object-contain است که فضای کافی برای نمایش ندارند.
//       // باید مطمئن شوید والد (div.h-48) ارتفاع مناسبی دارد که دارد.
//     } else {
//       setSelectedFile(null);
//       setPreviewURL(null);
//       onFileChange(null);
//     }
//   };

//   const closeTextModalAndOpenSuccessModal = () => {
//     setIsOpenTextModal(false); // بستن مدال اول
//     setIsOpenSuccessModal(true); // باز کردن مدال موفقیت
//   };

//   const closeSuccessModalAndNavigate = () => {
//     setIsOpenSuccessModal(false); // بستن مدال موفقیت
//     onNext();
//   };

//   // ... (handleClick)

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full"
//       >
//         <div className="flex flex-col text-right">
//          <StepperComponent currentStep={1} isAdvance={true} />
//           <p className="lg:text-xl font-medium text-black1 hidden lg:flex self-end mb-5">
//             لطفا مدرک شناسایی خود را بارگذاری کنید
//           </p>
//           <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-6 mb-4 rounded-lg">
//             {/* ... متن توجه داشته باشید ... */}

//             <div className="flex text-orange1 gap-1 self-end font-medium">
//               <span className="lg:text-base text-xs">توجه داشته باشید</span>
//               <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
//                 <IconAlert />
//               </span>
//             </div>

//             <ul
//               className="list-disc list-inside text-right text-black1 lg:text-base text-xs"
//               dir="rtl"
//             >
//               <li>
//                 تصاویر و مدارک ارائه‌شده واضح، خوانا و کامل باشند و در صورت تار
//                 بودن یا ناقص بودن، مورد تأیید قرار نگیرند.
//               </li>
//               <li>تعهدنامه بدون امضا و تاریخ فاقد اعتبار است.</li>
//               <li>
//                 متن این تعهدنامه عیناً مطابق نمونه نوشته شود و هرگونه تغییر، حذف
//                 یا خلاصه‌نویسی موجب رد آن می‌شود.
//               </li>
//               <li>
//                 نام صرافی [پی فا 24] به صورت صحیح ذکر شود و در صورت وجود غلط
//                 املایی، تعهدنامه رد خواهد شد.
//               </li>
//             </ul>
//           </div>

//           <div
//             className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
//             onClick={() => fileInputRef.current?.click()}
//           >
//             {/* ⭐️⭐️ بخش نمایش پیش‌نمایش - مطمئن شوید کلاس‌های max-h-full و h-48 به درستی عمل می‌کنند. ⭐️⭐️ */}
//             <div className="flex flex-col items-center justify-center h-48">
//               {!previewURL && (
//                 <>
//                   <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
//                     <UploadImage />
//                   </span>
//                   <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
//                     بارگذاری تصویر تعهدنامه
//                   </p>
//                 </>
//               )}
//               {previewURL && (
//                 <div className="flex justify-center items-center w-full h-full">
//                   <img
//                     src={previewURL}
//                     alt="پیش نمایش"
//                     className="max-h-full max-w-full rounded-lg object-contain"
//                   />
//                 </div>
//               )}
//             </div>

//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//           </div>

//           <button
//             type="button" // ⬅️ این باید type="button" باشد تا فرم سابمیت نشود
//             className="text-blue2 lg:text-lg text-base font-bold rounded-lg border border-blue2 lg:h-[56px] h-[40px]"
//             onClick={() => setIsOpenAccordion(!isOpenAccordion)} // ⬅️ فعال‌سازی آکوردئون
//           >
//             متن تعهد نامه
//           </button>

//           {/* نمایش تعهد نامه - اصلاح‌شده برای آکوردئون */}
//           <div className="mt-4 mb-14 border border-gray12 rounded-lg">
//             <div
//               className="flex justify-between items-center flex-row-reverse p-4 cursor-pointer"
//               onClick={() => setIsOpenAccordion(!isOpenAccordion)}
//             >
//               <h2 className="text-base font-medium text-black1">
//                 نمونه تصویر تعهدنامه
//               </h2>
//               <span className="icon-wrapper w-5 h-5 text-gray15">
//                 {isOpenAccordion ? <IconCloseChervon /> : <IconOpenChervon />}
//               </span>
//             </div>
//             {isOpenAccordion && (
//               <div>
//                 <img
//                   src={previewURLImage2}
//                   alt="تعهد نامه"
//                   className="w-full h-64 object-fill rounded-lg mb-2 px-4"
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-1 text-lg font-bold mb-6 bg-blue1 w-full lg:h-[56px] h-10 rounded-lg text-white2"
//           disabled={!selectedFile}
//         >
//           تأیید
//         </button>
//       </form>

//       {/* ⭐️ مدال ۱: متن تعهدنامه (تاریخ و امضا) ⭐️ */}
//       {isOpenTextModal && (
//         <div
//           onClick={() => {
//             setIsOpenTextModal(false); // بستن مدال اول
//             closeTextModalAndOpenSuccessModal(); // باز کردن مدال موفقیت
//           }}
//           className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
//         >
//           <div
//             className="lg:w-[448px] w-full lg:rounded-lg lg:p-8 p-4 relative bg-white8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center flex-row justify-between text-black1">
//               <span
//                 className="icon-wrapper h-6 w-6 cursor-pointer"
//                 onClick={() => {
//                   setIsOpenTextModal(false); // بستن مدال اول
//                   closeTextModalAndOpenSuccessModal(); // باز کردن مدال موفقیت
//                 }}
//               >
//                 <IconClose />
//               </span>
//               <span className="font-normal text-base">متن تعهدنامه</span>
//             </div>
//             <p className="text-right mt-12 mb-6 lg:text-lg text-sm font-medium text-black1">
//               اینجانب (نام و نام خانوادگی) فرزند (نام پدر) با پذیرش تمام شرایط و
//               قوانین مندرج در وبسایت payfa24.com اقدام به ثبت نام و فعالیت نموده
//               و کاربری و حساب خود را اجاره نخواهم داد
//             </p>
//             <span className="text-lg font-medium text-black1">
//               تاریخ + امضا
//             </span>
//           </div>
//         </div>
//       )}

//       {/* ⭐️ مدال ۲:  ⭐️ */}
//       {isOpenSuccessModal && (
//         <div
//           onClick={closeSuccessModalAndNavigate}
//           className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
//         >
//           <div
//             className="lg:w-[448px] w-full lg:rounded-2xl rounded-xl lg:p-8 p-4 relative bg-white8 text-center"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <span className="icon-wrapper w-16 h-16 mx-auto text-blue1">
//               <IconVerify />
//             </span>
//             <p className="text-xl font-bold mt-4 mb-8 text-black0">
//               ! احراز هویت شما باموفقیت انجام شد
//             </p>
//             <button
//               type="button"
//                onClick={closeSuccessModalAndNavigate} // ⬅️ فراخوانی onNext
//               className="mt-2 text-lg font-bold bg-blue1 w-full h-[56px] rounded-lg text-white2"
//             >
//               متوجه شدم
//             </button>
//             {/* <button
//                  type="button"
//                  onClick={closeSuccessModalAndNavigate} // یا بازگشت به صفحه اصلی
//                  className="mt-4 text-lg font-bold border border-blue1 text-blue1 w-full h-[56px] rounded-lg bg-white"
//               >
//                  بازگشت به صفحه اصلی
//               </button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// ... (سایر import ها)
import UploadImage from "../../../../assets/Icons/authentication/UploadImage";
import IconAlert from "../../../../assets/Icons/Login/IconAlert";
import { toast } from "react-toastify";
import StepperComponent from "../Stepper";
import IconCloseChervon from "../../../../assets/Icons/authentication/IconCloseChervon";
import IconOpenChervon from "../../../../assets/Icons/authentication/IconOpenChervon";
import IconClose from "../../../../assets/Icons/Login/IconClose";
import previewURLImage2 from "../../../../assets/previewURLImage (2).png";
import IconCheck from "../../../../assets/Icons/authentication/IconCheckmark";
import IconVerify from "../../../../assets/Icons/authentication/IconVerify";
import { useNavigate } from "react-router-dom"; // ⬅️ استفاده از react-router-dom برای ناوبری

type Props = {
  onNext: () => void;
  onFileChange: (file: File | null) => void;
  initialPreviewUrl: string | null;
};

type FormData = {
  document: FileList;
};
export default function IdentityVerification({
  onNext,
  onFileChange,
  initialPreviewUrl,
}: Props) {
  const { handleSubmit, setValue } = useForm<FormData>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(
    initialPreviewUrl
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const [isOpenTextModal, setIsOpenTextModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  useEffect(() => {
        setPreviewURL(initialPreviewUrl);
        return () => {
            if (previewURL && previewURL.startsWith("blob:")) {
                URL.revokeObjectURL(previewURL);
            }
        };
    }, [previewURL, initialPreviewUrl]);

    const onSubmit = () => {
        if (!selectedFile && !initialPreviewUrl) {
            toast.error("لطفا تصویر تعهدنامه را بارگذاری کنید.");
            return;
        }
        setIsOpenTextModal(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (previewURL && previewURL.startsWith("blob:")) {
                URL.revokeObjectURL(previewURL);
            }
            const objectUrl = URL.createObjectURL(file);
            setSelectedFile(file);
            setValue("document", files);
            onFileChange(file); // ⬅️ فراخوانی تابع ارسالی از والد
            setPreviewURL(objectUrl);
        } else {
            setSelectedFile(null);
            setPreviewURL(null);
            onFileChange(null);
        }
    };

    const closeTextModalAndOpenSuccessModal = () => {
        setIsOpenTextModal(false);
        setIsOpenSuccessModal(true);
    };

    // ⭐️⭐️ تابع اصلاح شده برای شروع آپلود در Advance.tsx
    const closeSuccessModalAndCallNext = () => {
        setIsOpenSuccessModal(false);
        onNext(); // ⬅️ فراخوانی onNext در Advance.tsx
        // ناوبری (navigate) فقط در Advance.tsx و پس از موفقیت API رخ می‌دهد.
    };
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:bg-gray9 lg:rounded-2xl lg:px-8 w-full"
      >
        {/* ... (کدهای Stepper، توضیحات و آپلود فایل) ... */}
        <div className="flex flex-col text-right">
          <StepperComponent currentStep={1} isAdvance={true} />
          <p className="lg:text-xl font-medium text-black1 hidden lg:flex self-end mb-5">
            لطفا مدرک شناسایی خود را بارگذاری کنید
          </p>
          <div className="bg-orange4 flex flex-col pr-6 pl-2 py-4 gap-2 lg:mb-6 mb-4 rounded-lg">
            <div className="flex text-orange1 gap-1 self-end font-medium">
              <span className="lg:text-base text-xs">توجه داشته باشید</span>
              <span className="icon-wrapper lg:w-6 lg:h-6 w-4 h-4 text-orange1">
                <IconAlert />
              </span>
            </div>

            <ul
              className="list-disc list-inside text-right text-black1 lg:text-base text-xs"
              dir="rtl"
            >
              <li>
                تصاویر و مدارک ارائه‌شده واضح، خوانا و کامل باشند و در صورت تار
                بودن یا ناقص بودن، مورد تأیید قرار نگیرند.
              </li>
              <li>تعهدنامه بدون امضا و تاریخ فاقد اعتبار است.</li>
              <li>
                متن این تعهدنامه عیناً مطابق نمونه نوشته شود و هرگونه تغییر، حذف
                یا خلاصه‌نویسی موجب رد آن می‌شود.
              </li>
              <li>
                نام صرافی [پی فا 24] به صورت صحیح ذکر شود و در صورت وجود غلط
                املایی، تعهدنامه رد خواهد شد.
              </li>
            </ul>
          </div>

          <div
            className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-48">
              {!previewURL ? (
                <>
                  <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
                    <UploadImage />
                  </span>
                  <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
                    بارگذاری تصویر مدرک شناسایی
                  </p>
                </>
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={previewURL}
                    // alt="  بارگذاری تصویر مدرک شناسایی"
                    className="max-h-48 max-w-full rounded-lg absolute"
                  />
                  <div>
                    <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15">
                      <UploadImage />
                    </span>
                    <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">
                      بارگذاری تصویر مدرک شناسایی
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button
            type="button"
            className="text-blue2 lg:text-lg text-base font-bold rounded-lg border border-blue2 lg:h-[56px] h-[40px]"
            onClick={() => setIsOpenAccordion(!isOpenAccordion)}
          >
            متن تعهد نامه
          </button>

          {/* نمایش تعهد نامه - آکوردئون */}
          <div className="mt-4 mb-14 border border-gray12 rounded-lg">
            <div
              className="flex justify-between items-center flex-row-reverse p-4 cursor-pointer"
              onClick={() => setIsOpenAccordion(!isOpenAccordion)}
            >
              <h2 className="text-base font-medium text-black1">
                نمونه تصویر تعهدنامه
              </h2>
              <span className="icon-wrapper w-5 h-5 text-gray15">
                {isOpenAccordion ? <IconCloseChervon /> : <IconOpenChervon />}
              </span>
            </div>
            {isOpenAccordion && (
              <div>
                <img
                  src={previewURLImage2}
                  alt="تعهد نامه"
                  className="w-full h-64 object-fill rounded-lg mb-2 px-4"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 text-lg font-bold mb-6 bg-blue1 w-full lg:h-[56px] h-10 rounded-lg text-white2"
          disabled={!selectedFile}
        >
          تأیید
        </button>
      </form>

      {/* ⭐️ مدال ۱: متن تعهدنامه (تاریخ و امضا) ⭐️ */}
      {isOpenTextModal && (
        <div
          onClick={closeTextModalAndOpenSuccessModal}
          className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        >
          <div
            className="lg:w-[448px] w-full lg:rounded-lg lg:p-8 p-4 relative bg-white8"
            onClick={(e) => e.stopPropagation()} // ⬅️ جلوگیری از ناوبری با کلیک داخلی
          >
            <div className="flex items-center flex-row justify-between text-black1">
              <span
                className="icon-wrapper h-6 w-6 cursor-pointer"
                onClick={closeTextModalAndOpenSuccessModal}
              >
                <IconClose />
              </span>
              <span className="font-normal text-base">متن تعهدنامه</span>
            </div>
            <p className="text-right mt-12 mb-6 lg:text-lg text-sm font-medium text-black1">
              اینجانب (نام و نام خانوادگی) فرزند (نام پدر) با پذیرش تمام شرایط و
              قوانین مندرج در وبسایت payfa24.com اقدام به ثبت نام و فعالیت نموده
              و کاربری و حساب خود را اجاره نخواهم داد
            </p>
            <span className="text-lg font-medium text-black1">
              تاریخ + امضا
            </span>
          </div>
        </div>
      )}

      {/* ⭐️ مدال ۲: مدال موفقیت نهایی ⭐️ */}
      {isOpenSuccessModal && (
        <div
          onClick={closeSuccessModalAndCallNext}
          className="fixed cursor-pointer inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div
            className="lg:w-[448px] w-full lg:rounded-2xl rounded-xl lg:p-8 p-4 relative bg-white8 text-center"
            onClick={(e) => e.stopPropagation()} // ⬅️ جلوگیری از ناوبری با کلیک داخلی
          >
            <span className="icon-wrapper w-16 h-16 mx-auto text-blue1">
              <IconVerify />
            </span>
            <p className="text-xl font-bold mt-4 mb-8 text-black0">
              ! احراز هویت شما باموفقیت انجام شد
            </p>
            <button
              type="button"
              // ⬅️⬅️ ناوبری نهایی به هوم با کلیک روی دکمه مدال ۲
              onClick={closeSuccessModalAndCallNext}
              className="mt-2 text-lg font-bold bg-blue1 w-full h-[56px] rounded-lg text-white2"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
