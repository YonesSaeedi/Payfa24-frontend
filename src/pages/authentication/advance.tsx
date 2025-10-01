// import { useState } from "react";
// import HeaderLayout from "../../layouts/HeaderLayout";
// // import StepCard from "../../Components/auth/step/StepBasic/StepCard";
// import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
// import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
// import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";

// export default function advance() {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false); // State برای مدیریت شروع فرآیند

//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const handleFinish = () => {
//     console.log("فرآیند تکمیل شد.");
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return <IdentificationDocument onNext={() => setStep(2)} />;
//       case 2:
//         return <IdentityVerification onNext={() => setStep(3)} />;
//       // case 3:
//         // return <StepCard onNext={handleFinish} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <HeaderLayout>
//       <AuthenticationLayoutAdvance
//         step={step}
//         started={started}
//         onStart={handleStart}
//         text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
//         text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید "
//       >
//         <div className="flex flex-col items-center justify-center gap-6 w-full">
//           {renderStep()}
//         </div>
//       </AuthenticationLayoutAdvance>
//     </HeaderLayout>
//   );
// }

// import { useState, useCallback } from "react";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import StepCard from "../../Components/auth/step/StepBasic/StepCard";
// import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
// import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
// import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";

// export default function Advance() {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);

//   const onFile1Change= (file: File | null) => {
//     setFile1(file);
//   };

//   const onFile2Change = (file: File | null) => {
//     setFile2(file);
//   };
//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   // تابع برای آپلود فایل‌ها به API
//   const uploadMutation = useMutation({
//     mutationFn: ({ file1, file2 }: { file1: File; file2: File }) => {
//       const formData = new FormData();
//       formData.append("file1", file1);
//       formData.append("file2", file2);

//       return apiRequest({
//         url: "api/kyc/advanced/level1", // مسیر API طبق تصویر شما
//         method: "POST",
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//     onSuccess: (data) => {
//       console.log("Upload success:", data);
//       toast.success("مدارک احراز هویت با موفقیت آپلود شد.");
//       setStep(3); // به مرحله نهایی بروید
//     },
//     onError: (err: AxiosError<{ msg: string }>) => {
//       console.error("Upload error:", err);
//       const errorMsg =
//         err.response?.data?.msg || "خطا در آپلود مدارک. لطفا دوباره تلاش کنید.";
//       toast.error(errorMsg);
//     },
//   });

//   const handleNextStep = useCallback(() => {
//     if (step === 1) {
//       // بعد از آپلود فایل اول، به مرحله دوم می‌رویم
//       setStep(2);
//     } else if (step === 2) {
//       // بعد از آپلود فایل دوم، هر دو فایل را به API می‌فرستیم
//       if (file1 && file2) {
//         uploadMutation.mutate({ file1, file2 });
//       } else {
//         toast.error("لطفا هر دو فایل را آپلود کنید.");
//       }
//     } else {
//       setStep((prev) => prev + 1);
//     }
//   }, [step, file1, file2, uploadMutation]);

//   const onFile1Change = useCallback((file: File | null) => {
//     setFile1(file);
//   }, []);

//   const onFile2Change = useCallback((file: File | null) => {
//     setFile2(file);
//   }, []);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <IdentificationDocument
//             onNext={handleNextStep}
//             onFileChange={onFile1Change}
//           />
//         );
//       case 2:
//         return (
//           <IdentityVerification
//             onNext={handleNextStep}
//             onFileChange={onFile2Change}
//           />
//         );
//       // case 3:
//       // return <StepCard onNext={() => console.log("فرآیند نهایی تکمیل شد.")} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <HeaderLayout>
//       <AuthenticationLayoutAdvance
//         step={step}
//         started={started}
//         onStart={handleStart}
//         text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
//         text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید"
//       >
//         <div className="flex flex-col items-center justify-center gap-6 w-full">
//           {renderStep()}
//         </div>
//       </AuthenticationLayoutAdvance>
//     </HeaderLayout>
//   );
// }

// import { useState, useCallback } from "react";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
// import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
// import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";
// import StepperComponent from "../../Components/auth/step/Stepper";
// import { useNavigate } from "react-router-dom";

// export default function Advance() {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const uploadMutation = useMutation({
//     mutationFn: ({ file1, file2 }: { file1: File; file2: File }) => {
//       const formData = new FormData();
//       formData.append("file1", file1);
//       formData.append("file2", file2);

//       return apiRequest({
//         url: "api/kyc/advanced/level1",
//         method: "POST",
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//     onSuccess: (data) => {
//       console.log("Upload success:", data);
//       toast.success("مدارک احراز هویت با موفقیت آپلود شد.");
//       setStep(3);
//     },
//     onError: (err: AxiosError<{ msg: string }>) => {
//       console.error("Upload error:", err);
//       const errorMsg =
//         err.response?.data?.msg || "خطا در آپلود مدارک. لطفا دوباره تلاش کنید.";
//       toast.error(errorMsg);
//     },
//   });

//   const onFile1Change = useCallback((file: File | null) => {
//     setFile1(file);
//   }, []);

//   const onFile2Change = useCallback((file: File | null) => {
//     setFile2(file);
//   }, []);

//   const handleNextStep = useCallback(() => {
//     if (step === 1) {
//       if (!file1) {
//         toast.error("لطفا فایل مدرک شناسایی را انتخاب کنید.");
//         return;
//       }
//       setStep(2);
//     } else if (step === 2) {
//       if (!file2) {
//         toast.error("لطفا فایل تعهدنامه را انتخاب کنید.");
//         return;
//       }
//       if (file1 && file2) {
//         uploadMutation.mutate({ file1, file2 });
//       }
//     } else {
//       setStep((prev) => prev + 1);
//     }
//   }, [step, file1, file2, uploadMutation]);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <IdentificationDocument
//             onNext={handleNextStep}
//             onFileChange={onFile1Change}
//           />
//         );
//       case 2:
//         return (
//           <IdentityVerification
//             onNext={handleNextStep}
//             onFileChange={onFile2Change}
//           />
//         );
//       case 3:
//         return (
//           <div className="flex flex-col items-center justify-center p-8 text-center bg-white8 rounded-2xl shadow-lg">
//             <h2 className="text-2xl font-bold text-black1 mb-4">
//               احراز هویت شما با موفقیت انجام شد!
//             </h2>
//             <p className="text-lg text-black1 mb-8">
//               مدارک شما برای بررسی ارسال شد. پس از تأیید، دسترسی شما به امکانات
//               پیشرفته فعال خواهد شد.
//             </p>
//             <button
//               onClick={() => navigate("/")}
//               className="bg-blue1 w-full h-[56px] rounded-lg text-white2 font-bold text-xl"
//             >
//               بازگشت به صفحه اصلی
//             </button>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <HeaderLayout>
//       <AuthenticationLayoutAdvance
//         step={step}
//         started={started}
//         onStart={handleStart}
//         text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
//         text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید"
//       >
//         <div className="flex flex-col items-center justify-center gap-6 w-full">
//           {step > 0 && <StepperComponent currentStep={step - 1} isAdvance={true} />}
//           {renderStep()}
//         </div>
//       </AuthenticationLayoutAdvance>
//     </HeaderLayout>
//   );
// }

// import { useState, useCallback } from "react";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
// import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
// import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";
// import StepperComponent from "../../Components/auth/step/Stepper";
// import { useNavigate } from "react-router-dom";
// import HomePage from "../Home/HomePage";

// export default function Advance() {
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const uploadMutation = useMutation({
//     mutationFn: ({ file1, file2 }: { file1: File; file2: File }) => {
//       const formData = new FormData();
//       formData.append("file1", file1);
//       formData.append("file2", file2);

//       return apiRequest({
//         url: "/api/kyc/advanced/level1",
//         method: "POST",
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//     onSuccess: (data) => {
//       console.log("Upload success:", data);
//       toast.success("مدارک احراز هویت با موفقیت آپلود شد.");
//       setStep(3);
//     },
//     onError: (err: AxiosError<{ msg: string }>) => {
//       console.error("Upload error:", err);
//       const errorMsg =
//         err.response?.data?.msg || "خطا در آپلود مدارک. لطفا دوباره تلاش کنید.";
//       toast.error(errorMsg);
//     },
//   });

//   const onFile1Change = useCallback((file: File | null) => {
//     setFile1(file);
//   }, []);

//   const onFile2Change = useCallback((file: File | null) => {
//     setFile2(file);
//   }, []);

//   const handleNextStep = useCallback(() => {
//     if (step === 1) {
//       if (!file1) {
//         toast.error("لطفا فایل مدرک شناسایی را انتخاب کنید.");
//         return;
//       }
//       setStep(2);
//     } else if (step === 2) {
//       if (!file2) {
//         toast.error("لطفا فایل تعهدنامه را انتخاب کنید.");

//         return;
//       }
//       if (file1 && file2) {
//         uploadMutation.mutate({ file1, file2 });
//       }
//     } else {
//       setStep((prev) => prev + 1);
//     }
//   }, [step, file1, file2, uploadMutation]);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <IdentificationDocument
//             onNext={handleNextStep}
//             onFileChange={onFile1Change}
//           />
//         );
//       case 2:
//         return (
//           <IdentityVerification
//             onNext={handleNextStep}
//             onFileChange={onFile2Change}
//             />

//         );
//       case 3:
//         return (
//           // <div className="flex flex-col items-center justify-center p-8 text-center bg-white8 rounded-2xl shadow-lg">
//           //   <h2 className="text-2xl font-bold text-black1 mb-4">
//           //     احراز هویت شما با موفقیت انجام شد!
//           //   </h2>
//           //   <p className="text-lg text-black1 mb-8">
//           //     مدارک شما برای بررسی ارسال شد. پس از تأیید، دسترسی شما به امکانات
//           //     پیشرفته فعال خواهد شد.
//           //   </p>
//           //   <button
//           //     onClick={() => navigate("/")}
//           //     className="bg-blue1 w-full h-[56px] rounded-lg text-white2 font-bold text-xl"
//           //   >
//           //     بازگشت به صفحه اصلی
//           //   </button>
//           // </div>
//         <HomePage/>
//         );
//       default:
//        return null
//     }
//   };

//   return (
//     <HeaderLayout>
//       <AuthenticationLayoutAdvance
//         step={step}
//         started={started}
//         onStart={handleStart}
//         text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
//         text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید"
//       >
//         <div className="flex flex-col items-center justify-center gap-6 w-full overflow-x-hidden">
//           {step > 0 && <StepperComponent currentStep={step - 1} isAdvance={true} />}
//           {renderStep()}
//         </div>
//       </AuthenticationLayoutAdvance>
//     </HeaderLayout>
//   );
// }



// import { useState, useCallback } from "react";
// import HeaderLayout from "../../layouts/HeaderLayout";
// import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
// import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
// import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";
// import { useMutation } from "@tanstack/react-query";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";
// import StepperComponent from "../../Components/auth/step/Stepper";
// import { useNavigate } from "react-router-dom";
// import HomePage from "../Home/HomePage";

// const STEP_KEY = "kyc_advanced_step";
// const FILE1_KEY = "kyc_advanced_file1_url";
// const FILE2_KEY = "kyc_advanced_file2_url";
// export default function Advance() {
//    const initialStep = Number(localStorage.getItem(STEP_KEY)) || 0;
//   const [step, setStep] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [file1, setFile1] = useState<File | null>(null);
//   const [file2, setFile2] = useState<File | null>(null);
//     const [file1Url, setFile1Url] = useState(localStorage.getItem(FILE1_KEY));
//   const [file2Url, setFile2Url] = useState(localStorage.getItem(FILE2_KEY));
//   const navigate = useNavigate(); // ⬅️ Hook ناوبری
// useEffect(() => {
//     localStorage.setItem(STEP_KEY, String(step));
//     setStarted(step > 0);
//   }, [step]);
//   const handleStart = () => {
//     setStarted(true);
//     setStep(1);
//   };

//   const uploadMutation = useMutation({
//     mutationFn: ({ file1, file2 }: { file1: File; file2: File }) => {
//       const formData = new FormData();
//       formData.append("file1", file1);
//       formData.append("file2", file2);

//       return apiRequest({
//         url: "/api/kyc/advanced/level1",
//         method: "POST",
//         data: formData,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     },
//     onSuccess: (data) => {
//       console.log("Upload success:", data);
//       toast.success("مدارک احراز هویت با موفقیت آپلود و ارسال شد.");
//       // ⭐️⭐️⭐️ تغییر حیاتی برای رفتن مستقیم به هوم ⭐️⭐️⭐️
//       navigate("/"); // یا navigate('/home')
//     },
//     onError: (err: AxiosError<{ msg: string }>) => {
//       console.error("Upload error:", err);
//       const errorMsg =
//         err.response?.data?.msg || "خطا در آپلود مدارک. لطفا دوباره تلاش کنید.";
//       toast.error(errorMsg);
//       // 💡 در صورت خطا، کاربر را در همین صفحه نگه دارید تا مجدداً تلاش کند
//     },
//   });

//    const onFile1Change = useCallback((file: File | null) => {
//     setFile1(file);
//     if (file) {
//         const url = URL.createObjectURL(file);
//         localStorage.setItem(FILE1_KEY, url);
//         setFile1Url(url);
//     } else {
//         localStorage.removeItem(FILE1_KEY);
//         setFile1Url(null);
//     }
//   }, []);

//   const onFile2Change = useCallback((file: File | null) => {
//     setFile2(file);
//     if (file) {
//         const url = URL.createObjectURL(file);
//         localStorage.setItem(FILE2_KEY, url);
//         setFile2Url(url);
//     } else {
//         localStorage.removeItem(FILE2_KEY);
//         setFile2Url(null);
//     }
//   }, []);

//   const handleNextStep = useCallback(() => {
//      if (step === 1) {
//       if (file1 || file1Url) { // ⬅️ اگر فایل جدید یا ذخیره‌شده وجود دارد
//         setStep(2);
//       } else {
//          toast.error("لطفا فایل مدرک شناسایی را انتخاب کنید.");
//       }
//     } else if (step === 2) {
//       // ⬅️ اینجا فراخوانی onNext از مدال موفقیت IdentityVerification انجام می‌شود
//       if (file2 || file2Url) { // ⬅️ اگر فایل جدید یا ذخیره‌شده وجود دارد
//         uploadMutation.mutate({
//             // 💡 اگر فایل جدید انتخاب شده است، آن را بفرست، در غیر این صورت باید فایل ذخیره شده را بازیابی کنی
//             // (که فرآیند پیچیده‌تری است. فعلاً فرض می‌کنیم برای آپلود نهایی فایل باید در file1/file2 باشد)
//             file1: file1 as File,
//             file2: file2 as File
//         });
//         // ⚠️ ناوبری نهایی در IdentityVerification انجام می‌شود
//       } else {
//          toast.error("لطفا فایل تعهدنامه را انتخاب کنید.");
//       }
//     } else {
//       setStep((prev) => prev + 1);
//     }
//   }, [step, file1, file2, uploadMutation, file1Url, file2Url]);

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <IdentificationDocument
//             onNext={handleNextStep}
//             onFileChange={onFile1Change}
//             initialPreviewUrl={file1Url}
//           />
//         );
//       case 2:
//         return (
//           <IdentityVerification
//             onNext={handleNextStep} // ⬅️ این برای شروع آپلود استفاده می‌شود
//             onFileChange={onFile2Change}
//             initialPreviewUrl={file1Url}
//             />
//         );
//       // case 3:
//       //   // ⬅️ چون در onSuccess از navigate استفاده کردیم، این case دیگر لازم نیست.
//       //   return null;

//       default:
//         return null
//     }
//   };

//   // 💡 این کامپوننت (AuthenticationLayoutAdvance) باید از children استفاده کند،
//   // اما شما از هر دو (children و renderStep) استفاده کرده‌اید.
//   // ما از renderStep استفاده می‌کنیم و آن را داخل div children می‌گذاریم.
//   return (
//     <HeaderLayout>
//       <AuthenticationLayoutAdvance
//         step={step}
//         started={started}
//         onStart={handleStart}
//         text1="! احراز هویت سطح پایه شما با موفقیت انجام شد"
//         text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را نیز تکمیل نمایید"
//       >
//         <div className="flex flex-col items-center justify-center gap-6 w-full overflow-x-hidden">
//           {step > 0 && <StepperComponent currentStep={step - 1} isAdvance={true} />}
//           {renderStep()} {/* ⬅️ نمایش محتوای مراحل */}
//         </div>
//       </AuthenticationLayoutAdvance>
//     </HeaderLayout>
//   );
// }
// src/pages/Advance.tsx

import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/apiClient";
import IdentificationDocument from "../../Components/auth/step/StepAdvanced/IdentificationDocument";
import IdentityVerification from "../../Components/auth/step/StepAdvanced/IdentityVerification";
import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
import HeaderLayout from "../../layouts/HeaderLayout";

const STEP_KEY = "kyc_advanced_step";
const FILE1_KEY = "kyc_advanced_file1_url";
const FILE2_KEY = "kyc_advanced_file2_url";

type UploadData = { file1: File; file2: File };

export default function Advance() {
  const initialStep = Number(localStorage.getItem(STEP_KEY)) || 0;
  const [step, setStep] = useState(initialStep > 0 ? initialStep : 1);
  const [started, setStarted] = useState(initialStep > 0);

  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);

  const [file1Url, setFile1Url] = useState(localStorage.getItem(FILE1_KEY));
  const [file2Url, setFile2Url] = useState(localStorage.getItem(FILE2_KEY));

  const navigate = useNavigate();

  // ... (useEffect برای step و URL cleanup) ...

const uploadMutation = useMutation({
  mutationFn: (data: UploadData) => {
    const formData = new FormData();
    formData.append("file1", data.file1);
    formData.append("file2", data.file2);

    return apiRequest({
      url: "/api/kyc/advanced/level1", // بدون /api چون در apiClient معمولا prefix داره
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  onSuccess: (data) => {
    toast.success("مدارک احراز هویت با موفقیت آپلود و ارسال شد.");
    navigate("/");
    localStorage.removeItem(STEP_KEY);
    localStorage.removeItem(FILE1_KEY);
    localStorage.removeItem(FILE2_KEY);

  },
  onError: (err: AxiosError<{ msg: string }>) => {
    const errorMsg =
      err.response?.data?.msg || "خطا در آپلود مدارک. لطفا دوباره تلاش کنید.";
    toast.error(errorMsg);
    console.log("file1:", file1, "file2:", file2);

  },
});


  const onFile1Change = useCallback(
    (file: File | null) => {
      setFile1(file);
      if (file) {
        if (file1Url && file1Url.startsWith("blob:")) {
          URL.revokeObjectURL(file1Url);
        }
        const url = URL.createObjectURL(file);
        localStorage.setItem(FILE1_KEY, url);
        setFile1Url(url);
      } else {
        if (file1Url && file1Url.startsWith("blob:")) {
          URL.revokeObjectURL(file1Url);
        }
        localStorage.removeItem(FILE1_KEY);
        setFile1Url(null);
      }
    },
    [file1Url]
  );

  // onFile2Change - اصلاح شده
  const onFile2Change = useCallback(
    (file: File | null) => {
      setFile2(file);
      if (file) {
        if (file2Url && file2Url.startsWith("blob:")) {
          URL.revokeObjectURL(file2Url);
        }
        const url = URL.createObjectURL(file);
        localStorage.setItem(FILE2_KEY, url);
        setFile2Url(url);
      } else {
        if (file2Url && file2Url.startsWith("blob:")) {
          URL.revokeObjectURL(file2Url);
        }
        localStorage.removeItem(FILE2_KEY);
        setFile2Url(null);
      }
    },
    [file2Url]
  );
  const handleNextStep = useCallback(() => {
    console.log(
      "File 1 is File:",
      file1 instanceof File,
      "File 1 Size:",
      file1?.size
    );
    console.log(
      "File 2 is File:",
      file2 instanceof File,
      "File 2 Size:",
      file2?.size
    );
    
    if (step === 1) {
      if (file1 || file1Url) {
        setStep(2);
      } else {
        toast.error("لطفا فایل مدرک شناسایی را انتخاب کنید.");
      }
    } else if (step === 2) {
      const isFile1Valid = file1 instanceof File && file1.size > 0;
      const isFile2Valid = file2 instanceof File && file2.size > 0;

      if (isFile1Valid && isFile2Valid) {
        // ارسال فایل‌ها به صورت مستقیم
        uploadMutation.mutate({ file1: file1 as File, file2: file2 as File });
      } else {
        if (!isFile1Valid) {
          toast.error(
            "فایل مدرک شناسایی (مرحله ۱) مفقود شده است. لطفا دوباره آن را انتخاب کنید."
          );
          setStep(1); // برگشت به مرحله ۱
        } else if (!isFile2Valid) {
          toast.error("لطفا تصویر تعهدنامه (مرحله ۲) را انتخاب کنید.");
        } else {
          toast.error("لطفا هر دو فایل را انتخاب کنید.");
        }
      }
    }
  }, [step, file1, file2, file1Url, uploadMutation, setStep]);

  const renderStep = () => {
    if (step === 2 && !file1 && !file1Url) {
      toast.warn("تصویر مرحله قبل یافت نشد.");
      setStep(1);
      return null;
    }
    switch (step) {
      case 1:
        return (
          <IdentificationDocument
            onNext={handleNextStep}
            onFileChange={onFile1Change}
            initialPreviewUrl={file1Url}
          />
        );
      case 2:
        return (
          <IdentityVerification
            onNext={handleNextStep}
            onFileChange={onFile2Change}
            initialPreviewUrl={file2Url}
          />
        );
      default:
        return null;
    }
  };

  return (
    <HeaderLayout>
      <AuthenticationLayoutAdvance
        step={step}
        started={started}
        onStart={() => setStarted(true)}
        text1="احراز هویت سطح پایه شما با موفقیت انجام شد!"
        text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را تکمیل نمایید."
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full overflow-x-hidden">
          {renderStep()}
        </div>
      </AuthenticationLayoutAdvance>
    </HeaderLayout>
  );
}


