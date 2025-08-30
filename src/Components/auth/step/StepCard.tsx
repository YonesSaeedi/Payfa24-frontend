import { Controller, useForm } from "react-hook-form";
import StepperComponent from "./Stepper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "../../InputField/TextField";
import { useState } from "react";
import IconClose from "../../../assets/Icons/Login/IconClose";
import OTPModal from "../../OTPModal";
import IconAgain from "../../../assets/Icons/Login/IconAgain";

type Props = {
  onNext: () => void;
};

type FormValues = {
  cardNumber: string; // تغییر نام از email به cardNumber
};

const schema = yup.object().shape({
  cardNumber: yup
    .string()
    .required("شماره کارت الزامی است.")
    .matches(/^\d{4}-?\d{4}-?\d{4}-?\d{4}$/, "شماره کارت باید ۱۶ رقمی باشد.")
    .test("valid-length", "شماره کارت باید ۱۶ رقم باشد.", (value) => {
      const digits = value ? value.replace(/-/g, "") : "";
      return digits.length === 16;
    }),
});

// تابع فرمت‌کننده شماره کارت
const formatCardNumber = (value: string): string => {
  const numericValue = value.replace(/[^0-9]/g, ""); // فقط اعداد را نگه می‌داریم
  if (numericValue.length === 0) return "____-____-____-____"; // پیش‌فرض با خط تیره
  const formattedValue = numericValue
    .slice(0, 16) // حداکثر 16 رقم
    .replace(/(\d{4})/g, "$1-")
    .replace(/-$/, ""); // حذف خط تیره اضافی در آخر
  // پر کردن با خط تیره اگر تعداد اعداد کمتر از 16 باشد
  const parts = formattedValue.split("-");
  while (parts.length < 4) parts.push("____");
  return parts.join("-").slice(0, 19); // حداکثر 19 کاراکتر (16 رقم + 3 خط تیره)
};

export default function StepCard({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contactMethod = "email";

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { cardNumber: "____-____-____-____" }, // مقدار پیش‌فرض با خط تیره
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const cardNumberValue = watch("cardNumber");

  const onSubmit = (data: FormValues) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onNext();
  };

  return (
    <>
      <div className="w-full">
        <form className="lg:px-16 px-2 lg:border border-gray26 lg:bg-gray27 lg:rounded-2xl">
          <StepperComponent currentStep={3} />

          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
            شماره کارت خود را وارد کنید
          </p>

          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <TextField
                label="شماره کارت"
                type="text"
                error={errors.cardNumber?.message}
                {...field}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setValue("cardNumber", formatted, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                value={cardNumberValue}
                className="w-full mt-2 bg-transparent"
              />
            )}
          />

          <button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            className="lg:mt-22 mt-12 mb-60 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            تایید
          </button>
        </form>

        {isModalOpen && (
          <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              onClick={() => {
                setIsModalOpen(false);
                console.log("Clicked outside, closing modal");
              }}
            >
              <div
                className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center flex-row-reverse justify-between">
                  <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                    {contactMethod === "phone"
                      ? "تایید شماره همراه"
                      : "تایید ایمیل"}
                  </h2>
                  <span
                    className="icon-wrapper h-6 w-6 cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <IconClose />
                  </span>
                </div>

                <p
                  className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
                  dir="rtl"
                >
                  لطفا کد ارسالی به{" "}
                  {contactMethod === "phone"
                    ? `شماره ${getValues("cardNumber")}`
                    : `ایمیل ${getValues("cardNumber")}`}{" "}
                  را وارد کنید.
                </p>

                <div className="mt-[32px] mb-[48px]">
                  <OTPModal
                    length={5}
                    onChange={(code) => console.log("کد وارد شده:", code)}
                  />
                </div>

                <div className="flex justify-between flex-row-reverse mb-4">
                  <div className="flex gap-2 items-center">
                    <span className="text-gray12">ارسال مجدد</span>
                    <span className="icon-wrapper h-5 w-5 cursor-pointer">
                      <IconAgain />
                    </span>
                  </div>
                  <p className="text-gray12">ارسال مجدد کد تا 2:30</p>
                </div>
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
                  >
                    ویرایش ایمیل
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
                  >
                    تایید
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}











// import { Controller, useForm } from "react-hook-form";
// import StepperComponent from "./Stepper";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import TextField from "../../InputField/TextField";
// import { useState } from "react";
// import IconClose from "../../../assets/Icons/Login/IconClose";
// import OTPModal from "../../OTPModal";
// import IconAgain from "../../../assets/Icons/Login/IconAgain";
// import { Link } from "react-router";

// type props = {
//   onNext: () => void;
// };

// type FormValues = {
//   email: string;
// };
// const schema = yup.object().shape({
//   email: yup
//     .string()
//     .required("ایمیل الزامی است.")
//     .email("ایمیل وارد شده معتبر نیست."),
// });

// export default function StepCard({ onNext }: props) {
//   const [IsModalOpen, setIsModalOpen] = useState(true);
//   const contactMethod = "email";

//   const {
//     control,
//     handleSubmit,
//     watch,
//     getValues,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: { email: "" },
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });

//   const emailValue = watch("email");

//   const onSubmit = (data: FormValues) => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     onNext();
//   };

//   return (
//     <>
//       <div className="w-full">
//         <form className="lg:px-16 px-2 lg:border border-gray26 lg:bg-gray9 lg:rounded-2xl">
//           <StepperComponent currentStep={3} />

//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 text-end text-black0">
//             .شماره کارت خود را وارد کنید
//           </p>

//           <Controller
//             name="email"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 label="شماره کارت "
//                 type="text"
//                 error={errors.email?.message}
//                 {...field}
//                 // className="w-full mt-2 bg-transparent"
//                 labelBgClass="bg-gray9"
//               />
//             )}
//           />

//           <button
//             onClick={() => {
//               setIsModalOpen(true);
//             }}
//             type="submit"
//             className="lg:mt-22 mt-12 mb-56 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             تایید
//           </button>
//         </form>

//         {IsModalOpen && (
//           <div>
//             <div className="fixed inset-0 bg-black bg-opacity-50 z-45"></div>
//             <div
//               className="fixed inset-0 flex items-center justify-center z-50"
//               onClick={() => {
//                 setIsModalOpen(false);
//                 console.log("Clicked outside, closing modal");
//               }}
//             >
//               <div
//                 className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex items-center flex-row-reverse justify-between">
//                   <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
//                     {contactMethod === "phone"
//                       ? "تایید شماره همراه"
//                       : "تایید ایمیل"}
//                   </h2>
//                   <span
//                     className="icon-wrapper h-6 w-6 cursor-pointer"
//                     onClick={() => setIsModalOpen(false)}
//                   >
//                     <IconClose />
//                   </span>
//                 </div>

//                 <p
//                   className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24"
//                   dir="rtl"
//                 >
//                   لطفا کد ارسالی به{" "}
//                   {contactMethod === "phone"
//                     ? `شماره ${getValues("email")}`
//                     : `ایمیل ${getValues("email")}`}{" "}
//                   را وارد کنید.
//                 </p>

//                 <div className="mt-[32px] mb-[48px]">
//                   <OTPModal
//                     length={5}
//                     onChange={(code) => console.log("کد وارد شده:", code)}
//                   />
//                 </div>

//                 <div className="flex justify-between flex-row-reverse mb-4">
//                   <div className="flex gap-2 items-center ">
//                     <span className="text-gray12">ارسال مجدد</span>
//                     <span className="icon-wrapper h-5 w-5 cursor-pointer">
//                       <IconAgain />
//                     </span>
//                   </div>
//                   <p className="text-gray12">ارسال مجدد کد تا 2:30</p>
//                 </div>
//                 <div className="flex gap-2 mb-8">
//                   <button
//                     onClick={() => setIsModalOpen(false)}
//                     className="mt-4 w-[180px] h-[48px] border border-blue2 rounded-lg text-blue2 text-sm lg:text-medium"
//                   >
//                     ویرایش ایمیل
//                   </button>
//                   <Link to={""}>
//                     <button
//                       onClick={() => setIsModalOpen(false)}
//                       className="mt-4 w-[200px] h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
//                     >
//                       تایید
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
