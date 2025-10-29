import { useState } from "react";
import OTPModal from "../../OTPModal";
import { apiRequest } from "../../../utils/apiClient";
import { UseTwoStepVerification } from "../../../hooks/UseTwoStepVerification";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../routes/routes";
import { toast } from "react-toastify";
import { AxiosError } from "axios";



export default function EnterCodePage() {
  const { data, refetch } = UseTwoStepVerification();

  const type = data?.twofa?.type; // مقدار type برای URL
  const [code, setCode] = useState("");
  const navigate = useNavigate()
  const onClick = async () => {
    if (!code || !type) return; // اعتبارسنجی اولیه

    try {
      const res: any = await apiRequest({
        url: `/api/account/2fa/verify/google`,
        method: "POST",
        data: { code },
      });
      toast.success(res.data?.msg || `تایید شد`);
      refetch()
      // اینجا می‌تونید بعد از موفقیت onPrev یا هر چیزی که لازمه اجرا کنید
      // onPrev();
      navigate(ROUTES.MULTI_FACTOR)
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      const errorMsg = error.response?.data?.msg || `خطا در تأیید کد.`;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="lg:text-lg mt-8 text-sm font-normal text-gray5 text-center">
        لطفا کد ارسال شده به Google Authenticator را وارد کنید.
      </p>
      <div>
        <OTPModal length={6} onChange={setCode} />
      </div>
      <div className="w-full flex gap-4 mt-8">
        <button
          onClick={onClick}
          className="w-full py-3 font-bold text-lg bg-blue2 rounded-lg text-white2"
        >
          تأیید کد
        </button>
      </div>
    </div>
  );
}
