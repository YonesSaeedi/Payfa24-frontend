import { useEffect, useState, useRef, useCallback } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import DepositForm from "../../components/Deposit/DepositForm";
import CardToCardTransfer from "../../components/Deposit/CardToCardTransfer";
import DepositWithTxID from "../../components/Deposit/DepositWithTxID";
import DepositDedicatedWallet from "../../components/Deposit/DepositDedicatedWallet";
import DepositwithIdentifier from "../../components/Deposit/DepositWithIdentifier";
import DepositBankReceipt from "../../components/Deposit/DepositBankReceipt";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import useGetGeneralInfo from "../../hooks/useGetGeneralInfo";
import { CryptoItem } from "../../types/crypto";
import IconBank from "../../assets/icons/Deposit/IconBank";
import IconArrowRight from "../../assets/icons/Deposit/IconArrowRight";
import IconIDentifier from "../../assets/icons/Deposit/Deposit/IconIDentifier";
import IconConvertCard from "../../assets/icons/Deposit/IconConvertCard";
import IconReceipt from "../../assets/icons/Deposit/Deposit/IconReceipt";
import IconWallet from "../../assets/icons/Deposit/IconWallet";
import IconLink from "../../assets/icons/Deposit/IconLink";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import CryptoListModal from "../../components/trade/CryptoListModal";
import { AxiosError } from "axios";

// ---------- کارت‌های رسید واریز (Receipt) ----------
interface ReceiptCard {
  account_name: string;
  account_number: string;
  iban_number: string;
  name_bank: string;
  card_number: string;
}

interface ReceiptData {
  status: boolean;
  list_cards: ReceiptCard[];
}

// ---------- کارت‌های کاربر (لیست کارت‌های ثبت‌شده) ----------
interface UserCard {
  id: number;
  card: string; // شماره کارت
  bank: string; // نام بانک
  iban: string | null; // شماره شبا
}

// ---------- محدودیت‌های کیف پول داخلی ----------
interface WalletLimits {
  min_deposit: string | number;
  max_deposit: string | number;
}

// ---------- تنظیمات فعال/غیرفعال بودن روش‌های واریز ----------
interface DepositMethodStatus {
  isDisable: boolean;
  isHidden: boolean;
}

interface DepositMethods {
  gateway: DepositMethodStatus;
  card: DepositMethodStatus;
  receipt: DepositMethodStatus;
  gatewayId: DepositMethodStatus;
}

// ---------- پاسخ شناسه واریز (deposit_id) ----------
interface DepositIdentifier {
  destination_bank: string;
  destination_owner_name: string;
  destination_iban: string;
  destination_account_number: string;
  deposit_id: number | string;
}

interface DepositIdentifierResponse extends DepositIdentifier {
  list_deposit_id?: Array<{
    deposit_id: string;
    id_card: number;
  }>;
}

// ---------- داده کامل صفحه واریز فیات ----------
interface WalletFiatData {
  wallet?: {
    internal?: WalletLimits;
  };

  list_cards?: UserCard[];

  receipt?: ReceiptData;

  cardToCard?: any; // اگر ساختار مشخصی داره بعداً تایپش کن

  list_deposit_id?: Array<{
    deposit_id: string;
    id_card: number;
  }>;

  deposit_id?: DepositIdentifier;

  depositMethods: DepositMethods;
}

// ---------- پراپس صفحه واریز ----------
type DepositTab = "gateway" | "identifier" | "card" | "receipt" | "wallet" | "txid";

interface DepositPageProps {
  selected?: DepositTab;
}

// ---------- والت کریپتو (برای شبکه‌های مختلف) ----------
interface Wallet {
  address: string;
  address_tag: string | null;
  id_coin: number;
  id_net: number;
}

export type { WalletFiatData, ReceiptCard, ReceiptData, UserCard, DepositMethods, DepositIdentifierResponse, DepositTab, DepositPageProps, Wallet };

export default function DepositPage({ selected = "gateway" }: DepositPageProps) {
  const [depositNetworks, setDepositNetworks] = useState<[]>([]);
  const [depositWalletsTxid, setDepositWalletsTxid] = useState<[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    switch (selected) {
      case "identifier":
        return "Identifier";
      case "card":
        return "CardToCard";
      case "receipt":
        return "Bank Receipt:";
      case "wallet":
        return "DedicatedWallet";
      case "txid":
        return "DepositWithTxID";
      default:
        return "closeDeal";
    }
  });

  const { data: generalInfo } = useGetGeneralInfo();

  const location = useLocation();
  const [fiatData, setFiatData] = useState<WalletFiatData | null>(null);
  const [identifierData, setIdentifierData] = useState<DepositIdentifierResponse | null>(null);
  const [isCreatingIdentifier, setIsCreatingIdentifier] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoItem | null>(null);
  const [loadingBankCards, setLoadingBankCards] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isDedicatedWalletModalOpen, setIsDedicatedWalletModalOpen] = useState(false);
  const [isTxidModalOpen, setIsTxidModalOpen] = useState(false);
  const hasFetchedCryptoData = useRef(false);
  const hasFetchedFiatData = useRef(false);
  const [cryptoListData, setCryptoListData] = useState<CryptoItem[]>([]);
  const filteredCryptoForDedicatedWallet = cryptoListData.filter((crypto) => crypto.symbol === "USDT" || crypto.symbol === "TRX");
  const [isDepositCoinsLoading, setIsDepositCoinsLoading] = useState(false);
  const [depositMethods, setDepositMethods] = useState<WalletFiatData["depositMethods"] | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    switch (type) {
      case "identifier":
        setSelectedOption("Identifier");
        break;
      case "card":
        setSelectedOption("CardToCard");
        break;
      case "receipt":
        setSelectedOption("Bank Receipt:");
        break;
      case "wallet":
        setSelectedOption("DedicatedWallet");
        break;
      case "txid":
        setSelectedOption("DepositWithTxID");
        break;
      case "gateway":
        setSelectedOption("closeDeal");
        break;
    }
  }, [location.search]);

  const refreshData = useCallback(async () => {
    try {
      const res = await apiRequest<any>({
        url: "/wallets/crypto/deposit",
        method: "GET",
      });

      const depositCoins = res?.coins ?? [];
      const walletsData = res?.wallets ?? [];
      const infoCoins = generalInfo?.cryptocurrency ?? [];

      const merged = depositCoins.map((coin: any) => {
        const info = infoCoins.find((i: any) => i.symbol.toLowerCase() === coin.symbol.toLowerCase());
        return {
          ...info,
          id: coin.id,
          symbol: coin.symbol || "UNK",
          name: info?.locale?.fa?.name || coin.symbol || "نام ناشناس",
          icon: info?.icon || "",
          balance: coin.balance || "0",
          balance_available: coin.balance_available || "0",
          network: coin.network || [],
          isFont: info?.isFont || false,
          color: info?.color || "#000",
          priceBuy: coin.price || info?.priceBuy || "0",
        } as CryptoItem & { id: number; network: any[] };
      });

      setCryptoListData(merged);
      setDepositNetworks(res?.networks ?? []);
      setDepositWalletsTxid(res?.wallets_txid ?? []);
      setWallets(walletsData);
    } catch (err) {
      toast.error((err as AxiosError<{ msg: string }>)?.response?.data?.msg || "خطا در رفرش داده‌های واریز");
    }
  }, [generalInfo]);
  // 1. تابع را خارج از useEffect تعریف کن (در والد)
  const fetchFiatData = async () => {
    try {
      setLoadingBankCards(true);
      const response = await apiRequest<WalletFiatData>({
        url: "/wallets/fiat",
        method: "GET",
      });

      setFiatData(response);
      setDepositMethods(response.depositMethods);

      if (response.deposit_id || response.list_deposit_id) {
        setIdentifierData({
          destination_bank: response.deposit_id?.destination_bank || "",
          destination_owner_name: response.deposit_id?.destination_owner_name || "",
          destination_iban: response.deposit_id?.destination_iban || "",
          destination_account_number: response.deposit_id?.destination_account_number || "",
          deposit_id: response.deposit_id?.deposit_id || "",
          list_deposit_id: response.list_deposit_id,
        });
      }

      hasFetchedFiatData.current = true;
    } catch (err) {
      toast.error("خطا در بارگذاری اطلاعات واریز");
    } finally {
      setLoadingBankCards(false);
    }
  };

  const openDedicatedWalletModal = () => {
    setIsDedicatedWalletModalOpen(true);
  };

  const openTxidModal = () => {
    setIsTxidModalOpen(true);
  };

  // 2. useEffect فقط یک بار تابع را صدا بزند
  useEffect(() => {
    if (!hasFetchedFiatData.current) {
      fetchFiatData();
    }
  }, []);

  useEffect(() => {
    if (hasFetchedCryptoData.current || !generalInfo) return;

    const fetchCryptoData = async () => {
      setIsDepositCoinsLoading(true);
      try {
        const res = await apiRequest<any>({ url: "/wallets/crypto/deposit", method: "GET" });

        const depositCoins = res?.coins ?? [];
        const walletsData = res?.wallets ?? [];
        setWallets(walletsData);

        const infoCoins = generalInfo?.cryptocurrency ?? [];
        const merged = depositCoins.map((coin: any) => {
          const info = infoCoins.find((i: any) => i.symbol.toLowerCase() === coin.symbol.toLowerCase());
          return {
            ...info,
            id: coin.id,
            symbol: coin.symbol || "UNK",
            name: info?.locale?.fa?.name || coin.symbol || "نام ناشناس",
            icon: info?.icon || "",
            balance: coin.balance || "0",
            network: coin.network || [],
            isFont: info?.isFont || false,
            color: info?.color || "#000",
            priceBuy: coin.price || info?.priceBuy || "0",
          } as CryptoItem & { id: number; network: any[] };
        });

        setCryptoListData(merged);
        setDepositNetworks(res?.networks ?? []);
        setDepositWalletsTxid(res?.wallets_txid ?? []);

        hasFetchedCryptoData.current = true;
      } catch (err) {
        toast.error("خطا در بارگذاری لیست ارزها");
      } finally {
        setIsDepositCoinsLoading(false);
      }
    };

    fetchCryptoData();
  }, [generalInfo]);

  useEffect(() => {
    if (!cryptoListData.length) return;

    if (selectedOption === "DepositWithTxID") {
      setSelectedCrypto(cryptoListData[0]);
    }

    if (selectedOption === "DedicatedWallet") {
      const dedicatedList = cryptoListData.filter((c) => c.symbol === "USDT" || c.symbol === "TRON");

      if (dedicatedList.length > 0) {
        setSelectedCrypto(dedicatedList[0]);
      }
    }
  }, [selectedOption, cryptoListData]);

  const handleCreateIdentifier = useCallback(async (cardId: number) => {
    setIsCreatingIdentifier(true);
    try {
      const res = await apiRequest<DepositIdentifierResponse, { id: number }>({
        url: "/wallets/fiat/deposit/gateway-id",
        method: "POST",
        data: { id: cardId },
      });

      const data = res.deposit_id || res;
      if (typeof data === "object" && data !== null && "deposit_id" in data && data.deposit_id !== undefined && data.deposit_id !== null) {
        setIdentifierData(data as DepositIdentifierResponse);
        toast.success("شناسه واریز ساخته شد");
      } else {
        setIdentifierData(null);
        toast.success("شناسه واریز ساخته شد");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "قبلاً شناسه ساخته شده");
    } finally {
      setIsCreatingIdentifier(false);
    }
  }, []);

  const handleStart = () => setStarted(true);

  const isMethodisHidden = (method: keyof WalletFiatData["depositMethods"]) => {
    return depositMethods?.[method]?.isHidden !== true;
  };

  const isMethodDisabled = (method: keyof WalletFiatData["depositMethods"]) => {
    return depositMethods?.[method]?.isDisable === true;
  };

  const depositFormMessages = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید، چراکه درصورت بروز هرگونه مشکل احتمالی، مسئولیت قضایی ناشی از این امر به عهده کاربر است و ارز هشت مسئولیتی در این زمینه ندارد.",
    "جهت واریز وجه، حتما باید از کارت‌های بانکی به نام خودتان که در بخش کاربری ثبت و تایید شده است، استفاده نمایید.",
  ];

  const DepositWithIdentifierMessages = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید...",
    "کارمزد واریز با شناسه: %0.05 مبلغ واریزی میباشد...",
  ];

  let currentAlertMessages: string[] = [];
  if (selectedOption === "closeDeal") currentAlertMessages = depositFormMessages;
  else if (selectedOption === "Identifier") currentAlertMessages = DepositWithIdentifierMessages;

  const minDeposit = Number(fiatData?.wallet?.internal?.min_deposit ?? 200000);
  const maxDeposit = Number(fiatData?.wallet?.internal?.max_deposit ?? 200000000);
  const bankCards = fiatData?.list_cards ?? [];
  const receiptAccounts = fiatData?.receipt?.list_cards ?? [];
  const cardToCardInfo = fiatData?.cardToCard ?? { transaction: null, card: null };

  const rightOptions = [
    {
      id: "closeDeal",
      methodKey: "gateway" as const,
      Icon: <IconBank />,
      Title: "واریز تومانی با درگاه پرداخت",
      description: `واریز حداکثر تا ${formatPersianDigits((maxDeposit / 1_000_000).toString())} میلیون تومان`,
      button: "پرداخت در لحظه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "Identifier",
      methodKey: "gatewayId" as const,
      Icon: <IconIDentifier />,
      Title: "واریز تومانی با شناسه",
      description: "واریز وجه به صورت نامحدود",
      button: `پرداخت در ${formatPersianDigits(20)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "CardToCard",
      methodKey: "card" as const,
      Icon: <IconConvertCard />,
      Title: "واریز تومانی با کارت به کارت",
      description: `واریز حداکثر تا ${formatPersianDigits((maxDeposit / 1_000_000).toString())} میلیون تومان`,
      button: `پرداخت در ${formatPersianDigits(30)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "Bank Receipt:",
      methodKey: "receipt" as const,
      Icon: <IconReceipt />,
      Title: "واریز تومانی با فیش بانکی",
      description: "واریز وجه به صورت نامحدود",
      button: `پرداخت در ${formatPersianDigits(20)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "DedicatedWallet",
      Icon: <IconWallet />,
      Title: "واریز رمز ارز با ولت اختصاصی",
      description: "بدون نیاز به TxID , واریز خودکار و سریع",
      button: "",
      IconMore: <IconArrowRight />,
    },
    {
      id: "DepositWithTxID",
      Icon: <IconLink />,
      Title: "واریز رمز ارز با TxID",
      description: "برای واریز از صرافی با کیف پول دیگر",
      button: "",
      IconMore: <IconArrowRight />,
    },
  ];



  const handleCryptoSelect = (crypto: CryptoItem) => {
    setSelectedCrypto(crypto);
  };

  const renderStep = () => {
    switch (selectedOption) {
      case "closeDeal":
        return <DepositForm minDeposit={minDeposit} maxDeposit={maxDeposit} isDataLoaded={!!fiatData} />;
      case "Identifier":
        return (
          <DepositwithIdentifier
            loadingBankCards={loadingBankCards}
            cards={bankCards}
            identifierData={identifierData}
            onCreateIdentifier={handleCreateIdentifier}
            isCreating={isCreatingIdentifier}
          />
        );
      case "CardToCard":
        return (
          <CardToCardTransfer
            refreshFiatData={fetchFiatData}
            loadingBankCards={loadingBankCards}
            cards={bankCards}
            cardToCardInfo={cardToCardInfo}
            minDeposit={minDeposit}
            maxDeposit={maxDeposit}
          />
        );
      case "Bank Receipt:":
        return (
          <DepositBankReceipt
            loadingBankCards={loadingBankCards}
            bankCards={bankCards}
            receiptAccounts={receiptAccounts}
            onNext={() => setIdentifierData(null)}
            onFileChange={() => { }}
            initialPreviewUrl={null}
          />
        );
      case "DedicatedWallet":
        return (
          <DepositDedicatedWallet
            openCryptoModal={openDedicatedWalletModal} // تغییر اینجا
            selectedCrypto={selectedCrypto}
            cryptoDepositData={filteredCryptoForDedicatedWallet} // تغییر اینجا
            networks={depositNetworks}
            isDepositCoinsLoading={isDepositCoinsLoading}
            onRefreshData={refreshData}
            wallets={wallets}
          />
        );
      case "DepositWithTxID":
        return (
          <DepositWithTxID
            openCryptoModal={openTxidModal} // تغییر اینجا
            selectedCrypto={selectedCrypto}
            cryptoDepositData={cryptoListData} // لیست کامل (بدون تغییر)
            networks={depositNetworks}
            walletsTxid={depositWalletsTxid}
            isDepositCoinsLoading={isDepositCoinsLoading}
          />
        );
      default:
        return <DepositForm minDeposit={minDeposit} maxDeposit={maxDeposit} />;
    }
  };

  useEffect(() => {
    if (!cryptoListData || cryptoListData.length === 0) return;

    const params = new URLSearchParams(location.search);
    const coinSymbol = params.get("coin");

    if (coinSymbol) {
      const found = cryptoListData.find((c) => c.symbol.toLowerCase() === coinSymbol.toLowerCase());

      if (found) {
        setSelectedCrypto(found);
        return;
      }
    }
  }, [location.search, cryptoListData]);

  return (
    <HeaderLayout>
      <DepositLayout step={1} started={started} onStart={handleStart} alertMessages={currentAlertMessages}>
        {/* بخش راست */}
        <div className="w-full overflow-y-auto h-full lg:block hidden" dir="rtl">
          <p className="text-base text-black0 mb-4 font-medium">واریز تومانی</p>
          {rightOptions.slice(0, 4).map((option) => {
            const visible = option.methodKey ? isMethodisHidden(option.methodKey) : true;
            const disabled = option.methodKey ? isMethodDisabled(option.methodKey) : false;

            if (!visible) return null;

            return (
              <div key={option.id} className={`mt-4 ${disabled ? "pointer-events-none" : "cursor-pointer"}`} onClick={() => !disabled && setSelectedOption(option.id)}>
                <div
                  className={`flex items-center rounded-lg gap-2 justify-between p-3 transition-all duration-200 border ${selectedOption === option.id ? "border-blue2" : disabled ? "border-gray2 dark:bg-gray21 opacity-60" : "border-gray2"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-3 rounded-lg ${disabled ? "bg-gray21 border border-gray5 opacity-45" : "bg-blue14"}`}>
                      <span className={`icon-wrapper w-7 h-7 ${disabled ? "text-gray5" : "text-blue2"}`}>{option.Icon}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h2 className={`font-medium flex items-center gap-2 lg:text-base xl:text-lg   ${disabled ? "text-gray5" : "text-black0"}`}>{option.Title}</h2>
                      <p className="text-sm text-gray5">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {option.button && (
                      <button
                        className={`text-xs font-normal border px-2 py-[6px] rounded-lg ${disabled ? "border-gray12 text-gray5 dark:bg-gray21" : "border-gray26 text-gray5"}`}
                      >
                        {option.button}
                      </button>
                    )}
                    <span className={`icon-wrapper w-5 h-5 ${disabled ? "text-gray-400" : "text-gray5"}`}>{option.IconMore}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <p className="mt-8 mb-4 text-base text-black0 font-medium">واریز رمز ارز</p>
          {rightOptions.slice(4, 6).map((option) => (
            <div key={option.id} className="mt-4 cursor-pointer" onClick={() => setSelectedOption(option.id)}>
              <div
                className={`flex items-center rounded-lg gap-2 justify-between border p-3 transition-all duration-200 ${selectedOption === option.id ? "border border-blue2" : "border border-gray2"
                  }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="bg-blue14 p-3 rounded-lg">
                      <span className="icon-wrapper w-7 h-7 text-blue2">{option.Icon}</span>
                    </div>
                    <div>
                      <h2 className=" font-medium text-black0 lg:text-base xl:text-lg ">{option.Title}</h2>
                      <p className="text-sm text-gray5">{option.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="icon-wrapper w-5 h-5 text-gray5">{option.IconMore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* بخش چپ */}
        <div className="w-full">{renderStep()}</div>
      </DepositLayout>

      <div dir="rtl">
        {isDedicatedWalletModalOpen && (
          <CryptoListModal
            setIsCryptoListModalOpen={setIsDedicatedWalletModalOpen}
            cryptoListData={filteredCryptoForDedicatedWallet} // فقط TRON و USDT
            setCurrentCryptoCurrency={handleCryptoSelect}
            isCryptoListLoading={isDepositCoinsLoading}
          />
        )}

        {isTxidModalOpen && (
          <CryptoListModal
            setIsCryptoListModalOpen={setIsTxidModalOpen}
            cryptoListData={cryptoListData} // همه ارزها
            setCurrentCryptoCurrency={handleCryptoSelect}
            isCryptoListLoading={isDepositCoinsLoading}
          />
        )}
      </div>
    </HeaderLayout>
  );
}
