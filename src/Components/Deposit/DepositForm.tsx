
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// ⚠️ مسیر ایمپورت apiRequest را با توجه به پروژه خود اصلاح کنید
import { apiRequest } from "../../utils/apiClient"; 

// کامپوننت‌های UI (بدون تغییر)
import Accordion from "../Withdrawal/Accordion";
import FloatingInput from "../FloatingInput/FloatingInput";
import IconVideo from "../../assets/Icons/Deposit/IconVideo";


interface PaymentGatewayRequestData {
    amount: number; // مقدار واریزی (تومان/ریال بسته به توافق با بک‌اند)
    card: string;   // فیلدی که ممکن است بک‌اند انتظارش را بکشد
}

interface PaymentGatewayResponse {
    status: boolean;
    msg: string;
    link?: string; // لینک هدایت به درگاه پرداخت
    url?: string; // ممکن است بک‌اند شما از 'url' به جای 'link' استفاده کند (من هر دو را می‌نویسم)
    id: number;
}

// Schema اعتبارسنجی: مبلغ به تومان (بر اساس مقادیر UI)
const validationSchema = yup.object().shape({
    amount: yup
        .number()
        .typeError("مبلغ باید عدد باشد")
        .required("وارد کردن مبلغ الزامی است")
        // حداقل و حداکثر به تومان (۲۵ هزار تا ۲۵ میلیون تومان)
        .min(25000, "حداقل مبلغ واریز ۲۵,۰۰۰ تومان است") 
        .max(25000000, "حداکثر مبلغ واریز ۲۵ میلیون تومان است"),
    bank: yup.string().nullable(), 
});


export default function DepositForm() {
    
    // مقادیر پیشنهادی به تومان 
    const amounts = [5000000, 10000000, 20000000, 25000000]; 
    
    // ۱. گرفتن ID از URL پس از بازگشت از درگاه (Callback)
    const urlId = new URLSearchParams(window.location.search).get("id");

    const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            amount: "", 
            bank: "",
        }
    });

    const amountValue = watch("amount");
    
    const setPresetAmount = (amount: number) => {
        setValue("amount", amount, { shouldValidate: true });
    };

    // --- ۲. منطق بررسی نهایی تراکنش (Callback) با درخواست GET ---
    useEffect(() => {
        // اگر id در URL وجود نداشت، از اجرای این تابع جلوگیری کن
        if (!urlId) return;

        // تابعی برای حذف پارامترهای اضافی از URL پس از پردازش
        const cleanUrl = () => {
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        };
        
        // **درخواست GET برای نهایی‌سازی تراکنش**
        apiRequest<any>({
            // URL شما که حاوی id برگشتی از درگاه است
            url: `/api/wallets/fiat/deposit/gateway/${urlId}`,
            method: 'GET',
        })
        .then(res => {
            // بررسی وضعیت تراکنش از بک‌اند
            if (res.status === 200 || res.status) {
                 toast.success(res.msg || "تراکنش با موفقیت انجام شد. ✅");
            } else {
                 toast.error(res.msg || "تراکنش ناموفق بود. ❌");
            }
            cleanUrl();
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.msg || "خطا در بررسی وضعیت تراکنش.";
            toast.error(errorMessage);
            cleanUrl();
        });
        
    }, [urlId]); // این useEffect فقط زمانی اجرا می‌شود که urlId تغییر کند (در بارگذاری اولیه صفحه Callback)


    // --- ۳. هندلر ارسال فرم و هدایت به درگاه (API اول: درخواست POST) ---
    const onSubmit = async (data: any) => {
        
        // 🔑 مهم: ارسال مقدار واریزی دقیقاً همانطور که کاربر وارد کرده (بدون ضرب در ۱۰)
        // با فرض اینکه بک‌اند شما این مقدار را می‌پذیرد.
        const amountToSend = Number(data.amount); 
        
        try {
            const requestData: PaymentGatewayRequestData = {
                amount: amountToSend, 
                card: data.bank, 
            };

            const response = await apiRequest<PaymentGatewayResponse, PaymentGatewayRequestData>({
                url: "/api/wallets/fiat/deposit/gateway", // API برای دریافت لینک درگاه
                method: "POST",
                data: requestData,
            });

            // هدایت کاربر به لینک درگاه پرداخت
            const redirectLink = response.link || response.url;
            if (response.status && redirectLink) {
                toast.info("در حال هدایت به درگاه پرداخت... 🚀");
                window.location.href = redirectLink; 
            } else {
                toast.error(response.msg || "خطا: لینک درگاه پرداخت از سرور دریافت نشد. 🚫");
            }

        } catch (error: any) {
             // نمایش پیام خطای ۴۰۰ که از بک‌اند برمی‌گردد
            const serverMsg = error.response?.data?.msg || "خطا در اتصال به سرور. دوباره امتحان کنید. ⚠️";
            toast.error(serverMsg);
            console.error("خطای کامل درگاه:", error);
        }
    };
    
    // --- ۴. رندر UI ---
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:px-7" dir="rtl">
            
            {/* ... (بخش‌های UI بدون تغییر) ... */}
            
            <div className="mb-8 bg-blue14 text-blue2 flex items-center p-3 rounded-lg gap-2">
                <span className="icon-wrapper w-6 h-6 text-blue2"><IconVideo /></span>
                <span>ویدیو آموزشی واریز با درگاه پرداخت</span>
            </div>

            <div dir="rtl" className="mb-1.5">
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <>
                            <FloatingInput
                                label="مقدار واریزی (تومان)"
                                value={field.value}
                                onChange={field.onChange}
                                type="number"
                                placeholder="0 تومان "
                                placeholderColor="text-black0"
                            />
                            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
                        </>
                    )}
                />
            </div>
            
            {/* 💡 فیلد کنترلر bank به صورت مخفی برای سازگاری با بک‌اند */}
            <Controller name="bank" control={control} render={({ field }) => <input type="hidden" {...field} />} />


            <p className="text-gray12 text-sm mb-5">
                میزان واریزی حداقل ۲۵ هزار تومان و حداکثر تا سقف ۲۵ میلیون تومان{" "}
            </p>
            
            {/* دکمه‌های مبلغ پیشنهادی */}
            <div className="flex gap-2 items-center mb-12 flex-wrap justify-center">
                {amounts.map((amount, index) => (
                    <button
                        type="button" 
                        key={index}
                        onClick={() => setPresetAmount(amount)}
                        className={`border rounded-lg px-7 py-2 text-sm transition ${
                            Number(amountValue) === amount ? 'border-blue2 text-blue2' : 'border-gray12 text-gray12 hover:border-blue2 hover:text-blue2'
                        }`}
                    >
                        {amount / 1000000} میلیون
                    </button>
                ))}
            </div>

            <div className="mt-16">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white2 bg-blue2 w-full py-3 font-bold text-lg rounded-lg ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
                >
                    {isSubmitting ? 'در حال اتصال...' : 'واریز'}
                </button>

                <div className="mt-4" dir="ltr">
                    <Accordion title="راهنمای واریز با درگاه پرداخت ">
                        <ul className="list-disc pr-5 space-y-2 text-black1">
                            <li>از صحت آدرس صفحه‌ پرداخت و بودن در یکی از سایت‌های سامانه‌ی شاپرک مطمئن شوید. (صفحه درگاه الزاما .shaparak.ir باشد)</li>
                            <li>مطمئن شوید مبلغ نمایش‌ داده‌شده در صفحه‌ی پرداخت درست باشد.</li>
                        </ul>
                    </Accordion>
                </div>
            </div>
        </form>
    );
}