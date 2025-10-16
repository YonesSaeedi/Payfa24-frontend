import React, { FC, useEffect, useState } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { CryptoItem } from "../../types/crypto";
import OTPInputModal from "../trade/OTPInputModal";
import CryptoListModal from "../trade/CryptoListModal";
import useMergedCryptoList from "../Withdrawal/MergedCryptoData";
import TradeSuccessModal from "../trade/TradeSuccessModal";
import IconClose from "../../assets/Icons/Login/IconClose";

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
  const [tag, setTag] = useState<string>(""); // Tag/Memo
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [allNetworks, setAllNetworks] = useState<FullNetwork[]>([]);
  const [availableNetworks, setAvailableNetworks] = useState<(FullNetwork & CoinNetworkRef & { displayName?: string })[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<(FullNetwork & CoinNetworkRef & { displayName?: string }) | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"withdraw" | "transfer">("withdraw");
  const { data: mergedCryptosData, isLoading: isCryptoListLoading} = useMergedCryptoList();
  const [withdrawData, setWithdrawData] = useState<any>(null);
  const [levelUsed, setLevelUsed] = useState<{daily_withdrawal_crypto?: number;}>({});
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<string>("");
  const [resendCodeTimeLeft, setResendCodeTimeLeft] = useState<number>(0);
  const [isResending, setIsResending] = useState(false);
  const [isTradeSuccessModalOpen, setIsTradeSuccessModalOpen] = useState(false);
  const [currentCryptoCurrency, setCurrentCryptoCurrency] = useState<CryptoItem | null>(null);



const handleSetCurrentCryptoCurrency = (currency: CryptoItem) => {
  setCrypto(currency.symbol);
  setCurrentCryptoCurrency(currency);
  setIsCurrencyModalOpen(false);
};


  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false);
    setOtpCode("")
  };

const handleSubmitOtp = async () => {
  if (!otpCode) return;

  try {
    const res = await apiRequest({
      url: `/api/wallets/crypto/withdraw/${crypto}`,
      method: "POST",
      data: {
        ...withdrawData,
        codeOtp: parseInt(otpCode, 10),
      },
    });

    if (res.status) {
      toast.success("برداشت با موفقیت انجام شد ✅");
      
      // OTP modal را ببند
      setIsOtpModalOpen(false);
      setOtpCode("");
      setIsTradeSuccessModalOpen(true);
      setTimeout(() => {
    setIsTradeSuccessModalOpen(true);
  }, 200);
    } else {
      toast.error(res.msg || "کد وارد شده معتبر نیست ❌");
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در تأیید برداشت!");
  }
};

//ارسال دوباره کد OTP
const handleResendCode = async () => {
  try {
    setIsResending(true);

    if (activeTab === "withdraw") {
      // ارسال مجدد OTP برای برداشت از کیف پول
      const res = await apiRequest({
        url: `/api/wallets/crypto/withdraw/${crypto}`, // مسیر واقعی API را جایگزین کن
        method: "POST",
        data: withdrawData,
      });
      toast.success(res?.msg || "کد جدید ارسال شد");
    } else {
      // ارسال مجدد OTP برای انتقال به کاربر
      const res = await apiRequest({
        url: `/api/wallets/crypto/withdraw-transfer/${crypto}`, // مسیر واقعی API را جایگزین کن
        method: "POST",
        data: withdrawData,
      });
      toast.success(res?.msg || "کد جدید ارسال شد");
    }

    setResendCodeTimeLeft(120); // ریست کردن تایمر
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در ارسال مجدد کد OTP");
  } finally {
    setIsResending(false);
  }
};



//شمارنده OTP
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


//دریافت اطلاعات اولیه کوین‌ها و شبکه‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest({
          url: "/api/wallets/crypto/withdraw",
          method: "GET",
        });
        setCoins(res.coins || []);
        setAllNetworks(res.networks || []);
        setLevelUsed(res.level_used || {}); // ← اینجا اضافه کن
      } catch (err) {
        console.error("خطا در گرفتن اطلاعات:", err);
      }
    };
    fetchData();
  }, []);

  // بروزرسانی شبکه‌های مربوط به کوین انتخابی
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
      const full =
        allNetworks.find((n) => n.id === cn.id) || ({} as FullNetwork);
      const localeName =
        (full?.locale &&
          (full.locale.fa?.name || full.locale.fa || full.locale["fa"])) ||
        full?.name ||
        full?.symbol ||
        String(cn.id);

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
    setTag(""); // پاک کردن مقدار قبلی Tag/Memo
  };

 
  //ارسال فرم برداشت قبل از otp
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!selectedNetwork) {
    toast.error("لطفاً شبکه را انتخاب کنید");
    setIsLoading(false);
    return;
  }

  const withdrawAmount = parseFloat(amount);
  const minAmount = parseFloat(selectedNetwork.withdraw_min || "0");
  const maxAmount = parseFloat(coins.find(c => c.symbol === crypto)?.balance_available || "0");

  if (!amount || isNaN(withdrawAmount)) {
    toast.error("لطفاً مقدار برداشت را وارد کنید");
    setIsLoading(false);
    return;
  }

  if (withdrawAmount < minAmount) {
    toast.error(`حداقل مقدار برداشت ${minAmount} ${crypto} است`);
    setIsLoading(false);
    return;
  }

  if (withdrawAmount > maxAmount) {
    toast.error(`موجودی کافی نیست`);
    setIsLoading(false);
    return;
  }

  // اعتبارسنجی Tag/Memo
  if (selectedNetwork.tag === 1 && selectedNetwork.memoRegex) {
    const regex = new RegExp(selectedNetwork.memoRegex);
    if (!regex.test(tag)) {
      toast.error("مقدار Tag/Memo معتبر نیست");
      setIsLoading(false);
      return;
    }
  }

  try {
    await apiRequest({
      url: `/api/wallets/crypto/withdraw/${crypto}`,
      method: "POST",
      data: {
        network: selectedNetwork.symbol,
        withdrawAmount,
        withdrawAddressWallet: address,
        withdrawAddressWalletTag: tag,
      },
    });

    setWithdrawData({
      network: selectedNetwork.symbol,
      withdrawAmount,
      withdrawAddressWallet: address,
      withdrawAddressWalletTag: tag,
    });

    setIsOtpModalOpen(true);
    setResendCodeTimeLeft(120);
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در برداشت!");
  } finally {
    setIsLoading(false);
  }
};
///////////انتقال به کاربر 
// ارسال فرم انتقال قبل از OTP
const handleSubmitTransfer = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  const withdrawAmount = parseFloat(amount);
  const maxAmount = parseFloat(coins.find(c => c.symbol === crypto)?.balance_available || "0");

  if (!amount || isNaN(withdrawAmount)) {
    toast.error("لطفاً مقدار انتقال را وارد کنید");
    setIsLoading(false);
    return;
  }

  if (withdrawAmount > maxAmount) {
    toast.error(`موجودی کافی نیست`);
    setIsLoading(false);
    return;
  }

  if (!address) {
    toast.error("لطفاً موبایل یا ایمیل دریافت‌کننده را وارد کنید");
    setIsLoading(false);
    return;
  }

  try {
    await apiRequest({
      url: `/api/wallets/crypto/withdraw-transfer/${crypto}`,
      method: "POST",
      data: {
        withdrawAmount,
        mobile: address.includes("@") ? "" : address,
        email: address.includes("@") ? address : "",
      },
    });

    setWithdrawData({
      withdrawAmount,
      mobile: address.includes("@") ? "" : address,
      email: address.includes("@") ? address : "",
    });

    setIsOtpModalOpen(true);
    setResendCodeTimeLeft(120);
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در انتقال!");
  } finally {
    setIsLoading(false);
  }
};

// ارسال OTP برای انتقال به کاربر پی‌فا
const handleSubmitTransfers = async (e: React.FormEvent) => {
  e.preventDefault();
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

  // regex برای ایمیل
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10,11}$/; // موبایل‌های ایران

  const dataToSend: any = {
    withdrawAmount,
  };

  if (emailRegex.test(address)) {
    // ایمیل
    dataToSend.email = address;
  } else if (mobileRegex.test(address)) {
    // موبایل
    dataToSend.mobile = address;
  } else {
    toast.error("مقدار وارد شده موبایل یا ایمیل معتبر نیست");
    setIsLoading(false);
    return;
  }

  try {
    await apiRequest({
      url: `/api/wallets/crypto/withdraw-transfer/${crypto}`,
      method: "POST",
      data: dataToSend,
    });

    setWithdrawData(dataToSend);
    setIsOtpModalOpen(true);
    setResendCodeTimeLeft(120);
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در انتقال!");
  } finally {
    setIsLoading(false);
  }
};

// const handleSubmitTransferOtp = async () => {
//   if (!otpCode) return;

//   try {
//     const res = await apiRequest({
//       url: `/api/wallets/crypto/withdraw-transfer/${crypto}`, // endpoint تایید OTP
//       method: "POST",
//       data: {
//         ...withdrawData,
//         codeOtp: parseInt(otpCode, 10),
//       },
//     });

//     if (res.status) {
//       toast.success("انتقال با موفقیت انجام شد ✅");

//       // بستن مودال OTP
//       setIsOtpModalOpen(false);
//       setOtpCode("");

//       // باز کردن مودال Success
//       setIsTradeSuccessModalOpen(true);
//     } else {
//       toast.error(res.msg || "کد وارد شده معتبر نیست ❌");
//     }
//   } catch (err: any) {
//     toast.error(err?.response?.data?.msg || "خطا در تایید انتقال!");
//   }
// };
 // تایید کد OTP برای انتقال به کاربر پی فا
const handleSubmitTransferOtp = async () => {
  if (!otpCode) return;

  try {
    const res = await apiRequest({
      url: `/api/wallets/crypto/withdraw-transfer/${crypto}`, // endpoint تایید OTP
      method: "POST",
      data: {
        ...withdrawData,
        codeOtp: parseInt(otpCode, 10),
      },
    });

    if (res.status) {
      toast.success("انتقال با موفقیت انجام شد ✅");

      // بستن مودال OTP
      setIsOtpModalOpen(false);
      setOtpCode("");

      // باز کردن مودال موفقیت
      setIsTradeSuccessModalOpen(true);
    } else {
      toast.error(res.msg || "کد وارد شده معتبر نیست ❌");
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "خطا در تأیید انتقال!");
  }
};
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await apiRequest({
        url: "/api/wallets/crypto/withdraw",
        method: "GET",
      });
      const coinList = res.coins || [];
      setCoins(coinList);
      setAllNetworks(res.networks || []);
      setLevelUsed(res.level_used || {});

      // ✅ مقدار پیش‌فرض crypto = اولین ارز لیست
      if (coinList.length > 0) {
        setCrypto(coinList[0].symbol);
      }
    } catch (err) {
      console.error("خطا در گرفتن اطلاعات:", err);
    }
  };
  fetchData();
}, []);
useEffect(() => {
  if (!crypto && mergedCryptosData?.length > 0) {
    const firstCoin = mergedCryptosData[0];
    setCrypto(firstCoin.symbol);
    setCurrentCryptoCurrency(firstCoin);
  }
}, [mergedCryptosData, crypto]);



  return (
    <form
      onSubmit={activeTab === "withdraw" ? handleSubmit :  handleSubmitTransfers}
      className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between  overflow-y-auto lg:border lg:border-gray26"
    >
      <div>
        {/* 🔹 بخش ویدیو آموزشی */}
        <div
          dir="rtl"
          className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2  justify-between"
        >
           <div className="flex flex-row">
             <span className="w-6 h-6 icon-wrapper text-blue17">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue17 mr-2">
            ویدیو آموزشی برداشت رمز ارز
          </h2>
           </div>
         
            <span className="w-6 h-6 icon-wrapper  text-blue17 ">
                        <IconClose/>
                      </span>
        </div>

        {/* 🔹 تب‌ها */}
        <div dir="rtl" className="flex mb-6 ">
          {/*تب "برداشت از کیف پول"*/}
          <button
            type="button"
            onClick={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "withdraw"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            برداشت از کیف پول
          </button>

          {/*تب "انتقال به کاربر پی فا"*/}
          <button
            type="button"
            onClick={() => setActiveTab("transfer")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "transfer"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
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
            style={{ color: currentCryptoCurrency.color, fontSize: '24px' }}
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

    <svg
      className="w-4 h-4 text-gray12"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">
    انتخاب ارز
  </label>
        </div>

            {/* شبکه برداشت*/}
            {crypto ? (
              <div className="mb-6">
                <FloatingSelect
                  label="شبکه برداشت"
                  value={selectedNetworkId || undefined}
                  onChange={handleNetworkChange}
                  options={availableNetworks.map((n) => ({
                    value: String(n.id),
                    label: `${n.displayName || n.name || n.symbol || n.id} (${
                      n.name || n.symbol || n.id
                    })`,
                  }))}
                />
              </div>
            ) : (
              <div className="w-full border rounded-lg p-3 text-center text-gray-500 border-gray12 mb-6">
                ابتدا رمز ارز مورد نظر را انتخاب کنید
              </div>
            )}

            {/* مقدار برداشت */}
            {selectedNetworkId && (
              <div className="mt-4 relative z-10 flex flex-col gap-6">
                <div>
                  <FloatingInput
                    label="مقدار"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    className="border border-gray12 mb-6"
                  />
                  {/* 🔹 توضیحات زیر input */}
                  <div className="text-md text-gray5 mt-3 space-y-2">
                    {/* ردیف اول */}
                    <div className="flex items-center justify-between mb-4">
                      <span>موجودی قابل برداشت</span>
                      <span className="font-medium text-black0">
                        {parseFloat(
                          coins.find((c) => c.symbol === crypto)
                            ?.balance_available || "0"
                        ).toFixed(8)}{" "}
                        {crypto}
                      </span>
                    </div>
                    {/* ردیف دوم */}
                    <div className="flex items-center justify-between ">
                      <span>مقدار برداشت روزانه معادل</span>
                      <span className="font-medium text-black0">
                        {levelUsed.daily_withdrawal_crypto?.toLocaleString() ||
                          "—"}{" "}
                        تومان
                      </span>
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
                  <p className="text-xs text-gray5 mt-2">
                    با درج کردن آدرس اشتباه ممکن است باعث از دست رفتن دارایی شما
                    شود.
                  </p>
                </div>

                {/* فقط اگر شبکه نیاز به Tag/Memo دارد */}
                {selectedNetwork?.tag === 1 && (
                  <div>
                    <FloatingInput
                      label="آدرس ممو"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      type="text"
                    />
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
            style={{ color: currentCryptoCurrency.color, fontSize: '24px' }}
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

    <svg
      className="w-4 h-4 text-gray12"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
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
                <FloatingInput
                  label="مقدار"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  className="border border-gray12 mb-6"
                />
                {/* 🔹 توضیحات زیر input */}
                <div className="text-md text-gray5 mt-3 space-y-2">
                <div className="flex items-center justify-between mb-4">
  <span>موجودی قابل برداشت</span>
  <span className="font-medium text-black0">
    {parseFloat(coins.find(c => c.symbol === crypto)?.balance_available || "0").toFixed(8)} {crypto}
  </span>
</div>
<div className="flex items-center justify-between">
  <span>مقدار برداشت روزانه معادل</span>
  <span className="font-medium text-black0">
    {levelUsed.daily_withdrawal_crypto?.toLocaleString() || "—"} تومان
  </span>
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
                <p className="text-xs text-gray5 mt-2">
                  با درج کردن موبایل یا ایمیل ا اشتباه ممکن است باعث از دست رفتن
                  دارایی شما شود.
                </p>
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
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg mb-2"
              disabled={isLoading}
            >
              {isLoading ? "در حال ارسال..." : "تایید"}
            </button>
          </div>
        )}
        {/* 🔹راهنمای برداشت رمز ارز*/}
        <div className="mt-2" dir="ltr">
          <Accordion title="راهنمای برداشت رمز ارز">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>
                از برداشت مستقیم از آدرس خود به مقصد اکسچنچ‌های جهانی که در شروط
                استفاده از خدمات خود به کاربران ایرانی با محدودیت ساخته اند به
                ویژه اکسچنچ های آمریکایی، حتما از کیف پول شخصی و آدرس های یک بار
                مصرف و انتقال چند لایه بین آدرس های خود استفاده کنید.
              </li>
              <li>
                در تعیین شبکه برداشت دقت لازم را داشته باشید و از پشتیبانی کیف
                پول مقصد از شبکه انتخابی اطمینان حاصل کنید.
              </li>
              <li>
                در صورت برداشت به آدرس های دفتر ، نیاز به ورود دو مرحله و
                استفاده از رمز یک بر مصرف نمیباشد.
              </li>
              <li>
                در صورتی که آدرس مقصد متعلق به کاربر پی فا 24 باشد. انتقال به
                صورت رایگان انجام خواهد شد .
              </li>
              <li>
                به دستور مقام قضایی فاصله بین واریز ریالی و برداشت رمز ارز بین
                72 ساعت ممکن است طول بکشد.
              </li>
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
    mainText="کد تأیید ارسال‌شده به خود را وارد کنید"
    submitButtonText="تأیید"
    titleText="تأیید برداشت"
  />
      </div>
  
)}


    {isTradeSuccessModalOpen && (
       <div dir="rtl">
          <TradeSuccessModal
        setIsTradeSuccessModalOpen={setIsTradeSuccessModalOpen}
        isSell={false}
      />
       </div>
    
    )}
    </form>
  );
};

export default CryptoWithdrawForm;
