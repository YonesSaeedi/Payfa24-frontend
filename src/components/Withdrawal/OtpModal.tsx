import React, { useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  crypto: string;
  data: {
    network: string;
    withdrawAmount: number;
    withdrawAddressWallet: string;
    withdrawAddressWalletTag?: string;
  };
}

const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  crypto,
  data,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

 const handleConfirm = async () => {
  if (!otp) {
    toast.error("کد تأیید را وارد کنید");
    return;
  }

  setLoading(true);

  try {
    await apiRequest({
      url: `/api/wallets/crypto/withdraw/${crypto}`,
      method: "POST",
      data: {
        ...data,
        codeOtp: otp,
      },
    });

    toast.success("برداشت با موفقیت تأیید شد ✅");
    onClose();

  } catch (err: unknown) {
    let message = "کد تأیید اشتباه است ❌";

    if (err instanceof AxiosError) {
      message = err.response?.data?.msg || message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    toast.error(message);

  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl" dir="rtl">
        <h3 className="text-lg font-semibold mb-2 text-center">
          تأیید برداشت رمز ارز
        </h3>
        <p className="text-gray-600 text-sm text-center mb-4">
          کد ارسال‌شده به ایمیل یا موبایل خود را وارد کنید
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-center tracking-widest text-lg"
          placeholder="کد ۶ رقمی"
        />

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "تأیید"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
