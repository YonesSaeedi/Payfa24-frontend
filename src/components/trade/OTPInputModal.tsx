import IconClose from "../../assets/icons/Login/IconClose"
import OTPModal from "../OTPModal"
import IconAgain from "../../assets/icons/Login/IconAgain"
import { formatTime } from "../../utils/formatTime"
import { useState } from "react"

interface OTPInputModalProps {
  onSubmit: () => void
  closeModal: () => void
  onChange: (value: string) => void
  submitButtonText?: string
  titleText?: string
  mainText?: string
  OTPLength?: number
  handleEdit?: () => void
  editButtonText?: string
  handleResendCode?: () => void
  resendCodeTimeLeft?: number
  resendCodeIsSubmitting?: boolean
  isSubmitting?: boolean
  isSubmittingText?: string
}

const OTPInputModal = ({
  onSubmit,
  closeModal,
  onChange,
  submitButtonText = 'تایید',
  titleText = 'تایید کد',
  mainText = 'لطفا کد ارسال شده را وارد کنید',
  OTPLength = 6,
  handleEdit,
  editButtonText,
  handleResendCode,
  resendCodeTimeLeft,
  resendCodeIsSubmitting,
  isSubmitting,
  isSubmittingText = 'در حال ثبت ...'
}: OTPInputModalProps) => {
  const [otpValue, setOtpValue] = useState<string>('')
  const isWaiting = !!(resendCodeTimeLeft && resendCodeTimeLeft > 0)
  const isOtpComplete = otpValue.length === OTPLength

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-3 lg:p-6" onClick={closeModal}>
      <div dir="rtl" className="rounded-lg lg:p-8 p-4 bg-white8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="lg:text-lg text-sm lg:font-bold font-medium text-black0">{titleText}</h2>
          <span className="icon-wrapper h-6 w-6 cursor-pointer text-gray12 hover:text-blue2" onClick={closeModal}><IconClose /></span>
        </div>
        <p className="lg:mt-12 mt-8 mb-6 lg:mb-8 lg:text-lg text-sm font-normal text-gray15">{mainText}</p>
        <div className="mb-8 lg:mb-12"><OTPModal length={OTPLength} onChange={resultCode => { onChange(resultCode); setOtpValue(resultCode) }} /></div>
        {handleResendCode &&
          <div className="flex items-center justify-between gap-3 mb-2 lg:mb-4">
            <button
              onClick={handleResendCode}
              disabled={isWaiting || resendCodeIsSubmitting}
              className={`flex items-center gap-1 text-gray15 ${!resendCodeIsSubmitting && !isWaiting ? 'hover:text-blue2 hover:underline' : ''}`}
            >
              <span className={`w-[18px] h-[18px] lg:w-5 lg:h-5`}><IconAgain /></span>
              {resendCodeIsSubmitting ? 'در حال ارسال ...' : 'ارسال مجدد'}
            </button>
            {isWaiting && <span className="text-gray15 font-normal lg:text-sm text-xs">ارسال مجدد کد تا {formatTime(resendCodeTimeLeft)}</span>}
          </div>
        }
        <div className="w-full flex items-center gap-2">
          <button
            onClick={onSubmit}
            className={`w-full flex-1 text-base font-bold text-white2 rounded-lg py-2.5 lg:py-3 border border-transparent transition duration-200 ease-in
                  ${resendCodeIsSubmitting || !isOtpComplete ? ' bg-blue2 opacity-60 cursor-not-allowed' : 'bg-blue2  hover:border-blue2 hover:text-blue2 hover:bg-transparent'}`}
            disabled={resendCodeIsSubmitting || !isOtpComplete || isSubmitting}
          >
            {isSubmitting ? isSubmittingText : submitButtonText} 
          </button>
          {handleEdit &&
            <button
              disabled={resendCodeIsSubmitting}
              onClick={handleEdit}
              className="w-full flex-1 lg:text-base text-sm font-bold rounded-lg py-2.5 lg:py-3 border border-blue2 text-blue2 hover:border-transparent hover:text-white
                        hover:bg-blue2 transition duration-200 ease-in"
            >
              {editButtonText}
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default OTPInputModal