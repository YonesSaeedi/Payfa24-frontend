import { useEffect, useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import DepositLayout from "./DepositLayout";
import IconBank from "../../assets/icons/Deposit/IconBank";
import IconConvertCard from "../../assets/icons/Deposit/IconConvertCard";
import IconWallet from "../../assets/icons/Deposit/IconWallet";
import IconLink from "../../assets/icons/Deposit/IconLink";
import DepositForm from "../../components/Deposit/DepositForm";
import CardToCardTransfer from "../../components/Deposit/CardToCardTransfer";
import DepositWithTxID from "../../components/Deposit/DepositWithTxID";
import DepositDedicatedWallet from "../../components/Deposit/DepositDedicatedWallet";
import DepositwithIdentifier from "../../components/Deposit/DepositWithIdentifier";
import DepositBankReceipt from "../../components/Deposit/DepositBankReceipt";
import IconIDentifier from "../../assets/icons/Deposit/Deposit/IconIDentifier";
import IconReceipt from "../../assets/icons/Deposit/Deposit/IconReceipt";
import IconArrowRight from "../../assets/icons/Deposit/IconArrowRight";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";

// --- Interface ---
interface WalletFiatData {
  wallet?: {
    internal?: {
      min_deposit: string | number;
      max_deposit: string | number;
    };
  };
  list_cards?: Array<{
    id: number;
    card: string;
    bank: string;
    iban: string | null;
  }>;
  receipt?: {
    list_cards?: Array<{
      iban_number: string;
      name_bank: string;
      account_name: string;
      account_number?: string;
    }>;
  };
  cardToCard?: {
    transaction: {
      id: number;
      amount: number;
      date: string;
      card: number;
    } | null;
    card: {
      name: string;
      card: string;
      bank: string;
      iban: string | null;
    } | null;
  };
}

interface DepositIdentifierResponse {
  destination_bank: string;
  destination_owner_name: string;
  destination_iban: string;
  destination_account_number: string;
  deposit_id: number | string;
}

interface DepositPageProps {
  selected?: "gateway" | "identifier" | "card" | "receipt" | "wallet" | "txid";
}

export default function DepositPage({
  selected = "gateway",
}: DepositPageProps) {
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

  const [fiatData, setFiatData] = useState<WalletFiatData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- برای شناسه واریز ---
  const [identifierData, setIdentifierData] =
    useState<DepositIdentifierResponse | null>(null);
  const [isCreatingIdentifier, setIsCreatingIdentifier] = useState(false);

  // --- API فقط اینجا ---
  useEffect(() => {
    const fetchFiatData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest<WalletFiatData>({
          url: "/api/wallets/fiat",
          method: "GET",
        });
        setFiatData(response);
      } catch (err: any) {
        console.error("Error:", err);
        toast.error("خطا در بارگذاری اطلاعات واریز");
      } finally {
        setLoading(false);
      }
    };
    fetchFiatData();
  }, []);

  // --- ساخت شناسه واریز ---
  const handleCreateIdentifier = async (cardId: number) => {
    setIsCreatingIdentifier(true);
    try {
      const res = await apiRequest<DepositIdentifierResponse, { id: number }>({
        url: "/api/wallets/fiat/deposit/gateway-id",
        method: "POST",
        data: { id: cardId },
      });

      const data = res.deposit_id || res;
      if (
        typeof data === "object" &&
        data !== null &&
        "deposit_id" in data &&
        data.deposit_id !== undefined &&
        data.deposit_id !== null
      ) {
        setIdentifierData(data as DepositIdentifierResponse);
        toast.success("شناسه واریز ساخته شد");
      } else {
        setIdentifierData(null);
        toast.error("خطا در ساخت شناسه");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "قبلاً شناسه ساخته شده");
    } finally {
      setIsCreatingIdentifier(false);
    }
  };

  const handleStart = () => setStarted(true);

  const depositFormMessages = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید...",
    "جهت واریز وجه، حتما باید از کارت‌های بانکی به نام خودتان استفاده نمایید.",
  ];

  const DepositWithIdentifierMessages = [
    "تاکید می‌شود که از دریافت وجه ریالی از افراد ناشناس و انتقال رمزارز به آنها خودداری نمایید...",
    "کارمزد واریز با شناسه: %0.05 مبلغ واریزی میباشد...",
  ];

  let currentAlertMessages: string[] = [];
  if (selectedOption === "closeDeal")
    currentAlertMessages = depositFormMessages;
  else if (selectedOption === "Identifier")
    currentAlertMessages = DepositWithIdentifierMessages;

  // --- لودینگ ---
  if (loading) {
    return (
      <HeaderLayout>
        <DepositLayout
          step={1}
          started={started}
          onStart={handleStart}
          alertMessages={[]}
        >
          <div className="w-full text-center py-10">در حال بارگذاری...</div>
        </DepositLayout>
      </HeaderLayout>
    );
  }

  if (!fiatData) {
    return (
      <HeaderLayout>
        <DepositLayout
          step={1}
          started={started}
          onStart={handleStart}
          alertMessages={[]}
        >
          <div className="w-full text-center py-10 text-red-500">
            خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.
          </div>
        </DepositLayout>
      </HeaderLayout>
    );
  }

  // --- داده‌های تضمینی ---
  const minDeposit = Number(fiatData.wallet?.internal?.min_deposit) || 300000;
  const maxDeposit = Number(fiatData.wallet?.internal?.max_deposit) || 25000000;
  const bankCards = fiatData.list_cards || []; // (CreditCard[])
  const receiptAccounts = fiatData.receipt?.list_cards || [];
  const cardToCardInfo = fiatData.cardToCard || {
    transaction: null,
    card: null,
  };

  const rightOptions = [
    {
      id: "closeDeal",
      Icon: <IconBank />,
      Title: "واریز با درگاه پرداخت",
      description: `واریز حداکثر تا ${formatPersianDigits(
        (maxDeposit / 1_000_000).toString()
      )} میلیون تومان`,
      button: "پرداخت در لحظه",
      IconMore: <IconArrowRight />,
    },
    {
      id: "Identifier",
      Icon: <IconIDentifier />,
      Title: "واریز با شناسه",
      description: "واریز وجه به صورت نامحدود",
      button: `پرداخت در ${formatPersianDigits(20)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "CardToCard",
      Icon: <IconConvertCard />,
      Title: "واریز کارت به کارت",
      description: `واریز تا سقف ${formatPersianDigits(10)} میلیون تومان`,
      button: `پرداخت در ${formatPersianDigits(20)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "Bank Receipt:",
      Icon: <IconReceipt />,
      Title: "فیش بانکی",
      description: "واریز وجه به صورت نامحدود",
      button: `پرداخت در ${formatPersianDigits(20)} دقیقه`,
      IconMore: <IconArrowRight />,
    },
    {
      id: "DedicatedWallet",
      Icon: <IconWallet />,
      Title: "واریز با ولت اختصاصی",
      description: "بدون نیاز به TxID , واریز خودکار و سریع",
      button: "",
      IconMore: <IconArrowRight />,
    },
    {
      id: "DepositWithTxID",
      Icon: <IconLink />,
      Title: "واریز با TxID",
      description: "برای واریز از صرافی با کیف پول دیگر",
      button: "",
      IconMore: <IconArrowRight />,
    },
  ];

  const renderStep = () => {
    switch (selectedOption) {
      case "closeDeal":
        return <DepositForm minDeposit={minDeposit} maxDeposit={maxDeposit} />;
      case "Identifier":
        return (
          <DepositwithIdentifier
            cards={bankCards}
            identifierData={identifierData}
            onCreateIdentifier={handleCreateIdentifier}
            isCreating={isCreatingIdentifier}
          />
        );
      case "CardToCard":
        return (
          <CardToCardTransfer
            cards={bankCards} // جدید
            cardToCardInfo={cardToCardInfo} // جدید
            minDeposit={minDeposit} // قبلاً داشتید، ارسال می‌کنیم
            maxDeposit={maxDeposit} // قبلاً داشتید، ارسال می‌کنیم
          />
        );
      case "Bank Receipt:":
        return (
          <DepositBankReceipt
            bankCards={bankCards}
            receiptAccounts={receiptAccounts}
            onNext={() => {
              // بعد از آپلود، دوباره API بزن یا state ریست کن
              setIdentifierData(null);
            }}
            onFileChange={() => {}}
            initialPreviewUrl={null}
          />
        );
      case "DedicatedWallet":
        return <DepositDedicatedWallet />;
      case "DepositWithTxID":
        return <DepositWithTxID />;
      default:
        return <DepositForm minDeposit={minDeposit} maxDeposit={maxDeposit} />;
    }
  };

  return (
    <HeaderLayout>
      <DepositLayout
        step={1}
        started={started}
        onStart={handleStart}
        alertMessages={currentAlertMessages}
      >
        {/* بخش راست */}
        <div
          className="w-full overflow-y-auto h-full lg:block hidden"
          dir="rtl"
        >
          <p className="text-base text-black0 mb-4 font-medium">واریز تومان</p>
          {rightOptions.slice(0, 4).map((option) => (
            <div
              key={option.id}
              className="mt-4 cursor-pointer"
              onClick={() => setSelectedOption(option.id)}
            >
              <div
                className={`flex items-center rounded-lg gap-2 justify-between border p-3 transition-all duration-200 ${
                  selectedOption === option.id
                    ? "border-blue2"
                    : "border-gray50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <div className="bg-blue14 p-3 rounded-lg">
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        {option.Icon}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-black0">
                        {option.Title}
                      </h2>
                      <p className="text-sm text-gray5">{option.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {option.button && (
                    <button className="text-xs font-normal border text-gray5 border-gray26 px-2 py-[6px] rounded-lg">
                      {option.button}
                    </button>
                  )}
                  <span className="icon-wrapper w-5 h-5 text-gray5">
                    {option.IconMore}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <p className="mt-8 mb-4 text-base text-black0 font-medium">
            واریز ارز
          </p>
          {rightOptions.slice(4, 6).map((option) => (
            <div
              key={option.id}
              className="mt-4 cursor-pointer"
              onClick={() => setSelectedOption(option.id)}
            >
              <div
                className={`flex items-center rounded-lg gap-2 justify-between border p-3 transition-all duration-200 ${
                  selectedOption === option.id
                    ? "border-blue2"
                    : "border-gray50"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <div className="bg-blue14 p-3 rounded-lg">
                      <span className="icon-wrapper w-7 h-7 text-blue2">
                        {option.Icon}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-black0">
                        {option.Title}
                      </h2>
                      <p className="text-sm text-gray5">{option.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="icon-wrapper w-5 h-5 text-gray5">
                    {option.IconMore}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* بخش چپ */}
        <div className="w-full">{renderStep()}</div>
      </DepositLayout>
    </HeaderLayout>
  );
}
