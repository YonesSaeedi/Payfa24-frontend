// وضعیت های تیکت
export const ticketStatusMap: Record<string, string> = {
  "answered": "پاسخ داده شده",
  "done": "انجام شده",
  "closed": "بسته شده",
  "rejected": "رد شده",
  "pending": "درحال بررسی",
  "awaiting answer": "درحال بررسی",
};

//  وضعیت‌های تراکنش
export const transactionStatusMap: Record<string, string> = {
  "success": "انجام شده",
  "pending": "درحال بررسی",
  "reject": "رد شده",
  "unsuccessful": "ناموفق",
};


//  نوع تراکنش
export const transactionTypeMap: Record<string, string> = {
  deposit: "واریز",
  withdraw: "برداشت",
};
