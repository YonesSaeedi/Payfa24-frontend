// import { useForm, Controller, useWatch } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useContext, useEffect, useState } from "react";
// import { ThemeContext } from "../../../../context/ThemeContext";
// import StepperComponent from "../Stepper";
// import TextField from "../../../InputField/TextField";
// import { getContactSchema } from "../../../../utils/validationSchemas";
// import { type ObjectSchema } from "yup";
// import { apiRequest } from "../../../../utils/apiClient";
// import OTPInputModal from "../../../trade/OTPInputModal";

// type Props = {
//   onNext: () => void;
//   userInfo: any;
// };

// type FormValues = {
//   contactType: "email" | "mobile";
//   contactValue: string;
// };

// const getSchema: ObjectSchema<FormValues> = getContactSchema();

// export default function StepEmail({ onNext, userInfo }: Props) {
//   const [isCodeSent, setIsCodeSent] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [otpValue, setOtpValue] = useState("");
//   const [resendTimeLeft, setResendTimeLeft] = useState<number>(0);

//   const context = useContext(ThemeContext);
//   if (!context) throw new Error("ThemeContext is undefined");

//   const {
//     control,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       contactType: "email",
//       contactValue: "", // مقدار اولیه بعداً در useEffect تنظیم می‌شود
//     },
//     resolver: yupResolver(getSchema),
//   });

//   const contactType = useWatch({ control, name: "contactType" });
//   const contactValue = useWatch({ control, name: "contactValue" });

//   // 🔹 تعیین نوع contact و مقدار اولیه هوشمند
//   useEffect(() => {
//     if (!userInfo?.kyc?.basic) return;

//     const { email, mobile } = userInfo.kyc.basic;

//     if (email && !mobile) {
//       setValue("contactType", "mobile");
//       setValue("contactValue", "");
//     } else if (mobile && !email) {
//       setValue("contactType", "email");
//       setValue("contactValue", "");
//     } else if (email && mobile) {
//       onNext(); // هر دو موجود است → مرحله رد شود
//     } else {
//       setValue("contactType", "email");
//       setValue("contactValue", "");
//     }
//   }, [userInfo, setValue, onNext]);

//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (resendTimeLeft > 0) {
//       timer = setTimeout(() => setResendTimeLeft(resendTimeLeft - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendTimeLeft]);

//   const sendContactMutation = useMutation({
//     mutationFn: async (payload: any) =>
//       apiRequest<{ status: boolean; msg?: string }>({
//         url: "/kyc/basic/level1",
//         method: "POST",
//         data: payload,
//       }),
//     onSuccess: (res) => {
//       if (res.status) {
//         toast.success(`کد تأیید به ${contactValue} ارسال شد.`);
//         setIsCodeSent(true);
//         setIsModalOpen(true);
//         setResendTimeLeft(120);
//       } else {
//         toast.error(res.msg || "خطا در ارسال کد تأیید");
//       }
//     },
//     onError: (err: any) => {
//       toast.error(err?.response?.data?.msg || "خطا در ارسال درخواست.");
//     },
//   });

//   const verifyOtpMutation = useMutation({
//     mutationFn: async (payload: any) =>
//       apiRequest<{ status: boolean; msg?: string }>({
//         url: "/kyc/basic/level1",
//         method: "POST",
//         data: payload,
//       }),
//     onSuccess: (res) => {
//       if (res.status) {
//         toast.success("تأیید با موفقیت انجام شد!");
//         setIsModalOpen(false);
//         onNext();
//       } else {
//         toast.error(res.msg || "کد تأیید اشتباه است.");
//       }
//     },
//     onError: (err: any) => {
//       toast.error(err?.response?.data?.msg || "خطا در تأیید کد.");
//     },
//   });

//   const onSubmitContact = (data: FormValues) => {
//     const payload = { [data.contactType]: data.contactValue };
//     sendContactMutation.mutate(payload);
//   };

//   const handleVerifyCode = () => {
//     if (otpValue.length === 4) {
//       const payload = { [contactType]: contactValue, code: otpValue };
//       verifyOtpMutation.mutate(payload);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setIsCodeSent(false);
//   };

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(onSubmitContact)}
//         className="w-full lg:bg-gray9 lg:mt-0 mt-6 pb-32 lg:rounded-2xl lg:border border-gray26"
//       >
//         <div className="w-full flex justify-center items-center flex-col lg:px-8">
//           <StepperComponent currentStep={0} />

//           <p className="lg:text-xl font-medium text-sm lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
//             {contactType === "email"
//               ? ". ایمیل خود را وارد کنید"
//               : ". شماره موبایل خود را وارد کنید"}
//           </p>

//           <Controller
//             name="contactValue"
//             control={control}
//             render={({ field }) => (
//               <TextField
//                 label={contactType === "email" ? "ایمیل" : "موبایل"}
//                 type={contactType === "email" ? "email" : "tel"}
//                 error={errors.contactValue?.message}
//                 placeholder={contactType === "email" ? "example@email.com" : "09123456789"}
//                 {...field}
//                 labelBgClass="lg:bg-gray9 bg-gray38"
//               />
//             )}
//           />

//           <button
//             type="submit"
//             disabled={sendContactMutation.isPending}
//             className={`lg:mt-22 lg:text-xl text-base mt-12 w-full h-[40px] lg:h-[56px] font-bold text-white2 rounded-lg transition-colors
//               ${sendContactMutation.isPending ? "bg-blue2 cursor-not-allowed opacity-60" : "opacity-100 bg-blue2 hover:border-blue1"}`}
//           >
//             {sendContactMutation.isPending ? "در حال ارسال..." : "ارسال کد تأیید"}
//           </button>
//         </div>
//       </form>

//       {isCodeSent && isModalOpen && (
//         <OTPInputModal
//           onSubmit={handleVerifyCode}
//           closeModal={handleCloseModal}
//           onChange={(value) => setOtpValue(value)}
//           submitButtonText="تأیید"
//           titleText={`تأیید ${contactType === "email" ? "ایمیل" : "موبایل"}`}
//           mainText={`کد ارسال‌شده به ${contactType === "email" ? "ایمیل" : "شماره موبایل"} ${contactValue} را وارد کنید.`}
//           OTPLength={4}
//           isSubmitting={verifyOtpMutation.isPending}
//           isSubmittingText="در حال تأیید..."
//           handleResendCode={() => onSubmitContact({ contactType, contactValue })}
//           resendCodeTimeLeft={resendTimeLeft}
//           resendCodeIsSubmitting={sendContactMutation.isPending}
//           handleEdit={() => handleCloseModal()}
//           editButtonText={contactType === "email" ? "ویرایش ایمیل" : "ویرایش موبایل"}
//         />
//       )}
//     </>
//   );
// }



import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";
import OTPInputModal from "../../../trade/OTPInputModal";
import StepperComponent from "../Stepper";
import TextField from "../../../InputField/TextField";
import { getContactSchema } from "../../../../utils/validationSchemas";
import { type ObjectSchema } from "yup";
import { apiRequest } from "../../../../utils/apiClient";

type Props = {
  onNext: () => void;
  userInfo: {
    kyc?: {
      basic?: {
        email?: string;
        mobile?: string;
      };
    };
  };
};

type FormValues = {
  contactType: "email" | "mobile";
  contactValue: string;
};

const getSchema: ObjectSchema<FormValues> = getContactSchema();

export default function StepEmail({ onNext, userInfo }: Props) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState(""); // اضافه شد
  const [resendTimeLeft, setResendTimeLeft] = useState<number>(0); // اضافه شد

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

  // تنظیم هوشمند contactType
  useEffect(() => {
    if (!userInfo?.kyc?.basic) return;

    const { email, mobile } = userInfo.kyc.basic;

    if (email && mobile) {
      onNext();
      return;
    }

    if (email && !mobile) {
      setValue("contactType", "mobile");
      setValue("contactValue", "");
    } else if (mobile && !email) {
      setValue("contactType", "email");
      setValue("contactValue", "");
    } else {
      setValue("contactType", "email");
      setValue("contactValue", "");
    }
  }, [userInfo, setValue, onNext]);

  // تایمر ارسال مجدد
  useEffect(() => {
    if (resendTimeLeft <= 0) return;
    const timer = setTimeout(() => setResendTimeLeft(resendTimeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimeLeft]);

  // ارسال کد
  const sendContactMutation = useMutation({
    mutationFn: async (payload: any) =>
      apiRequest<{ status: boolean; msg?: string }>({
        url: "/kyc/basic/level1",
        method: "POST",
        data: payload,
      }),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(`کد تأیید به ${contactValue} ارسال شد.`);
        setIsCodeSent(true);
        setIsModalOpen(true);
        setResendTimeLeft(120)
      } else {
        toast.error(res.msg || "خطا در ارسال کد تأیید");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.msg || "خطا در ارسال درخواست.");
    },
  });

  // تأیید کد
  const verifyOtpMutation = useMutation({
    mutationFn: async (payload: any) =>
      apiRequest<{ status: boolean; msg?: string }>({
        url: "/kyc/basic/level1",
        method: "POST",
        data: payload,
      }),
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

  // وقتی کد ۴ رقمی شد، خودکار تأیید کن
  const handleVerifyCode = () => {
    if (otpValue.length === 4) {
      const payload = { [contactType]: contactValue, code: otpValue };
      verifyOtpMutation.mutate(payload);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsCodeSent(false);
    setOtpValue("");
  };

  // اگر هر دو وجود داشته باشن، رندر نکن
  if (userInfo?.kyc?.basic?.email && userInfo?.kyc?.basic?.mobile) {
    return null;
  }


  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmitContact)}
        className="w-full lg:bg-gray9 lg:mt-0 mt-6 pb-32 lg:rounded-2xl lg:border border-gray26"
      >
        <div className="w-full flex justify-center items-center flex-col lg:px-8">
          <StepperComponent currentStep={0} />
          <p className="lg:text-xl font-medium text-sm lg:mt-14 mt-10 lg:mb-8 mb-5 self-end text-black0">
            {contactType === "email" ? ". ایمیل خود را وارد کنید" : ". شماره موبایل خود را وارد کنید"}
          </p>

          <Controller
            name="contactValue"
            control={control}
            render={({ field }) => (
              <TextField
                label={contactType === "email" ? "ایمیل" : "موبایل"}
                type={contactType === "email" ? "email" : "tel"}
                error={errors.contactValue?.message}
                // placeholder={contactType === "email" ? "example@email.com" : "09123456789"}
                {...field}
                labelBgClass="lg:bg-gray9 bg-gray38"
              />
            )}
          />

          <button
            type="submit"
            disabled={sendContactMutation.isPending}
            className={`lg:mt-22 lg:text-xl text-base mt-12 w-full h-[40px] lg:h-[56px] font-bold text-white2 rounded-lg transition-colors
              ${sendContactMutation.isPending ? "bg-blue2 cursor-not-allowed opacity-60" : "opacity-100 bg-blue2 hover:border-blue1"}`}
          >
            {sendContactMutation.isPending ? "در حال ارسال..." : "ارسال کد تأیید"}
          </button>
        </div>
      </form>

      {isCodeSent && isModalOpen && (
        <OTPInputModal
          onSubmit={handleVerifyCode}
          closeModal={handleCloseModal}
          onChange={(value) => setOtpValue(value)}
          submitButtonText="تأیید"
          titleText={`تأیید ${contactType === "email" ? "ایمیل" : "موبایل"}`}
          mainText={`کد ارسال‌شده به ${contactType === "email" ? "ایمیل" : "شماره موبایل"} ${contactValue} را وارد کنید.`}
          OTPLength={4}
          isSubmitting={verifyOtpMutation.isPending}
          isSubmittingText="در حال تأیید..."
          handleResendCode={() => onSubmitContact({ contactType, contactValue })}
          resendCodeTimeLeft={resendTimeLeft}
          resendCodeIsSubmitting={sendContactMutation.isPending}
          handleEdit={handleCloseModal}
          editButtonText={contactType === "email" ? "ویرایش ایمیل" : "ویرایش موبایل"}
        />
      )}
    </>
  );
}