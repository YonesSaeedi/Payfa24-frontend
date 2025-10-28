import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";
import Accordion from "../Withdrawal/Accordion";
import { apiRequest } from "../../utils/apiClient";
import IconClose from "../../assets/icons/Login/IconClose";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";

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

interface DepositIdItem {
  deposit_id: number | string;
  id_card: number;
}

/** Helper to copy and toast */
const copyToClipboard = (text: string | number, label: string) => {
  navigator.clipboard
    .writeText(String(text))
    .then(() => toast.info(`${label} کپی شد ✅`))
    .catch(() => toast.error(`خطا در کپی ${label}`));
};

type FiatApiResponse = {
  list_cards?: BankCard[];
  list_deposit_id?: DepositIdItem[];
  deposit_id?: DepositIdentifierResponse;
};

export default function DepositWithIdentifier(): React.ReactElement {
  const { control } = useForm<{ bank?: string }>();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [apiResponseData, setApiResponseData] =
    useState<DepositIdentifierResponse | null>(null);

  const fetchInitial = async () => {
    setLoadingCards(true);
    try {
      const res = await apiRequest<FiatApiResponse>({
        url: "/api/wallets/fiat",
        method: "GET",
      });

      setCards(res.list_cards ?? []);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت لیست کارت‌ها ❌");
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  /** ایجاد شناسه واریز برای کارت انتخاب‌شده */
  const handleCreateIdentifier = async () => {
    if (!selectedCard) {
      toast.error("لطفاً ابتدا کارت بانکی خود را انتخاب کنید 💳");
      return;
    }

    setIsLoading(true);
    try {
      // پاسخ ممکنه: { deposit_id: { ... } } یا خودِ آبجکت برگرده
      const response = await apiRequest<
        { deposit_id?: DepositIdentifierResponse } | DepositIdentifierResponse
      >({
        url: "/api/wallets/fiat/deposit/gateway-id",
        method: "POST",
        // data: { id: selectedCard } as Record<string, number>,
      });

      const depositData: DepositIdentifierResponse | null =
        "deposit_id" in response &&
        response.deposit_id &&
        typeof response.deposit_id === "object"
          ? response.deposit_id
          : null;
      if (
        depositData &&
        typeof depositData === "object" &&
        "deposit_id" in depositData
      ) {
        setApiResponseData(depositData);
        setIsShown(true);
        // افزودن به لیست depositIds محلی (برای هر نیاز آینده)
        // setDepositIds((prev) => [
        //   ...prev,
        //   { deposit_id: depositData.deposit_id, id_card: selectedCard },
        // ]);
        toast.success("شناسه واریز با موفقیت ساخته شد ");
      } else {
        toast.success("شناسه واریز با موفقیت ساخته شد ");
      }

      // بعد از نمایش شناسه، دکمه غیرفعال خواهد شد (به علت isShown=true)
    } catch (error: unknown) {
      console.error("API Error:", error);
      {
        toast.error("قبلا برای این شبا شناسه واریز ایجاد شده است");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:px-5 my-10 " dir="rtl">
      <div className="my-10 bg-blue14 px-3 py-[14px] rounded-lg text-blue2 flex items-center justify-between">
        <div className="flex items-center  gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>
        <span className=" icon-wrapper w-5 h-5  text-blue2">
          <IconClose />
        </span>
      </div>

      <div className="mb-12 w-full">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder={
                loadingCards
                  ? "در حال بارگذاری کارت‌ها..."
                  : "حساب بانکی را انتخاب کنید"
              }
              label="کارت بانکی"
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
                const selected = cards.find((c) => c.id === Number(val));
                setSelectedCard(selected ? selected.id : null);
                setIsShown(false);
                setApiResponseData(null);
              }}
              options={cards.map((card) => ({
                value: card.id.toString(),
                label: (
                  <div className="flex items-center justify-between w-full py-1 rounded-md">
                    <span className="text-sm text-black0">{card.bank}</span>
                    <span className="text-sm text-black0">{card.card}</span>
                  </div>
                ),

                icon: (
                  <span className="w-6 h-6">
                    <BankMelliLogo />
                  </span>
                ),
              }))}
            />
          )}
        />
      </div>

      {/* نمایش مشخصات حساب فقط وقتی که apiResponseData موجود و isShown true باشد */}
      {isShown && apiResponseData && (
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
              <div className="flex gap-1 items-center">
                <span>{apiResponseData.destination_bank}</span>
              </div>
              <span>{apiResponseData.destination_owner_name}</span>
              <div className="flex gap-1 items-center">
                <span>{apiResponseData.destination_iban}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(apiResponseData.destination_iban, "شبا")
                  }
                >
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{apiResponseData.destination_account_number}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(
                      apiResponseData.destination_account_number,
                      "شماره حساب"
                    )
                  }
                >
                  <IconCopy />
                </button>
              </div>
              <div className="flex gap-1 items-center">
                <span>{apiResponseData.deposit_id}</span>
                <button
                  className="icon-wrapper w-5 h-5 text-gray5"
                  onClick={() =>
                    copyToClipboard(apiResponseData.deposit_id, "شناسه واریز")
                  }
                >
                  <IconCopy />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={`${isShown ? "mt-6" : "mt-24"}`}>
        {/* دکمه همیشه نمایش داده می‌شود، اما فعال فقط وقتی کارت انتخاب شده و فیش هنوز نمایش داده نشده */}
        <button
          onClick={handleCreateIdentifier}
          disabled={isLoading || !selectedCard || isShown}
          className={`w-full py-3 font-bold text-lg rounded-lg transition ${
            isLoading || !selectedCard || isShown
              ? "bg-gray-400 text-white2 cursor-pointer"
              : "text-white2 bg-blue2 hover:bg-blue2"
          }`}
        >
          {isLoading
            ? "در حال دریافت..."
            : isShown
            ? "شناسه نمایش داده شد"
            : "ساخت شناسه واریز"}
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
