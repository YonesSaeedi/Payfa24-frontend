import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import IconClose from "../../assets/icons/Login/IconClose";
import { getBankLogo } from "../../utils/bankLogos";
import { useEffect, useState } from "react";
import { toPersianDigits } from "./CardToCardTransfer";

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
  list_deposit_id?: Array<{ deposit_id: string; id_card: number }>;
}

interface DepositWithIdentifierProps {
  cards?: BankCard[];
  identifierData?: DepositIdentifierResponse | null;
  onCreateIdentifier: (cardId: number) => Promise<void>;
  isCreating?: boolean;
  loadingBankCards?: boolean;
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
export default function DepositWithIdentifier({ cards = [], identifierData = null, onCreateIdentifier, isCreating = false, loadingBankCards }: DepositWithIdentifierProps) {
  const { control, watch } = useForm<{ bank?: string }>();
  const selectedCardId = Number(watch("bank"));
  const [currentIdentifier, setCurrentIdentifier] = useState<DepositIdentifierResponse | null>(null);
  useEffect(() => {
    if (selectedCardId && identifierData) {
      const hasIdentifier = identifierData.list_deposit_id?.some((item) => item.id_card === selectedCardId);

      if (hasIdentifier) {
        setCurrentIdentifier(identifierData);
      } else {
        setCurrentIdentifier(null);
      }
    } else {
      setCurrentIdentifier(null);
    }
  }, [selectedCardId, identifierData]);

  const handleCreate = async () => {
    if (!selectedCardId) {
      toast.error("لطفاً کارت انتخاب کنید");
      return;
    }

    // چک کن ببین این کارت قبلاً شناسه داره یا نه
    const hasExistingIdentifier = identifierData?.list_deposit_id?.some((item) => item.id_card === selectedCardId);
    if (hasExistingIdentifier) {
      toast.error("برای این کارت قبلاً شناسه ساخته شده است");
      return;
    }

    await onCreateIdentifier(selectedCardId);
  };

  const isShown = !!identifierData || !!selectedCardId;

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
                placeholder={
                  loadingBankCards ? ( 
                    <span className="skeleton-bg w-40 h-4 rounded-sm"></span>
                  ) : hasCards ? (
                    "حساب بانکی را انتخاب کنید"
                  ) : (
                    <span className="text-gray5 text-xs lg:text-sm">هیچ کارت ثبت‌ شده‌ای ندارید</span>
                  )
                }
                label="کارت بانکی"
                value={hasCards ? field.value : ""}
                onChange={(val) => {
                  field.onChange(val);
                  setCurrentIdentifier(null);
                }}
                disabled={!hasCards}
                options={
                  hasCards
                    ? cards.map((card) => ({
                        value: card.id.toString(),
                        label: (
                          <div className="flex items-center justify-between  w-full py-1">
                            <span className="lg:text-sm text-xs text-black0">{card.bank}</span>
                            <span className="lg:text-sm text-xs text-black0">{formatPersianCardNumber(card.card)}</span>
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
      {isShown && currentIdentifier && (
        <>
          <p className="text-sm text-gray5 mt-6 mb-2">مشخصات حساب گیرنده</p>
          <div className="lg:p-6 px-4 py-6 border rounded-lg border-gray19 flex w-full justify-between bg-gray40">
            <div className="flex w-1/2 flex-col gap-5 text-gray5 text-sm">
              <span>بانک</span>
              <span>نام صاحب حساب</span>
              <span>شبا</span>
              <span>شماره حساب</span>
              <span>شناسه واریز</span>
            </div>
            <div className="flex w-1/2  flex-col gap-5 items-end text-sm text-black0">
              <span>{currentIdentifier.destination_bank}</span>
              <span>{currentIdentifier.destination_owner_name}</span>
              <div className="flex gap-1 items-center  cursor-pointer group hover:text-blue2" onClick={() => copyToClipboard(currentIdentifier.destination_iban, "شبا")}>
                <span>{toPersianDigits(currentIdentifier.destination_iban)}</span>
                <button className="icon-wrapper w-5 h-5 text-gray5 group-hover:text-blue2">
                  <IconCopy />
                </button>
              </div>
              <div
                className="flex gap-1 items-center cursor-pointer group hover:text-blue2"
                onClick={() => copyToClipboard(currentIdentifier.destination_account_number, "شماره حساب")}
              >
                <span>{toPersianDigits(currentIdentifier.destination_account_number)}</span>

                <button
                  className="icon-wrapper w-5 h-5 text-gray5 group-hover:text-blue2"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(currentIdentifier.destination_account_number, "شماره حساب");
                  }}
                >
                  <IconCopy />
                </button>
              </div>

              <div className="flex gap-1 items-center cursor-pointer group hover:text-blue2" onClick={() => copyToClipboard(currentIdentifier.deposit_id, "شناسه واریز")}>
                <span>{toPersianDigits(currentIdentifier.deposit_id)}</span>
                <button className="icon-wrapper w-5 h-5 text-gray5 group-hover:text-blue2" onClick={() => copyToClipboard(currentIdentifier.deposit_id, "شناسه واریز")}>
                  <IconCopy />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Button */}
      <div className={`${isShown && currentIdentifier ? "mt-6" : "lg:mt-72 mt-56"}`}>
        {!(isShown && currentIdentifier) && (
          <button
            onClick={handleCreate}
            disabled={isCreating || !selectedCardId}
            className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all 
        ${isCreating || !selectedCardId ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1"}`}
          >
            {isCreating ? "در حال ساخت ..." : "ساخت شناسه واریز"}
          </button>
        )}
        {/* {(isShown  || currentIdentifier) && ( */}
        <div className="mt-6" dir="ltr">
          <Accordion title="راهنمای واریز با شناسه">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>آدرس درگاه باید shaparak.ir باشد.</li>
              <li>مبلغ پرداختی را قبل از تأیید بررسی کنید.</li>
            </ul>
          </Accordion>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}
