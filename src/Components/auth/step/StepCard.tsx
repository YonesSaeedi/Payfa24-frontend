import { Controller, useForm } from "react-hook-form";
import StepperComponent from "./Stepper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../../InputField/TextField";
type props = {
  onNext: () => void;
};

type FormValues = {
  email: string;
};
const schema = yup.object().shape({
  email: yup
    .string()
    .required("ایمیل الزامی است.")
    .email("ایمیل وارد شده معتبر نیست."),
});

export default function StepCard({ onNext }: props) {
  const {
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: "" },
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  return (
    <>
      <div className="w-full">
        <form className="lg:px-16 px-2 lg:border border-gray26 lg:bg-gray27 lg:rounded-2xl">
          <StepperComponent currentStep={3}  />

          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
           .شماره کارت خود را وارد کنید
          </p>

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                label="شماره کارت "
                type="text"
                error={errors.email?.message}
                {...field}
                className="w-full mt-2 bg-transparent"
              />
            )}
          />

          <button
            type="submit"
            className="lg:mt-22 mt-12 mb-60 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            تایید
          </button>
        </form>
      </div>
    </>
  );
}









// import React from "react";
// import StepperComponent from "./Stepper";
// import TextField from "../../InputField/TextField";
// import { Controller, useForm } from "react-hook-form";

// type Props = {
//   onNext: () => void;
// };

// type CardFormData = {
//   cardNumber: string; // نوع داده برای شماره کارت
// };

// export default function StepCard({ onNext }: Props) {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CardFormData>({
//     defaultValues: {
//       cardNumber: "",
//     },
//   });

//   const onSubmit = () => {
//     onNext();
//   };

//   // تابع برای فرمت‌دهی شماره کارت
//   const formatCardNumber = (value: string) => {
//     // حذف همه کاراکترهای غیرعددی
//     const cleaned = value.replace(/\D/g, "");
//     // محدود کردن به 16 رقم
//     const maxLength = 16;
//     const truncated = cleaned.slice(0, maxLength);

//     // اضافه کردن خط بعد از هر 4 رقم
//     let formatted = "";
//     for (let i = 0; i < truncated.length; i++) {
//       if (i > 0 && i % 4 === 0) {
//         formatted += "-";
//       }
//       formatted += truncated[i];
//     }

//     return formatted;
//   };

//   return (
//     <>
//       <div className="w-full">
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-gray31 lg:px-16">
//           <StepperComponent currentStep={3} />

//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
//             شماره کارت خود را وارد کنید
//           </p>

//           <Controller
//             name="cardNumber" // تغییر به cardNumber
//             control={control}
//             render={({ field: { onChange, value, onBlur } }) => (
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={formatCardNumber(value)} // فرمت خودکار
//                   onChange={(e) => onChange(e.target.value)} // فقط مقدار خام
//                   onBlur={onBlur}
//                   placeholder="1234-5678-9012-3456"
//                   className="w-full lg:h-[56px] h-[40px] rounded-xl border px-4 py-2 text-[14px] font-normal focus:outline-none bg-transparent text-gray12 border-gray12"
//                   maxLength={19} // 16 رقم + 3 خط
//                 />
//                 {errors.cardNumber?.message && (
//                   <span className="text-red-500 text-sm">
//                     {errors.cardNumber?.message}
//                   </span>
//                 )}
//               </div>
//             )}
//           />

//           <button
//             type="submit"
//             className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             تأیید
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }