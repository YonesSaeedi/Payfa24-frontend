// import React, { useRef } from "react";
// import StepperComponent from "../Stepper";
// import { Controller, useForm } from "react-hook-form";
// import DatePicker from "react-multi-date-picker";
// import persian from "react-date-object/calendars/persian";
// import persian_fa from "react-date-object/locales/persian_fa";
// import IconCalender from "../../../../assets/Icons/authentication/IconCalender";
// import TextField from "../../../InputField/TextField";

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
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-1"
//       >
//         <StepperComponent currentStep={1} />
//         <div className="space-y-7 lg:space-y-8 my-14">
//           {/* دو فیلد اول: نام و نام خانوادگی */}
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
//                           <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
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

//             // اعتبارسنجی کد ملی
//             if (field.name === "nationalId") {
//               return (
//                 <Controller
//                   key={field.name}
//                   name="nationalId"
//                   control={control}
//                   rules={{
//                     required: "کد ملی الزامی است",
//                     pattern: {
//                       value: /^\d{10}$/,
//                       message: "کد ملی باید یک عدد ۱۰ رقمی باشد",
//                     },
//                   }}
//                   render={({ field: controllerField, fieldState }) => (
//                     <TextField
//                       label={field.label}
//                       type="text"
//                       {...controllerField}
//                       error={fieldState.error?.message}
//                       labelBgClass="bg-gray9"
//                     />
//                   )}
//                 />
//               );
//             }

//             return (
//               <Controller
//                 key={field.name}
//                 name={field.name as "fatherName"}
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

// import React, { useContext, useState, useEffect } from "react";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { Controller, useForm } from "react-hook-form";
// import IconCalender from "../../../../assets/Icons/authentication/IconCalender";
// import DatePickerModal from "../../../DatePicker";
// import { ThemeContext } from "../../../../Context/ThemeContext";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "../../../../utils/apiClient";
// import { toast } from "react-toastify";

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

// type UserInfo = {
//   level_kyc: string;
//   kyc: {
//     basic?: {
//       name?: string;
//       family?: string;
//       mobile?: string | null;
//       email?: string | null;
//       father?: string;
//       national_code?: string;
//       date_birth?: string;
//       cardbank?: number;
//     };
//     advanced?: {
//       status: "pending" | "success" | "reject";
//       reason_reject: string | null;
//     };
//   };
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

//   // Fetch user info to prefill form
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await apiRequest<UserInfo>({ url: "/api/kyc/get-info" });
//         console.log("User info response:", response);
//         if (response.kyc?.basic) {
//           setValue("lastName", response.kyc.basic.family || "");
//           setValue("firstName", response.kyc.basic.name || "");
//           setValue("fatherName", response.kyc.basic.father || "");
//           setValue("nationalId", response.kyc.basic.national_code || "");
//           setValue("birthDate", response.kyc.basic.date_birth || "");
//         }
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//         toast.error("خطا در دریافت اطلاعات کاربر.");
//       }
//     };
//     fetchUserData();
//   }, [setValue]);

//   // Mutation for submitting personal info
//   const submitPersonalInfoMutation = useMutation({
//     mutationFn: (data: FormData) =>
//       apiRequest({ url: "/api/kyc/basic/level2", method: "POST", data }),
//     onSuccess: (data) => {
//       console.log("Submit personal info response:", data);
//       if (data.status) {
//         toast.success("اطلاعات با موفقیت ثبت شد.");
//         onNext();
//       } else {
//         toast.error(data.msg || "خطا در ثبت اطلاعات.");
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";
//       toast.error(errorMsg);
//       console.error("Submit personal info error:", error);
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     const payload = {
//       lastName: data.lastName,
//       firstName: data.firstName,
//       fatherName: data.fatherName,
//       nationalId: data.nationalId,
//       birthDate: data.birthDate,
//     };
//     console.log("Sending personal info payload:", payload);
//     submitPersonalInfoMutation.mutate(payload);
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
//         className="lg:bg-gray9 lg:rounded-2xl lg:px-8 px-1"
//       >
//         <StepperComponent currentStep={1} />
//         <div className="space-y-7 lg:space-y-8 my-14">
//           {/* دو فیلد اول: نام و نام خانوادگی */}
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
//                           <span className="icon-wrapper text-gray12 w-5 h-5 flex items-center justify-center cursor-pointer">
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

//             if (field.name === "nationalId") {
//               return (
//                 <Controller
//                   key={field.name}
//                   name="nationalId"
//                   control={control}
//                   rules={{
//                     required: "کد ملی الزامی است",
//                     pattern: {
//                       value: /^\d{10}$/,
//                       message: "کد ملی باید یک عدد ۱۰ رقمی باشد",
//                     },
//                   }}
//                   render={({ field: controllerField, fieldState }) => (
//                     <TextField
//                       label={field.label}
//                       type="text"
//                       {...controllerField}
//                       error={fieldState.error?.message}
//                       labelBgClass="bg-gray9"
//                     />
//                   )}
//                 />
//               );
//             }

//             return (
//               <Controller
//                 key={field.name}
//                 name={field.name as "fatherName"}
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
//           disabled={submitPersonalInfoMutation.isLoading}
//         >
//           {submitPersonalInfoMutation.isLoading ? "در حال ثبت..." : "تأیید"}
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

import React, { useContext, useState, useEffect } from "react";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { Controller, useForm } from "react-hook-form";
import IconCalender from "../../../../assets/icons/authentication/IconCalender";
import DatePickerModal from "../../../DatePicker";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../../utils/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type Props = {
  onNext: () => void;
  onBack?: () => void;
};

type FormData = {
  name: string;
  family: string;
  father: string;
  nationalCode: string;
  dateBirth: string;
};

type UserInfo = {
  level_kyc: number;
  kyc: {
    basic?: {
      name?: string;
      family?: string;
      mobile?: string | null;
      email?: string | null;
      father?: string;
      national_code?: string;
      date_birth?: string;
      cardbank?: number;
    };
    advanced?: {
      status: "pending" | "success" | "reject";
      reason_reject?: string | null;
    };
  };
};

export default function StepPersonal({ onNext }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  const formInput = [
    { name: "family", label: "نام خانوادگی" },
    { name: "name", label: "نام" },
    { name: "father", label: "نام پدر" },
    { name: "nationalCode", label: "کد ملی" },
    { name: "dateBirth", label: "تاریخ تولد" },
  ];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      family: "",
      father: "",
      nationalCode: "",
      dateBirth: "",
    },
  });

  // Fetch user info to prefill form and navigate if already completed
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiRequest<UserInfo>({
          url: "/api/kyc/get-info",
        });
        console.log("User info response stepPersonal:", response);
        if (response.kyc?.basic) {
          // Check if all required fields are filled
          const isCompleted =
            response.kyc.basic.name &&
            response.kyc.basic.family &&
            response.kyc.basic.father &&
            response.kyc.basic.national_code &&
            response.kyc.basic.date_birth;

          if (isCompleted) {
            console.log(
              "Personal info already completed. Navigating to next step."
            );
            onNext();
            return;
          }

          setValue("name", response.kyc.basic.name || "");
          setValue("family", response.kyc.basic.family || "");
          setValue("father", response.kyc.basic.father || "");
          setValue("nationalCode", response.kyc.basic.national_code || "");
          setValue("dateBirth", response.kyc.basic.date_birth || "");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("خطا در دریافت اطلاعات کاربر.");
      }
    };
    fetchUserData();
  }, [setValue, onNext]);

  // Mutation for submitting personal info
  const submitPersonalInfoMutation = useMutation({
    mutationFn: (data: FormData) =>
      apiRequest({ url: "/api/kyc/basic/level2", method: "POST", data }),
    onSuccess: (data) => {
      console.log("Submit personal info response:", data);
      if (data.status) {
        toast.success("اطلاعات با موفقیت ثبت شد.");
        onNext();
      } else {
        const isAlreadyRegistered =
          data.msg && data.msg.includes("قبلا این اطلاعات را ثبت کرده‌اید");
        if (isAlreadyRegistered) {
          toast.info("اطلاعات شما قبلا ثبت شده است. به مرحله بعد می‌روید.");
          onNext();
        } else {
          toast.error(data.msg || "خطا در ثبت اطلاعات.");
        }
      }
    },
    onError: (error: AxiosError<{ msg: string }>) => {
      console.error("Submit personal info error:", error);
      const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";

      const isAlreadyRegisteredError =
        error.response?.status === 400 &&
        errorMsg.includes("قبلا این اطلاعات را ثبت کرده اید");

      if (isAlreadyRegisteredError) {
        // Correctly handle the 400 error by navigating to the next step
        toast.info("اطلاعات شما قبلا ثبت شده است. به مرحله بعد می‌روید.");
        onNext();
      } else {
        toast.error(errorMsg);
      }
    },
  });

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      family: data.family,
      father: data.father,
      nationalCode: data.nationalCode,
      dateBirth: data.dateBirth,
    };
    console.log("Sending personal info payload:", payload);
    submitPersonalInfoMutation.mutate(payload);
  };

  const handleDateChange = (date: string | null) => {
    if (date) {
      setValue("dateBirth", date);
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
          <div className="flex space-x-4">
            {formInput.slice(0, 2).map((field) => (
              <Controller
                key={field.name}
                name={field.name as "name" | "family"}
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
          {formInput.slice(2).map((field) => {
            if (field.name === "dateBirth") {
              return (
                <Controller
                  key={field.name}
                  name="dateBirth"
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

            if (field.name === "nationalCode") {
              return (
                <Controller
                  key={field.name}
                  name="nationalCode"
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
                name={field.name as "father"}
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
          disabled={submitPersonalInfoMutation.isLoading}
        >
          {submitPersonalInfoMutation.isLoading ? "در حال ثبت..." : "تأیید"}
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
