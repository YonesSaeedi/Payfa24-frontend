
import React, { FC, useEffect, useState } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Withdrawal/IconVideo";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import CurrencyWithdrawModal from "./GeneralWithdrawModal"; // 👈 اضافه شد
import { toast } from "react-toastify";
import { CryptoItem } from "../../types/crypto";
import GeneralWithdrawModal from "./GeneralWithdrawModal";




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
  const [availableNetworks, setAvailableNetworks] = useState<
    (FullNetwork & CoinNetworkRef & { displayName?: string })[]
  >([]);
  const [selectedNetwork, setSelectedNetwork] = useState<
    (FullNetwork & CoinNetworkRef & { displayName?: string }) | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState<"withdraw" | "transfer">("withdraw");


  // 👇 state برای کنترل باز/بسته بودن مودال
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest({
          url: "/api/wallets/crypto/withdraw",
          method: "GET",
        });
        setCoins(res.coins || []);
        setAllNetworks(res.networks || []);
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
      const full = allNetworks.find((n) => n.id === cn.id) || ({} as FullNetwork);
      const localeName =
        (full?.locale && (full.locale.fa?.name || full.locale.fa || full.locale["fa"])) ||
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

  // انتخاب شبکه
  const handleNetworkChange = (id: string) => {
    setSelectedNetworkId(id);
    const net = availableNetworks.find((n) => String(n.id) === id);
    setSelectedNetwork(net);
    setTag(""); // پاک کردن مقدار قبلی Tag/Memo
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!amount || isNaN(parseFloat(amount))) {
    toast.error("لطفاً مقدار برداشت را وارد کنید");
    setIsLoading(false);
    return;
  }

  if (selectedNetwork?.tag === 1 && selectedNetwork?.memoRegex) {
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
        network: selectedNetwork?.symbol || selectedNetworkId,
        withdrawAmount: parseFloat(amount),
        withdrawAddressWallet: address,
        withdrawAddressWalletTag: tag,
      },
    });

    toast.success("برداشت با موفقیت ثبت شد!");
  } catch (err: any) {
    console.error(err);
    toast.error(err?.response?.data?.msg || "خطا در برداشت!");
  } finally {
    setIsLoading(false);
  }
};


  return (


  <form
    onSubmit={handleSubmit}
    className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between h-[864px] overflow-y-auto"
  >
    <div>
      {/* 🔹 بخش ویدیو آموزشی */}
      <div
        dir="rtl"
        className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2"
      >
        <span className="w-6 h-6 icon-wrapper">
          <IconVideo />
        </span>
        <h2 className="font-normal text-blue2">
          ویدیو آموزشی برداشت رمز ارز
        </h2>
      </div>

      {/* 🔹 تب‌ها */}
      <div dir="rtl" className="flex mb-6 border-b border-gray-300">
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
          {/* انتخاب رمز ارز */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              انتخاب رمز ارز
            </label>
            <div
              className="p-3 border rounded-lg cursor-pointer border-gray12"
              onClick={() => setIsCurrencyModalOpen(true)}
            >
              {crypto || "انتخاب کنید"}
            </div>
          </div>

          {crypto ? (
            <FloatingSelect
              label="شبکه برداشت"
              value={selectedNetworkId || undefined}
              onChange={handleNetworkChange}
              options={availableNetworks.map((n) => ({
                value: String(n.id),
                label: `${
                  n.displayName || n.name || n.symbol || n.id
                } (${n.name || n.symbol || n.id})`,
              }))}
            />
          ) : (
            <div className="w-full border rounded-lg p-3 text-center text-gray-500 bg-gray-100">
              ابتدا رمز ارز مورد نظر را انتخاب کنید
            </div>
          )}

         {selectedNetworkId && (
  <div className="mt-4 relative z-10 flex flex-col gap-6">

{/* مقدار برداشت */}
    <div>
      <FloatingInput
        label="مقدار"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
      />

      {/* 🔹 توضیحات زیر input */}
     {/* 🔹 توضیحات زیر input */}
<div className="text-xs text-gray-500 mt-3 space-y-2">
  {/* ردیف اول */}
  <div className="flex items-center justify-between">
    <span>موجودی قابل برداشت</span>
    <span className="font-medium text-gray-700">
      {parseFloat(coins.find(c => c.symbol === crypto)?.balance_available || "0").toFixed(3)} {crypto}
    </span>
  </div>

  {/* ردیف دوم */}
  <div className="flex items-center justify-between">
    <span>حداقل مقدار برداشت</span>
    <span className="font-medium text-gray-700">
      {selectedNetwork?.withdraw_min || "—"} {crypto}
    </span>
  </div>

  {/* ردیف سوم */}
  <div className="flex items-center justify-between">
    <span>مقدار برداشت روزانه معادل</span>
    <span className="font-medium text-gray-700">
      {selectedNetwork?.withdraw_fee || "—"} تومان
    </span>
  </div>
</div>

    </div>


    {/* آدرس مقصد */}
    <div>
      <FloatingInput
        label="آدرس کیف پول مقصد"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
      />
      <p className="text-xs text-gray-500 mt-2">
        با درج کردن آدرس اشتباه ممکن است باعث از دست رفتن دارایی شما شود.
      </p>
    </div>

    {/* فقط اگر شبکه نیاز به Tag/Memo دارد */}
    {selectedNetwork?.tag === 1 && (
      <div>
        <FloatingInput
          label="Tag / Memo (در صورت نیاز)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          type="text"
        />
        <p className="text-xs text-gray-500 mt-2">
          در صورت نیاز، مقدار Tag یا Memo را دقیق وارد کنید.
        </p>
      </div>
    )}

    
  </div>
)}

        </div>
      )}

      {/* 🔹 محتوای تب انتقال به کاربر پی‌فا */}
      {activeTab === "transfer" && (
        <div
          dir="rtl"
          className="p-6 rounded-xl bg-gray-50 border border-gray-200 text-right"
        >
          <h2 className="text-lg font-semibold mb-4 text-blue-600">
            انتقال به کاربر پی‌فا
          </h2>
          <p className="text-gray-600 mb-4">
            در این بخش می‌توانید به کاربر دیگری در پی‌فا انتقال انجام دهید.
          </p>
          {/* 👉 در آینده اینجا فرم مخصوص انتقال اضافه می‌شود */}
        </div>
      )}
    </div>

    {/* 🔹 دکمه تایید */}
    {activeTab === "withdraw" && (
      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال..." : "تایید"}
        </button>
      </div>
    )}
      <div className="mt-2" dir="ltr">
            <Accordion title="راهنمای برداشت رمز ارز">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>
                 از برداشت مستقیم از آدرس خود به مقصد اکسچنچ‌های جهانی که در شروط استفاده از خدمات خود به کاربران ایرانی با محدودیت ساخته اند به ویژه اکسچنچ های آمریکایی، حتما از کیف پول شخصی و آدرس های یک بار مصرف و انتقال چند لایه بین آدرس های خود استفاده کنید.
                </li>
                <li>
                در تعیین شبکه برداشت دقت لازم را داشته باشید و از پشتیبانی کیف پول مقصد از شبکه انتخابی اطمینان حاصل کنید.
                </li>
                <li>در صورت برداشت به آدرس های دفتر ، نیاز به ورود دو مرحله و استفاده از رمز یک بر مصرف نمیباشد.</li>
                <li>در صورتی که آدرس مقصد متعلق به کاربر پی فا 24  باشد. انتقال به صورت رایگان انجام خواهد شد .</li>
                <li>به دستور مقام قضایی فاصله بین واریز ریالی و برداشت رمز ارز بین 72 ساعت ممکن است طول بکشد.</li>
              </ul>
            </Accordion>
          </div>

    {/* 🔹 مودال انتخاب رمز ارز */}
    {isCurrencyModalOpen && (
      <GeneralWithdrawModal
        setIsModalOpen={setIsCurrencyModalOpen}
        setCurrentCryptoCurrency={(item: CryptoItem) => {
          setCrypto(item.symbol);
          setIsCurrencyModalOpen(false);
        }}
      />
    )}
  </form>
);





 
};

export default CryptoWithdrawForm;
