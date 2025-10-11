import { useState } from "react"
import IconClose from "../../assets/Icons/Login/IconClose"
import OTPModal from "../OTPModal"

interface OTPInputModalProps {
  onSubmit: () => void
  closeModal: () => void
  titleText?: string
  mainText?: string
  OTPLength?: number
  editButtonFunctionality?: () => void
  editButtonText?: string
  resendCodeFunctionality?: () => void
  resendCodeTimeLeft?: number
}

const OTPInputModal = ({
  onSubmit,
  closeModal,
  titleText = 'تایید کد',
  mainText = 'لطفا کد ارسال شده را وارد کنید',
  OTPLength = 6,
  editButtonFunctionality,
  editButtonText,
  resendCodeFunctionality,
  resendCodeTimeLeft
}: OTPInputModalProps) => {
  const [OTPCode, setOtpCode] = useState<string>('')

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center" onClick={closeModal}>
      <div className="rounded-lg lg:p-8 p-4 bg-white8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="lg:text-lg text-sm lg:font-bold font-medium text-black0">{titleText}</h2>
          <span className="icon-wrapper h-6 w-6 cursor-pointer text-gray12" onClick={closeModal}><IconClose /></span>
        </div>
        <p className="lg:mt-12 mt-8 mb-6 lg:mb-8 lg:text-lg text-sm font-normal text-gray15">{mainText}</p>
        <div className="mb-8 lg:mb-12"><OTPModal length={OTPLength} onChange={resultCode => setOtpCode(resultCode)} /></div>
        {resendCodeFunctionality &&
          <div className="flex items-center justify-between gap-3 mb-2 lg:mb-4">
            <button
              className="flex items-center gap-1 text-gray15"
            >
              <span className="w-[18px] h-[18px] lg:w-5 lg:h-5"></span>
            </button>
            <span className="text-gray15"></span>
          </div>
        }
        <div className="w-full flex items-center gap-2">
          {editButtonFunctionality &&
            <button
              onClick={editButtonFunctionality}
              className="w-full flex-1 text-base font-bold rounded-lg py-2.5 lg:py-3 border border-blue2 hover:border-transparent hover:text-white
            hover:bg-blue2 transition duration-200 ease-in"
            >
              {editButtonText}
            </button>
          }
          <button
            onClick={() => null}
            className="w-full flex1 text-base font-bold bg-blue2 text-white rounded-lg py-2.5 lg:py-3 border border-transparent hover:border-blue2 hover:text-blue2
            hover:bg-transparent transition duration-200 ease-in"
            disabled={false}
          >
            aaa
          </button>
        </div>
      </div>
    </div>
  )
}

export default OTPInputModal