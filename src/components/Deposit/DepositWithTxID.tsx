import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import QRCode from "react-qr-code";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import TextField from "../InputField/TextField";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { CryptoItem } from "../../types/crypto";
import CryptoListModal from "../trade/CryptoListModal";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { toast } from "react-toastify";

interface TxidPostResponse {
  status: number;
  data?: { wallets_txid?: WalletTxid[] };
  message?: string;
}

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

const INITIAL_CURRENCY: Partial<CryptoItem & { network?: CoinNetwork[] }> = {
  name: "",
  icon: "",
  symbol: "",
  priceBuy: "0",
  balance: "0",
  network: [],
};

const formatPersianDigits = (num: number | string) => {
  const number = Number(num);
  if (isNaN(number)) return "۰";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return number.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
};

export default function DepositWithTxID() {
  const [isCryptoListModalOpen, setIsCryptoListModalOpen] = useState(false);
  const [cryptoListData, setCryptoListData] = useState<CryptoItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] =
    useState<Partial<CryptoItem & { network?: CoinNetwork[] }>>(
      INITIAL_CURRENCY
    );

  const [isDepositCoinsLoading, setIsDepositCoinsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false); // state برای باز و بسته شدن لیست
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // state برای آدرس ولت
  const { control, watch, setValue } = useForm();
  const { data: generalInfo, isLoading: isGeneralInfoLoading } =
    useGetGeneralInfo();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedNetwork = watch("network");
  const txidValue = watch("txid");
  const isButtonActive =
    !!selectedCurrency.symbol && !!selectedNetwork && !!txidValue;
  const networkOptions = useMemo(() => {
    return (
      selectedCurrency.network?.map((net) => {
        const networkInfo = networks.find((n) => n.id === net.id);
        const networkName =
          networkInfo?.locale?.fa?.name ||
          networkInfo?.name ||
          net.id.toString();
        const networkSymbol = networkInfo?.name || ""; 
        return {
          value: net.id.toString(),
          label: `${networkName} (${networkSymbol})`, 
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
      const depositRes = await apiRequest<{
        coins?: Array<{
          id: number;
          symbol: string;
          price: string;
          balance: string;
          network?: CoinNetwork[];
        }>;
        networks?: Network[];
        wallets_txid?: WalletTxid[];
      }>({
        url: "/wallets/crypto/deposit",
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
        const first = merged[0];
        setSelectedCurrency({
          id: first.id,
          name: first.locale?.fa?.name || first.symbol,
          icon: first.icon || "",
          symbol: first.symbol || "UNK",
          priceBuy: first.priceBuy || "0",
          balance: first.balance || "0",
          isFont: first.isFont || false,
          color: first.color || "#000",
          network: (first as any).network || [],
        });
      }


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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsNetworkDropdownOpen(false);
      }
    };

    if (isNetworkDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNetworkDropdownOpen]);
  // تولید آدرس ولت بعد از انتخاب ارز و شبکه
  const fetchWalletAddress = async () => {
    if (selectedCurrency.id && selectedNetwork) {
      const selectedCoin = cryptoListData.find(
        (coin) => coin.id === selectedCurrency.id
      );
      if (selectedCoin) {
        const depositRes = await apiRequest<{
          coins?: Array<{
            id: number;
            symbol: string;
            price: string;
            balance: string;
            network?: CoinNetwork[];
          }>;
          networks?: Network[];
          wallets_txid?: WalletTxid[];
        }>({
          url: "/wallets/crypto/deposit",
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
    if (!selectedCurrency.symbol || !selectedNetwork) {
      toast.error("لطفاً ارز و شبکه را انتخاب کنید");
      return;
    }

    try {

      const depositRes = await apiRequest<TxidPostResponse, { txid: string, network_id: number }>({
        url: `/wallets/crypto/deposit/txid/${selectedCurrency.symbol}`,
        method: "POST",
        data: {
          txid: watch("txid") || "",
          network_id: parseInt(selectedNetwork),
        },
      });

      if (depositRes.status === 200) {
        const matchingWallet = depositRes.data?.wallets_txid?.find(
          (wallet: WalletTxid) =>
            wallet.id_coin === selectedCurrency.id &&
            wallet.id_net === parseInt(selectedNetwork)
        );

        if (matchingWallet?.address) {
          setWalletAddress(matchingWallet.address);
          toast.success("آدرس ولت با موفقیت دریافت شد");
        } else {
          toast.error("آدرس ولت برای این شبکه یافت نشد");
          setWalletAddress(null);
        }
      } else {
        toast.success(depositRes.message || "درخواست شما با موفقیت ثبت شد");
      }
    } catch (err: any) {
      console.error("خطا در ارسال TxID:", err);
      toast.error(err.response?.data?.msg || "خطا در اتصال به سرور");
    }
  };

  return (
    <div className="w-full " dir="rtl">
      {/* ویدیو آموزشی */}
      <div className="mb-10">
        <div className="bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با TxID</span>
        </div>
      </div>

      {/* انتخاب ارز */}
      <div className="mb-2">
        <Controller
          name="currency"
          control={control}
          rules={{ required: "لطفا یک ارز انتخاب کنید" }}
          render={({ field }) => (
            <FloatingSelect
              placeholder={selectedCurrency.name || ""}
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
              placeholderIcon={
                selectedCurrency.icon || selectedCurrency.isFont ? (
                  selectedCurrency.isFont ? (
                    <i
                      className={`cf cf-${selectedCurrency.symbol?.toLowerCase()}`}
                      style={{
                        color: selectedCurrency.color,
                        fontSize: "28px",
                      }}
                    ></i>
                  ) : (
                    <img
                      src={`https://api.payfa24.org/images/currency/${selectedCurrency.icon}`}
                      alt={selectedCurrency.symbol}
                      className="w-7 h-7 rounded-full object-contain"
                    />
                  )
                ) : (
                  <div className="w-7 h-7 skeleton-bg rounded-full" />
                )
              }
              placeholderClasses="text-black0"
            />
          )}
        />
      </div>

      {/* موجودی - همیشه نمایش بده */}
      <div className="mb-10">
        <div className="flex justify-between ">
          <span className="text-sm text-gray5">موجودی</span>
          <span className="text-sm text-black0">
            {formatPersianDigits(selectedCurrency.balance || 0)}
            {selectedCurrency.symbol || ""}
          </span>
        </div>
      </div>

      {/* network */}
      <div className="mb-2 relative" ref={dropdownRef}>
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
              options={
                networkOptions.map((option) => ({
                  value: option.value,
                  label: (
                    <div className="flex items-center justify-between w-full py-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="lg:text-sm text-xs text-black0">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  ),
                })) || []
              }
              placeholderClasses="text-black0 text-sm"
            />
          )}
        />

        {/* Dropdown جدا */}
        {isNetworkDropdownOpen && networkOptions.length > 0 && (
          <div className="absolute top-[68px] left-0 right-0 z-50 bg-gray43 border border-gray-300 rounded-lg shadow-lg p-2 mt-1">
            {networkOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-end gap-3 p-3 flex-row-reverse rounded-md transition-colors w-full cursor-pointer hover:bg-gray12"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("network", option.value);
                  setIsNetworkDropdownOpen(false);
                }}
              >
                <span className="text-base text-black0">{option.label}</span>
                <input
                  type="radio"
                  value={option.value}
                  checked={watch("network") === option.value}
                  readOnly
                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-600"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* حداقل واریز - همیشه نمایش بده */}
      <div className="mb-10">
        <div className="flex justify-between">
          <span className="text-sm text-gray5">حداقل واریز</span>
          <span className="text-sm text-black0">
            {selectedCurrency.network && selectedCurrency.network.length > 0
              ? `${formatPersianDigits(
                  selectedCurrency.network[0].deposit_min
                )} ${selectedCurrency.symbol}`
              : "۰ " + (selectedCurrency.symbol || "")}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <Controller
          name="txid"
          control={control}
          render={({ field }) => (
            <TextField
              label="لینک تراکنش TxID"
              type={showPassword ? "text" : "password"}
              onIconClick={() => setShowPassword((prev) => !prev)}
              {...field}
              labelBgClass="lg:bg-gray43 bg-white4"
              inputBgClass="lg:bg-gray43 bg-white4"
            />
          )}
        />
      </div>
      {/* QR Code و آدرس ولت */}
      {walletAddress && (
        <div className="mb-10">
          <div className="rounded-lg border border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
            <QRCode value={walletAddress} size={128} />
            <div className="flex justify-between w-full">
              <span className="text-gray5 text-xs lg:text-sm">آدرس ولت</span>
                <div
                  onClick={() => {
                    if (walletAddress) {
                      navigator.clipboard.writeText(walletAddress);
                      toast.info(" کپی شد");
                    }
                  }}
                  className="flex items-center gap-1 justify-between cursor-pointer"
                >
                <span className="text-black0 lg:text-sm text-xs  max-w-sm">
                  {walletAddress}
                </span>
                <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5">
                  <IconCopy />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* دکمه و راهنما */}
      <div className="mb-10">
        <button
          onClick={handleSubmit}
          disabled={!isButtonActive}
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all ${
            !isButtonActive
              ? "opacity-60 cursor-not-allowed"
              : "opacity-100 hover:bg-blue1"
          }`}
        >
          ثبت اطلاعات
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
