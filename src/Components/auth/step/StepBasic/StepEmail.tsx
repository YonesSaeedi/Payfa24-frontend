// import { useForm, Controller, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { sendContact, verifyOtp } from "../../../../utils/api/authBasic";
// import { useContext, useEffect, useState } from "react";
// import { ThemeContext } from "../../../../Context/ThemeContext";
// import OTPModal from "../../../OTPModal";
// import IconClose from "../../../../assets/Icons/Login/IconClose";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { apiRequest } from "../../../../utils/apiClient";

// type Props = {
//   onNext: () => void;
// };

// type FormValues = {
//   contactType: "email" | "mobile";
//   contactValue: string;
// };

// type UserInfo = {
//   level_kyc: string; // "basic" | "advanced" | null
//   kyc: {
//     basic?: {
//       name?: string;
//       family?: string;
//       mobile?: string; // اگه وجود داره، موبایل ثبت شده
//       email?: string; // اگه وجود داره، ایمیل ثبت شده
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

// const schema = yup.object().shape({
//   contactType: yup.string().required("نوع تماس الزامی است."),
//   contactValue: yup
//     .string()
//     .required("مقدار تماس الزامی است.")
//     .when("contactType", {
//       is: "email",
//       then: (schema) => schema.email("ایمیل معتبر نیست."),
//       otherwise: (schema) =>
//         schema.matches(/^09\d{9}$/, "شماره موبایل معتبر نیست."),
//     }),
// });

// export default function StepEmail({ onNext }: Props) {
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");
//   const { theme } = context;

//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     setValue,
//   } = useForm<FormValues>({
//     defaultValues: { contactType: "email", contactValue: "" },
//     resolver: yupResolver(schema),
//   });

//   const contactType = useWatch({ control, name: "contactType" });
//   const contactValue = useWatch({ control, name: "contactValue" });

//   // Mutation برای ارسال تماس (ایمیل/موبایل)
//   const sendContactMutation = useMutation({
//     mutationFn: sendContact,
//     onSuccess: (data) => {
//       console.log('SendContact response:', data);
//       if (data.status) {
//         setIsCodeSent(true);
//         setIsModalOpen(true);
//         toast.success("کد تأیید ارسال شد.");
//       } else {
//         setErrorMessage(data.msg || "خطا در ارسال کد.");
//         toast.error(data.msg || "خطا در ارسال کد.");
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//       console.error("Send contact error:", error);
//     },
//   });

//   // Mutation برای تأیید OTP
//   const verifyOtpMutation = useMutation({
//     mutationFn: verifyOtp,
//     onSuccess: (data) => {
//       console.log('VerifyOtp response:', data);
//       if (data.status) {
//         toast.success("تأیید شد! به مرحله بعدی برو.");
//         setIsModalOpen(false);
//         onNext();
//       } else {
//         setErrorMessage(data.msg || "کد نامعتبر است.");
//         toast.error(data.msg || "خطا در تأیید کد.");
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || "خطا در تأیید کد.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//       console.error("Verify OTP error:", error);
//     },
//   });

//   // Fetch user info on mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await apiRequest<UserInfo>({ url: "/api/kyc/get-info" });
//         console.log("User info response:", response);
//         setUserInfo(response);

//         // Set contact type based on registration status
//         const emailRegistered = !!response.kyc?.basic?.email; // اگه email وجود داره، ثبت شده
//         const mobileRegistered = !!response.kyc?.basic?.mobile; // اگه mobile وجود داره، ثبت شده

//         console.log('Email registered:', emailRegistered, 'Mobile registered:', mobileRegistered); // لاگ برای چک

//         if (emailRegistered && !mobileRegistered) {
//           setValue("contactType", "mobile"); // اگه فقط ایمیل ثبت شده، موبایل بگیر
//         } else if (mobileRegistered && !emailRegistered) {
//           setValue("contactType", "email"); // اگه فقط موبایل ثبت شده، ایمیل بگیر
//         } else if (emailRegistered && mobileRegistered) {
//           setErrorMessage("هر دو ایمیل و موبایل ثبت شده‌اند. با پشتیبانی تماس بگیرید.");
//           toast.error("هر دو ایمیل و موبایل ثبت شده‌اند. با پشتیبانی تماس بگیرید.");
//         } else {
//           setValue("contactType", "email"); // پیش‌فرض (اگه هیچ‌کدوم ثبت نشده)
//         }
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//         setErrorMessage("خطا در دریافت اطلاعات کاربر.");
//         toast.error("خطا در دریافت اطلاعات کاربر.");
//       }
//     };
//     fetchUserData();
//   }, [setValue]);

//   const onSubmitContact = (data: FormValues) => {
//     const payload = {
//       [data.contactType]: data.contactValue,
//     };
//     console.log('Sending payload:', payload);
//     sendContactMutation.mutate(payload);
//   };

//   const handleVerifyCode = (code: string) => {
//     const payload = {
//       [contactType]: contactValue,
//       code,
//     };
//     console.log('Verifying code with payload:', payload);
//     verifyOtpMutation.mutate(payload);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     if (verifyOtpMutation.isSuccess) onNext();
//   };

//   if (sendContactMutation.isLoading || verifyOtpMutation.isLoading) {
//     return <p className="text-center">در حال پردازش...</p>;
//   }

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmitContact)}
//         className="w-full lg:bg-gray9 lg:mt-0 mt-6 pb-36 lg:rounded-2xl lg:px-5 lg:border border-gray26"
//       >
//         <div className="w-full flex justify-center items-center flex-col">
//           <StepperComponent currentStep={0} />
//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
//             {contactType === "email" ? "ایمیل جدید خود را وارد کنید" : "شماره موبایل جدید خود را وارد کنید"}
//           </p>
//           <input type="hidden" {...control.register("contactType")} value={contactType} />
//           <Controller
//             name="contactValue"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 label={contactType === "email" ? "ایمیل" : "موبایل"}
//                 type={contactType === "email" ? "email" : "tel"}
//                 error={errors.contactValue?.message || errorMessage}
//                 {...field}
//                 labelBgClass="lg:bg-gray9 bg-white1"
//               />
//             )}
//           />
//           <button
//             type="submit"
//             disabled={sendContactMutation.isLoading}
//             className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             {sendContactMutation.isLoading ? "در حال ارسال..." : "ارسال کد تأیید"}
//           </button>
//         </div>
//       </form>
//       {isCodeSent && isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
//           onClick={handleCloseModal}
//         >
//           <div
//             className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center flex-row-reverse justify-between">
//               <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
//                 تأیید {contactType === "email" ? "ایمیل" : "موبایل"}
//               </h2>
//               <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={handleCloseModal}>
//                 <IconClose />
//               </span>
//             </div>
//             <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24">
//               کد به {contactValue} ارسال شد.
//             </p>
//             <div className="mt-[32px] mb-[48px]">
//               <OTPModal length={4} onChange={handleVerifyCode} isLoading={verifyOtpMutation.isLoading} />
//             </div>
//             <button
//               onClick={handleCloseModal}
//               className="mt-4 w-full h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
//               disabled={verifyOtpMutation.isLoading}
//             >
//               {verifyOtpMutation.isLoading ? "در حال تأیید..." : "تأیید"}
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import { useForm, Controller, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { sendContact, verifyOtp } from "../../../../utils/api/authBasic";
// import { useContext, useEffect, useState } from "react";
// import { ThemeContext } from "../../../../Context/ThemeContext";
// import OTPModal from "../../../OTPModal";
// import IconClose from "../../../../assets/Icons/Login/IconClose";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { apiRequest } from "../../../../utils/apiClient";
// import { getContactSchema } from "../../../../utils/validationSchemas";

// type Props = {
//   onNext: () => void;
// };

// type FormValues = {
//   contactType: "email" | "mobile";
//   contactValue: string;
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

// const getSchema = getContactSchema()

// export default function StepEmail({ onNext }: Props) {
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");
//   const { theme } = context;

//   const {
//     control,
//     handleSubmit,
//     watch,
//     formState: { errors },
//     setValue,
//   } = useForm<FormValues>({
//     defaultValues: { contactType: "email", contactValue: "" },
//     resolver: yupResolver(getSchema),
//   });

//   const contactType = useWatch({ control, name: "contactType" });
//   const contactValue = useWatch({ control, name: "contactValue" });

//   // Mutation برای ارسال تماس (ایمیل/موبایل)
//   const sendContactMutation = useMutation({
//     mutationFn: sendContact,
//     onSuccess: (data) => {
//       console.log('SendContact response:', data);
//       if (data.status) {
//         setIsCodeSent(true);
//         setIsModalOpen(true);
//         toast.success("کد تأیید ارسال شد.");
//       } else {
//         setErrorMessage(data.msg || "خطا در ارسال کد.");
//         toast.error(data.msg || "خطا در ارسال کد.");
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || "خطا در ارتباط با سرور.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//       console.error("Send contact error:", error);
//     },
//   });

//   // Mutation برای تأیید OTP
//   const verifyOtpMutation = useMutation({
//     mutationFn: verifyOtp,
//     onSuccess: (data) => {
//       console.log('VerifyOtp response:', data);
//       if (data.status) {
//         toast.success("تأیید شد! به مرحله بعدی برو.");
//         setIsModalOpen(false);
//         onNext();
//       } else {
//         setErrorMessage(data.msg || "کد نامعتبر است.");
//         toast.error(data.msg || "خطا در تأیید کد.");
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || "خطا در تأیید کد.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//       console.error("Verify OTP error:", error);
//     },
//   });

//   // Fetch user info on mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await apiRequest<UserInfo>({ url: "/api/kyc/get-info" });
//         console.log("User info response:", response);
//         setUserInfo(response);

//         // Set contact type based on registration status
//         const emailRegistered = !!response.kyc?.basic?.email && response.kyc.basic.email !== null; // اگه email غیر null باشه
//         const mobileRegistered = !!response.kyc?.basic?.mobile && response.kyc.basic.mobile !== null; // اگه mobile غیر null باشه

//         console.log('Email registered:', emailRegistered, 'Mobile registered:', mobileRegistered);

//         if (emailRegistered && !mobileRegistered) {
//           setValue("contactType", "mobile"); // اگه فقط ایمیل ثبت شده، موبایل بگیر
//         } else if (mobileRegistered && !emailRegistered) {
//           setValue("contactType", "email"); // اگه فقط موبایل ثبت شده، ایمیل بگیر
//         } else if (emailRegistered && mobileRegistered) {
//           setErrorMessage("هر دو ایمیل و موبایل ثبت شده‌اند. با پشتیبانی تماس بگیرید.");
//           toast.error("هر دو ایمیل و موبایل ثبت شده‌اند. با پشتیبانی تماس بگیرید.");
//         } else {
//           setValue("contactType", "email"); // پیش‌فرض (اگه هیچ‌کدوم ثبت نشده)
//         }
//       } catch (error) {
//         console.error("Error fetching user info:", error);
//         setErrorMessage("خطا در دریافت اطلاعات کاربر.");
//         toast.error("خطا در دریافت اطلاعات کاربر.");
//       }
//     };
//     fetchUserData();
//   }, [setValue]);

//   const onSubmitContact = (data: FormValues) => {
//     const payload = {
//       [data.contactType]: data.contactValue,
//     };
//     console.log('Sending payload:', payload);
//     sendContactMutation.mutate(payload);
//   };

//   const handleVerifyCode = (code: string) => {
//     const payload = {
//       [contactType]: contactValue,
//       code,
//     };
//     console.log('Verifying code with payload:', payload);
//     verifyOtpMutation.mutate(payload);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     if (verifyOtpMutation.isSuccess) onNext();
//   };

//   if (sendContactMutation.isLoading || verifyOtpMutation.isLoading) {
//     return <p className="text-center">در حال پردازش...</p>;
//   }

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmitContact)}
//         className="w-full lg:bg-gray9 lg:mt-0 mt-6 pb-36 lg:rounded-2xl lg:px-5 lg:border border-gray26"
//       >
//         <div className="w-full flex justify-center items-center flex-col">
//           <StepperComponent currentStep={0} />
//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
//             {contactType === "email" ? "ایمیل جدید خود را وارد کنید" : "شماره موبایل جدید خود را وارد کنید"}
//           </p>
//           <input type="hidden" {...control.register("contactType")} value={contactType} />
//           <Controller
//             name="contactValue"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 label={contactType === "email" ? "ایمیل" : "موبایل"}
//                 type={contactType === "email" ? "email" : "tel"}
//                 error={errors.contactValue?.message || errorMessage}
//                 {...field}
//                 labelBgClass="lg:bg-gray9 bg-white1"
//               />
//             )}
//           />
//           <button
//             type="submit"
//             disabled={sendContactMutation.isLoading}
//             className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             {sendContactMutation.isLoading ? "در حال ارسال..." : "ارسال کد تأیید"}
//           </button>
//         </div>
//       </form>
//       {isCodeSent && isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
//           onClick={handleCloseModal}
//         >
//           <div
//             className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center flex-row-reverse justify-between">
//               <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
//                 تأیید {contactType === "email" ? "ایمیل" : "موبایل"}
//               </h2>
//               <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={handleCloseModal}>
//                 <IconClose />
//               </span>
//             </div>
//             <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24">
//               کد به {contactValue} ارسال شد.
//             </p>
//             <div className="mt-[32px] mb-[48px]">
//               <OTPModal length={4} onChange={handleVerifyCode} isLoading={verifyOtpMutation.isLoading} />
//             </div>
//             <button
//               onClick={handleCloseModal}
//               className="mt-4 w-full h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
//               disabled={verifyOtpMutation.isLoading}
//             >
//               {verifyOtpMutation.isLoading ? "در حال تأیید..." : "تأیید"}
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { sendContact, verifyOtp } from "../../../../utils/api/authBasic";
import { useContext, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import OTPModal from "../../../OTPModal";
import IconClose from "../../../../assets/Icons/Login/IconClose";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { getContactSchema } from "../../../../utils/validationSchemas";

type Props = {
  onNext: () => void;
};

type FormValues = {
  contactType: "email" | "mobile";
  contactValue: string;
};

const getSchema = getContactSchema();

export default function StepEmail({ onNext }: Props) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: { contactType: "email", contactValue: "" },
    resolver: yupResolver(getSchema),
  });

  const contactType = useWatch({ control, name: "contactType" });
  const contactValue = useWatch({ control, name: "contactValue" });

  const sendContactMutation = useMutation({
    mutationFn: sendContact,
    onSuccess: (data) => {
      console.log("SendContact response:", data);

      if (data.status) {
        setIsCodeSent(true);
        setIsModalOpen(true);
        toast.success(`کد تأیید به ${contactValue} ارسال شد.`);
      } else {
        const errorMsg = data.msg || `خطا در ارسال کد به ${contactType === "email" ? "ایمیل" : "شماره موبایل"}.`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.msg || `خطا در ارتباط با سرور. لطفا مجددا تلاش کنید.`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("VerifyOtp response:", data);
      if (data.status) {
        toast.success("تأیید با موفقیت انجام شد! به مرحله بعدی می‌روید.");
        setIsModalOpen(false);
        localStorage.setItem("kycStepCompleted", "level1");
        onNext(); // This is the correct place to call onNext
      } else {
        const errorMsg = data.msg || `کد تأیید نامعتبر است.`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.msg || `خطا در تأیید کد.`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    },
  });

  const onSubmitContact = (data: FormValues) => {
    const payload = {
      [data.contactType]: data.contactValue,
    };
    sendContactMutation.mutate(payload);
  };

  const handleVerifyCode = (code: string) => {
    const payload = {
      [contactType]: contactValue,
      code,
    };
    verifyOtpMutation.mutate(payload);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (sendContactMutation.isLoading || verifyOtpMutation.isLoading) {
    return <p className="text-center">در حال پردازش...</p>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitContact)}
        className="w-full lg:bg-gray9 lg:mt-0 mt-6 pb-36 lg:rounded-2xl lg:px-5 lg:border border-gray26"
      >
        <div className="w-full flex justify-center items-center flex-col">
          <StepperComponent currentStep={0} />
          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
            {contactType === "email" ? "ایمیل خود را وارد کنید" : "شماره موبایل خود را وارد کنید"}
          </p>
          <input type="hidden" {...control.register("contactType")} value={contactType} />
          <Controller
            name="contactValue"
            control={control}
            render={({ field }) => (
              <TextField
                label={contactType === "email" ? "ایمیل" : "موبایل"}
                type={contactType === "email" ? "email" : "tel"}
                error={errors.contactValue?.message || errorMessage}
                {...field}
                labelBgClass="lg:bg-gray9 bg-white1"
              />
            )}
          />
          <button
            type="submit"
            disabled={sendContactMutation.isLoading}
            className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            {sendContactMutation.isLoading ? "در حال ارسال..." : "ارسال کد تأیید"}
          </button>
        </div>
      </form>
      {isCodeSent && isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="lg:w-[448px] w-[328px] rounded-lg lg:p-8 p-4 relative bg-white8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center flex-row-reverse justify-between">
              <h2 className="lg:text-lg text-sm lg:font-bold font-normal text-black0">
                تأیید {contactType === "email" ? "ایمیل" : "موبایل"}
              </h2>
              <span className="icon-wrapper h-6 w-6 cursor-pointer" onClick={handleCloseModal}>
                <IconClose />
              </span>
            </div>
            <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24">
              کد تأیید به {contactValue} ارسال شد.
            </p>
            <div className="mt-[32px] mb-[48px]">
              <OTPModal length={4} onChange={handleVerifyCode} isLoading={verifyOtpMutation.isLoading} />
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
              disabled={verifyOtpMutation.isLoading}
            >
              {verifyOtpMutation.isLoading ? "در حال تأیید..." : "تأیید"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}