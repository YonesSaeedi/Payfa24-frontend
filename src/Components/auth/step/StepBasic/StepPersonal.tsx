// import React, { useRef } from "react";
// import StepperComponent from "./Stepper";
// import TextField from "../../InputField/TextField";
// import { Controller, useForm } from "react-hook-form";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import IconCalender from "../../../assets/Icons/authentication/IconCalender";

// type Props = {
//   onNext: () => void;
//   onBack?: () => void;
// };

// type FormData = {
//   lastName: string;
//   firstName: string;
//   fatherName: string;
//   nationalId: string;
//   birthDate: string;
//   name: string;
// };

// export default function StepPersonal({ onNext, onBack }: Props) {
//   const datePickerRef = useRef<any>(null);

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
//     getValues,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       lastName: "",
//       firstName: "",
//       fatherName: "",
//       nationalId: "",
//       birthDate: "",
//       name: "",
//     },
//   });

//   const onSubmit = () => {
//     onNext();
//   };

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-10 w-f"
//       >
//         <StepperComponent currentStep={2} />
//         <div className="space-y-7 lg:space-y-8 my-14">
//           {/* دو فیلد اول */}
//           <div className="flex space-x-4">
//             {formInput.slice(0, 2).map((field) => (
//               <Controller
//                 key={field.name}
//                 name={field.name}
//                 control={control}
//                 render={({ field: controllerField }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     error={errors[field.name]?.message}
//                     {...controllerField}

//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             ))}
//           </div>

//           {/* فیلدهای بعدی */}
//           {formInput.slice(2).map((field) => {
//             if (field.name === "birthDate") {
//               return (
//                 <Controller
//                   key={field.name}
//                   name="birthDate"
//                   control={control}
//                   rules={{
//                     required: "تاریخ تولد الزامی است",
//                     validate: (value) => {
//                       if (!value) return true;
//                       const parts = value.split("/");
//                       const year = parseInt(parts[0], 10);
//                       const month = parseInt(parts[1], 10) - 1;
//                       const day = parseInt(parts[2], 10);
//                       const birthDate = new Date(year, month, day);
//                       const today = new Date();
//                       let age = today.getFullYear() - birthDate.getFullYear();
//                       const m = today.getMonth() - birthDate.getMonth();
//                       if (
//                         m < 0 ||
//                         (m === 0 && today.getDate() < birthDate.getDate())
//                       ) {
//                         age--;
//                       }
//                       return age >= 18 || "سن باید حداقل ۱۸ سال باشد";
//                     },
//                   }}
//                   render={({ field: controllerField, fieldState }) => (
//                     <div className="relative">
//                       {/* Input اصلی */}
//                       <TextField
//                         label={field.label}
//                         type="text"
//                         value={controllerField.value || ""}
//                         onChange={() => {
//                           ("");
//                         }}
//                         onBlur={() => {}}
//                         labelBgClass="bg-gray9"
//                         error={fieldState.error?.message}
//                         icon={
//                           <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
//                             <IconCalender />
//                           </span>
//                         }
//                         onIconClick={() =>
//                           datePickerRef.current?.openCalendar()
//                         }
//                       />

//                       {/* DatePicker مخفی */}
//                       <DatePicker
//                         ref={datePickerRef}
//                         value={controllerField.value}
//                         onChange={(date) =>
//                           controllerField.onChange(date?.format?.("YYYY/MM/DD"))
//                         }
//                         editable={false}
//                         calendar={persian}
//                         locale={persian_fa}
//                         // minDate={new Date().setDate(5)}
//                         minDate={new Date().setFullYear(
//                           new Date().getFullYear() - 100
//                         )} // حداقل 100 سال قبل
//                         maxDate={new Date()} // حداکثر سال جاری
//                         style={{ display: "none" }}
//                       />
//                     </div>
//                   )}
//                 />
//               );
//             }

//             return (
//               <Controller
//                 key={field.name}
//                 name={field.name}
//                 control={control}
//                 rules={{
//                   required: `${field.label} الزامی است`,
//                 }}
//                 render={({ field: controllerField, fieldState }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     {...controllerField}
//                     error={fieldState.error?.message}
//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             );
//           })}
//         </div>

//         <button
//           type="submit"
//           className="mt-1 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
//         >
//           تأیید
//         </button>
//       </form>
//     </div>
//   );
// }

// s// src/components/auth/step/StepPersonal.tsx



// import React, { useContext, useState } from "react";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { Controller, useForm } from "react-hook-form";
// import IconCalender from "../../../../assets/Icons/authentication/IconCalender";
// import DatePickerModal from "../../../DatePicker"; 
// import { ThemeContext } from "../../../../Context/ThemeContext";

// type Props = {
//   onNext: () => void;
//   onBack?: () => void;
// };

// type FormData = {
//   lastName: string;
//   firstName: string;
//   fatherName: string;
//   nationalId: string;
//   birthDate: string;
// };
// export default function StepPersonal({ onNext }: Props) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");
//   const { theme } = context;

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
//     setValue,
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

//   const handleDateChange = (date: string | null) => {
//     if (date) {
//       setValue("birthDate", date);
//     }
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-2"
//       >
//         <StepperComponent currentStep={1} />
//         <div className="space-y-7 lg:space-y-8 my-14">
//           {/* دو فیلد اول */}
//           <div className="flex space-x-4">
//             {formInput.slice(0, 2).map((field) => (
//               <Controller
//                 key={field.name}
//                 name={field.name as "lastName" | "firstName"}
//                 control={control}
//                 rules={{
//                   required: `${field.label} الزامی است`,
//                 }}
//                 render={({ field: controllerField, fieldState }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     error={fieldState.error?.message}
//                     {...controllerField}
//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             ))}
//           </div>

//           {/* فیلدهای بعدی */}
//           {formInput.slice(2).map((field) => {
//             if (field.name === "birthDate") {
//               return (
//                 <Controller
//                   key={field.name}
//                   name="birthDate"
//                   control={control}
//                   rules={{
//                     required: "تاریخ تولد الزامی است",
//                   }}
//                   render={({ field: controllerField, fieldState }) => (
//                     <div className="relative">
//                       <TextField
//                         label={field.label}
//                         type="text"
//                         value={controllerField.value || ""}
//                         onChange={() => {}}
//                         onBlur={() => {}}
//                         labelBgClass="bg-gray9"
//                         error={fieldState.error?.message}

//                         icon={
//                           <span className = "icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
//                             <IconCalender />
//                           </span>
//                         }
//                         onIconClick={() => setIsModalOpen(true)}
//                       />
//                     </div>
//                   )}
//                 />
//               );
//             }

//             return (
//               <Controller
//                 key={field.name}
//                 name={field.name as "fatherName" | "nationalId"}
//                 control={control}
//                 rules={{
//                   required: `${field.label} الزامی است`,
//                 }}
//                 render={({ field: controllerField, fieldState }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     {...controllerField}
//                     error={fieldState.error?.message}
//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             );
//           })}
//         </div>

//         <button
//           type="submit"
//           className="mt-1 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
//         >
//           تأیید
//         </button>
//       </form>

//       {isModalOpen && (
//         <DatePickerModal
//           setBirthDateBtnValue={handleDateChange}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )}
//     </div>
//   );
// }



import React, { useContext, useState } from "react";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { Controller, useForm } from "react-hook-form";
import IconCalender from "../../../../assets/Icons/authentication/IconCalender";
import DatePickerModal from "../../../DatePicker";
import { ThemeContext } from "../../../../Context/ThemeContext";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

type FormData = {
  lastName: string;
  firstName: string;
  fatherName: string;
  nationalId: string;
  birthDate: string;
};

export default function StepPersonal({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

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
    setValue,
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

  const onSubmit = () => {
    onNext();
  };

  const handleDateChange = (date: string | null) => {
    if (date) {
      setValue("birthDate", date);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-1"
      >
        <StepperComponent currentStep={1} />
        <div className="space-y-7 lg:space-y-8 my-14">
          {/* دو فیلد اول: نام و نام خانوادگی */}
          <div className="flex space-x-4">
            {formInput.slice(0, 2).map((field) => (
              <Controller
                key={field.name}
                name={field.name as "lastName" | "firstName"}
                control={control}
                rules={{
                  required: `${field.label} الزامی است`,
                }}
                render={({ field: controllerField, fieldState }) => (
                  <TextField
                    label={field.label}
                    type="text"
                    error={fieldState.error?.message}
                    {...controllerField}
                    labelBgClass="bg-gray9"
                  />
                )}
              />
            ))}
          </div>

          {/* فیلدهای بعدی */}
          {formInput.slice(2).map((field) => {
            if (field.name === "birthDate") {
              return (
                <Controller
                  key={field.name}
                  name="birthDate"
                  control={control}
                  rules={{
                    required: "تاریخ تولد الزامی است",
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="relative">
                      <TextField
                        label={field.label}
                        type="text"
                        value={controllerField.value || ""}
                        onChange={() => {}}
                        onBlur={() => {}}
                        labelBgClass="bg-gray9"
                        error={fieldState.error?.message}
                        icon={
                          <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
                            <IconCalender />
                          </span>
                        }
                        onIconClick={() => setIsModalOpen(true)}
                      />
                    </div>
                  )}
                />
              );
            }

            // اعتبارسنجی کد ملی
            if (field.name === "nationalId") {
              return (
                <Controller
                  key={field.name}
                  name="nationalId"
                  control={control}
                  rules={{
                    required: "کد ملی الزامی است",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "کد ملی باید یک عدد ۱۰ رقمی باشد",
                    },
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <TextField
                      label={field.label}
                      type="text"
                      {...controllerField}
                      error={fieldState.error?.message}
                      labelBgClass="bg-gray9"
                    />
                  )}
                />
              );
            }

            return (
              <Controller
                key={field.name}
                name={field.name as "fatherName"}
                control={control}
                rules={{
                  required: `${field.label} الزامی است`,
                }}
                render={({ field: controllerField, fieldState }) => (
                  <TextField
                    label={field.label}
                    type="text"
                    {...controllerField}
                    error={fieldState.error?.message}
                    labelBgClass="bg-gray9"
                  />
                )}
              />
            );
          })}
        </div>

        <button
          type="submit"
          className="mt-1 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
        >
          تأیید
        </button>
      </form>

      {isModalOpen && (
        <DatePickerModal
          setBirthDateBtnValue={handleDateChange}
          onClose={() => setIsModalOpen(false)}
        
        />
      )}
    </div>
  );
}