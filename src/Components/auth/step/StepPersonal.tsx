import React, { useRef } from "react";
import StepperComponent from "./Stepper";
import TextField from "../../InputField/TextField";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import IconCalender from "../../../assets/Icons/authentication/IconCalender";

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
  name: string;
};

export default function StepPersonal({ onNext, onBack }: Props) {
  const datePickerRef = useRef<any>(null);

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
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      lastName: "",
      firstName: "",
      fatherName: "",
      nationalId: "",
      birthDate: "",
      name: "",
    },
  });

  const onSubmit = () => {
    onNext();
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:bg-gray9 lg:rounded-2xl lg:px-16"
      >
        <StepperComponent currentStep={2} />
        <div className="space-y-7 lg:space-y-8 my-14">
          {/* دو فیلد اول */}
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
                    validate: (value) => {
                      if (!value) return true;
                      const parts = value.split("/");
                      const year = parseInt(parts[0], 10);
                      const month = parseInt(parts[1], 10) - 1;
                      const day = parseInt(parts[2], 10);
                      const birthDate = new Date(year, month, day);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const m = today.getMonth() - birthDate.getMonth();
                      if (
                        m < 0 ||
                        (m === 0 && today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }
                      return age >= 18 || "سن باید حداقل ۱۸ سال باشد";
                    },
                  }}
                  render={({ field: controllerField, fieldState }) => (
                    <div className="relative">
                      {/* Input اصلی */}
                      <TextField
                        label={field.label}
                        type="text"
                        value={controllerField.value || ""}
                        onChange={() => {
                          ("");
                        }}
                        onBlur={() => {}}
                        labelBgClass="bg-gray9"
                        error={fieldState.error?.message}
                        icon={
                          <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
                            <IconCalender />
                          </span>
                        }
                        onIconClick={() =>
                          datePickerRef.current?.openCalendar()
                        }
                      />

                      {/* DatePicker مخفی */}
                      <DatePicker
                        ref={datePickerRef}
                        value={controllerField.value}
                        onChange={(date) =>
                          controllerField.onChange(date?.format?.("YYYY/MM/DD"))
                        }
                        editable={false}
                        calendar={persian}
                        locale={persian_fa}
                        // minDate={new Date().setDate(5)}
                        minDate={new Date().setFullYear(
                          new Date().getFullYear() - 100
                        )} // حداقل 100 سال قبل
                        maxDate={new Date()} // حداکثر سال جاری
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                />
              );
            }

            return (
              <Controller
                key={field.name}
                name={field.name}
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
          className="mt-28 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
        >
          تأیید
        </button>
      </form>
    </div>
  );
}







// import React, { useRef } from "react";
// import StepperComponent from "./Stepper";
// import TextField from "../../InputField/TextField";
// import { Controller, useForm } from "react-hook-form";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import IconCalender from "../../../assets/Icons/authentication/IconCalender";
// import { DateObject } from "react-multi-date-picker";


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

//   const today = new DateObject({ calendar: persian, date: new Date() }); // 1404/06/07
//   const minDate = new DateObject({
//     calendar: persian,
//     year: today.year - 100, // 100 سال قبل، حدود 1304
//     month: today.month.number,
//     day: today.day,
//   });

//   const {
//     control,
//     handleSubmit,
//     getValues,
//     formState: { errors, isSubmitted },
//     setValue,
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

//   const onSubmit = (data: FormData) => {
//     onNext();
//   };

//   // تابع محاسبه سن با تقویم شمسی
//   const calculateAge = (birthDateStr: string): number => {
//     if (!birthDateStr || !/^\d{4}\/\d{2}\/\d{2}$/.test(birthDateStr)) return 0;
//     const [year, month, day] = birthDateStr.split("/").map(Number);
//     const birthDate = new DateObject({ calendar: persian, year, month, day });
//     const today = new DateObject({ calendar: persian });
//     let age = today.year - birthDate.year;
//     const m = today.month.number - birthDate.month.number;
//     if (m < 0 || (m === 0 && today.day < birthDate.day)) {
//       age--;
//     }
//     return age;
//   };

//   return (
//     <div className="w-full">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-16"
//       >
//         <StepperComponent currentStep={2} />
//         <div className="space-y-7 lg:space-y-8 my-14">
//           <div className="flex space-x-4">
//             {formInput.slice(0, 2).map((field) => (
//               <Controller
//                 key={field.name}
//                 name={field.name}
//                 control={control}
//                 rules={{ required: `${field.label} الزامی است` }}
//                 render={({ field: controllerField, fieldState }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     error={fieldState.error?.message}
//                     {...controllerField}
//                     className={
//                       isSubmitted && !controllerField.value ? "border-red1" : ""
//                     }
//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             ))}
//           </div>

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
//                       const age = calculateAge(value);
//                       return age >= 18 || "سن باید حداقل ۱۸ سال باشد";
//                     },
//                   }}
//                   render={({ field: controllerField, fieldState }) => (
//                     <div className="relative">
//                       <TextField
//                         label={field.label}
//                         type="text"
//                         value={controllerField.value || ""}
//                         onChange={(e) => {
//                           const inputValue = e.target.value;
//                           // فقط اگر فرمت درست باشه (YYYY/MM/DD) پردازش کن
//                           if (/^\d{0,4}\/\d{0,2}\/\d{0,2}$/.test(inputValue)) {
//                             const [year, month, day] = inputValue
//                               .split("/")
//                               .map(Number);
//                             if (
//                               year &&
//                               month &&
//                               day &&
//                               calculateAge(inputValue) < 18
//                             ) {
//                               return; // بلاک کردن ورودی کمتر از 18 سال
//                             }
//                             setValue("birthDate", inputValue);
//                           }
//                         }}
//                         onBlur={controllerField.onBlur}
//                         labelBgClass="bg-gray9"
//                         error={fieldState.error?.message}
//                         icon={
//                           <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
//                             <IconCalender />
//                           </span>
//                         }
//                         onIconClick={() => datePickerRef.current?.openCalendar()}
//                         className={
//                           isSubmitted && !controllerField.value
//                             ? "border-red1"
//                             : ""
//                         }
//                       />

//                       <DatePicker
//                         ref={datePickerRef}
//                         value={controllerField.value}
//                         onChange={(date) =>
//                           controllerField.onChange(
//                             date?.format("YYYY/MM/DD") || ""
//                           )
//                         }
//                         editable={false}
//                         calendar={persian}
//                         locale={persian_fa}
//                         minDate={minDate} // 100 سال قبل
//                         maxDate={today} // امروز
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
//                 rules={{ required: `${field.label} الزامی است` }}
//                 render={({ field: controllerField, fieldState }) => (
//                   <TextField
//                     label={field.label}
//                     type="text"
//                     {...controllerField}
//                     error={fieldState.error?.message}
//                     className={
//                       isSubmitted && !controllerField.value ? "border-red1" : ""
//                     }
//                     labelBgClass="bg-gray9"
//                   />
//                 )}
//               />
//             );
//           })}
//         </div>

//         <button
//           type="submit"
//           className="mt-28 text-lg font-bold mb-8 bg-blue1 w-full h-[56px] rounded-lg text-white2"
//         >
//           تأیید
//         </button>
//       </form>
//     </div>
//   );
// }