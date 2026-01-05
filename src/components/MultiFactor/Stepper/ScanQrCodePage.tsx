import { toast } from "react-toastify";
import { UseTwoStepVerification } from "../../../hooks/UseTwoStepVerification";

interface propSub {
  onNext: () => void;
  onPrev?: () => void;
}

export default function ScanQrCodePage({ onNext }: propSub) {
  const { data } = UseTwoStepVerification();
  const dataGoogleVerificationForm = data?.google;
  const svgData = dataGoogleVerificationForm?.inlineUrl;
  const svgBase64 = svgData ? `data:image/svg+xml;base64,${btoa(svgData)}` : undefined;

  return (
    <div className="w-full flex flex-col items-center gap-6 lg:px-4" dir="rtl">
      <div className="flex lg:flex-col flex-col-reverse items-center gap-6">
        <p className="lg:text-lg text-sm font-normal text-gray5">کد QR را با برنامه Google Authenticator اسکن کنید.</p>
        <div className="flex flex-col gap-2.5 items-center justify-center">
          {dataGoogleVerificationForm?.inlineUrl ? (
            <img className="min-w-48 h-48 rounded-[10px]" src={svgBase64} alt="QR Code" />
          ) : (
            <div className="flex items-center justify-center w-48 h-48 bg-secondary rounded-[10px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        <p
          onClick={() => {
            navigator.clipboard.writeText(dataGoogleVerificationForm?.secret|| "");
            toast.info(" کپی شد");
          }}
          className="lg:text-sm text-xs font-normal text-gray5"
        >
          یا میتوانید کد زیر را به صورت دستی وارد کنید: <span className="cursor-pointer">{dataGoogleVerificationForm?.secret}</span>
        </p>
      </div>
      <button onClick={onNext} className="w-full py-3 mt-4 lg:mt-16 font-bold text-lg bg-blue2 rounded-lg text-white2">
        ادامه
      </button>
    </div>
  );
}
