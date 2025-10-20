// import { Controller, useForm } from "react-hook-form";
// import IconVideo from "../../assets/Icons/Deposit/IconVideo";
// import FloatingSelect from "../FloatingInput/FloatingSelect";
// import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
// import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
// import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
// import { yupResolver } from "@hookform/resolvers/yup";
// import FloatingInput from "../FloatingInput/FloatingInput";
// import { useEffect, useRef, useState } from "react";
// import UploadImage from "../../assets/Icons/authentication/UploadImage";
// import Accordion from "../Withdrawal/Accordion";
// import * as yup from "yup";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify"; // فرض می‌کنم از react-toastify استفاده می‌کنی

// // اسکیما validation
// const schema = yup.object().shape({
//   bank: yup.string().required("حساب مبدا الزامی است"),
//   destinationBank: yup.string().required("حساب مقصد الزامی است"),
//   amount: yup.number().min(1000000, "حداقل ۱ میلیون تومان").required("مقدار واریزی الزامی است"),
// });

// type WalletData = {
//   list_cards?: { id: number; bank: string; card: string }[];
//   receipt?: { list_cards?: { iban_number: string }[] };
//   deposit_id?: { destination_iban: string };
// };

// type Props = {
//   onNext: () => void;
//   onFileChange: (file: File | null) => void;
//   initialPreviewUrl: string | null;
// };

// export default function DepositBankReceipt({ onNext, onFileChange, initialPreviewUrl }: Props) {
//   const amounts = [5, 10, 20, 50];
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [previewURL, setPreviewURL] = useState<string | null>(initialPreviewUrl);
//   const [walletData, setWalletData] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { control, handleSubmit, setValue, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: { amount: "" },
//   });

//   // بارگذاری داده‌های کیف پول
//   useEffect(() => {
//     const fetchWalletData = async () => {
//       try {
//         const response = await apiRequest({ url: "/api/wallets/fiat", method: "GET" });
//         setWalletData(response);
//       } catch (err) {
//         // setError("خطا در بارگذاری داده‌ها از API");
//         console.error("خطا در fetch wallet data:", err);
//       }
//     };
//     fetchWalletData();

//     return () => {
//       if (previewURL && previewURL.startsWith("blob:")) URL.revokeObjectURL(previewURL);
//     };
//   }, [initialPreviewUrl]);

//   // مدیریت کلیک برای آپلود فایل
//   const handleClick = () => fileInputRef.current?.click();

//   // مدیریت تغییر فایل
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null;
//     if (previewURL && previewURL.startsWith("blob:")) URL.revokeObjectURL(previewURL);
//     if (file) {
//       const newPreviewURL = URL.createObjectURL(file);
//       setPreviewURL(newPreviewURL);
//       onFileChange(file);
//       setValue("amount", "", { shouldValidate: true });
//     } else {
//       setPreviewURL(null);
//       setValue("amount", "", { shouldValidate: true });
//     }
//   };

//   // تنظیم مقدار واریزی با کلیک روی دکمه‌ها
//   const handleAmountClick = (amount: number) => {
//     setValue("amount", amount * 1000000, { shouldValidate: true });
//   };

//   // ارسال فرم به API
//   const onSubmit = async (data: any) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // اعتبارسنجی داده‌ها
//       if (!data.amount || data.amount < 1000000) throw new Error("مقدار واریزی باید حداقل ۱ میلیون باشد");
//       const selectedCardId = walletData?.list_cards.find((c: any) => c.bank === data.bank)?.id;
//       if (!selectedCardId) throw new Error("کارت مبدا انتخاب نشده است");
//       const payeeIban = walletData?.receipt?.list_cards?.[0]?.iban_number;
//       if (!payeeIban) throw new Error("شماره شبا مقصد از API دریافت نشد");
//       const file = fileInputRef.current?.files?.[0];
//       if (!file) throw new Error("فایل فیش آپلود نشده است");

//       // ساخت FormData
//       const formData = new FormData();
//       formData.append("amount", data.amount.toString());
//       formData.append("payee", payeeIban);
//       formData.append("card", selectedCardId.toString());
//       formData.append("file", file);

//       // دیباگ
//       console.log("ارسال به API:", { amount: data.amount, payee: payeeIban, card: selectedCardId, file: file ? file.name : null });

//       const response = await apiRequest({
//         url: "/api/wallets/fiat/deposit/receipt",
//         method: "POST",
//         data: formData,
//         isFormData: true,
//       });

//       console.log("پاسخ API:", response); // دیباگ برای تأیید
//       toast.success("فیش با موفقیت ثبت شد ");

//       // setIsOpenModalReceipt(false); // اگر هنوز استفاده می‌شه
//       onNext();
//     } catch (err) {
//       setError("خطا: " + (err as any).message);
//       console.error("خطا در onSubmit:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full lg:px-7 my-10" dir="rtl">
//       <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
//         <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
//         <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
//       </div>

//       {/* انتخاب حساب مبدا */}
//       <div className="mb-12">
//         <Controller
//           name="bank"
//           control={control}
//           render={({ field }) => (
//             <FloatingSelect
//               placeholder="حساب مبدا را انتخاب کنید"
//               label="حساب مبدا"
//               value={field.value}
//               onChange={field.onChange}
//               options={
//                 walletData?.list_cards?.map((card: any) => ({
//                   value: card.bank,
//                   label: `${card.bank} - ${card.card}`,
//                   icon: <span className="w-6 h-6 icon-wrapper">{/* آیکون بر اساس bank */}</span>,
//                 })) || []
//               }
//             />
//           )}
//         />
//         {errors.bank && <p className="text-red-500">{errors.bank.message as string}</p>}
//       </div>

//       {/* انتخاب حساب مقصد */}
//       <div className="mb-3">
//         <Controller
//           name="destinationBank"
//           control={control}
//           render={({ field }) => (
//             <FloatingSelect
//               placeholder="حساب مقصد را انتخاب کنید"
//               label="حساب مقصد"
//               value={field.value}
//               onChange={field.onChange}
//               options={
//                 walletData?.receipt?.list_cards?.map((acc: any) => ({
//                   value: acc.iban_number,
//                   label: `${acc.name_bank} - ${acc.account_name}`,
//                   icon: <span className="w-6 h-6 icon-wrapper">{/* آیکون */}</span>,
//                 })) || [{ value: walletData?.deposit_id?.destination_iban, label: walletData?.deposit_id?.destination_bank }]
//               }
//             />
//           )}
//         />
//         {errors.destinationBank && <p className="text-red-500">{errors.destinationBank.message as string}</p>}
//       </div>

//       <p className="text-gray5">حداقل واریز با فیش بانکی، ۱,۰۰۰,۰۰۰ تومان می‌باشد.</p>

//       <div dir="rtl" className="mb-1.5 mt-8">
//         <Controller
//           name="amount"
//           control={control}
//           render={({ field }) => (
//             <FloatingInput
//               label="مقدار واریزی"
//               value={field.value}
//               onChange={field.onChange}
//               type="number"
//               placeholder="۰ تومان"
//               placeholderColor="text-black0"
//             />
//           )}
//         />
//         {errors.amount && <p className="text-red1 text-xs py-3">مقدار واریزی را وارد کنید</p>}
//       </div>

//       <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
//         {amounts.map((amount, index) => (
//           <button
//             key={index}
//             type="button"
//             onClick={() => handleAmountClick(amount)}
//             className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm"
//           >
//             {amount} میلیون
//           </button>
//         ))}
//       </div>

//       <p className="font-medium mb-3 text-gray5">تصویر رسید</p>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*,application/pdf"
//         className="hidden"
//         onChange={handleFileChange}
//       />

//       <div
//         className="relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed border-gray31 rounded-lg text-center"
//         onClick={handleClick}
//       >
//         <div className="flex flex-col items-center justify-center h-48">
//           {previewURL ? (
//             <img
//               src={previewURL}
//               alt="پیش نمایش فیش بانکی"
//               className="max-h-full max-w-full rounded-lg object-contain"
//             />
//           ) : (
//             <>
//               <span className="icon-wrapper lg:w-14 lg:h-14 w-8 h-8 text-gray15"><UploadImage /></span>
//               <p className="text-gray15 lg:text-lg text-sm mt-1 font-normal">بارگذاری تصویر فیش بانکی</p>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="mt-14">
//         <button
//           onClick={handleSubmit(onSubmit)}
//           disabled={loading}
//           className="text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg"
//         >
//           {loading ? "در حال ارسال..." : "ثبت اطلاعات"}
//         </button>

//         <div className="mt-4" dir="ltr">
//           <Accordion title="راهنمای فیش بانکی">
//             <ul className="list-disc pr-5 space-y-2 text-black1">
//               <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
//               <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
//             </ul>
//           </Accordion>
//         </div>
//       </div>
//     </div>
//   );
// }


import { Controller, useForm, useWatch } from "react-hook-form";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";
import FloatingSelect from "../FloatingInput/FloatingSelect";
import BankMelliLogo from "../../assets/icons/BankCards/IconBankMelliLogo";
import BankMellatLogo from "../../assets/icons/BankCards/IconBankMellatLogo";
import BankAnsarLogo from "../../assets/icons/BankCards/IconBankAnsarLogo";
import { yupResolver } from "@hookform/resolvers/yup";
import FloatingInput from "../FloatingInput/FloatingInput";
import { useEffect, useRef, useState, useCallback } from "react";
import UploadImage from "../../assets/Icons/authentication/UploadImage";
import Accordion from "../Withdrawal/Accordion";
import * as yup from "yup";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";

// --- اسکیما validation ---
const schema = yup.object().shape({
  bank: yup.string().required("حساب مبدا الزامی است"),
  destinationBank: yup.string().required("حساب مقصد الزامی است"),
  amount: yup
    .number()
    .min(1000000, "حداقل ۱ میلیون تومان")
    .required("مقدار واریزی الزامی است"),
});

// --- نوع داده‌ها ---
type WalletData = {
  list_cards?: { id: number; bank: string; card: string }[];
  receipt?: {
    list_cards?: {
      iban_number: string;
      name_bank: string;
      account_name: string;
      account_number?: string;
    }[];
  };
  deposit_id?: { destination_iban: string; destination_bank: string };
};

type Props = {
  onNext: () => void;
  onFileChange: (file: File | null) => void;
  initialPreviewUrl: string | null;
};

const bankIconMap: { [key: string]: JSX.Element } = {
  بلوبانک: <BankMellatLogo />,
  "بانک ملی": <BankMelliLogo />,
  "بانک ملت": <BankMellatLogo />,
  "بانک ایران زمین": <BankAnsarLogo />,
  "بانک سامان": <BankMellatLogo />,
  "بانک تجارت": <BankMellatLogo />,
  "بانک کشاورزی": <BankMellatLogo />,
  رسالت: <BankMellatLogo />,
  سایر: <BankAnsarLogo />,
};

const getBankIcon = (bankName: string) => {
  return bankIconMap[bankName] || bankIconMap["سایر"];
};

export default function DepositBankReceipt({
  onNext,
  onFileChange,
  initialPreviewUrl,
}: Props) {
  const amounts = [5, 10, 20, 50];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(initialPreviewUrl);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { amount: "" },
  });

  // --- آپلود فایل با progress ---
  const uploadFile = useCallback(async (file: File, formData: FormData) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await apiRequest({
        url: "/api/wallets/fiat/deposit/receipt",
        method: "POST",
        data: formData,
        isFormData: true,
        onUploadProgress: (event) => {
          if (event?.total && event.loaded) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(percent);
          }
        },
      });

      toast.success("فیش با موفقیت آپلود شد!");
      return true;
    } catch (err) {
      console.error("خطا در آپلود:", err);
      toast.error("خطا در آپلود فیش!");
      return false;
    } finally {
      setIsUploading(false);
    }
  }, []);

  // --- انتخاب فایل + نمایش فوری Preview ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // پاک کردن preview قبلی
    if (previewURL && previewURL.startsWith("blob:")) {
      URL.revokeObjectURL(previewURL);
    }

    if (file) {
      setSelectedFile(file);
      const newPreviewURL = URL.createObjectURL(file);
      setPreviewURL(newPreviewURL);
      onFileChange(file);
      setValue("amount", "", { shouldValidate: true });
    } else {
      setSelectedFile(null);
      setPreviewURL(null);
      onFileChange(null);
      setValue("amount", "", { shouldValidate: true });
    }
  };

  // --- کلیک برای انتخاب فایل ---
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // --- تنظیم مقدار واریزی ---
  const handleAmountClick = (amount: number) => {
    setValue("amount", amount * 1000000, { shouldValidate: true });
  };

  // --- دکمه Submit با Progress در خود دکمه ---
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // چک کردن وجود فایل
      if (!selectedFile) {
        throw new Error("لطفاً فیش را انتخاب کنید");
      }

      // آماده‌سازی FormData
      const selectedCardId = walletData?.list_cards?.find(
        (c) => c.bank === data.bank
      )?.id;
      
      if (!selectedCardId) {
        throw new Error("کارت مبدا انتخاب نشده است");
      }

      const payeeIban = walletData?.receipt?.list_cards?.[0]?.iban_number;
      if (!payeeIban) {
        throw new Error("شماره شبا مقصد در دسترس نیست");
      }

      const formData = new FormData();
      formData.append("amount", data.amount.toString());
      formData.append("payee", payeeIban);
      formData.append("card", selectedCardId.toString());
      formData.append("file", selectedFile);

      // آپلود با progress (نمایش در دکمه)
      const uploadSuccess = await uploadFile(selectedFile, formData);
      
      if (uploadSuccess) {
        setTimeout(() => {
          onNext();
        }, 1500);
      }
    } catch (err: any) {
      setError("خطا: " + err.message);
      console.error("خطا در onSubmit:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- بارگذاری داده‌های کیف پول ---
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await apiRequest({
          url: "/api/wallets/fiat",
          method: "GET",
        });
        setWalletData(response);
      } catch (err) {
        console.error("خطا در fetch wallet data:", err);
      }
    };
    fetchWalletData();

    return () => {
      if (previewURL && previewURL.startsWith("blob:"))
        URL.revokeObjectURL(previewURL);
    };
  }, [initialPreviewUrl, previewURL]);

  return (
    <div className="w-full lg:px-7 my-10" dir="rtl">
      <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
        <span className="icon-wrapper w-6 h-6 text-blue2">
          <IconVideo />
        </span>
        <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
      </div>

      {/* کارت مبدا */}
      <div className="mb-12">
        <Controller
          name="bank"
          control={control}
          render={({ field }) => (
            <FloatingSelect
              placeholder="حساب مبدا را انتخاب کنید"
              label="حساب مبدا"
              value={field.value}
              onChange={field.onChange}
              options={
                walletData?.list_cards?.map((card: any) => ({
                  value: card.bank,
                  label: (
                    <div className="flex items-center justify-between w-full py-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 icon-wrapper">
                          {getBankIcon(card.bank)}
                        </span>
                        <span className="text-sm text-black0">{card.bank}</span>
                      </div>
                      <span className="text-sm text-black0">{card.card}</span>
                    </div>
                  ),
                })) || []
              }
            />
          )}
        />
        {errors.bank && (
          <p className="text-red1 text-xs pt-2">{errors.bank.message as string}</p>
        )}
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
              options={
                walletData?.receipt?.list_cards?.map((acc: any) => ({
                  value: acc.iban_number,
                  label: (
                    <div className="flex items-center justify-between w-full py-1 rounded-md">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 icon-wrapper">
                          {getBankIcon(acc.name_bank)}
                        </span>
                        <span className="text-sm text-black0">
                          {acc.name_bank}
                        </span>
                      </div>
                      <span className="text-sm text-black0">
                        {acc.account_number || acc.iban_number}
                      </span>
                    </div>
                  ),
                })) || []
              }
            />
          )}
        />
        {errors.destinationBank && (
          <p className="text-red1 text-xs pt-2">
            {errors.destinationBank.message as string}
          </p>
        )}
      </div>

      <p className="text-gray5 text-sm">
        حداقل واریز با فیش بانکی، ۱,۰۰۰,۰۰۰ تومان می‌باشد.
      </p>

      {/* مقدار واریزی */}
      <div dir="rtl" className="mb-1.5 mt-8">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <FloatingInput
              label="مقدار واریزی"
              value={field.value}
              onChange={field.onChange}
              type="number"
              placeholder="۰ تومان"
              placeholderColor="text-black0"
            />
          )}
        />
        {errors.amount && (
          <p className="text-red1 text-xs py-3 pt-2">مقدار واریزی را وارد نمایید</p>
        )}
      </div>

      <div className="flex gap-2 items-center mb-12 flex-wrap justify-center mt-4 lg:mt-6">
        {amounts.map((amount, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleAmountClick(amount)}
            className="border border-gray12 rounded-lg px-7 py-2 text-gray12 text-sm hover:bg-gray12/20 transition-colors"
          >
            {amount} میلیون
          </button>
        ))}
      </div>

      {/* آپلود فایل - نمایش Preview فوری */}
      <p className="font-medium mb-3 text-gray5">تصویر رسید</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      
      <div
        className={`relative w-full cursor-pointer mx-auto my-5 p-4 border-2 border-dashed rounded-lg text-center transition-all duration-300 ${
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
              <p className="text-xs text-gray5 mt-1">
                (JPG, PNG, PDF)
              </p>
            </>
          )}

          {/* نمایش Preview + نام فایل */}
          {previewURL && !isUploading && (
            <>
              <img
                src={previewURL}
                alt="پیش نمایش فیش"
                className="max-h-32 max-w-full rounded-lg object-contain mb-2"
              />
              <p className="text-xs text-blue2 font-medium truncate max-w-[200px] px-2 py-1 bg-white rounded-full shadow-sm">
                {selectedFile?.name || "فایل انتخاب شد"}
              </p>
            </>
          )}

          {/* Progress Bar - فقط حین آپلود (overlay) */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-4">
              <div className="w-full max-w-xs bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-blue2 via-blue1 to-green-500 h-3 rounded-full transition-all duration-300 ease-in-out shadow-sm"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-blue2">{uploadProgress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* نمایش خطاها */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* دکمه ثبت - با Progress داخل دکمه */}
      <div className="mt-14">
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading || !selectedFile}
          className="relative text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group transition-all hover:bg-blue1"
        >
          {/* Progress Bar داخل دکمه */}
          {isUploading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue2 via-blue1 to-green-500 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm font-bold">{uploadProgress}%</span>
              </div>
            </div>
          )}
          
          {/* متن دکمه */}
          <span className={isUploading ? "opacity-0" : "opacity-100 transition-opacity"}>
            {loading && !isUploading 
              ? "در حال ارسال..." 
              : !selectedFile 
              ? "ابتدا فیش را انتخاب کنید" 
              : "ثبت اطلاعات"
            }
          </span>
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای فیش بانکی">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>
                از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی
                شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)
              </li>
              <li>
                مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.
              </li>
            </ul>
          </Accordion>
        </div>
      </div>
    </div>
  );
}