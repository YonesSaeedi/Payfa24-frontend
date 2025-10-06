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
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

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
       <div className="w-full px-4 py-2">
      <BreadcrumbNavigation />
    </div>
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


