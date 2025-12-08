import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useMemo, useRef, useContext } from "react";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import QRCode from "react-qr-code";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import TextField from "../InputField/TextField";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import { CryptoItem } from "../../types/crypto";
import { toast } from "react-toastify";
import IconClose from "../../assets/icons/Login/IconClose";
import { ThemeContext } from "../../context/ThemeContext";
import { formatEnglishNumber } from "../../utils/formatPersianNumber";

interface DepositWithTxIDProps {
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


export default function DepositWithTxID({ openCryptoModal, selectedCrypto, networks: networksFromParent, walletsTxid, isDepositCoinsLoading }: DepositWithTxIDProps) {
  const networks = networksFromParent;
  const [selectedCurrency, setSelectedCurrency] = useState<Partial<CryptoItem & { network?: CoinNetwork[] }>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showTxidModalText, setShowTxidModalText] = useState(false);
  const { control, watch, setValue } = useForm();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedNetwork = watch("network");
  const txidValue = watch("txid");
  const isButtonActive = !!selectedCurrency.symbol && !!selectedNetwork && !!txidValue;
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;
  // وقتی selectedCrypto از والد تغییر کرد، state داخلی رو آپدیت کن
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    if (!selectedCurrency.id || !selectedNetwork) return;

    const wallet = walletsTxid.find((w) => w.id_coin === selectedCurrency.id && w.id_net === Number(selectedNetwork));

    setWalletAddress(wallet?.address || null);
  }, [selectedCurrency, selectedNetwork, walletsTxid]);

  const openModalFromChild = () => {
    openCryptoModal();
  };

  const handleSubmit = async () => {
    if (!selectedCurrency.id || !selectedNetwork || !txidValue) {
      toast.error("همه فیلدها الزامی است");
      return;
    }

    try {
      await apiRequest({
        url: `/wallets/crypto/deposit/txid/${selectedCurrency.symbol}`,
        method: "POST",
        data: { txid: txidValue, network_id: Number(selectedNetwork) },
      });

      toast.success("تراکنش با موفقیت ثبت شد");

      const wallet = walletsTxid.find((w) => w.id_coin === selectedCurrency.id && w.id_net === Number(selectedNetwork));
      if (wallet?.address) setWalletAddress(wallet.address);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "خطا در ثبت تراکنش");
    }
  };

  const toggleTxidModal = () => {
    setShowTxidModalText((prev) => !prev);
  };

  useEffect(() => {
    if (selectedCurrency.id) {
      setWalletAddress(null);
      setValue("network", "");
    }
  }, [selectedCurrency.id, setValue]);

  useEffect(() => {
    if (!selectedCurrency.id || !selectedNetwork) return;
    if (selectedNetwork === "") return;

    const wallet = walletsTxid.find((w) => w.id_coin === selectedCurrency.id && w.id_net === Number(selectedNetwork));
    setWalletAddress(wallet?.address || null);
  }, [selectedCurrency.id, selectedNetwork, walletsTxid]);

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-10">
        <div className="bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2 justify-between">
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
      </div>

      <div className="relative w-full mb-2">
        <button
          type="button"
          onClick={openModalFromChild}
          className="flex items-center  justify-between w-full px-3 py-[14px] border rounded-md border-gray12 lg:bg-gray43 bg-gray38 focus:outline-none focus:ring-1 focus:ring-blue2"
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
              <span className="text-black1 font-medium lg:text-base text-sm">{selectedCurrency.name || selectedCurrency.symbol}</span>
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

      <div className="mb-10">
        <div className="flex justify-between">
          <span className="text-sm text-gray5">موجودی {selectedCurrency.name || selectedCurrency.symbol}</span>

          {isDepositCoinsLoading ? (
            <div className="skeleton-bg w-32 h-5 rounded-sm"></div>
          ) : (
            <span dir="ltr" className="text-sm font-medium text-black0">
              {formatEnglishNumber(selectedCurrency.balance ?? "0")} {selectedCurrency.symbol || ""}
            </span>
          )}
        </div>
      </div>

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
              options={networkOptions.map((option) => ({
                value: option.value,
                label: (
                  <div className="flex items-center justify-between w-full py-1 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm  text-black0">{option.label}</span>
                    </div>
                  </div>
                ),
              }))}
              placeholderClasses="text-gray12 text-sm"
            />
          )}
        />
      </div>

      <div className="mb-10">
        <div className="flex justify-between">
          <span className="text-sm text-gray5">حداقل واریز</span>

          {isDepositCoinsLoading ? (
            <div className="skeleton-bg w-20 h-5 rounded-sm"></div>
          ) : selectedCurrency.network?.[0]?.deposit_min != null ? (
            <span dir="ltr" className="text-sm font-medium text-black0">
              {selectedCurrency.network[0].deposit_min} {selectedCurrency.symbol}
            </span>
          ) : (
            <span className="text-sm text-gray10">-</span>
          )}
        </div>
      </div>

      {selectedCurrency.id && selectedNetwork && !isDepositCoinsLoading && !walletAddress && (
        <div className="mb-5 lg:text-sm text-xs  text-red1 ">
          امکان ثبت تراکنش با TXID در حال حاضر فعال نیست.
        </div>
      )}


      {walletAddress && (
        <div className="mb-10">
          <div className="rounded-lg border border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
            <QRCode value={walletAddress} size={128} bgColor={theme === "dark" ? "#000000" : "#FFFFFF"} fgColor={theme === "dark" ? "#FFFFFF" : "#000000"} />
            <div className="w-full items-center flex justify-between">
              <span className="text-gray5 text-xs lg:text-sm w-2/4 lg:w-1/5">آدرس کیف پول</span>
              <div
                dir="ltr"
                onClick={() => {
                  if (walletAddress) {
                    navigator.clipboard.writeText(walletAddress);
                    toast.info("کپی شد");
                  }
                }}
                className="mt-1 flex items-center gap-1 cursor-pointer"
              >
                <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray12">
                  <IconCopy />
                </span>
                <span className="text-black0 lg:text-sm text-xs break-all hover:text-blue2">{walletAddress}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
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
              inputBgClass="lg:bg-gray43 bg-white4 border !border-gray12 !rounded-lg"
            />
          )}
        />
        <p onClick={toggleTxidModal} className="mb-8 cursor-pointer hover:text-blue1  text-left lg:text-sm text-xs font-bold text-blue2">
          TXID چیست ؟
        </p>
      </div>

      <div className="mb-10">
        <button
          onClick={handleSubmit}
          disabled={!isButtonActive}
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all ${
            !isButtonActive ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1"
          }`}
        >
          ثبت اطلاعات
        </button>
        <div className="mt-4" dir="ltr">
          <Accordion title="TxID راهنمای واریز رمز ارز با ">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>از صحت آدرس صفحه‌ی پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید.</li>
              <li>مطمئن شوید مبلغ نمایش‌داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
            </ul>
          </Accordion>
        </div>
      </div>

      {showTxidModalText && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60" onClick={toggleTxidModal}>
          <div className="bg-gray38 rounded-xl p-6 w-11/12 max-w-lg  shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-black0">(TXID) چیست؟</h3>
              <button onClick={toggleTxidModal} className="text-gray12 hover:text-black0">
                <span className="icon-wrapper w-6 h-6">
                  <IconClose />
                </span>
              </button>
            </div>

            <div className=" space-y-3 lg:text-sm text-xs text-black0 w-full">
              <p>لینک تراکنش یا Hash یا همان TxID یک عبارت 64 کاراکتری بوده که ترکیبی از اعداد و حروف است و جهت رهگیری تراکنش استفاده می شود.</p>
              <p className="break-all text-left">به عنوان مثال: 3fc9153b7bdffcdfae092092320612c9c3c94351f600d80ad75f3915909b488b</p>
              <p>ممکن است TxID را کمی با تأخیر دریافت نمایید، لذا پس از انجام تراکنش چند دقیقه صبر کرده و پس از دریافت درخواست را ثبت نمایید.</p>
              <p>
                دقت نمایید کیف پولی که ازش استفاده میکنید بهتون لینک تراکنش میدهد یا خیر در صورتی که لینک تراکنش نداد از انتقال به کیف پول برنامه ما جددا خودداری کنید چون امکان
                رهگیری و اعتبار سنجی وجود نخواهد داشت .
              </p>
              <p>
                چنان چه TxID را به درستی وارد نکرده باشید امکان صحت سنجی وجود نخواهد داشت . دقت نمایید هنگامی که شما انتقال را انجام می دهید، مقداری نیز به عنوان کارمزد توسط سرویس
                دهنده کیف پول شما کسر می شود، شما می بایست مقداری که به کیف پول برنامه ما انتقال شده را وارد نمایید.
              </p>
              <p>از ثبت سفارش بیش از یک بار جددا خودداری فرمایید ، چون سیستم قبول نخواهد کرد .</p>
            </div>

            <button onClick={toggleTxidModal} className="mt-6 w-full py-2 bg-blue2 text-white2 rounded-lg font-medium hover:bg-blue1 transition-colors text-sm lg:text-base">
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
