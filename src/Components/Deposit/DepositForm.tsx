import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { apiRequest } from "../../utils/apiClient";
import Accordion from "../Withdrawal/Accordion";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/icons/Deposit/IconVideo";
import IconClose from "../../assets/icons/Login/IconClose";

type PaymentGatewayRequestData = Record<string, string | number>;

interface PaymentGatewayResponse {
  status: boolean;
  msg: string;
  link?: string;
  url?: string;
  id: number;
}

// Schema اعتبارسنجی: مبلغ به تومان (بر اساس مقادیر UI)
const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("وارد کردن مبلغ الزامی است")
    .min(300000, "حداقل مبلغ واریز ۳۰۰,۰۰۰ تومان است")
    .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
  bank: yup.string().nullable(),
});

export default function DepositForm() {
  // مقادیر پیشنهادی به تومان
  const amounts = [5000000, 10000000, 20000000, 25000000];

  const urlId = new URLSearchParams(window.location.search).get("id");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: 0,
      bank: "",
    },
  });

  const amountValue = watch("amount");

  const setPresetAmount = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true });
  };

  useEffect(() => {
    console.log("urlId", urlId);
    if (!urlId) return;

    const cleanUrl = () => {
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    };

    apiRequest<any>({
      url: `/api/wallets/fiat/deposit/gateway/${urlId}`,
      method: "GET",
    })
      .then((res) => {
        // بررسی وضعیت تراکنش از بک‌اند
        if (res.status === 200 || res.status) {
          toast.success(res.msg || "تراکنش با موفقیت انجام شد. ✅");
        } else {
          toast.error(res.msg || "تراکنش ناموفق بود. ❌");
        }
        cleanUrl();
      })
      .catch((error) => {
        console.log(error);
        cleanUrl();
      });
  }, [urlId]);

  const onSubmit = async (data: any) => {
    const amountToSend = Number(data.amount);

    try {
      const requestData: PaymentGatewayRequestData = {
        amount: amountToSend,
        card: data.bank,
      };

      const response = await apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
        url: "/api/wallets/fiat/deposit/gateway",
        method: "POST",
        data: requestData,
      });

      // هدایت کاربر به لینک درگاه پرداخت
      const redirectLink = response.link || response.url;
      if (response.status && redirectLink) {
        toast.success("در حال هدایت به درگاه پرداخت... 🚀");
        window.location.href = redirectLink;
      } else {
        toast.error(
          response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد"
        );
      }
    } catch (error: any) {
      const serverMsg =
        error.response?.data?.msg ||
        "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️";
      toast.error(serverMsg);
      console.error("خطای کامل درگاه:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full px-5" dir="rtl">
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

      <div className="mb-2">
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <>
              <FloatingInput
                label="مقدار واریزی (تومان)"
                value={field.value?.toString() ?? ""}
                onChange={field.onChange}
                type="number"
                placeholder="0 تومان "
              />
              {errors.amount && (
                <p className="text-red1 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <p className="text-gray12 text-sm mb-5">
        میزان واریزی حداقل ۳۰۰,۰۰۰ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان
      </p>

      {/* دکمه‌های مبلغ پیشنهادی */}
      <div className="flex gap-2 items-center mb-40 flex-wrap justify-center ">
        {amounts.map((amount, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setPresetAmount(amount)}
            className={`border rounded-lg lg:px-7 px-4 py-2 lg:text-sm text-xs  ${
              Number(amountValue) === amount
                ? "border-blue2 text-blue2"
                : "border-gray12 text-gray12 hover:border-blue2 hover:text-blue2"
            }`}
          >
            {amount / 1000000} میلیون
          </button>
        ))}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "در حال اتصال..." : "واریز"}
        </button>

        <div className="mt-4" dir="ltr">
          <Accordion title="راهنمای واریز با درگاه پرداخت ">
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
    </form>
  );
}
