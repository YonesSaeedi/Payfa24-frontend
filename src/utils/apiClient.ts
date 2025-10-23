// apiClient.ts
import axios, { AxiosRequestConfig, AxiosProgressEvent, AxiosRequestHeaders, AxiosError } from "axios";
import { ROUTES } from "../routes/routes";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : "https://api.payfa24.org/api/v4",
  timeout: 10_000,
  headers: {
    // حذف Content-Type پیش‌فرض تا هنگام ارسال FormData مرورگر خودش header مناسب را بسازد
    "X-Device": "website", // to be fixed later !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  },
});

// ---------- helper: token expiry ----------
function isTokenExpiringSoon(): boolean {
  const expiresAt = localStorage.getItem("expiresAt");
  if (!expiresAt) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= parseInt(expiresAt, 10) - 5 * 60;
}

// ---------- single-flight token refresh ----------
let refreshingPromise: Promise<string | null> | null = null;
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(apiClient.defaults.baseURL + "/api/auth/refresh-token", { refreshToken });
        if (res?.data?.access_token) {
          localStorage.setItem("accessToken", res.data.access_token);
          localStorage.setItem("expiresAt", String(res.data.expires_in));
          localStorage.setItem("refreshToken", res.data.refresh_token);
          return res.data.access_token;
        }
        return null;
      } catch (err) {
        toast.error((err as AxiosError<{ msg?: string }>).response?.data?.msg || "خطا در برقراری ارتباط با سرور");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        window.location.href = ROUTES.LOGIN;
        return null;
      } finally {
        refreshingPromise = null;
      }
    })();
  }
  return refreshingPromise;
}

// ---------- request interceptor ----------
apiClient.interceptors.request.use(async (config) => {
  // allow auth routes through
  if (
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/refresh-token") ||
    config.url?.includes("/auth/forget") ||
    config.url?.includes("/auth/forget/reset") ||
    config.url?.includes("/auth/login/login-2fa") ||
    config.url?.includes("/auth/login/resend-2fa") ||
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/google")
  ) {
    return config;
  }
  let token = localStorage.getItem("accessToken");
  if (isTokenExpiringSoon()) token = await refreshAccessToken();
  // ensure headers object exists and has the right type
  if (!config.headers) config.headers = {} as AxiosRequestHeaders;
  if (token) {
    // config.headers may be AxiosRequestHeaders or plain object; cast to any-safe set
    (config.headers).Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresAt");
    window.location.href = "/login";
  }
  return config;
});

// ---------- response interceptor: retry once on 401 ----------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? ({} as AxiosRequestHeaders);
        (originalRequest.headers).Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// ========== apiRequest wrapper ==========
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type FormDataValue = string | number | boolean | Blob | File;

interface ApiRequestParams<TData extends Record<string, FormDataValue> | FormData | undefined = undefined, TParams extends Record<string, unknown> | undefined = undefined> {
  url: string;
  method?: HttpMethod;
  data?: TData;
  params?: TParams;
  headers?: Record<string, string>;
  isFormData?: boolean;
  timeout?: number;
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
}

export async function apiRequest<
  TResponse = unknown,
  TData extends Record<string, FormDataValue> | FormData | undefined = undefined,
  TParams extends Record<string, unknown> = Record<string, unknown>
>({
  url,
  method = "GET",
  data,
  params,
  headers,
  isFormData = false,
  timeout,
  responseType,
  onUploadProgress,
}: ApiRequestParams<TData, TParams> & { onUploadProgress?: (progressEvent?: AxiosProgressEvent) => void }): Promise<TResponse> {
  // prepare outgoing headers
  const outgoingHeaders: Record<string, string> = { ...(headers ?? {}) };
  if (!isFormData) {
    outgoingHeaders["Content-Type"] = "application/json";
  } else {
    // ensure Content-Type is not set so browser/axios creates multipart boundary
    if ("Content-Type" in outgoingHeaders) delete outgoingHeaders["Content-Type"];
  }

  // prepare body: if caller passed FormData, use it; otherwise build
  const body = isFormData
    ? data instanceof FormData
      ? (data as FormData)
      : buildFormData(data as Record<string, FormDataValue>)
    : data;

  const config: AxiosRequestConfig = {

    url,
    method,
    params,
    headers: outgoingHeaders as AxiosRequestHeaders,
    data: body,
    timeout,
    responseType: responseType,
    // Axios expects a function that accepts AxiosProgressEvent; we accept that type in our param
    onUploadProgress: onUploadProgress as ((progressEvent?: AxiosProgressEvent) => void) | undefined,
  };

  const response = await apiClient.request<TResponse>(config);
  return response.data;
}

// Helper: build FormData from plain object (keeps File/Blob as-is)
function buildFormData(data: Record<string, FormDataValue>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "boolean" || typeof value === "number") {
      formData.append(key, String(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}

export default apiClient;
