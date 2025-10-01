import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../utils/apiClient";

interface TwofaType {
  status: boolean;
  type: string;
}

interface GoogleType {
  secret: string;
  inlineUrl?: string;
}

interface TelegramType {
  secret: string;
}

interface VerificationInfo {
  twofa: TwofaType;
  google: GoogleType;
  telegram: TelegramType;
}

let cache: VerificationInfo | null = null;

export function UseTwoStepVerification() {
  const [data, setData] = useState<VerificationInfo | null>(cache);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest({ url: "/api/account/2fa/get-info" }) as { data: VerificationInfo };
      setData(res);
      cache = res;  
    } catch (err) {
      setError(err);
      console.error("/account/2fa/get-info:", err);
    } finally {
      setLoading(false);
    }
  }, []);


  // فقط وقتی کش خالی است یا میخوایم رفرش کنیم، fetch کنیم
  useEffect(() => {
    if (!cache) {
      fetchData();
    }
  }, [fetchData]);

  // تابع رفرش دستی داده‌ها (کش رو آپدیت می‌کنه)
  const refresh = () => {
    fetchData();
  };

  return { data, loading, error, refresh };
}
