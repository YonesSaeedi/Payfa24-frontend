
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
      className="lg:p-8 rounded-xl lg:shadow-sm lg:bg-gray44 flex flex-col justify-between h-[644px] overflow-y-auto"
    >
      <div>
        <div
          dir="rtl"
          className="mb-6 bg-blue14 py-4 px-4 rounded-[8px] flex items-center gap-2"
        >
          <span className="w-6 h-6 icon-wrapper">
            <IconVideo />
          </span>
          <h2 className="font-normal text-blue2">ویدیو آموزشی برداشت رمز ارز</h2>
        </div>

        {/* 👇 تغییر داده شد: به جای FloatingSelect، یک div قابل کلیک و مودال */}
        <div dir="rtl" className="mb-6 relative">
          <label className="block text-sm text-gray-600 mb-1">انتخاب رمز ارز</label>
          <div
            className="p-3 border rounded-lg cursor-pointer bg-white"
            onClick={() => setIsCurrencyModalOpen(true)}
          >
            {crypto || "انتخاب کنید"}
          </div>
        </div>

      <div dir="rtl" className="mb-6 relative">
  {crypto ? (
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
  ) : (
    <div className="w-full border rounded-lg p-3 text-center text-gray-500 bg-gray-100">
      ابتدا رمز ارز مورد نظر را انتخاب کنید
    </div>
  )}

  {selectedNetworkId && (
    <div className="mt-4 relative z-10 flex flex-col gap-4">
      <FloatingInput
        label="آدرس مقصد"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        type="text"
      />

      {/* فقط اگر شبکه نیاز به Tag/Memo دارد */}
      {selectedNetwork?.tag === 1 && (
        <FloatingInput
          label="Tag / Memo (در صورت نیاز)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          type="text"
        />
      )}

      <div>
        <FloatingInput
          label="مقدار برداشت"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
        />
        <div className="flex justify-between pt-2 text-xs text-gray-500">
          <p>کل موجودی: 34.000 MOS</p>
          <button
            type="button"
            className="text-blue-500"
            onClick={() => setAmount("34.000")}
          >
            همه موجودی
          </button>
        </div>
      </div>
    </div>
  )}
</div>

      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? "در حال ارسال..." : "تایید"}
        </button>
      
      </div>

      
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
