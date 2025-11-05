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

// ---------- validation ----------
const schema = yup.object().shape({
  bank: yup.string().required("حساب مبدا الزامی است"),
  destinationBank: yup.string().required("حساب مقصد الزامی است"),
  amount: yup
    .number()
    .min(1_000_000, "حداقل ۱ میلیون تومان")
    .required("مقدار واریزی الزامی است"),
});

// ---------- props ----------
interface BankCard {
  id: number;
  bank: string;
  card: string;
}
interface ReceiptAccount {
  iban_number: string;
  name_bank: string;
  account_name: string;
  account_number?: string;
}
interface DepositBankReceiptProps {
  bankCards: BankCard[];
  receiptAccounts: ReceiptAccount[];
  onNext: () => void;
  onFileChange: (file: File | null) => void;
  initialPreviewUrl: string | null;
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
export default function DepositBankReceipt({
  bankCards,
  receiptAccounts,
  onNext,
  onFileChange,
  initialPreviewUrl,
}: DepositBankReceiptProps) {
  const amounts = [5, 10, 20, 50];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(
    initialPreviewUrl
  );
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
  defaultValues: { amount: undefined, bank: "", destinationBank: "" },
});

const watchAll = watch();
const isFormComplete =
  !!watchAll.bank &&
  !!watchAll.destinationBank &&
  !!watchAll.amount &&
  !!selectedFile;


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
      // setValue("amount", 0, { shouldValidate: true });
    } else {
      setSelectedFile(null);
      setPreviewURL(null);
      onFileChange(null);
      // setValue("amount", 0, { shouldValidate: true });
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleAmountClick = (m: number) =>
    setValue("amount", m * 1_000_000, { shouldValidate: true });

  // ---------- submit ----------
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (!selectedFile) throw new Error("لطفاً فیش را انتخاب کنید");

      const card = bankCards.find((c) => c.bank === data.bank);
      if (!card) throw new Error("کارت مبدا انتخاب نشده است");

      const payeeIban = receiptAccounts[0]?.iban_number;
      if (!payeeIban) throw new Error("شماره شبا مقصد در دسترس نیست");

      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("payee", payeeIban);
      formData.append("card", card.id.toString());
      formData.append("file", selectedFile);

      const ok = await uploadFile(formData);
      if (ok) setTimeout(onNext, 1500);
    } catch (err: any) {
      toast.error(err.message || "خطا در ثبت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" dir="rtl">
      {/* ویدیو */}
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span className="lg:text-sm text-xs">ویدیو آموزشی واریز با فیش بانکی</span>
      </div>

      {/* کارت مبدا */}
      <div className="mb-12">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect // placeholder را برای زمانی که کارتی موجود نیست، روی حالت پیش‌فرض می‌گذاریم. // چون پیغام اصلی در داخل options نمایش داده می‌شود.
              placeholder="حساب مبدا را انتخاب کنید"
              label="حساب مبدا"
              value={field.value}
              onChange={field.onChange} // ⬇️ منطق جدید بر اساس آرایه bankCards
              options={
                bankCards.length === 0
                  ? [
                      {
                        value: "",
                        label: (
                          <div className="text-center w-full py-2 text-gray-500">
                            هیچ کارت ثبت شده‌ای ندارید
                          </div>
                        ) as any,
                        disabled: true, // غیرفعال کردن برای جلوگیری از انتخاب
                        icon: null,
                        hideIndicator: true, // حذف دایره رادیویی
                      },
                    ]
                  : bankCards.map((c) => ({
                      value: c.bank,
                      label: (
                        <div className="flex items-center justify-between w-full py-1">
                          <span className="lg:text-sm text-xs text-black0">
                            {c.bank}
                          </span>
                          <span className="lg:text-sm text-xs text-black0">
                            {formatPersianCardNumber(c.card)}
                          </span>
                        </div>
                      ),
                      icon: (
                        <img
                          src={
                            getBankLogo(c.bank) || "/bank-logos/bank-sayer.png"
                          }
                          alt={c.bank}
                          className="w-6 h-6 object-contain"
                        />
                      ),
                    }))
              }
            />
          )}
          />
      </div>
       

      {/* کارت مقصد */}
      <div className="mb-3">
        <Controller
          name="destinationBank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder={
                receiptAccounts.length
                  ? "حساب مقصد را انتخاب کنید"
                  : "حساب مقصد یافت نشد"
              }
              label="حساب مقصد"
              value={field.value}
              onChange={field.onChange}
              options={receiptAccounts.map((a) => ({
                value: a.iban_number,
                label: (
                  <div className="flex items-center justify-between w-full py-1 rounded-md">
                    <span className="lg:text-sm text-xs text-black0">
                      {a.name_bank}
                    </span>
                    <span className="lg:text-sm text-xs text-black0">
                      {a.account_number || a.iban_number}
                    </span>
                  </div>
                ),
                icon: (
                  <img
                    src={
                      getBankLogo(a.name_bank) || "/bank-logos/bank-sayer.png"
                    }
                    alt={a.name_bank}
                    className="w-6 h-6 object-contain"
                  />
                ),
              }))}
            />
          )}
        />
        {errors.destinationBank && (
          <p className="text-red1 text-xs pt-2">
            {errors.destinationBank.message}
          </p>
        )}
      </div>

      <p className="text-gray5 text-sm">
        حداقل واریز با فیش بانکی، ۱,۰۰۰,۰۰۰ تومان می‌باشد.
      </p>

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
                const englishValue = rawValue
                  .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
                  .replace(/[^0-9]/g, "");
                field.onChange(englishValue ? Number(englishValue) : undefined);
              }}
              placeholder="۰ تومان"
              placeholderColor="text-black0"
            />
          )}
        />
        {errors.amount && (
          <p className="text-red1 text-xs py-3 pt-2">
            مبلغ عددی صحیح وارد کنید
          </p>
        )}
      </div>

      {/* دکمه‌های مبلغ پیشنهادی */}
      <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
        {amounts.map((a, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleAmountClick(a)}
            className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm hover:bg-gray12/20 transition-colors"
          >
          {toPersianDigits(a)} میلیون

          </button>
        ))}
      </div>

      {/* آپلود فایل */}
      <p className="font-medium mb-3 text-gray5">تصویر رسید</p>
      <input
        ref={fileInputRef}
        disabled={isUploading}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        className={`relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed rounded-lg text-center transition-all ${
          previewURL
            ? "border-blue2 bg-blue2/5"
            : "border-gray31 hover:border-gray12"
        }`}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center justify-center h-48 relative">
          {/* حالت عادی */}
          {!previewURL && !isUploading && (
            <>
              <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15 mb-2">
                <UploadImage />
              </span>
              <p className="text-gray15 lg:text-lg text-sm font-normal">
                بارگذاری تصویر فیش بانکی
              </p>
              <p className="text-xs text-gray5 mt-1">(JPG, PNG, PDF)</p>
            </>
          )}

          {/* پیش‌نمایش */}
          {previewURL && !isUploading && (
            <>
              <img
                src={previewURL}
                alt="پیش‌نمایش"
                className="max-h-32 max-w-full rounded-lg object-contain mb-2"
              />
              <p className="text-xs text-blue2 font-medium truncate max-w-[200px] px-2 py-1 bg-white rounded-full shadow-sm">
                {selectedFile?.name || "فایل انتخاب شد"}
              </p>
            </>
          )}

          {/* progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-xs bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-blue2 via-blue1 to-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue2">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* دکمه ثبت */}
      <div className="mt-14">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={!isFormComplete || loading}
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all 
                ${
                  !isFormComplete
                    ? "opacity-60 cursor-not-allowed"
                    : "opacity-100 hover:bg-blue1"
                }`}
        >
          {isUploading ? "در حال ثبت درخواست..." : "درخواست کارت به کارت"}
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای فیش بانکی">
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
