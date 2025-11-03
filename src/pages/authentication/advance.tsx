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

export default function Advance() {
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [imageFiles, setImageFiles] = useState<{ idCardImageFile: File | null; identityVerifyImageFile: File | null }>({ idCardImageFile: null, identityVerifyImageFile: null })
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isPendingModalOpen, setIsPendingModalOpen] = useState<boolean>(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false)
  const [rejectModalMsg, setRejectModalMsg] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false)
  const handleUploadImageFiles = (key: 'idCardImageFile' | 'identityVerifyImageFile', imageFile: File | undefined) => {
    setImageFiles(prev => ({ ...prev, [key]: imageFile }))
  }
  const navigate = useNavigate()
  // fetches advanced kyc status and reason_reject to display related modals =============================================================
  useEffect(() => {
    const fetchAdvancedKYC = async () => {
      try {
        const response = await apiRequest<KycGetInfo>({ url: "/kyc/get-info" });
        if (response?.level_kyc === null) {
          toast.warn('احراز هویت سطح مقدماتی هنوز تکمیل نشده است!')
          navigate(ROUTES.AUTHENTICATION_BASIC)
        } else if (response?.level_kyc === 'advanced') setIsSuccessModalOpen(true)
        const advancedInfo = response?.kyc?.advanced;
        if (advancedInfo?.status === 'success') {
          setIsSuccessModalOpen(true)
        }
        else if (advancedInfo?.status === 'reject') {
          setRejectModalMsg(advancedInfo?.reason_reject)
          setIsRejectModalOpen(true)
        } else if (advancedInfo?.status === 'pending') setIsPendingModalOpen(true)
      } catch (err) {
        toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "دریافت اطلاعات کاربر با خطا مواجه شد.")
      }
    }
    fetchAdvancedKYC()
  }, [])
  // submits data =======================================================================================================================
  const handleSubmit = async () => {
    if (!imageFiles.idCardImageFile) {
      toast.error('تصویر کارت شناسایی بارگزاری نشده است.')
      setStep(1)
      return
    }
    if (!imageFiles.identityVerifyImageFile) {
      toast.error('تصویر شخص به همراه متن تعهدنامه، بارگزاری نشده است.')
      return
    }
    const formData = new FormData()
    formData.append('file1', imageFiles.idCardImageFile)
    formData.append('file2', imageFiles.identityVerifyImageFile)
    // DEBUG: log entries to confirm files are in the FormData
    for (const [key, value] of formData.entries()) {
      console.log('FormData entry ->', key, value);
    }
    try {
      await apiRequest({
        url: '/kyc/advanced/level1',
        method: "POST",
        data: formData,
        timeout: 0,
        isFormData: true,
        onUploadProgress: (event) => {
          if (event && event.total) {
            const percent = Math.round((event.loaded * 100) / event.total)
            setUploadProgress(percent)
          }
        }
      })
      toast.success('تصاویر با موفقیت ارسال شدند.')
      setIsPendingModalOpen(true)
    } catch (err) {
      toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "خطا در ارسال اطلاعات")
    } finally {
      setTimeout(() => setUploadProgress(null), 500); // a delay to display the completed progress bar, before closing it
    }
  }

  return (
    <HeaderLayout>
      <AuthenticationLayoutAdvance
        step={step}
        setStep={setStep}
        text1="! احراز هویت سطح پایه شما با موفقیت انجام شد "
        text2="برای دسترسی به تمام امکانات و افزایش امنیت، لطفاً احراز هویت پیشرفته را تکمیل نمایید"
      >
        <div className="flex flex-col items-center justify-center gap-6 w-full overflow-x-hidden">
          {step === 0 && null}
          {step === 1 && <IdentificationDocument handleUploadImageFiles={handleUploadImageFiles} setStep={setStep} />}
          {step === 2 && <IdentityVerification handleUploadImageFiles={handleUploadImageFiles} handleSubmit={handleSubmit} uploadProgress={uploadProgress} />}
          {isSuccessModalOpen ?
            <KycSuccessModal />
            : isRejectModalOpen ? <KycRejectModal msg={rejectModalMsg} setIsRejectModalOpen={setIsRejectModalOpen} />
              : isPendingModalOpen ? <KycPendingModal />
                : null
          }
        </div>
      </AuthenticationLayoutAdvance>
    </HeaderLayout>
  );
}