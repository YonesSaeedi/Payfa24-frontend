// =============================================================
// توابع مربوط به ماژول دعوت (Referral API Functions)
// =============================================================

// فرض می‌کنیم apiClient شما در این مسیر قرار دارد
import { apiRequest } from "../apiClient"; 


export interface SetPercentResponse {
  status: boolean;
  msg: string;
}

// ساختار یک آیتم تراکنش (از lists)
export interface TransactionItem {
  id: number;
  amount: number;
  name: string; // نام کاربر
  description: string;
  date: string;
  for_user: string;
  percent_caller: number; // پورسانت شما
  percent_referral: number; // پورسانت دوستان
  total_wage_amount: number; // کل کارمزد
}

// ساختار پاسخ نهایی API لیست تراکنش‌ها
export interface ListTransactionResponse {
  lists: TransactionItem[];
  total: number; // تعداد کل آیتم‌ها برای صفحه بندی
}


export interface InvitedUserReportItem {
  id: number;
  Date: string; // تاریخ ثبت نام/دعوت (به نام 'Date' دقت کنید)
  Name: string; // نام کاربر
  percent_caller: number;
  percent_referral: number;
}

// ساختار پاسخ کامل گزارش (شامل تمام اطلاعات کلی پنل)
export interface ReferralReportResponse {
  referralPercent: number; // درصد سود شما (مثلاً 15)
  refid: number;
  reflink: string;
  user_referral: InvitedUserReportItem[]; // 👈 لیست کاربران دعوت شده
  referral_transaction_count: number;
  referral_transaction_amount: number;
}


// -----------------------------------------------------------
// ۲. توابع API صادراتی (Exported Functions)
// -----------------------------------------------------------

/**
 * ⭐️ تعریف Interface بدنه درخواست (Request Body)
 */
interface SetPercentRequestBody {
  referralsPercent: number;
}

/**
 * تنظیم درصد پورسانت سهم دوست در سیستم رفرال
 * مسیر: POST /referrals/set-percent
 * @param percent پورسانت سهم دوست کاربر (ReferralsPercent)
 */
export async function setReferralCommission(
  percent: number
): Promise<SetPercentResponse> {
  // 👈 در اینجا، data از نوع SetPercentRequestBody است.
  const data: SetPercentRequestBody = { 
    referralsPercent: percent,
  };

  // ✅ اصلاح فراخوانی: 
  // با استفاده از Generic سوم (TBody) برای apiClient، به آن می‌گوییم که
  // انتظار دارد بدنه درخواست از نوع SetPercentRequestBody باشد.
  const response = await apiRequest<
      SetPercentResponse, // TResponse
      undefined,          // TParams
      SetPercentRequestBody 
  >({
    url: "/api/referrals/set-percent",
    method: "POST",
    data: data,
  });

  return response;
}

/**
 * دریافت لیست تراکنش‌های رفرال
 * مسیر: GET /referrals/list-transaction
 * @param page شماره صفحه (پیش‌فرض: 1)
 * @param sort فیلد مرتب‌سازی (مثلاً 'amount')
 * @param sortType نوع مرتب‌سازی (asc یا desc)
 */
export async function getReferralTransactions(
  page: number = 1,
  sort: string = 'date',
  sortType: 'asc' | 'desc' = 'desc'
): Promise<ListTransactionResponse> {
  
  // ⭐️ تعریف Interface پارامترهای Query
  interface TransactionParams {
      page: string;
      sort: string;
      sortType: 'asc' | 'desc';
  }
  
  // ساخت پارامترهای Query String
  const params: TransactionParams = { // 👈 تخصیص تایپ
    page: page.toString(),
    sort: sort,
    sortType: sortType,
  };

  // ✅ اصلاح فراخوانی: 
  // با استفاده از Generic دوم (TParams)، به apiClient می‌گوییم که پارامترها از چه نوعی هستند.
  // Generic سوم (TBody) را روی undefined می‌گذاریم، چون GET بدنه ندارد.
  const response = await apiRequest<
      ListTransactionResponse, // TResponse
      TransactionParams,       // TParams 👈 Type مربوط به 'params'
      undefined                // TBody
  >({
    url: "/api/referrals/list-transaction",
    method: "GET",
    params: params, // ارسال پارامترها
  });

  return response;
}

/**
 * دریافت گزارش کامل ارجاع.
 * مسیر: GET /referrals/get-reports
 */
export async function getReferralReport(): Promise<ReferralReportResponse> {
  // ✅ اصلاح فراخوانی: 
  // در این درخواست GET، فقط TResponse را نیاز داریم.
  const response = await apiRequest<ReferralReportResponse>({
    url: "/api/referrals/get-reports",
    method: "GET",
  });

  return response;
}