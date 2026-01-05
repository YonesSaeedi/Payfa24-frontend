import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useRef, useState } from "react";
import UploadImage from "../../assets/icons/authentication/UploadImage";
import Accordion from "../Withdrawal/Accordion";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { getBankLogo } from "../../utils/bankLogos";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { toPersianDigits } from "./CardToCardTransfer";
import IconClose from "../../assets/icons/Login/IconClose";
import { UserCard } from "../../pages/Deposit/DepositPage";
import IconCopy from "../../assets/icons/AddFriend/IconCopy";

// ---------- validation ----------
const schema = yup.object().shape({
  bank: yup.string().required("حساب مبدا الزامی است"),
  destinationBank: yup.string().required("حساب مقصد الزامی است"),
  amount: yup
    .number()
    .typeError("مبلغ باید عدد باشد")
    .required("مقدار واریزی الزامی است")
    .min(1_000_000, "حداقل مبلغ واریزی ۱ میلیون تومان است")
    .max(500_000_000, "حداکثر مبلغ قابل واریز ۵۰۰ میلیون تومان است"),
});
// ---------- props ----------
interface ReceiptCard {
  account_name: string;
  account_number: string;
  iban_number: string;
  name_bank: string;
  card_number: string;
}
interface DepositBankReceiptProps {
  bankCards: UserCard[];
  receiptAccounts: ReceiptCard[];
  onNext: () => void;
  onFileChange: (file: File | null) => void;
  initialPreviewUrl: string | null;
  loadingBankCards?: boolean;
}

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
export default function DepositBankReceipt({ loadingBankCards, bankCards, receiptAccounts, onNext, onFileChange, initialPreviewUrl }: DepositBankReceiptProps) {
  const amounts = [5, 10, 20, 50];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(initialPreviewUrl);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit", // تغییر به onSubmit برای چک فقط بعد از سابمیت
    defaultValues: { amount: undefined, bank: "", destinationBank: "" },
  });

  const watchAll = watch();
  const isFormComplete = !!watchAll.bank && !!watchAll.destinationBank && !!watchAll.amount && !!selectedFile;

  // ---------- upload ----------
  const uploadFile = useCallback(async (formData: FormData) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      await apiRequest({
        url: "/wallets/fiat/deposit/receipt",
        method: "POST",
        data: formData,
        isFormData: true,
        onUploadProgress: (e) => {
          if (e?.total && e.loaded) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });
      toast.success("فیش با موفقیت آپلود شد!");
      return true;
    } catch (err) {
      toast.error("خطا در آپلود فیش!");
      return false;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // ---------- file ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (previewURL?.startsWith("blob:")) URL.revokeObjectURL(previewURL);

    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
      onFileChange(file);
    } else {
      setSelectedFile(null);
      setPreviewURL(null);
      onFileChange(null);
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleAmountClick = (m: number) => setValue("amount", m * 1_000_000, { shouldValidate: true });

  // ---------- submit ----------
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!selectedFile) {
        toast.error("لطفاً فیش واریز را آپلود کنید");
        return;
      }

      const card = bankCards.find((c) => c.bank === data.bank);
      if (!card) {
        toast.error("حساب مبدا انتخاب نشده است");
        return;
      }

      const payeeIban = receiptAccounts[0]?.iban_number;
      if (!payeeIban) {
        toast.error("شماره شبا مقصد در دسترس نیست");
        return;
      }

      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("payee", payeeIban);
      formData.append("card", card.id.toString());
      formData.append("file", selectedFile);

      const ok = await uploadFile(formData);
      if (ok) {
        setTimeout(onNext, 1500);
      }
    } catch (err: any) {
      toast.error(err.message || "خطا در ثبت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  // تابع برای وقتی فرم invalid بود (فقط بعد از سابمیت)
  const onInvalid = (errors: any) => {
    if (errors.amount) {
      toast.error(errors.amount.message);
    } else if (errors.bank) {
      toast.error(errors.bank.message);
    } else if (errors.destinationBank) {
      toast.error(errors.destinationBank.message);
    } else {
      toast.error("لطفاً تمام فیلدها را به درستی پر کنید");
    }
  };

  const selectedDestination = receiptAccounts.find((acc) => acc.iban_number === watchAll.destinationBank);

  return (
    <div className="w-full" dir="rtl">
      {/* ویدیو */}
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="icon-wrapper w-6 h-6 text-blue2">
            <IconVideo />
          </span>
          <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با درگاه پرداخت</span>
        </div>
        <span className="icon-wrapper w-5 h-5 text-blue2">
          <IconClose />
        </span>
      </div>

      {/* کارت مبدا */}
      <div className="mb-12">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => {
            const hasCards = bankCards.length > 0;
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
                label="حساب مبدا"
                value={hasCards ? field.value : ""}
                onChange={field.onChange}
                disabled={!hasCards}
                options={
                  hasCards
                    ? bankCards.map((c) => ({
                        value: c.bank,
                        label: (
                          <div className="flex items-center justify-between w-full py-1 border-red-500">
                            <span className="lg:text-sm text-xs text-black0">{c.bank}</span>
                            <span className="lg:text-sm text-xs text-black0">{formatPersianCardNumber(c.card)}</span>
                          </div>
                        ),
                        icon: <img src={getBankLogo(c.bank) || "/bank-logos/bank-sayer.png"} alt={c.bank} className="w-6 h-6 object-contain" />,
                      }))
                    : []
                }
              />
            );
          }}
        />
      </div>

      {/* کارت مقصد */}
      <div className="mb-3">
        <Controller
          name="destinationBank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder="حساب مقصد را انتخاب کنید"
              label="حساب مقصد"
              value={field.value}
              onChange={field.onChange}
              options={receiptAccounts.map((a) => ({
                value: a.iban_number,
                label: a.account_name,
                content: (
                  <div className="flex items-center justify-between w-full py-2 gap-1">
                    {/* چپ: آیکون + نام حساب */}
                    <div className="flex items-center gap-1">
                      <img src={getBankLogo(a.name_bank) || "/bank-logos/bank-sayer.png"} alt={a.name_bank} className="w-6 h-6 object-contain rounded-full" />
                      <span className="lg:text-sm text-xs text-black0">{a.account_name}</span>
                    </div>
                    {/* راست: شماره کارت یا حساب */}
                    {a.account_number && <span className="text-xs lg:text-sm text-black0">{toPersianDigits(a.account_number)}</span>}
                  </div>
                ),
              }))}
            />
          )}
        />
      </div>

      {selectedDestination && (
        <div className="bg-gray47 shadow-sm  p-4 rounded-lg my-6">
          <div className="space-y-2 text-sm lg:text-base text-black0">
            <div className="flex justify-between items-center">
              <span>شماره کارت</span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(selectedDestination.card_number);
                  toast.info(" کپی شد");
                }}
                className="flex items-center gap-1  cursor-pointer hover:text-blue2"
              >
                <p>{formatPersianCardNumber(selectedDestination.card_number)}</p>
                <span className="icon-wrapper w-5 h-5 text-gray12">
                  <IconCopy />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>شماره حساب</span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(selectedDestination.account_number);
                  toast.info("کپی شد");
                }}
                className="flex items-center gap-1 hover:text-blue2 cursor-pointer"
              >
                <p>{toPersianDigits(selectedDestination.account_number)}</p>
                <span className="icon-wrapper w-5 h-5 text-gray12">
                  <IconCopy />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>شماره شبا</span>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(selectedDestination.iban_number);
                  toast.info("کپی شد");
                }}
                className="flex items-center gap-1 hover:text-blue2 cursor-pointer"
              >
                <p>{toPersianDigits(selectedDestination.iban_number)}</p>
                <span className="icon-wrapper w-5 h-5 text-gray12">
                  <IconCopy />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مقدار واریزی */}
      <div className="mb-1.5 mt-8">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <FloatingInput
              label="مقدار واریزی (تومان)"
              value={formatPersianDigits(field.value?.toString() ?? "")}
              type="text"
              onChange={(e) => {
                const rawValue = e.target.value;
                const englishValue = rawValue.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()).replace(/[^0-9]/g, "");
                field.onChange(englishValue ? Number(englishValue) : undefined);
              }}
              placeholder="۰ تومان"
              placeholderColor="text-black0"
            />
          )}
        />
        <p className="text-gray5 text-sm mt-2">حداقل واریز با فیش بانکی، ۱,۰۰۰,۰۰۰ تومان می‌باشد.</p>
      </div>

      {/* دکمه‌های مبلغ پیشنهادی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
        {amounts.map((a, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleAmountClick(a)}
            className="border rounded-lg w-full py-2 lg:text-sm text-xs transition-all border-gray12 text-gray12 hover:border-blue2 hover:text-blue2"
          >
            {toPersianDigits(a)} میلیون
          </button>
        ))}
      </div>

      {/* آپلود فایل */}
      <p className="font-medium mb-3 text-gray5">تصویر رسید</p>
      <input ref={fileInputRef} disabled={isUploading} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
      <div
        className={`relative w-full mx-auto my-5 p-4 border-2 border-dashed rounded-lg text-center transition-all ${
          previewURL ? "border-blue2 " : "border-gray31 hover:border-gray12"
        } ${isUploading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        onClick={!isUploading ? handleClick : undefined}
      >
        <div className="flex flex-col items-center justify-center h-48 relative">
          {/* حالت عادی */}
          {!previewURL && (
            <>
              <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15 mb-2">
                <UploadImage />
              </span>
              <p className="text-gray15 lg:text-lg text-sm font-normal">بارگذاری تصویر فیش بانکی</p>
              <p className="text-xs text-gray5 mt-1">(JPG, PNG, PDF)</p>
            </>
          )}

          {/* پیش‌نمایش */}
          {previewURL && (
            <>
              <img src={previewURL} alt="پیش‌نمایش" className="max-h-32 max-w-full rounded-lg object-contain mb-2" />
              <p className="text-xs text-blue2 font-medium truncate max-w-[200px] px-2 py-1 bg-white rounded-full shadow-sm">{selectedFile?.name || "فایل انتخاب شد"}</p>
            </>
          )}
        </div>
      </div>

      {/* دکمه ثبت */}
      <div className="mt-14">
        <button
          onClick={handleSubmit(onSubmit, onInvalid)} // اضافه کردن onInvalid
          disabled={!isFormComplete || loading || isUploading}
          type="button"
          className={`relative text-white2 font-bold text-lg w-full py-3 rounded-lg overflow-hidden transition-all
      ${!isFormComplete ? "bg-blue2 opacity-60 cursor-not-allowed" : "bg-blue2 opacity-100 hover:bg-blue1"}
    `}
        >
          {/* Progress background */}
          {isUploading && <span className="absolute left-0 top-0 bottom-0 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />}

          {/* Button text */}
          <span className="relative z-10">{isUploading ? `در حال ارسال ${uploadProgress}%` : "درخواست کارت به کارت"}</span>
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با فیش بانکی">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>مطمئن شوید فیش بانکی واضح و خوانا باشد.</li>
              <li>مبلغ، تاریخ و شماره پیگیری را بررسی کنید.</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
