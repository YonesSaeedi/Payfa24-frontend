import React from "react";
import QrCode from "../../../assets/images/QRcode.png";

interface propSub {
  onNext: () => void;
}

export default function ScanQrCodePage({ onNext }: propSub) {
  return (
    <div className="w-full flex flex-col items-center gap-6 lg:px-4" dir="rtl">
      <div className="flex lg:flex-col flex-col-reverse items-center gap-6">
        <p className="lg:text-lg text-sm font-normal text-gray5">
          کد QR را با برنامه Google Authenticator اسکن کنید.
        </p>
        <img className="w-48 h-48" src={QrCode} alt="" />
      </div>
      <button
        onClick={onNext}
        className="w-full py-3 mt-52 lg:mt-16 font-bold text-lg bg-blue2 rounded-lg text-white2"
      >
        ادامه
      </button>
    </div>
  );
}
