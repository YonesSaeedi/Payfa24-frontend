import React from "react";
import StepperComponent from "./Stepper";
import TextField from "../../InputField/TextField";
import { Controller, useForm } from "react-hook-form";

type Props = {
  onNext: () => void;
};

// تعریف نوع داده متناسب با فرم
type FormData = {
  lastName: string;
  firstName: string;
  fatherName: string;
  nationalId: string;
  birthDate: string;
};

export default function StepPersonal({ onNext }: Props) {
  const formInput = [
    { name: "lastName", label: "نام خانوادگی" },
    { name: "firstName", label: "نام" },
    { name: "fatherName", label: "نام پدر" },
    { name: "nationalId", label: "کد ملی" },
    { name: "birthDate", label: "تاریخ تولد" },
  ];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      lastName: "",
      firstName: "",
      fatherName: "",
      nationalId: "",
      birthDate: "",
    },
  });

  // تابع ارسال فرم
  const onSubmit = () => {
    onNext(); // فراخوانی onNext برای رفتن به مرحله بعدی (StepCard)
  };

  return (
    <>
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:bg-gray27 lg:rounded-2xl lg:px-16">
          <StepperComponent currentStep={2} />
          <div className="space-y-4">
            {/* ردیف اول: نام و نام خانوادگی کنار هم */}
            <div className="flex space-x-4">
              {formInput.slice(0, 2).map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <TextField
                      label={field.label}
                      type="text"
                      error={errors[field.name]?.message}
                      {...controllerField}
                    />
                  )}
                />
              ))}
            </div>

            {formInput.slice(2).map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    label={field.label}
                    type={field.name === "birthDate" ? "date" : "text"} // نوع تاریخ برای birthDate
                    error={errors[field.name]?.message}
                    {...controllerField}
                  />
                )}
              />
            ))}
          </div>
          <button type="submit" className="mt-52 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2">
            تأیید
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

// type FormData = {
//   lastName: string;
//   firstName: string;
//   fatherName: string;
//   nationalId: string;
//   birthDate: string;
// };

// export default function StepPersonal({ onNext }: Props) {
//   const formInput = [
//     { name: "lastName", label: "نام خانوادگی" },
//     { name: "firstName", label: "نام" },
//     { name: "fatherName", label: "نام پدر" },
//     { name: "nationalId", label: "کد ملی" },
//     { name: "birthDate", label: "تاریخ تولد" },
//   ];

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       lastName: "",
//       firstName: "",
//       fatherName: "",
//       nationalId: "",
//       birthDate: "",
//     },
//   });

//   const onSubmit = () => {
//     onNext();
//   };

//   return (
//     <>
//       <div className="w-full">
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-red-300 lg:px-16">
//           <StepperComponent currentStep={2} />
//           <div className="space-y-4">
//             {/* ردیف اول: نام و نام خانوادگی کنار هم */}
//             <div className="flex space-x-4">
//               {formInput.slice(0, 2).map((field) => (
//                 <Controller
//                   key={field.name}
//                   name={field.name}
//                   control={control}
//                   render={({ field: controllerField }) => (
//                     <TextField
//                       label={field.label}
//                       type="text"
//                       error={errors[field.name]?.message}
//                       {...controllerField}
//                     />
//                   )}
//                 />
//               ))}
//             </div>

//             {formInput.slice(2).map((field) => (
//               <Controller
//                 key={field.name}
//                 name={field.name}
//                 control={control}
//                 render={({ field: controllerField }) => (
//                   <div className="relative">
//                     {field.name === "birthDate" ? (
//                       <div className="relative w-full">
//                         <input
//                           type="date"
//                           value={controllerField.value}
//                           onChange={(e) => controllerField.onChange(e.target.value)}
//                           onBlur={controllerField.onBlur}
//                           className="w-full lg:h-[56px] h-[48px] rounded-xl border px-10 py-2 text-[14px] font-normal focus:outline-none bg-white4 text-gray12 border-gray12 appearance-none"
//                           style={{ marginLeft: "0", marginRight: "10rem" }} // فضای کافی برای آیکون و متن
//                         />
//                         <button
//                           type="button"
//                           className="absolute left-18 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
//                           onClick={() => {
//                             // اینجا می‌تونی لاجیک باز کردن تقویم رو تنظیم کنی، ولی type="date" خودش این کار رو می‌کنه
//                           }}
//                         >
//                           {/* 📅 */}
//                         </button>
//                         <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                           تاریخ تولد
//                         </span>
//                       </div>
//                     ) : (
//                       <TextField
//                         label={field.label}
//                         type="text"
//                         error={errors[field.name]?.message}
//                         {...controllerField}
//                       />
//                     )}
//                     {errors[field.name]?.message && (
//                       <span className="text-red-500 text-sm">
//                         {errors[field.name]?.message}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               />
//             ))}
//           </div>
//           <button type="submit" className="mt-52 mb-8 bg-blue1 w-full h-[56px] rounded-lg">
//             تأیید
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }