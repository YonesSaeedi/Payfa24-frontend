import React from "react";
import OTPModal from "../../OTPModal";

export default function EnterCodePage({ onPrev }) {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="lg:text-lg mt-8 text-sm font-normal text-gray5 text-center">
        لطفا کد ارسال شده به Google Authenticatior را وارد کنید.
      </p>
      <div>
        <OTPModal length={6} />
      </div>
      <div className="w-full flex gap-4 mt-8">
        <button className="w-full py-3 font-bold text-lg bg-blue2 rounded-lg text-white2">
          تأیید کد
        </button>
      </div>
    </div>
  );
}



