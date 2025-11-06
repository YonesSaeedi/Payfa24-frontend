import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import IconClose from "../../assets/icons/Login/IconClose";
import { getBankLogo } from "../../utils/bankLogos";

interface BankCard {
  id: number;
  card: string;
  bank: string;
  iban: string | null;
}

interface DepositIdentifierResponse {
  destination_bank: string;
  destination_owner_name: string;
  destination_iban: string;
  destination_account_number: string;
  deposit_id: number | string;
}

interface DepositWithIdentifierProps {
  cards?: BankCard[];
  identifierData?: DepositIdentifierResponse | null;
  onCreateIdentifier: (cardId: number) => Promise<void>;
  isCreating?: boolean;
}

const copyToClipboard = (text: string | number, label: string) => {
  navigator.clipboard
    .writeText(String(text))
    .then(() => toast.info(`${label} کپی شد`))
    .catch(() => toast.error(`خطا در کپی ${label}`));
};
export function formatPersianCardNumber(input: string | number): string {
  if (input === null || input === undefined || input === "") return "";

  const persianMap = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  let digitsOnly = String(input).replace(/\D/g, "");
  if (/^\d+$/.test(digitsOnly) && digitsOnly.length < 16) {
    digitsOnly = digitsOnly.padStart(16, "0");
  }
  const grouped = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1-");
  const persianGrouped = grouped.replace(/[0-9]/g, (d) => persianMap[+d]);

  return persianGrouped;
}

export default function DepositWithIdentifier({ cards = [], identifierData = null, onCreateIdentifier, isCreating = false }: DepositWithIdentifierProps) {
  const { control, watch, setValue } = useForm<{ bank?: string }>();
  const selectedCardId = Number(watch("bank"));

  const handleCardChange = (val: string) => {
    setValue("bank", val);
  };

  const handleCreate = async () => {
    if (!selectedCardId) {
      toast.error("لطفاً کارت انتخاب کنید");
      return;
    }

    await onCreateIdentifier(selectedCardId);
    // =======

    //     setIsLoading(true);
    //     try {
    //       // پاسخ ممکنه: { deposit_id: { ... } } یا خودِ آبجکت برگرده
    //       const response = await apiRequest<
    //         { deposit_id?: DepositIdentifierResponse } | DepositIdentifierResponse
    //       >({
    //         url: "/wallets/fiat/deposit/gateway-id",
    //         method: "POST",
    //         // data: { id: selectedCard } as Record<string, number>,
    //       });

    //       const depositData: DepositIdentifierResponse | null =
    //         "deposit_id" in response &&
    //         response.deposit_id &&
    //         typeof response.deposit_id === "object"
    //           ? response.deposit_id
    //           : null;
    //       if (
    //         depositData &&
    //         typeof depositData === "object" &&
    //         "deposit_id" in depositData
    //       ) {
    //         setApiResponseData(depositData);
    //         setIsShown(true);
    //         // افزودن به لیست depositIds محلی (برای هر نیاز آینده)
    //         // setDepositIds((prev) => [
    //         //   ...prev,
    //         //   { deposit_id: depositData.deposit_id, id_card: selectedCard },
    //         // ]);
    //         toast.success("شناسه واریز با موفقیت ساخته شد ");
    //       } else {
    //         toast.success("شناسه واریز با موفقیت ساخته شد ");
    //       }

    //       // بعد از نمایش شناسه، دکمه غیرفعال خواهد شد (به علت isShown=true)
    //     } catch (error: unknown) {
    //       console.error("API Error:", error);
    //       {
    //         toast.error("قبلا برای این شبا شناسه واریز ایجاد شده است");
    //       }
    //     } finally {
    //       setIsLoading(false);
    //     }
    // >>>>>>> 1232b6ddee25d123b9fdb16f8e7da7d008dfedea
  };

  const isShown = !!identifierData;

  return (
    <div className="w-full" dir="rtl">
      {/* Video */}
      <div className="mb-10 bg-blue14 px-3 py-[14px] rounded-lg text-blue2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با شناسه</span>
        </div>
        <span className="icon-wrapper w-5 h-5 text-blue2">
          <IconClose />
        </span>
      </div>

      {/* Card Select */}
      <div className="mb-12 w-full">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => {
            const hasCards = cards.length > 0;

            return (
              <FloatingSelect
                placeholder={hasCards ? "حساب بانکی را انتخاب کنید" : "هیچ کارت ثبت‌ شده‌ای ندارید"}
                label="کارت بانکی"
                value={hasCards ? field.value : ""}
                onChange={field.onChange}
                disabled={!hasCards} 
                options={
                  hasCards
                    ? cards.map((card) => ({
                        value: card.id.toString(),
                        label: (
                          <div className="flex items-center justify-between w-full py-1">
                            <span className="text-sm text-black0">{card.bank}</span>
                            <span className="text-sm text-black0">{formatPersianCardNumber(card.card)}</span>
                          </div>
                        ),
                        icon: <img src={getBankLogo(card.bank) || "/bank-logos/bank-sayer.png"} alt={card.bank} className="w-6 h-6 object-contain" />,
                      }))
                    : [] 
                }
              />
            );
          }}
        />
      </div>

      {/* Identifier Info */}
      {isShown && identifierData && (
        <>
          <p className="text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
          <div className="p-4 border rounded-lg border-gray19 flex w-full justify-between bg-gray40">
            <div className="flex flex-col gap-5 text-gray5 text-sm">
              <span>بانک</span>
              <span>نام صاحب حساب</span>
              <span>شبا</span>
              <span>شماره حساب</span>
              <span>شناسه واریز</span>
            </div>
            <div className="flex flex-col gap-5 items-end text-sm text-black0">
              <span>{identifierData.destination_bank}</span>
              <span>{identifierData.destination_owner_name}</span>
              <div className="flex gap-1 items-center">
                <span>{identifierData.destination_iban}</span>
                <button className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.destination_iban, "شبا")}>
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{identifierData.destination_account_number}</span>
                <button className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.destination_account_number, "شماره حساب")}>
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{identifierData.deposit_id}</span>
                <button className="icon-wrapper w-5 h-5 text-gray5" onClick={() => copyToClipboard(identifierData.deposit_id, "شناسه واریز")}>
                  <IconCopy />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Button */}
      <div className={`${isShown ? "mt-6" : "mt-24"}`}>
        <button
          onClick={handleCreate}
          disabled={isCreating || !selectedCardId || isShown} // ⬅️ شرط غیرفعال بودن
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all 
          ${isCreating || !selectedCardId || isShown ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1"}`}
        >
          {isCreating ? "در حال ساخت..." : isShown ? "شناسه نمایش داده شد" : "ساخت شناسه واریز"}
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با شناسه">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>آدرس درگاه باید shaparak.ir باشد.</li>
              <li>مبلغ پرداختی را قبل از تأیید بررسی کنید.</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
