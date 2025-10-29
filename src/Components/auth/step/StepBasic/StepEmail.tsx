// import { useForm, Controller, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { sendContact, verifyOtp } from "../../../../utils/api/authBasic";
// import { useContext, useState } from "react";
// import { ThemeContext } from "../../../../context/ThemeContext";
// import OTPModal from "../../../OTPModal";
// import IconClose from "../../../../assets/icons/Login/IconClose";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { getContactSchema } from "../../../../utils/validationSchemas";
// import { type ObjectSchema } from "yup";

// type Props = {
//   onNext: () => void;
// };

// type FormValues = {
//   contactType: "email" | "mobile";
//   contactValue: string;
// };

// const getSchema: ObjectSchema<FormValues> = getContactSchema();

// export default function StepEmail({ onNext }: Props) {
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: { contactType: "email", contactValue: "" },
//     resolver: yupResolver(getSchema),
//   });

//   const contactType = useWatch({ control, name: "contactType" });
//   const contactValue = useWatch({ control, name: "contactValue" });

//   const sendContactMutation = useMutation({
//     mutationFn: sendContact,
//     onSuccess: (data) => {
//       console.log("SendContact response:", data);

//       if (data.status) {
//         setIsCodeSent(true);
//         setIsModalOpen(true);
//         toast.success(`کد تأیید به ${contactValue} ارسال شد.`);
//       } else {
//         const errorMsg =
//           data.msg ||
//           `خطا در ارسال کد به ${
//             contactType === "email" ? "ایمیل" : "شماره موبایل"
//           }.`;
//         setErrorMessage(errorMsg);
//         toast.error(errorMsg);
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg =
//         error.response?.data?.msg ||
//         `خطا در ارتباط با سرور. لطفا مجددا تلاش کنید.`;
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     },
//   });

//   const verifyOtpMutation = useMutation({
//     mutationFn: verifyOtp,
//     onSuccess: (data) => {
//       console.log("VerifyOtp response:", data);
//       if (data.status) {
//         toast.success("تأیید با موفقیت انجام شد! به مرحله بعدی می‌روید.");
//         setIsModalOpen(false);

//         onNext(); // This is the correct place to call onNext
//       } else {
//         const errorMsg = data.msg || `کد تأیید نامعتبر است.`;
//         setErrorMessage(errorMsg);
//         toast.error(errorMsg);
//       }
//     },
//     onError: (error: any) => {
//       const errorMsg = error.response?.data?.msg || `خطا در تأیید کد.`;
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     },
//   });

//   const onSubmitContact = (data: FormValues) => {
//     const payload = {
//       [data.contactType]: data.contactValue,
//     };
//     sendContactMutation.mutate(payload);
//   };

//   const handleVerifyCode = (code: string) => {
//     const payload = {
//       [contactType]: contactValue,
//       code,
//     };
//     verifyOtpMutation.mutate(payload);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   if (sendContactMutation.isPending || verifyOtpMutation.isPending) {
//     return <p className="text-center">در حال پردازش...</p>;
//   }

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmitContact)}
//         className="w-full lg:bg-gray37 lg:mt-0 mt-6 pb-36 lg:rounded-2xl lg:px-5 lg:border border-gray26"
//       >
//         <div className="w-full flex justify-center items-center flex-col ">
//           <StepperComponent currentStep={0} />
//           <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
//             {contactType === "email"
//               ? "ایمیل خود را وارد کنید"
//               : "شماره موبایل خود را وارد کنید"}
//           </p>
//           <input
//             type="hidden"
//             {...control.register("contactType")}
//             value={contactType}
//           />
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
//             disabled={sendContactMutation.isPending}
//             className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
//           >
//             {sendContactMutation.isPending
//               ? "در حال ارسال..."
//               : "ارسال کد تأیید"}
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
//               <span
//                 className="icon-wrapper h-6 w-6 cursor-pointer"
//                 onClick={handleCloseModal}
//               >
//                 <IconClose />
//               </span>
//             </div>
//             <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24">
//               کد تأیید به {contactValue} ارسال شد.
//             </p>
//             <div className="mt-[32px] mb-[48px]">
//               <OTPModal
//                 length={5}
//                 onChange={handleVerifyCode}
//               />
//             </div>
//             <button
//               onClick={handleCloseModal}
//               className="mt-4 w-full h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
//               disabled={verifyOtpMutation.isPending}
//             >
//               {verifyOtpMutation.isPending ? "در حال تأیید..." : "تأیید"}
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }




import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import OTPModal from "../../../OTPModal";
import IconClose from "../../../../assets/icons/Login/IconClose";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { getContactSchema } from "../../../../utils/validationSchemas";
import { type ObjectSchema } from "yup";
import { apiRequest } from "../../../../utils/apiClient";

type Props = {
  onNext: () => void;
};

type FormValues = {
  contactType: "email" | "mobile";
  contactValue: string;
};

const getSchema: ObjectSchema<FormValues> = getContactSchema();

export default function StepEmail({ onNext }: Props) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { contactType: "email", contactValue: "" },
    resolver: yupResolver(getSchema),
  });

  const contactType = useWatch({ control, name: "contactType" });
  const contactValue = useWatch({ control, name: "contactValue" });

  // 🔹 دریافت اطلاعات کاربر
  const { data: userInfo, isLoading: isLoadingInfo } = useQuery({
    queryKey: ["kyc-info"],
    queryFn: async () => {
      const res = await apiRequest<{ kyc?: { basic?: { email?: string; mobile?: string } } }>({
        url: "/api/kyc/get-info",
        method: "GET",
      });
      return res;
    },
  });

  // 🔹 وقتی اطلاعات لود شد، تصمیم بگیر ایمیل یا موبایل گرفته شود
  useEffect(() => {
    if (!userInfo?.kyc?.basic) return;

    const { email, mobile } = userInfo.kyc.basic;
    if (email && !mobile) {
      setValue("contactType", "mobile");
    } else if (mobile && !email) {
      setValue("contactType", "email");
    } else if (email && mobile) {
      onNext();
    }
  }, [userInfo, setValue, onNext]);

  // 🔹 ارسال درخواست برای ارسال کد تأیید
  const sendContactMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiRequest<{ status: boolean; msg?: string }>({
        url: "/api/kyc/basic/level1",
        method: "POST",
        data: payload,
      });
    },
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`کد تأیید به ${contactValue} ارسال شد.`);
        setIsCodeSent(true);
        setIsModalOpen(true);
      } else {
        toast.error(res.msg || "خطا در ارسال کد تأیید");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "خطا در ارسال درخواست.");
    },
  });

  // 🔹 تأیید کد ارسال‌شده
  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiRequest<{ status: boolean; msg?: string }>({
        url: "/api/kyc/basic/level1",
        method: "POST",
        data: payload,
      });
    },
    onSuccess: (res) => {
      if (res.status) {
        toast.success("تأیید با موفقیت انجام شد!");
        setIsModalOpen(false);
        onNext();
      } else {
        toast.error(res.msg || "کد تأیید اشتباه است.");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "خطا در تأیید کد.");
    },
  });

  const onSubmitContact = (data: FormValues) => {
    const payload = { [data.contactType]: data.contactValue };
    sendContactMutation.mutate(payload);
  };

 const handleVerifyCode = (code: string) => {
  // فقط وقتی کد کامل شد (۴ رقم)، درخواست بفرست
  if (code.length === 4) {
    const payload = {
      [contactType]: contactValue,
      code,
    };
    verifyOtpMutation.mutate(payload);
  }
};


  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoadingInfo) return <p className="text-center">در حال بارگذاری...</p>;
  if (sendContactMutation.isPending || verifyOtpMutation.isPending)
    return <p className="text-center">در حال پردازش...</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitContact)}
        className="w-full lg:bg-gray37 lg:mt-0 mt-6 pb-36 lg:rounded-2xl lg:px-5 lg:border border-gray26"
      >
        <div className="w-full flex justify-center items-center flex-col">
          <StepperComponent currentStep={0} />
          <p className="lg:text-lg text-xs lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
            {contactType === "email"
              ? "ایمیل خود را وارد کنید"
              : "شماره موبایل خود را وارد کنید"}
          </p>

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
            disabled={sendContactMutation.isPending}
            className="lg:mt-22 mt-12 w-full h-[40px] lg:h-[56px] bg-blue1 font-bold text-white2 rounded-lg"
          >
            {sendContactMutation.isPending ? "در حال ارسال..." : "ارسال کد تأیید"}
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
              <span
                className="icon-wrapper h-6 w-6 cursor-pointer"
                onClick={handleCloseModal}
              >
                <IconClose />
              </span>
            </div>
            <p className="lg:mt-12 mt-8 mb-6 lg:text-lg text-sm text-center text-gray24">
              کد تأیید به {contactValue} ارسال شد.
            </p>
            <div className="mt-[32px] mb-[48px]">
              <OTPModal length={4} onChange={handleVerifyCode} />
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full h-[48px] font-bold bg-blue2 text-white1 rounded-lg"
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? "در حال تأیید..." : "تأیید"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
