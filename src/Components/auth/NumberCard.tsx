// import React, { useState, useRef } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// // این کامپوننت برای نمایش مراحل فرم استفاده می‌شود.
// // برای سادگی، یک نسخه ساده از آن را اینجا قرار می‌دهیم.
// const StepperComponent = ({ currentStep }: { currentStep: number }) => {
//   return (
//     <div className="flex justify-center items-center gap-2 mt-4 lg:mt-8">
//       {[1, 2, 3].map((step) => (
//         <div
//           key={step}
//           className={`h-2 rounded-full transition-all duration-300 ${
//             step <= currentStep ? "bg-blue-500 w-8" : "bg-gray-300 w-2"
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// // این کامپوننت OTPModal را شبیه‌سازی می‌کند.
// // برای سادگی، یک نسخه ساده از آن را اینجا قرار می‌دهیم.
// const OTPModal = ({ length, onChange }: { length: number; onChange: (code: string) => void }) => {
//   const [otp, setOtp] = useState(new Array(length).fill(""));
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const { value } = e.target;
//     if (isNaN(Number(value))) return;

//     const newOtp = [...otp];
//     newOtp[index] = value.slice(0, 1);
//     setOtp(newOtp);
//     onChange(newOtp.join(""));

//     if (value && index < length - 1) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <div className="flex justify-center gap-2">
//       {otp.map((data, index) => (
//         <input
//           key={index}
//           ref={(el) => (inputRefs.current[index] = el)}
//           type="text"
//           value={data}
//           onChange={(e) => handleChange(e, index)}
//           onKeyDown={(e) => handleKeyDown(e, index)}
//           maxLength={1}
//           className="w-10 h-10 lg:w-12 lg:h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:border-blue-500"
//         />
//       ))}
//     </div>
//   );
// };

// // تابع برای فرمت کردن شماره کارت با خط تیره
// const formatCardNumber = (value) => {
//   const numericValue = value.replace(/\D/g, "");
//   return numericValue.replace(/(\d{4})(?=\d)/g, "$1-");
// };

// // کامپوننت اصلی و سفارشی ورودی شماره کارت
// const CardNumberInput = ({ value, onChange, error }) => {
//   const inputRefs = useRef([]);
//   const displayedValue = value.replace(/-/g, "");

//   const handleChange = (e, index) => {
//     const { value: inputValue } = e.target;
//     if (isNaN(Number(inputValue)) || inputValue.length > 1) {
//       return;
//     }

//     const newValueArray = displayedValue.split('');
//     newValueArray[index] = inputValue;

//     const newNumericValue = newValueArray.join('');
//     onChange(formatCardNumber(newNumericValue));

//     // انتقال فوکوس به باکس بعدی
//     if (inputValue && index < 15) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && index > 0 && !displayedValue[index]) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex justify-center items-center gap-1.5 lg:gap-2 text-xl font-bold rtl">
//         {Array.from({ length: 16 }).map((_, index) => {
//           const char = displayedValue[index] || "_";
//           return (
//             <React.Fragment key={index}>
//               <div
//                 className="w-8 h-10 lg:w-10 lg:h-12 flex justify-center items-center border border-gray-300 rounded-lg"
//               >
//                 <input
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   type="text"
//                   maxLength={1}
//                   value={displayedValue[index] || ""}
//                   onChange={(e) => handleChange(e, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   className="w-full h-full text-center text-black font-bold bg-transparent focus:outline-none"
//                 />
//               </div>
//               {(index + 1) % 4 === 0 && index < 15 && (
//                 <span className="text-2xl font-bold text-gray-400">-</span>
//               )}
//             </React.Fragment>
//           );
//         })}
//       </div>
//       {error && <p className="text-red-500 text-xs mt-2 text-end w-full">{error}</p>}
//     </div>
//   );
// };

// // طرحواره اعتبارسنجی با استفاده از yup
// const schema = yup.object().shape({
//   cardNumber: yup
//     .string()
//     .required("شماره کارت الزامی است.")
//     .matches(/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, "شماره کارت باید ۱۶ رقمی باشد."),
// });

// // کامپوننت اصلی StepCard
// export default function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const contactMethod = "card";

//   const {
//     control,
//     handleSubmit,
//     watch,
//     getValues,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: { cardNumber: "" },
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });

//   const cardNumberValue = watch("cardNumber");

//   const onSubmit = (data) => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     // در اینجا باید به مرحله بعدی بروید
//     // onNext();
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="lg:p-16 p-6 lg:border border-gray-200  rounded-2xl shadow-lg w-full max-w-lg"
//       >
//         <StepperComponent currentStep={3} />
//         <p className="lg:text-lg text-sm mt-10 mb-8 text-end text-gray-800">
//           شماره کارت خود را وارد کنید
//         </p>
//         <Controller
//           name="cardNumber"
//           control={control}
//           render={({ field }) => (
//             <CardNumberInput
//               value={field.value}
//               onChange={(formattedValue) => field.onChange(formattedValue)}
//               error={errors.cardNumber?.message}
              
//             />
//           )}
//         />
//         <button
//           type="submit"
//           className="mt-12 w-full h-12 bg-blue-500 font-bold text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
//         >
//           تایید
//         </button>
//       </form>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="lg:w-[448px] w-[328px] rounded-lg p-8 relative bg-white" onClick={(e) => e.stopPropagation()}>
//             <h2 className="lg:text-lg text-sm font-bold text-gray-900 text-right">
//               تایید شماره کارت
//             </h2>
//             <p className="mt-8 mb-6 lg:text-lg text-sm text-center text-gray-600">
//               لطفا کد ارسالی به شماره کارت{" "}
//               {getValues("cardNumber") || "____-____-____-____"}{" "}
//               را وارد کنید.
//             </p>
//             <div className="mt-8 mb-12">
//               <OTPModal length={5} onChange={(code) => console.log("کد وارد شده:", code)} />
//             </div>
//             <div className="flex justify-between flex-row-reverse mb-4">
//               <div className="flex gap-2 items-center">
//                 <span className="text-gray-500">ارسال مجدد</span>
//                 {/* می‌توانید اینجا یک آیکون اضافه کنید */}
//                 <span className="h-5 w-5 bg-gray-300 rounded-full"></span>
//               </div>
//               <p className="text-gray-500">ارسال مجدد کد تا 2:30</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-1/2 h-12 border border-blue-500 rounded-lg text-blue-500 text-sm hover:bg-blue-50"
//               >
//                 ویرایش شماره
//               </button>
//               <button
//                 onClick={handleCloseModal}
//                 className="w-1/2 h-12 font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 تایید
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
