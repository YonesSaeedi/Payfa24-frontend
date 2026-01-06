import { useEffect, useState } from "react";
import AuthenticationLayoutAdvance from "../../layouts/AuthenticationLayoutAdvance";
import HeaderLayout from "../../layouts/HeaderLayout";
import IdentificationDocument from "../../components/auth/step/StepAdvanced/IdentificationDocument";
import IdentityVerification from "../../components/auth/step/StepAdvanced/IdentityVerification";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { ROUTES } from "../../routes/routes";
import { apiRequest } from "../../utils/apiClient";
import { useNavigate } from "react-router";
import { KycGetInfo } from "../../types/apiResponses";
import KycSuccessModal from "../../components/auth/step/StepAdvanced/KycSuccessModal";
import KycPendingModal from "../../components/auth/step/StepAdvanced/KycPendingModal";
import KycRejectModal from "../../components/auth/step/StepAdvanced/KycRejectModal";
import useGetKYCInfo from "../../hooks/useGetKYCInfo";

export default function Advance() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [imageFiles, setImageFiles] = useState<{ idCardImageFile: File | null; identityVerifyImageFile: File | null }>({ idCardImageFile: null, identityVerifyImageFile: null });
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [rejectModalMsg, setRejectModalMsg] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const handleUploadImageFiles = (key: "idCardImageFile" | "identityVerifyImageFile", imageFile: File | undefined) => {
    setImageFiles((prev) => ({ ...prev, [key]: imageFile }));
  };
  const navigate = useNavigate();
  const { refetch } = useGetKYCInfo();
  // fetches advanced kyc status and reason_reject to display related modals =============================================================

  // useEffect(() => {
  //   const fetchAdvancedKYC = async () => {
  //     try {
  //       const response = await apiRequest<KycGetInfo>({ url: "/kyc/get-info" });
  //       if (response?.level_kyc === null) {
  //         toast.warn('احراز هویت سطح مقدماتی هنوز تکمیل نشده است!')
  //         navigate(ROUTES.AUTHENTICATION_BASIC)
  //       } else if (response?.level_kyc === 'advanced') setIsSuccessModalOpen(true)
  //       const advancedInfo = response?.kyc?.advanced;
  //       if (advancedInfo?.status === 'confirm') {
  //         setIsSuccessModalOpen(true)
  //       }
  //       else if (advancedInfo?.status === 'reject') {
  //         setRejectModalMsg(advancedInfo?.reason_reject)
  //         setIsRejectModalOpen(true)
  //       } else if (advancedInfo?.status === 'pending') setIsPendingModalOpen(true)
  //     } catch (err) {
  //       toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "دریافت اطلاعات کاربر با خطا مواجه شد.")
  //     }
  //   }
  //   fetchAdvancedKYC()
  // }, [])

  const [userLevelKYC, setUserLevelKYC] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvancedKYC = async () => {
       setShowSkeleton(true);
      try {
        const response = await apiRequest<KycGetInfo>({ url: "/kyc/get-info" });

        if (response?.level_kyc === null) {
          toast.warn("احراز هویت سطح مقدماتی هنوز تکمیل نشده است!");
          navigate(ROUTES.AUTHENTICATION_BASIC);
          return;
        }

        // این خط حیاتیه — حتماً باید ست بشه!
        setUserLevelKYC(response.level_kyc);
         setTimeout(() => setShowSkeleton(false), 300);
        // اگر advanced بود → هیچ مدالی باز نشه
        if (response.level_kyc === "advanced") {
          setIsSuccessModalOpen(false);
          setIsPendingModalOpen(false);
          setIsRejectModalOpen(false);
          return;
        }

        const advancedInfo = response?.kyc?.advanced;

        if (advancedInfo?.status === "confirm") {
          setIsSuccessModalOpen(true);
        } else if (advancedInfo?.status === "reject") {
          setRejectModalMsg(advancedInfo.reason_reject || null);
          setIsRejectModalOpen(true);
        } else if (advancedInfo?.status === "pending") {
          setIsPendingModalOpen(true);
        }
      } catch (err) {
        toast.error("خطا در دریافت اطلاعات");
        setUserLevelKYC(null);
      }
    };

    fetchAdvancedKYC();
  }, [navigate]);
  // submits data =======================================================================================================================
  const handleSubmit = async () => {
    if (!imageFiles.idCardImageFile) {
      toast.error("تصویر کارت شناسایی بارگزاری نشده است.");
      setStep(1);
      return;
    }
    if (!imageFiles.identityVerifyImageFile) {
      toast.error("تصویر شخص به همراه متن تعهدنامه، بارگزاری نشده است.");
      return;
    }
    const formData = new FormData();
    formData.append("file1", imageFiles.idCardImageFile);
    formData.append("file2", imageFiles.identityVerifyImageFile);

    try {
      await apiRequest({
        url: "/kyc/advanced/level1",
        method: "POST",
        data: formData,
        timeout: 0,
        isFormData: true,
        onUploadProgress: (event) => {
          if (event && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });
      refetch();
      toast.success("تصاویر با موفقیت ارسال شدند.");
      setIsPendingModalOpen(true);
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "خطا در ارسال اطلاعات");
    } finally {
      setTimeout(() => setUploadProgress(null), 500); 
    }
  };

  return (
    <HeaderLayout>
        {showSkeleton ? (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue2"></div>
            <p dir="rtl" className="mt-4 text-gray5">در حال بارگذاری ...</p>
          </div>
        </div>
      ) : (
        <AuthenticationLayoutAdvance
          step={step}
          setStep={setStep}
          userLevelKYC={userLevelKYC}
          text1="! احراز هویت سطح پایه شما با موفقیت انجام شد "
          text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را تکمیل نمایید ."
        >
          <div className="flex flex-col items-center justify-center gap-6 w-full overflow-x-hidden">
            {step === 0 && null}
            {step === 1 && <IdentificationDocument handleUploadImageFiles={handleUploadImageFiles} setStep={setStep} />}
            {step === 2 && <IdentityVerification handleUploadImageFiles={handleUploadImageFiles} handleSubmit={handleSubmit} uploadProgress={uploadProgress} />}
            {isSuccessModalOpen ? (
              <KycSuccessModal />
            ) : isRejectModalOpen ? (
              <KycRejectModal msg={rejectModalMsg} setIsRejectModalOpen={setIsRejectModalOpen} />
            ) : isPendingModalOpen ? (
              <KycPendingModal />
            ) : null}
          </div>
        </AuthenticationLayoutAdvance>
      )}
    </HeaderLayout>
  );
}