import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useMemo, useContext } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import QRCode from "react-qr-code";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import { CryptoItem } from "../../types/crypto";
import { toast } from "react-toastify";
import IconClose from "../../assets/icons/Login/IconClose";
import { ThemeContext } from "../../context/ThemeContext";
import { formatEnglishNumber } from "../../utils/formatPersianNumber";

interface DepositDedicatedWalletProps {
  openCryptoModal: () => void;
  selectedCrypto: CryptoItem | null;
  cryptoDepositData: CryptoItem[];
  networks: Network[];
  walletsTxid: WalletTxid[];
  isDepositCoinsLoading: boolean;
}

interface Network {
  id: number;
  name: string;
  symbol?: string;
  tag?: number;
  addressRegex?: string;
  memoRegex?: string | null;
  locale?: { fa?: { name: string } };
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


export default function DepositDedicatedWallet({
  openCryptoModal,
  selectedCrypto,
  networks: networksFromParent,
  walletsTxid,
  isDepositCoinsLoading,
}: DepositDedicatedWalletProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Partial<CryptoItem & { network?: CoinNetwork[] }>>({});
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const { control, watch, setValue } = useForm();
  const selectedNetwork = watch("network");
  const isButtonActive = !!selectedCurrency.id && !!selectedNetwork;
  const networks = networksFromParent;
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  useEffect(() => {
    if (selectedCrypto) {
      setSelectedCurrency({
        id: selectedCrypto.id,
        name: selectedCrypto.locale?.fa?.name || selectedCrypto.symbol || "نام ناشناس",
        symbol: selectedCrypto.symbol || "UNK",
        priceBuy: selectedCrypto.priceBuy || "۰",
        balance: selectedCrypto.balance || "۰",
        isFont: selectedCrypto.isFont || false,
        color: selectedCrypto.color || "#000",
        icon: selectedCrypto.icon || "",
        network: (selectedCrypto as any).network || [],
      });
      setValue("currency", selectedCrypto.symbol);
      setShowWalletInfo(false);
      setWalletAddress(null);
    }
  }, [selectedCrypto, setValue]);

  const networkOptions = useMemo(() => {
    return (
      selectedCurrency.network?.map((net) => {
        const networkInfo = networks.find((n) => n.id === net.id);
        const networkName = networkInfo?.locale?.fa?.name || networkInfo?.name || net.id.toString();
        const networkSymbol = networkInfo?.name || "";
        return {
          value: net.id.toString(),
          label: `${networkName} (${networkSymbol})`,
        };
      }) || []
    );
  }, [selectedCurrency.network, networks]);

  const selectedNetworkLabel = useMemo(() => {
    const selectedOption = networkOptions.find((opt) => opt.value === selectedNetwork);
    return selectedOption ? selectedOption.label : "شبکه خود را انتخاب کنید";
  }, [selectedNetwork, networkOptions]);

  const openModalFromChild = () => {
    openCryptoModal();
  };


  const handleSubmit = () => {
    if (!selectedCurrency.id || !selectedNetwork) {
      toast.error("لطفاً ارز و شبکه را انتخاب کنید");
      return;
    }

    const wallet = walletsTxid.find((w) => w.id_coin === selectedCurrency.id && w.id_net === Number(selectedNetwork));

    if (wallet?.address) {
      setWalletAddress(wallet.address);
      setShowWalletInfo(true);
      toast.success("آدرس ولت با موفقیت نمایش داده شد");
    } else {
      toast.error("آدرس برای این شبکه موجود نیست");
    }
  };
  return (
    <div className="w-full" dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2 justify-between">
        <div className="flex items-center gap-2 ">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>
        <span className="icon-wrapper w-5 h-5 text-blue2">
          <IconClose />
        </span>
      </div>

      <div className="relative w-full mb-2">
        <button
          type="button"
          onClick={openModalFromChild}
          className="flex items-center justify-between w-full px-3 py-4 border rounded-md border-gray12 lg:bg-gray43 bg-gray38 focus:outline-none focus:ring-1 focus:ring-blue2"
        >
          {isDepositCoinsLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 skeleton-bg rounded-full " />
              <div className="h-5 w-32 skeleton-bg rounded-sm " />
            </div>
          ) : selectedCurrency.symbol && selectedCrypto ? (
            <span className="flex items-center gap-2">
              {selectedCurrency.isFont ? (
                <i className={`cf cf-${selectedCurrency.symbol?.toLowerCase()}`} style={{ color: selectedCurrency.color || "#000", fontSize: "24px" }} />
              ) : (
                <img
                  src={`https://api.payfa24.org/images/currency/${selectedCurrency.icon}`}
                  alt={selectedCurrency.symbol}
                  className="w-6 h-6 object-contain rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="text-black1 font-medium">{selectedCurrency.name || selectedCurrency.symbol}</span>
            </span>
          ) : (
            <span className="text-gray12">انتخاب رمز ارز</span>
          )}

          <svg
            className={`w-5 h-5 text-gray12 transition-opacity ${isDepositCoinsLoading ? "opacity-40" : "opacity-100"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1 pointer-events-none transition-all duration-200">انتخاب رمز ارز</label>
      </div>

      <div className="flex justify-between mb-8">
        <span className="text-sm text-gray5">موجودی {selectedCurrency.name || selectedCurrency.symbol}</span>

        {isDepositCoinsLoading ? (
          <div className="skeleton-bg w-32 h-5 rounded-sm"></div>
        ) : (
          <span dir="ltr" className="text-sm font-medium text-black0">
            {formatEnglishNumber(selectedCurrency.balance ?? "0")} {selectedCurrency.symbol}
          </span>
        )}
      </div>

      <Controller
        name="network"
        control={control}
        rules={{ required: "لطفا یک شبکه انتخاب کنید" }}
        render={({ field }) => (
          <FloatingSelect
            placeholder={selectedNetworkLabel || "انتخاب شبکه"}
            label="انتخاب شبکه"
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              setShowWalletInfo(false);
              setWalletAddress(null);
            }}
            options={networkOptions.map((option) => ({ value: option.value, label: option.label }))}
            placeholderClasses="text-black0 text-sm"
          />
        )}
      />

      <div className="flex justify-between mt-2 mb-10">
        <span className="text-sm text-gray5">حداقل واریز</span>

        {isDepositCoinsLoading ? (
          <div className="skeleton-bg w-20 h-5 rounded-sm"></div>
        ) : (
          <span dir="ltr" className="text-sm font-medium text-black0">
            {selectedCurrency.network?.[0]?.deposit_min ?? "—"} {selectedCurrency.symbol}
          </span>
        )}
      </div>

      {walletAddress && showWalletInfo && (
        <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
          <QRCode value={walletAddress} size={128} bgColor={theme === "dark" ? "#000000" : "#FFFFFF"} fgColor={theme === "dark" ? "#FFFFFF" : "#000000"} />
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
                {walletAddress.length > 30 ? `${walletAddress.slice(0, 15)}...${walletAddress.slice(-10)}` : walletAddress}
              </span>
              <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5 cursor-pointer">
                <IconCopy />
              </span>
            </div>
          </div>
        </div>
      )}

      {!showWalletInfo && (
        <div className="lg:mt-40 mt-8 mb-10">
          <button
            onClick={() => handleSubmit()}
            disabled={!isButtonActive}
            className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all ${
              !isButtonActive ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1"
            }`}
          >
            ساخت آدرس
          </button>

          <div className="mt-4" dir="ltr">
            <Accordion title="راهنمای واریز رمز ارز">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>از صحت آدرس صفحه‌ی پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید.</li>
                <li>مطمئن شوید مبلغ نمایش‌داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
              </ul>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
