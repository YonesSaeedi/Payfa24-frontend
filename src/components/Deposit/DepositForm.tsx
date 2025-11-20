import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import Accordion from "../Withdrawal/Accordion";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import IconClose from "../../assets/icons/Login/IconClose";
import { formatPersianDigits } from "../../utils/formatPersianDigits";
import { toPersianDigits } from "./CardToCardTransfer";

type PaymentGatewayRequestData = Record<string, string | number>;

interface PaymentGatewayResponse {
  status: boolean;
  msg: string;
  link?: string;
  url?: string;
  id: number;
}

// props دریافتی از DepositPage
interface DepositFormProps {
  minDeposit: number;
  maxDeposit: number;
  isDataLoaded?: boolean;
}

export default function DepositForm({ minDeposit, maxDeposit, isDataLoaded }: DepositFormProps) {
  const presetAmounts = [5000000, 10000000, 20000000, 25000000];
  const urlId = new URLSearchParams(window.location.search).get("id");
  const getValidationSchema = (min: number, max: number) =>
    yup.object().shape({
      amount: yup
        .number()
        .typeError("وارد کردن مبلغ الزامی است")
        .min(min, `حداقل مبلغ واریز ${toPersianDigits(min.toLocaleString())} تومان است`)
        .max(max, `حداکثر مبلغ واریز ${toPersianDigits(max.toLocaleString())} تومان است`)
        .required("وارد کردن مبلغ الزامی است"),
      bank: yup.string().nullable(),
    });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(getValidationSchema(minDeposit, maxDeposit)),
    defaultValues: {
      bank: "",
      amount: undefined,
    },
    mode: "onChange",
  });

  const amountValue = watch("amount");
  const hasCheckedRef = useRef(false);
  // فقط برای چک کردن urlId (نتیجه پرداخت)
  useEffect(() => {
    if (!urlId || hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const cleanUrl = () => {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    };

    apiRequest<any>({
      url: `/wallets/fiat/deposit/gateway/${urlId}`,
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200 || res.status) {
          toast.success(res.msg || "تراکنش با موفقیت انجام شد.");
        } else {
          toast.error(res.msg || "تراکنش ناموفق بود.");
        }
        cleanUrl();
      })
      .catch(() => {
        toast.error("خطا در بررسی وضعیت تراکنش");
        cleanUrl();
      });
  }, [urlId]);

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true });
  };

  const onSubmit = async (data: any) => {
    const amountToSend = Number(data.amount);
    try {
      const requestData: PaymentGatewayRequestData = {
        amount: amountToSend,
        card: data.bank,
      };

      const response = await apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
        url: "/wallets/fiat/deposit/gateway",
        method: "POST",
        data: requestData,
      });

      const redirectLink = response.link || response.url;
      if (response.status && redirectLink) {
        toast.success("در حال هدایت به درگاه پرداخت...");
        window.location.href = redirectLink;
      } else {
        toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد");
      }
    } catch (error: any) {
      const serverMsg = error.response?.data?.msg || "خطا در اتصال به سرور. دوباره امتحان کنید.";
      toast.error(serverMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full" dir="rtl">
      {/* ویدیو */}
      <div className="mb-10 bg-blue14 px-3 py-[14px] rounded-lg text-blue2 flex items-center justify-between">
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

      {/* فیلد مبلغ */}
      <div className="mb-2">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <>
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
              />
              {errors.amount && <p className="text-red1 text-sm mt-1">{errors.amount.message}</p>}
            </>
          )}
        />
      </div>

      {/* پیام حداقل و حداکثر */}
      <p className="text-gray12 lg:text-sm text-xs mb-5">
        میزان واریزی حداقل
        {!isDataLoaded ? (
          <span className="inline-block w-16 h-5 mx-1 rounded  align-middle skeleton-bg"></span>
        ) : (
          <span> {formatPersianDigits(minDeposit.toLocaleString())} </span>
        )}
        تومان و حداکثر تا سقف {formatPersianDigits(maxDeposit.toLocaleString())} تومان
      </p>

      {/* دکمه‌های مبلغ پیشنهادی */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mb-40 flex-wrap justify-center ">
        {presetAmounts.map((amount, index) => {
          const isValid = amount >= minDeposit && amount <= maxDeposit;
          const isSelected = Number(amountValue) === amount;

          return (
            <button
              type="button"
              key={index}
              onClick={() => isValid && setPresetAmount(amount)}
              disabled={!isValid}
              className={`border rounded-lg w-full py-2 lg:text-sm text-xs transition-all ${
                isSelected
                  ? "border-blue2 text-blue2"
                  : isValid
                  ? "border-gray12 text-gray12 hover:border-blue2 hover:text-blue2"
                  : "border-gray12 text-gray10 opacity-50 cursor-not-allowed"
              }`}
            >
              {formatPersianDigits(amount / 1000000)} میلیون
            </button>
          );
        })}
      </div>

      {/* دکمه ارسال */}
      <div>
        <button
          type="submit" // دکمه فقط زمانی فعال باشد که isValid=true و isSubmitting=false باشد
          disabled={isSubmitting || !isValid}
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg transition-all 
 ${
   isSubmitting || !isValid ? "opacity-60 cursor-not-allowed" : "opacity-100 hover:bg-blue1" // نمایش (opacity-100)
 }`}
        >
          {isSubmitting ? "در حال اتصال..." : "واریز"}
        </button>

        {/* راهنما */}
        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با درگاه پرداخت">
            <ul className="list-disc pr-5 space-y-2 text-black1">
              <li>از صحت آدرس صفحه‌ی پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
              <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
            </ul>
          </Accordion>
        </div>
      </div>
    </form>
  );
}
