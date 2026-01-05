import { Controller, useForm } from "react-hook-form";
import { useState, useEffect, useContext } from "react";
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
import { apiRequest } from "../../utils/apiClient";

interface DepositDedicatedWalletProps {
  openCryptoModal: () => void;
  selectedCrypto: CryptoItem | null;
  cryptoDepositData: CryptoItem[];
  networks: Network[];
  wallets: Wallet[];
  isDepositCoinsLoading: boolean;
  onRefreshData?: () => void;
  placeholderClasses?: string;
}

interface Network {
  id: number;
  name: string;
  locale?: { fa?: { name: string } };
}

interface CoinNetwork {
  id: number;
  deposit_min: string;
}

interface Wallet {
  address: string;
  address_tag: string | null;
  id_coin: number;
  id_net: number;
}

export default function DepositDedicatedWallet({
  openCryptoModal,
  selectedCrypto,
  networks: allNetworks,
  wallets,
  isDepositCoinsLoading,
  onRefreshData,
}: DepositDedicatedWalletProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<{
    id?: number;
    symbol?: string;
    name?: string;
    balance?: string;
    network?: CoinNetwork[];
  }>({});

  const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletTag, setWalletTag] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [networkOptions, setNetworkOptions] = useState<{ value: string; label: string }[]>([]);

  const { control, setValue } = useForm();
  const context = useContext(ThemeContext);
  if (!context) throw new Error("ThemeContext is undefined");
  const { theme } = context;

  useEffect(() => {
    if (selectedCrypto) {
      const newCurrency = {
        id: selectedCrypto.id,
        symbol: selectedCrypto.symbol,
        name: selectedCrypto.locale?.fa?.name || selectedCrypto.symbol,
        balance: selectedCrypto.balance,
        network: (selectedCrypto as any).network || [],
      };

      if (selectedCurrency.id !== selectedCrypto.id) {
        setSelectedCurrency(newCurrency);
        setValue("currency", selectedCrypto.symbol);
        setSelectedNetworkId("");
        setValue("network", "");
        setWalletAddress("");
        setWalletTag("");
      } else {
        setSelectedCurrency(newCurrency);
        setValue("currency", selectedCrypto.symbol);
      }

      const options = (newCurrency.network || []).map((net: any) => {
        const networkInfo = allNetworks.find((n) => n.id === net.id);
        const networkName = networkInfo?.locale?.fa?.name || networkInfo?.name || `شبکه ${net.id}`;
        const networkSymbol = networkInfo?.name || "";

        return {
          value: net.id.toString(),
          label: `${networkName} (${networkSymbol})`,
        };
      });

      setNetworkOptions(options);
    }
  }, [selectedCrypto, allNetworks, setValue]);
  useEffect(() => {
    if (selectedCurrency.id && selectedNetworkId) {
      checkForExistingAddress();
    }
  }, [selectedCurrency.id, selectedNetworkId, selectedCurrency.network, wallets]);

  const checkForExistingAddress = () => {
    if (!selectedCurrency.id || !selectedNetworkId) return;

    setTimeout(() => {
      const networkIdNum = Number(selectedNetworkId);

      const existingWallet = wallets.find((w) => w.id_coin === selectedCurrency.id && w.id_net === networkIdNum);

      if (existingWallet?.address) {
        // آدرس وجود داره - فوراً نمایش بده
        setWalletAddress(existingWallet.address);
        setWalletTag(existingWallet.address_tag || "");
      }
    }, 300);
  };

  const handleCreateWallet = async () => {
    if (!selectedCurrency.id || !selectedNetworkId || !selectedCurrency.symbol) {
      toast.error("لطفاً ارز و شبکه را انتخاب کنید");
      return;
    }

    setIsLoading(true);

    try {
      const networkIdNum = Number(selectedNetworkId);

      const response = await apiRequest<any>({
        url: "/wallets/crypto/deposit/create-wallet",
        method: "POST",
        data: {
          symbol: selectedCurrency.symbol,
          network: networkIdNum,
        } as any,
      });

      if (response.status === true) {
        toast.success(response.msg || "آدرس ساخته شد");

        if (response.wallet) {
          // مستقیماً آدرس را ست کن
          setWalletAddress(response.wallet.address);
          setWalletTag(response.wallet.address_tag || "");

          // if (onRefreshData) {
          //   setTimeout(() => {
          //     onRefreshData();
          //   }, 500);
          // }
        } else {
          if (onRefreshData) {
            await onRefreshData();
          }
        }
      } else {
        toast.error(response.msg || "خطا در ساخت آدرس");
      }
    } catch (err: any) {
      toast.error("در حال حاضر ادرسی وجود ندارد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCurrency?.id || !selectedNetworkId) return;
    if (walletAddress) return;

    const networkIdNum = Number(selectedNetworkId);

    const existing = wallets.find((w) => w.id_coin === selectedCurrency.id && w.id_net === networkIdNum && !!w.address);

    if (existing) {
      setWalletAddress(existing.address);
      setWalletTag(existing.address_tag || "");
    }
  }, [wallets, selectedCurrency?.id, selectedNetworkId, walletAddress]);

  // حالت‌های مختلف UI
  const hasAddress = !!walletAddress;
  const hasSelectedNetwork = !!selectedNetworkId;
  const hasSelectedCurrency = !!selectedCurrency.id;

  // فیلتر کردن ارزها برای ولت اختصاصی (فقط TRON و USDT)

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2 justify-between">
        <div className="flex items-center gap-2 ">
          <span className="w-6 h-6 icon-wrapper">
            <IconVideo />
          </span>
          <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>
        <span className="w-5 h-5 icon-wrapper">
          <IconClose />
        </span>
      </div>

      {/* انتخاب ارز */}
      <div className="relative w-full mb-2">
        <button
          type="button"
          onClick={openCryptoModal}
          className="flex items-center justify-between w-full px-3 py-[14px] border rounded-md border-gray12 lg:bg-gray43 bg-gray38 focus:outline-none focus:ring-1 focus:ring-blue2"
        >
          {isDepositCoinsLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 skeleton-bg rounded-full" />
              <div className="h-5 w-32 skeleton-bg rounded-sm" />
            </div>
          ) : selectedCurrency.symbol ? (
            <div className="flex items-center gap-2">
              {selectedCrypto?.isFont ? (
                <i
                  className={`cf cf-${selectedCurrency.symbol?.toLowerCase()}`}
                  style={{
                    color: selectedCrypto?.color || "#000",
                    fontSize: "24px",
                  }}
                />
              ) : (
                <img
                  src={`https://api.payfa24.org/images/currency/${selectedCrypto?.icon}`}
                  alt={selectedCurrency.symbol}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="text-black1 font-medium lg:text-base text-sm">{selectedCurrency.name}</span>
            </div>
          ) : (
            <span className="text-gray12">انتخاب رمز ارز</span>
          )}
          <svg className="w-5 h-5 text-gray12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <label className="absolute right-3 text-gray12 text-xs -top-2 lg:bg-gray43 bg-gray38 px-1">انتخاب رمز ارز</label>
      </div>

      {/* موجودی */}

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

      {/* انتخاب شبکه */}
      <Controller
        name="network"
        control={control}
        render={({ field }) => (
          <FloatingSelect
            placeholder="شبکه خود را انتخاب کنید "
            label="انتخاب شبکه"
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              setSelectedNetworkId(val);
            }}
            placeholderClasses="text-gray12 text-sm "
            options={networkOptions}
          />
        )}
      />

      <div className="mb-10 mt-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray5">حداقل واریز</span>

          {isDepositCoinsLoading ? (
            <div className="skeleton-bg w-20 h-5 rounded-sm"></div>
          ) : selectedCurrency.network?.[0]?.deposit_min != null ? (
            <span dir="ltr" className="text-sm font-medium text-black0">
              {selectedCurrency.network[0].deposit_min} {selectedCurrency.symbol}
            </span>
          ) : (
            <span className="text-sm text-gray10">0</span>
          )}
        </div>
      </div>

      {isLoading && !hasAddress ? null : null}

      {isLoading ? (
        <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
          <div className="py-5 px-6  items-center flex justify-center">
            <div className="skeleton-bg w-32 h-32 rounded-md"></div>
          </div>

          <div className="flex justify-between gap-2 w-full items-center">
            <span className="skeleton-bg w-20 h-4 rounded-sm"></span>
            <div className="skeleton-bg w-2/3 h-4 rounded-sm"></div>
          </div>
        </div>
      ) : (
        hasAddress && (
          <div className="rounded-lg border mb-10 border-gray19 py-6 px-4 flex flex-col justify-center items-center gap-6">
            <QRCode value={walletAddress} size={128} bgColor={theme === "dark" ? "#000000" : "#FFFFFF"} fgColor={theme === "dark" ? "#FFFFFF" : "#000000"} />
            <div className="flex justify-between w-full items-center">
              <span className="text-gray5 text-xs lg:text-sm">آدرس کیف پول</span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                  toast.info("کپی شد");
                }}
                className="flex items-center gap-1 justify-between cursor-pointer"
              >
                <span className="block text-black0 lg:text-sm text-xs break-all max-w-sm text-end">{walletAddress}</span>
                <span className="icon-wrapper lg:w-5 lg:h-5 w-4 h-4 text-gray5">
                  <IconCopy />
                </span>
              </div>
            </div>

            {walletTag && (
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray5 text-sm">Tag</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walletTag);
                      toast.info("Tag کپی شد");
                    }}
                    className="text-blue2 text-sm flex items-center gap-1"
                  >
                    <span className="w-4 h-4 icon-wrapper">
                      <IconCopy />
                    </span>
                    کپی
                  </button>
                </div>
                <div className="text-black0 p-3 rounded text-sm font-mono break-all">{walletTag}</div>
              </div>
            )}
          </div>
        )
      )}

      {!hasAddress && (
        <div className={`lg:mt-${isLoading ? "5" : "40"} mt-16 mb-10`}>
          <button
            onClick={handleCreateWallet}
            disabled={!hasSelectedCurrency || !hasSelectedNetwork || isLoading}
            className={`
        w-full py-3  lg:font-bold font-medium rounded-lg transition-all  
        flex items-center justify-center text-white2 lg:text-lg text-base
        ${
          !hasSelectedCurrency || !hasSelectedNetwork
            ? "bg-blue2 opacity-60 cursor-not-allowed"
            : isLoading
            ? "bg-blue2 opacity-70 cursor-not-allowed"
            : "bg-blue2 hover:bg-blue1 cursor-pointer"
        }
      `}
          >
            {!hasSelectedNetwork ? "ساخت آدرس" : isLoading ? "در حال ساخت آدرس ..." : "ساخت آدرس"}
          </button>

          <div dir="ltr" className="mt-4">
            <Accordion title="راهنمای واریز رمز ارز">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>با کلیک بر روی دکمه، آدرس جدید ساخته می‌شود</li>
                <li>حداقل مبلغ واریزی را رعایت کنید</li>
                <li>آدرس ساخته شده فقط برای شما معتبر است</li>
              </ul>
            </Accordion>
          </div>
        </div>
      )}

      {hasAddress && (
        <div className="mt-6 mb-10">
          <div dir="ltr">
            <Accordion title="راهنمای واریز رمز ارز">
              <ul className="list-disc pr-5 space-y-2 text-black1">
                <li>آدرس را با دقت کپی کنید</li>
                <li>حداقل مبلغ واریزی را رعایت کنید</li>
                <li>آدرس فقط برای شما ساخته شده است</li>
              </ul>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
