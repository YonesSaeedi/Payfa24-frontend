import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useCallback, useMemo } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import QRCode from "react-qr-code"; // اضافه کردن پکیج react-qr-code
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { CryptoItem } from "../../types/crypto";
import CryptoListModal from "../trade/CryptoListModal";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { toast } from "react-toastify";

interface DepositApiResponse {
  coins?: Array<{
    id: number;
    symbol: string;
    price: string;
    balance: string;
    network?: CoinNetwork[];
  }>;
  networks?: Network[];
  wallets_txid?: WalletTxid[];
}
// تعریف نوع برای شبکه‌ها
interface Network {
  id: number;
  name: string;
  symbol?: string;
  tag?: number;
  addressRegex?: string;
  memoRegex?: string | null;
  locale?: {
    fa?: { name: string };
  };
}

interface CoinNetwork {
  id: number;
  deposit_min: string;
}

interface WalletTxid {
  id_coin: number;
  id_net: number;
  address: string;
  address_tag: string | null;
}

interface CryptoItemWithNetwork extends CryptoItem {
  id: number;
  network?: CoinNetwork[];
}

const formatPersianDigits = (num: number | string) => {
  const number = Number(num);
  if (isNaN(number)) return "۰";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

export default function DepositDedicatedWallet() {
  const [isCryptoListModalOpen, setIsCryptoListModalOpen] = useState(false);
  const [cryptoListData, setCryptoListData] = useState<CryptoItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<
    Partial<CryptoItem & { network?: CoinNetwork[] }>
  >({});
  const [isDepositCoinsLoading, setIsDepositCoinsLoading] = useState(false);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showWalletInfo, setShowWalletInfo] = useState(false);

  // state برای آدرس ولت
  const { control, watch } = useForm();
  const { data: generalInfo, isLoading: isGeneralInfoLoading } =
    useGetGeneralInfo();

  const selectedNetwork = watch("network");
  const networkOptions = useMemo(() => {
    return (
      selectedCurrency.network?.map((net) => {
        const networkInfo = networks.find((n) => n.id === net.id);
        const networkName =
          networkInfo?.locale?.fa?.name ||
          networkInfo?.name ||
          net.id.toString();
        const networkSymbol = networkInfo?.name || ""; // استفاده از name به عنوان نماد
        return {
          value: net.id.toString(),
          label: `${networkName} (${networkSymbol})`, // ترکیب مثل "ترون (TRC20)"
        };
      }) || []
    );
  }, [selectedCurrency.network, networks]);

  const selectedNetworkLabel = useMemo(() => {
    const selectedOption = networkOptions.find(
      (opt) => opt.value === selectedNetwork
    );
    return selectedOption ? selectedOption.label : "شبکه خود را انتخاب کنید";
  }, [selectedNetwork, networkOptions]);

  // دریافت و نگاشت داده‌های ارزها
  const fetchAndMergeCryptoData = useCallback(async () => {
    setIsDepositCoinsLoading(true);
    try {
      const depositRes = await apiRequest<DepositApiResponse>({
        url: "/api/wallets/crypto/deposit",
        method: "GET",
      });

      const depositCoins = depositRes?.coins ?? [];
      const infoCoins = generalInfo?.cryptocurrency ?? [];
      const allNetworks = depositRes?.networks ?? [];
      setNetworks(allNetworks);

      const merged: CryptoItem[] = depositCoins.map((coin: any) => {
        const info = infoCoins.find(
          (i: any) => i.symbol.toLowerCase() === coin.symbol.toLowerCase()
        );
        return {
          ...info,
          id: coin.id, // اضافه کردن id به CryptoItem
          symbol: coin.symbol || "UNK",
          name: info?.locale?.fa?.name || coin.symbol || "نام ناشناس",
          icon: info?.icon || "",
          priceBuy: (Number(coin.price) || 0).toString(),
          balance: (Number(coin.balance) || 0).toString(),
          isFont: info?.isFont || false,
          color: info?.color || "#000",
          network: coin.network || [],
        } as CryptoItem & { network: CoinNetwork[]; id: number };
      });

      setCryptoListData(merged);

      // تنظیم ارز پیش‌فرض (بدون انتخاب شبکه دیفالت)
      if (merged.length > 0) {
        const first = merged[0] as CryptoItemWithNetwork;
        setSelectedCurrency({
          id: first.id,
          name: first.locale?.fa?.name || first.symbol || "نام ناشناس",
          symbol: first.symbol || "UNK",
          icon: first.icon || "",
          priceBuy: first.priceBuy || "0",
          balance: first.balance || "0",
          isFont: first.isFont || false,
          color: first.color || "#000",
          network: first.network || [],
        });
      }

      console.log("Merged data:", merged);
      console.log("Networks:", allNetworks);
    } catch (err) {
      console.error("خطا در دریافت ارزها:", err);
    } finally {
      setIsDepositCoinsLoading(false);
    }
  }, [generalInfo]);

  // وقتی generalInfo آماده شد، داده‌ها را واکشی کن
  useEffect(() => {
    if (generalInfo && !isDepositCoinsLoading && cryptoListData.length === 0) {
      fetchAndMergeCryptoData();
    }
  }, [
    generalInfo,
    isDepositCoinsLoading,
    cryptoListData.length,
    fetchAndMergeCryptoData,
  ]);

  // تولید آدرس ولت بعد از انتخاب ارز و شبکه
  const fetchWalletAddress = async () => {
    if (selectedCurrency.id && selectedNetwork) {
      const selectedCoin = cryptoListData.find(
        (coin) => coin.id === selectedCurrency.id
      );
      if (selectedCoin) {
        const depositRes = await apiRequest<DepositApiResponse>({
          url: "/api/wallets/crypto/deposit",
          method: "GET",
        });
        const walletEntry = depositRes.wallets_txid?.find(
          (wallet: WalletTxid) =>
            wallet.id_coin === selectedCoin.id &&
            wallet.id_net === parseInt(selectedNetwork)
        );
        return walletEntry?.address || null;
      }
    }
    return null;
  };

  useEffect(() => {
    fetchWalletAddress()
      .then((address) => {
        setWalletAddress(address);
      })
      .catch((err) => {
        console.error("خطا در دریافت آدرس:", err);
        setWalletAddress(null);
      });
  }, [selectedCurrency, selectedNetwork, cryptoListData]);

  const openCryptoListModal = () => {
    setIsCryptoListModalOpen(true);
  };

  const handleCurrencySelect = (
    crypto: CryptoItem & { network?: CoinNetwork[] }
  ) => {
    setSelectedCurrency({
      id: crypto.id, // اضافه کردن id به selectedCurrency
      name: crypto.locale?.fa?.name || crypto.symbol || "نام ناشناس",
      symbol: crypto.symbol || "UNK",
      priceBuy: crypto.priceBuy || "۰",
      balance: crypto.balance || "۰",
      isFont: crypto.isFont || false,
      color: crypto.color || "#000",
      icon: crypto.icon || "",
      network: crypto.network || [],
    });
    setIsCryptoListModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedCurrency.id || !selectedNetwork) {
      alert("لطفاً ارز و شبکه را انتخاب کنید");
      return;
    }

    try {
      const depositRes = await apiRequest<DepositApiResponse>({
        url: "/api/wallets/crypto/deposit",
        method: "GET",
      });

      // پیدا کردن آدرس ولت بر اساس ارز و شبکه انتخاب‌شده
      const walletEntry = depositRes.wallets_txid?.find(
        (wallet: WalletTxid) =>
          wallet.id_coin === selectedCurrency.id &&
          wallet.id_net === parseInt(selectedNetwork)
      );

      if (walletEntry?.address) {
        setWalletAddress(walletEntry.address);
        setShowWalletInfo(true); // ✅ QR و آدرس رو نشون بده
      } else {
        toast.error("آدرس ولت برای این شبکه یافت نشد.");
        setWalletAddress(null);
        setShowWalletInfo(false);
      }
    } catch (err) {
      console.error("خطا در دریافت آدرس:", err);
      setShowWalletInfo(false);
    }
  };

  return (
    <div className="w-full my-10" dir="rtl">
      {/* ویدیو آموزشی */}
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span>ویدیو آموزشی واریز با TxID</span>
      </div>

      {/* انتخاب ارز */}
      <Controller
        name="currency"
        control={control}
        rules={{ required: "لطفا یک ارز انتخاب کنید" }}
        render={({ field }) => (
          <FloatingSelect
            placeholder={selectedCurrency.name || ""}
            placeholderIcon={
              !selectedCurrency.name ? (
                <div className="w-7 h-7 skeleton-bg rounded-full" />
              ) : selectedCurrency.icon || selectedCurrency.isFont ? (
                selectedCurrency.isFont ? (
                  <i
                    className={`cf cf-${
                      selectedCurrency.symbol?.toLowerCase() ?? "unknown"
                    }`}
                    style={{
                      color: selectedCurrency.color || "#000",
                      fontSize: "28px",
                    }}
                  />
                ) : (
                  <img
                    src={`https://api.payfa24.org/images/currency/${selectedCurrency.icon}`}
                    alt={selectedCurrency.symbol || "currency"}
                    className="w-7 h-7 rounded-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                )
              ) : (
                <div className="w-7 h-7 skeleton-bg rounded-full" />
              )
            }
            label="انتخاب رمز ارز"
            options={cryptoListData.map((crypto) => ({
              value: crypto.symbol,
              label: crypto.name || crypto.symbol,
            }))}
            value={field.value}
            onChange={(value) => {
              const selected = cryptoListData.find(
                (crypto) => crypto.symbol === value
              );
              if (selected) handleCurrencySelect(selected);
              field.onChange(value);
            }}
            onOpen={openCryptoListModal}
            placeholderClasses="text-black0"
          />
        )}
      />
      {selectedCurrency && (
        <div className="flex justify-between mt-2 mb-10">
          <span className="text-sm text-gray5">موجودی</span>
          <span className="text-sm text-black0">
            {formatPersianDigits(selectedCurrency.balance ?? "0")}{" "}
            {selectedCurrency.symbol}
          </span>
        </div>
      )}

      {/* انتخاب شبکه */}
      {/* انتخاب شبکه - دقیقاً مثل فیش بانکی */}
      <Controller
        name="network"
        control={control}
        rules={{ required: "لطفا یک شبکه انتخاب کنید" }}
        render={({ field }) => (
          <FloatingSelect
            placeholder={selectedNetworkLabel || "انتخاب شبکه"}
            label="انتخاب شبکه"
            value={field.value}
            onChange={field.onChange}
            options={networkOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            placeholderClasses="text-black0 text-sm"
          />
        )}
      />

      {/* حداقل واریز و تعداد شبکه‌ها */}
      {selectedCurrency.network && selectedCurrency.network.length > 0 && (
        <div className="flex justify-between mt-2 mb-10">
          <span className="text-sm text-gray5">حداقل واریز</span>
          <span className="text-sm text-black0">
            {formatPersianDigits(selectedCurrency.network[0].deposit_min)}{" "}
            {selectedCurrency.symbol}
          </span>
        </div>
      )}

      {/* QR Code و آدرس ولت */}
      {walletAddress && (
        <>
          {showWalletInfo && walletAddress && (
            <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
              <QRCode value={walletAddress} size={128} />
              <div className="flex justify-between w-full items-center">
                <span className="text-gray5 text-xs lg:text-sm">آدرس ولت</span>
                <div
                  onClick={() => {
                    if (walletAddress) {
                      navigator.clipboard.writeText(walletAddress);
                      toast.info(" کپی شد");
                    }
                  }}
                  className="flex items-center gap-1 justify-between"
                >
                  <span className=" block text-black0 lg:text-sm text-xs break-all text-end max-w-sm cursor-pointer">
                    {walletAddress}
                  </span>
                  <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5 cursor-pointer">
                    <IconCopy />
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ثبت اطلاعات و راهنما */}
      {!showWalletInfo && (
        <div className="lg:mt-40 mt-8 mb-10">
          <button
            className={`w-full py-3 font-bold text-lg rounded-lg transition-colors ${
              selectedCurrency.id && selectedNetwork
                ? "bg-blue2 text-white2 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedCurrency.id || !selectedNetwork}
            onClick={() => handleSubmit()}
          >
            ساخت آدرس
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="TxID راهنمای واریز رمز ارز با ">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>
                  از صحت آدرس صفحه‌ی پرداخت و بودن در یکی از سایت‌های سامانه‌ی
                  شاپرک مطمئن شوید.
                </li>
                <li>
                  مطمئن شوید مبلغ نمایش‌داده‌شده در صفحه‌ی پرداخت درست باشد.
                </li>
              </ul>
            </Accordion>
          </div>
        </div>
      )}

      {/* مدال */}
      {isCryptoListModalOpen && (
        <CryptoListModal
          cryptoListData={cryptoListData}
          setIsCryptoListModalOpen={setIsCryptoListModalOpen}
          setCurrentCryptoCurrency={handleCurrencySelect}
          isCryptoListLoading={isGeneralInfoLoading || isDepositCoinsLoading}
        />
      )}
    </div>
  );
}
