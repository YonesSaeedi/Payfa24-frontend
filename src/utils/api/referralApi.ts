// // =============================================================
// // توابع مربوط به ماژول دعوت (Referral API Functions)
// // =============================================================

// // فرض می‌کنیم apiClient شما در این مسیر قرار دارد
// import { apiRequest } from "../apiClient"; 


// export interface SetPercentResponse {
//   status: boolean;
//   // msg: string;
//   [key: string]: unknown; 
// }

// // ساختار یک آیتم تراکنش (از lists)
// export interface TransactionItem {
//   id: number;
//   amount: number;
//   name: string; // نام کاربر
//   description: string;
//   date: string;
//   for_user: string;
//   percent_caller: number; // پورسانت شما
//   percent_referral: number; // پورسانت دوستان
//   total_wage_amount: number; // کل کارمزد
// }

// // ساختار پاسخ نهایی API لیست تراکنش‌ها
// export interface ListTransactionResponse {
//   lists: TransactionItem[];
//   total: number; // تعداد کل آیتم‌ها برای صفحه بندی
// }


// export interface InvitedUserReportItem {
//   id: number;
//   Date: string; // تاریخ ثبت نام/دعوت (به نام 'Date' دقت کنید)
//   Name: string; // نام کاربر
//   percent_caller: number;
//   percent_referral: number;
// }

// // ساختار پاسخ کامل گزارش (شامل تمام اطلاعات کلی پنل)
// export interface ReferralReportResponse {
//   referralPercent: number; // درصد سود شما (مثلاً 15)
//   refid: number;
//   reflink: string;
//   user_referral: InvitedUserReportItem[]; // 👈 لیست کاربران دعوت شده
//   referral_transaction_count: number;
//   referral_transaction_amount: number;
// }


// // -----------------------------------------------------------
// // ۲. توابع API صادراتی (Exported Functions)
// // -----------------------------------------------------------

// /**
//  * ⭐️ تعریف Interface بدنه درخواست (Request Body)
//  */
// // interface SetPercentRequestBody {
// //   referralsPercent: number;
// // }
// type SetPercentRequestBody = Record<string, string | number | boolean | Blob | File> & {
//   referralsPercent: number;
// };

// /**
//  * تنظیم درصد پورسانت سهم دوست در سیستم رفرال
//  * مسیر: POST /referrals/set-percent
//  * @param percent پورسانت سهم دوست کاربر (ReferralsPercent)
//  */
// export async function setReferralCommission(
//   percent: number
// ): Promise<SetPercentResponse> {
//   const data: SetPercentRequestBody = { 
//     referralsPercent: percent,
//   };

//   // TResponse, TData, TParams
// const response = await apiRequest<
//   SetPercentResponse,      // TResponse
//   SetPercentRequestBody,   // TData (بدنه‌ی POST)
//   Record<string, unknown>   // TParams — می‌تونی این خط رو حذف هم بکنی چون default دارد
// >({
//   url: "/api/referrals/set-percent",
//   method: "POST",
//   data: data,
// });

// }


// /**
//  * دریافت لیست تراکنش‌های رفرال
//  * مسیر: GET /referrals/list-transaction
//  * @param page شماره صفحه (پیش‌فرض: 1)
//  * @param sort فیلد مرتب‌سازی (مثلاً 'amount')
//  * @param sortType نوع مرتب‌سازی (asc یا desc)
//  */
// export async function getReferralTransactions(
//   page: number = 1,
//   sort: string = 'date',
//   sortType: 'asc' | 'desc' = 'desc'
// ): Promise<ListTransactionResponse> {
  
//   // ⭐️ تعریف Interface پارامترهای Query
//   type TransactionParams = Record<string, string | number | boolean> & {
//   page: string;
//   sort: string;
//   sortType: 'asc' | 'desc';
// };

  
//   // ساخت پارامترهای Query String
//   const params: TransactionParams = { // 👈 تخصیص تایپ
//     page: page.toString(),
//     sort: sort,
//     sortType: sortType,
//   };

//   // ✅ اصلاح فراخوانی: 
//   // با استفاده از Generic دوم (TParams)، به apiClient می‌گوییم که پارامترها از چه نوعی هستند.
//   // Generic سوم (TBody) را روی undefined می‌گذاریم، چون GET بدنه ندارد.
//  const response = await apiRequest<
//   ListTransactionResponse,   // TResponse
//   undefined,                 // TData (GET: no body)
//   TransactionParams          // TParams (پارامترهای query)
// >({
//   url: "/api/referrals/list-transaction",
//   method: "GET",
//   params,
// });



//   return response;
// }

// /**
//  * دریافت گزارش کامل ارجاع.
//  * مسیر: GET /referrals/get-reports
//  */
// export async function getReferralReport(): Promise<ReferralReportResponse> {
//   // ✅ اصلاح فراخوانی: 
//   // در این درخواست GET، فقط TResponse را نیاز داریم.
//   const response = await apiRequest<ReferralReportResponse>({
//     url: "/api/referrals/get-reports",
//     method: "GET",
//   });

//   return response;
// }

// src/utils/api/referralApi.ts
import { apiRequest } from "../apiClient";

export interface SetPercentResponse {
  status: boolean;
  msg?: string; // ✅ اضافه کن
  [key: string]: unknown;
}

export interface TransactionItem {
  id: number;
  amount: number;
  name: string;
  description: string;
  date: string;
  for_user: string;
  percent_caller: number;
  percent_referral: number;
  total_wage_amount: number;
}

export interface ListTransactionResponse {
  lists: TransactionItem[];
  total: number;
}

export interface InvitedUserReportItem {
  id: number;
  Date: string;
  Name: string;
  percent_caller: number;
  percent_referral: number;
}

export interface ReferralReportResponse {
  referralPercent: number;
  refid: number;
  reflink: string;
  user_referral: InvitedUserReportItem[];
  referral_transaction_count: number;
  referral_transaction_amount: number;
}

/** بدنۀ درخواست برای ست کردن درصد */
type SetPercentRequestBody = {
  referralsPercent: number;
} & Record<string, string | number | boolean | Blob | File>; // در صورت نیاز به فرمدیتا

/** POST /referrals/set-percent */
export async function setReferralCommission(
  percent: number
): Promise<SetPercentResponse> {
  const data: SetPercentRequestBody = {
    referralsPercent: percent,
  };

  // برای POST بدنه داریم -> جنریک‌ها را به شکل (TResponse, TData) می‌گذاریم
  const response = await apiRequest<SetPercentResponse, SetPercentRequestBody>({
    url: "/api/referrals/set-percent",
    method: "POST",
    data,
  });

  return response;
}

/** GET /referrals/list-transaction */
export async function getReferralTransactions(
  page: number = 1,
  sort: string = "date",
  sortType: "asc" | "desc" = "desc"
): Promise<ListTransactionResponse> {
  type TransactionParams = {
    page: string;
    sort: string;
    sortType: "asc" | "desc";
  };

  const params: TransactionParams = {
    page: page.toString(),
    sort,
    sortType,
  };

  // برای GET: TData = undefined, TParams = TransactionParams
  const response = await apiRequest<
    ListTransactionResponse,
    undefined,
    TransactionParams
  >({
    url: "/api/referrals/list-transaction",
    method: "GET",
    params,
  });

  return response;
}

/** GET /referrals/get-reports */
export async function getReferralReport(): Promise<ReferralReportResponse> {
  const response = await apiRequest<ReferralReportResponse>({
    url: "/api/referrals/get-reports",
    method: "GET",
  });

  return response;
}
