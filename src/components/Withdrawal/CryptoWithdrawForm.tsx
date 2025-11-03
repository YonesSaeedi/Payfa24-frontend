import React, { FC, useEffect, useState } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "./Accordion";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { CryptoItem } from "../../types/crypto";
import OTPInputModal from "../trade/OTPInputModal";
import CryptoListModal from "../trade/CryptoListModal";
import useMergedCryptoList from "./MergedCryptoData";
import TradeSuccessModal from "../trade/TradeSuccessModal";
import IconClose from "../../assets/icons/Login/IconClose";
import useGetUser from "../../hooks/useGetUser";
import { AxiosError } from "axios";

interface WithdrawApiResponse {
  status: boolean;
  msg: string;
  coins?: Coin[];
  networks?: FullNetwork[];
  level_used?: { daily_withdrawal_crypto?: number };
  data?: {
    otp: boolean;
    msgOtp: string;
    transaction_id: number;
    method: string;
  };
}
type WithdrawRequestData = {
  transactionId: number;
  coin?: string;
  network?: string;
  withdrawAmount?: number;
  withdrawAddressWallet?: string;
  withdrawAddressWalletTag?: string;
};


interface TransferResponse {
  status: boolean;
  msg: string;
  transaction_id: number;
}

interface CoinNetworkRef {
  id: number;
  withdraw_min?: string;
  withdraw_fee?: string;
}

interface Coin {
  id: number;
  symbol: string;
  balance?: string;
  balance_available?: string;
  network?: CoinNetworkRef[];
}

interface FullNetwork {
  id: number;
  name?: string;
  symbol?: string;
  tag?: any;
  addressRegex?: string;
  memoRegex?: string;
  locale?: any;
}


const CryptoWithdrawForm: FC = () => {
  const [crypto, setCrypto] = useState<string>("");
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const allWithdrawFieldsFilled = crypto && selectedNetworkId && amount && address;
  const allTransferFieldsFilled = crypto && amount && address;
  const [coins, setCoins] = useState<Coin[]>([]);
  const [allNetworks, setAllNetworks] = useState<FullNetwork[]>([]);
  const [availableNetworks, setAvailableNetworks] = useState<(FullNetwork & CoinNetworkRef & { displayName?: string })[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<(FullNetwork & CoinNetworkRef & { displayName?: string }) | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"withdraw" | "transfer">("withdraw");
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const { data: mergedCryptosData, isLoading: isCryptoListLoading } = useMergedCryptoList();
  const [withdrawData, setWithdrawData] = useState<{
  transactionId: number;
  coin?: string;
  network?: string;
  withdrawAmount?: number;
  withdrawAddressWallet?: string;
  withdrawAddressWalletTag?: string;
} | null>(null);
  const [levelUsed, setLevelUsed] = useState<{ daily_withdrawal_crypto?: number }>({});
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState<number>(0);
  const [isResending, setIsResending] = useState(false);
  const [isTradeSuccessModalOpen, setIsTradeSuccessModalOpen] = useState(false);
  const [currentCryptoCurrency, setCurrentCryptoCurrency] = useState<CryptoItem | null>(null);
  const { data: userData } = useGetUser();
  const userMobile = userData?.user?.mobile || "شماره شما";
  const handleSetCurrentCryptoCurrency = (currency: CryptoItem) => {
    setCrypto(currency.symbol);
    setCurrentCryptoCurrency(currency);
    setIsCurrencyModalOpen(false);
  };
  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpCode("");
  };
// handle submit otp ============================================================================================
const handleSubmitOtp = async () => {
  if (isOtpSubmitting || !withdrawData) return;
  setIsOtpSubmitting(true);
  try {
    const res = await apiRequest<{ msg: string }, { transaction_id: number; codeOtp: string }>({url: "/api/wallets/crypto/withdraw/confirm",method: "POST",data: {
        transaction_id: withdrawData.transactionId,
        codeOtp: otpCode,
      },
    });
    toast.success(res.msg || "برداشت با موفقیت تأیید شد ✅");
    // ✅ ریست کامل state‌ها
    setIsOtpModalOpen(false);
    setOtpCode("");
    setResendCodeTimeLeft(0);
    setWithdrawData(null);
    setIsTradeSuccessModalOpen(true);
  } catch (err) {
    toast.error((err as AxiosError<{ msg?: string }>)?.response?.data?.msg ||"در تایید کد مشکلی پیش آمد.");
  } finally {
    setIsOtpSubmitting(false);
  }
};
// handle resend ==================================================================================================
const handleResendCode = async () => {
  console.log('resend executed!');
  
  if (!withdrawData || resendCodeTimeLeft) return;
  try {
    setIsResending(true);
    if (!withdrawData) return;
    const res = await apiRequest<WithdrawApiResponse, WithdrawRequestData>({url: "/api/wallets/crypto/withdraw/request",method: "POST",data: withdrawData});
    toast.success(res.msg || "کد جدید ارسال شد");
    setResendCodeTimeLeft(120);

  } catch (err) {
    toast.error((err as AxiosError<{msg?:string}>).response?.data?.msg || "در ارسال مجدد کد مشکلی پیش آمد.") 
  } finally {
    setIsResending(false);
  }
};



  useEffect(() => {
    if (!isOtpModalOpen) return;
    let timer: NodeJS.Timeout | undefined;
    if (resendCodeTimeLeft > 0) {
      timer = setInterval(() => {
        setResendCodeTimeLeft((prev) => {
          return Math.max(prev - 1, 0);
        });
      }, 1000);

    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpModalOpen, resendCodeTimeLeft]);

 //  دریافت اطلاعات اولیه لیست کوین‌ها و شبکه‌ها=======================================================================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest<WithdrawApiResponse>({
          url: "/api/wallets/crypto/withdraw",
          method: "GET",
        });

        setCoins(res.coins || []);
        setAllNetworks(res.networks || []);
        setLevelUsed(res.level_used || {});
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات:", err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (!crypto) {
      setAvailableNetworks([]);
      setSelectedNetworkId("");
      setSelectedNetwork(undefined);
      return;
    }
    const selectedCoin = coins.find((c) => c.symbol === crypto);
    if (!selectedCoin || !Array.isArray(selectedCoin.network)) {
      setAvailableNetworks([]);
      setSelectedNetworkId("");
      setSelectedNetwork(undefined);
      return;
    }
    const nets = selectedCoin.network.map((cn) => {
      const full = allNetworks.find((n) => n.id === cn.id) || ({} as FullNetwork);
      const localeName = (full?.locale && (full.locale.fa?.name || full.locale.fa || full.locale["fa"])) || full?.name || full?.symbol || String(cn.id);
      return {
        ...full,
        ...cn,
        displayName: localeName,
      } as FullNetwork & CoinNetworkRef & { displayName?: string };
    });
    setAvailableNetworks(nets);
    setSelectedNetworkId("");
    setSelectedNetwork(undefined);
    setTag("");
  }, [crypto, coins, allNetworks]);

  const handleNetworkChange = (id: string) => {
    setSelectedNetworkId(id);
    const net = availableNetworks.find((n) => String(n.id) === id);
    setSelectedNetwork(net);
    setTag("");
  };
//  ارسال درخواست برداشت رمزارز (برداشت از کیف پول)======================================================================================================
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!selectedNetwork) {
    toast.error("لطفاً شبکه را انتخاب کنید");
    setIsLoading(false);
    return;
  }

  const withdrawAmount = parseFloat(amount);
  if (!amount || isNaN(withdrawAmount)) {
    toast.error("لطفاً مقدار برداشت را وارد کنید");
    setIsLoading(false);
    return;
  }

  try {
    const response = await apiRequest<
  WithdrawApiResponse,
  {
    coin: string;
    network: string;
    withdrawAmount: number;
    withdrawAddressWallet: string;
    withdrawAddressWalletTag: string;
  }
>({
  url: "/api/wallets/crypto/withdraw/request",
  method: "POST",
  data: {
    coin: crypto,
    network: selectedNetwork?.symbol || "",
    withdrawAmount,
    withdrawAddressWallet: address,
    withdrawAddressWalletTag: tag,
  },
});

    toast.success(response.data?.msgOtp || response.msg || "کد تأیید ارسال شد.");

    if (!response.data?.transaction_id) {
      toast.error("شناسه تراکنش از سرور دریافت نشد.");
      setIsLoading(false);
      return;
    }

    // ✅ ذخیره داده‌ها برای مرحله بعد (تأیید OTP)
    setWithdrawData({
      transactionId: response.data.transaction_id,
      network: selectedNetwork.symbol,
      withdrawAmount,
      withdrawAddressWallet: address,
      withdrawAddressWalletTag: tag,
    });

    // ✅ باز کردن مودال OTP
    setResendCodeTimeLeft(120);
    setIsOtpModalOpen(true);

  } catch (err) {
    toast.error(
      (err as AxiosError<{ msg?: string }>)?.response?.data?.msg ||
        "ارسال درخواست برداشت با مشکل مواجه شد."
    );
  } finally {
    setIsLoading(false);
  }
};

//  مرحله ۱ انتقال به کاربر پی‌فا (ارسال درخواست انتقال)======================================================================================================
  const handleSubmitTransfers = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtpModalOpen) return;
    setIsLoading(true);

    const withdrawAmount = parseFloat(amount);
    if (!amount || isNaN(withdrawAmount)) {
      toast.error("لطفاً مقدار انتقال را وارد کنید");
      setIsLoading(false);
      return;
    }

    if (!address) {
      toast.error("لطفاً موبایل یا ایمیل دریافت‌کننده را وارد کنید");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10,11}$/;

    const dataToSend: any = {
      coin: crypto,
      withdrawAmount,
    };

    if (emailRegex.test(address)) {
      dataToSend.email = address;
    } else if (mobileRegex.test(address)) {
      dataToSend.mobile = address;
    } else {
      toast.error("مقدار وارد شده موبایل یا ایمیل معتبر نیست");
      setIsLoading(false);
      return;
    }

    try {
      const res = await apiRequest<TransferResponse>({
        url: "/api/wallets/crypto/transfer/request",
        method: "POST",
        data: dataToSend,
      });

      if (res.status) {
        setWithdrawData({
          transactionId: res.transaction_id,
          ...dataToSend,
        });
        setIsOtpModalOpen(true);
        setResendCodeTimeLeft(120);
        toast.success(res.msg || "کد تأیید ارسال شد");
      } else {
        toast.error(res.msg || "خطا در ثبت درخواست انتقال");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "خطا در ثبت درخواست انتقال!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTransferOtp = async () => {
    if (!otpCode || !withdrawData?.transactionId) return;

    try {
      const res = await apiRequest<TransferResponse, { transaction_id: number; codeOtp: string }>({
        url: "/api/wallets/crypto/transfer/confirm",
        method: "POST",
        data: {
          transaction_id: withdrawData.transactionId,
          codeOtp: otpCode,
        },
      });

     if (res.status) {
  toast.success(res.msg || "انتقال با موفقیت انجام شد ✅");
  setIsOtpModalOpen(false);
  setOtpCode("");
  setWithdrawData(null); 
  setIsTradeSuccessModalOpen(true);
}
 else {
        toast.error(res.msg || "کد تأیید نامعتبر است");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "خطا در تأیید انتقال!");
    }
  };
  useEffect(() => {
    if (!crypto && mergedCryptosData?.length > 0) {
      const firstCoin = mergedCryptosData[0];
      setCrypto(firstCoin.symbol);
      setCurrentCryptoCurrency(firstCoin);
    }
  }, [mergedCryptosData, crypto]);

  return (
    <>
    <form
      onSubmit={activeTab === "withdraw" ? handleSubmit : handleSubmitTransfers}
      className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between  overflow-y-auto lg:border lg:border-gray26"
    >
      <div>
        {/* 🔹 بخش ویدیو آموزشی */}
        <div dir="rtl" className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2  justify-between">
          <div className="flex flex-row">
            <span className="w-6 h-6 icon-wrapper text-blue17">
              <IconVideo />
            </span>
            <h2 className="font-normal text-blue17 mr-2">ویدیو آموزشی برداشت رمز ارز</h2>
          </div>

          <span className="w-6 h-6 icon-wrapper  text-blue17 ">
            <IconClose />
          </span>
        </div>

        {/* 🔹 تب‌ها */}
        <div dir="rtl" className="flex mb-6 ">
          {/*تب "برداشت از کیف پول"*/}
          <button
            type="button"
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "withdraw" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            برداشت از کیف پول
          </button>

          {/*تب "انتقال به کاربر پی فا"*/}
          <button
            type="button"
            onClick={() => setActiveTab("transfer")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "transfer" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-500"
            }`}
          >
            انتقال به کاربر پی فا
          </button>
        </div>

        {/* 🔹 محتوای تب برداشت از کیف پول */}
        {activeTab === "withdraw" && (
          <div dir="rtl" className="mb-6 relative">
            {/* انتخاب رمز ارز*/}
            <div className="relative w-full mb-6">
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43  bg-gray38 focus:outline-none focus:ring-1 focus:ring-blue2"
              >
                {currentCryptoCurrency ? (
                  <span className="flex items-center gap-2">
                    {currentCryptoCurrency.isFont ? (
                      <i
                        className={`cf cf-${currentCryptoCurrency.symbol.toLowerCase()}`}
                        style={{
                          color: currentCryptoCurrency.color,
                          fontSize: "24px",
                        }}
                      ></i>
                    ) : (
                      <img
                        src={`https://api.payfa24.org/images/currency/${currentCryptoCurrency.icon}`}
                        alt={currentCryptoCurrency.symbol}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-black1 font-medium">{currentCryptoCurrency.symbol}</span>
                  </span>
                ) : (
                  <span className="text-gray12">انتخاب ارز</span>
                )}

                <svg className="w-4 h-4 text-gray12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
                انتخاب ارز
              </label>
            </div>

            
            {crypto ? (
              <div dir="rtl" className="mb-6">
                <FloatingSelect
                  label="شبکه برداشت"
                  value={selectedNetworkId || ""}
                  onChange={handleNetworkChange}
                  options={availableNetworks.map((n) => ({
                    value: String(n.id),
                    label: `${n.displayName || n.name || n.symbol || n.id} (${n.name || n.symbol || n.id})`,
                  }))}
                />
              </div>
            ) : (
              <div className="w-full border rounded-lg p-3 text-center text-gray-500 border-gray12 mb-6">ابتدا رمز ارز مورد نظر را انتخاب کنید</div>
            )}

            {/* مقدار برداشت */}
            {selectedNetworkId && (
              <div className="mt-4 relative z-10 flex flex-col gap-6">
                <div>
                  <FloatingInput label="مقدار" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="border border-gray12 mb-6" />
                  {/* 🔹 توضیحات زیر input */}
                  <div className="text-md text-gray5 mt-3 space-y-2">
                    {/* ردیف اول */}
                    <div className="flex items-center justify-between mb-4">
                      <span>موجودی قابل برداشت</span>
                      <span className="font-medium text-black0">
                        {parseFloat(coins.find((c) => c.symbol === crypto)?.balance_available || "0").toFixed(8)} {crypto}
                      </span>
                    </div>
                    {/* ردیف دوم */}
                    <div className="flex items-center justify-between ">
                      <span>مقدار برداشت روزانه معادل</span>
                      <span className="font-medium text-black0">{levelUsed.daily_withdrawal_crypto?.toLocaleString() || "—"} تومان</span>
                    </div>
                    {/* ردیف سوم */}
                    <div className="flex items-center justify-between mb-2">
                      <span>حداقل مجاز برداشت</span>
                      <span className="font-medium text-black0">
                        {selectedNetwork?.withdraw_min || "—"} {crypto}
                      </span>
                    </div>
                  </div>
                </div>
                {/* آدرس مقصد */}
                <div className="pt-2">
                  <FloatingInput
                    label="آدرس کیف پول مقصد"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    className="border border-gray12"
                  />
                  <p className="text-xs text-gray5 mt-2">با درج کردن آدرس اشتباه ممکن است باعث از دست رفتن دارایی شما شود.</p>
                </div>

                {/* فقط اگر شبکه نیاز به Tag/Memo دارد */}
                {selectedNetwork?.tag === 1 && (
                  <div>
                    <FloatingInput label="آدرس ممو" value={tag} onChange={(e) => setTag(e.target.value)} type="text" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* 🔹 محتوای تب انتقال به کاربر پی‌فا */}
        {activeTab === "transfer" && (
          <div dir="rtl" className="mb-6 relative">
            {/* انتخاب رمز ارز 1-*/}
            <div className="relative w-full mb-6">
              <button
                type="button"
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center justify-between w-full px-3 py-5 border rounded-md border-gray12 lg:bg-gray43  bg-gray38 focus:outline-none focus:ring-1 focus:ring-blue2"
              >
                {currentCryptoCurrency ? (
                  <span className="flex items-center gap-2">
                    {currentCryptoCurrency.isFont ? (
                      <i
                        className={`cf cf-${currentCryptoCurrency.symbol.toLowerCase()}`}
                        style={{
                          color: currentCryptoCurrency.color,
                          fontSize: "24px",
                        }}
                      ></i>
                    ) : (
                      <img
                        src={`https://api.payfa24.org/images/currency/${currentCryptoCurrency.icon}`}
                        alt={currentCryptoCurrency.symbol}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-black1 font-medium">{currentCryptoCurrency.symbol}</span>
                  </span>
                ) : (
                  <span className="text-gray12">انتخاب ارز</span>
                )}

                <svg className="w-4 h-4 text-gray12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
                انتخاب ارز
              </label>
            </div>
            {/* مقدار برداشت */}

            <div className="mt-4 relative z-10 flex flex-col gap-6">
              <div>
                <FloatingInput label="مقدار" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="border border-gray12 mb-6" />
                {/* 🔹 توضیحات زیر input */}
                <div className="text-md text-gray5 mt-3 space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <span>موجودی قابل برداشت</span>
                    <span className="font-medium text-black0">
                      {parseFloat(coins.find((c) => c.symbol === crypto)?.balance_available || "0").toFixed(8)} {crypto}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>مقدار برداشت روزانه معادل</span>
                    <span className="font-medium text-black0">{levelUsed.daily_withdrawal_crypto?.toLocaleString() || "—"} تومان</span>
                  </div>
                </div>
              </div>
              {/* موبایل یا ایمیل دریافت کننده */}
              <div className="pt-4">
                <FloatingInput
                  label="موبایل یا ایمیل دریافت کننده"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  className="border border-gray12"
                />
                <p className="text-xs text-gray5 mt-2">با درج کردن موبایل یا ایمیل اشتباه ممکن است باعث از دست رفتن دارایی شما شود.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {/* 🔹 دکمه تایید */}
        {(activeTab === "withdraw" || activeTab === "transfer") && (
          <div>
            <button
              type="submit"
              disabled={isLoading || (activeTab === "withdraw" ? !allWithdrawFieldsFilled : !allTransferFieldsFilled)}
              className={`w-full py-3 rounded-lg mb-2 mt-24 font-bold text-[18px] transition-colors duration-300 ${
                isLoading || (activeTab === "withdraw" ? !allWithdrawFieldsFilled : !allTransferFieldsFilled)
                  ? "bg-gray12 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? "در حال ارسال..." : "تأیید"}
            </button>
          </div>
        )}
        {/* 🔹راهنمای برداشت رمز ارز*/}
        <div className="mt-2" dir="ltr">
          <Accordion title="راهنمای برداشت رمز ارز">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>
                از برداشت مستقیم از آدرس خود به مقصد اکسچنچ‌های جهانی که در شروط استفاده از خدمات خود به کاربران ایرانی با محدودیت ساخته اند به ویژه اکسچنچ های
                آمریکایی، حتما از کیف پول شخصی و آدرس های یک بار مصرف و انتقال چند لایه بین آدرس های خود استفاده کنید.
              </li>
              <li>در تعیین شبکه برداشت دقت لازم را داشته باشید و از پشتیبانی کیف پول مقصد از شبکه انتخابی اطمینان حاصل کنید.</li>
              <li>در صورت برداشت به آدرس های دفتر ، نیاز به ورود دو مرحله و استفاده از رمز یک بر مصرف نمیباشد.</li>
              <li>در صورتی که آدرس مقصد متعلق به کاربر پی فا 24 باشد. انتقال به صورت رایگان انجام خواهد شد .</li>
              <li>به دستور مقام قضایی فاصله بین واریز ریالی و برداشت رمز ارز بین 72 ساعت ممکن است طول بکشد.</li>
            </ul>
          </Accordion>
        </div>
      </div>
      {isCurrencyModalOpen && (
        <div dir="rtl">
          <CryptoListModal
            setIsCryptoListModalOpen={setIsCurrencyModalOpen}
            cryptoListData={mergedCryptosData}
            setCurrentCryptoCurrency={handleSetCurrentCryptoCurrency}
            isCryptoListLoading={isCryptoListLoading}
          />
        </div>
      )}
      {isTradeSuccessModalOpen && (
        <div dir="rtl">
          <TradeSuccessModal setIsTradeSuccessModalOpen={setIsTradeSuccessModalOpen} isSell={false} />
        </div>
      )}
    </form>
      {isOtpModalOpen && (
        <div dir="rtl">
          <OTPInputModal
            closeModal={handleCloseOtpModal}
            onChange={(value: string) => setOtpCode(value)}
            onSubmit={activeTab === "withdraw" ? handleSubmitOtp : handleSubmitTransferOtp} // ← اینجا
            OTPLength={6}
            handleResendCode={handleResendCode}
            resendCodeIsSubmitting={isResending}
            resendCodeTimeLeft={resendCodeTimeLeft}
            mainText={`لطفاً کد ارسال شده به شماره ${userMobile} را وارد کنید`}
            submitButtonText="تأیید"
            titleText="تأیید برداشت"
            />
        </div>
      )}
      </>
  );
};

export default CryptoWithdrawForm;
