import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : "https://api.payfa24.org/api/v4",
  timeout: 10_000, // 10 seconds default, set longer for heavier requests and set 0 to disable it.
  headers: {
    'Content-Type': 'application/json',
    'X-Device': 'android' // temporarily; to be removed later when mohandes fixed allowed domains for recaptcha !!!!!!!!!!!!!!!!!!!!!!!!!$%^&!%#^@$#%^$#%$^&*$#^&%*(^*^#$#$!#$@%$#^%*)
  }
})

// helper to check expiry
function isTokenExpiringSoon() {
  const expiresAt = localStorage.getItem('expiresAt');
  if (!expiresAt) return false;
  const now = Math.floor(Date.now() / 1000);
  return now >= parseInt(expiresAt, 10) - (5 * 60)
}

// Refresh function
let refreshingPromise: Promise<string | null> | null = null;
// Used to ensure only one refresh request is in flight at a time.
// If multiple requests trigger a refresh, they all await the same promise.
// Once it finishes, refreshingPromise is reset so future refreshes can happen again.
async function refreshAccessToken(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(apiClient.defaults.baseURL + '/api/auth/refresh-token', { refreshToken });
        if (res?.data?.access_token) {
          localStorage.setItem('accessToken', res.data.access_token);
          localStorage.setItem('expiresAt', res.data.expires_in.toString());
          localStorage.setItem('refreshToken', res.data.refresh_token);
          return res.data.access_token;
        } else return null;
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        window.location.href = '/login';
        return null;
      } finally {
        // always clear so the next call can retry if needed
        refreshingPromise = null;
      }
    })();
  }
  return refreshingPromise;
}

// Request interceptor: attach token, refresh if needed
apiClient.interceptors.request.use(async config => {
  if (
    config.url?.includes('/auth/login')
    || config.url?.includes('/auth/forget')
    || config.url?.includes('/auth/forget/reset')
    || config.url?.includes('/auth/register')
    || config.url?.includes('/auth/google')
    // ???
  ) return config;
  let token = localStorage.getItem('accessToken');
  if (isTokenExpiringSoon()) token = await refreshAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresAt');
    window.location.href = '/login';
  }
  return config;
});

// Response interceptor: retry once on 401
// sends the error so you can display it wherever the api is called. ==========================================================================
apiClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest); // retry request
      }
    }
    return Promise.reject(error);
  }
);

// creating apiRequest function that wraps apiClient and handles methods and headers etc. can be exported to another file later. =============================================================
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
// Allowed values for FormData
type FormDataValue = string | number | boolean | Blob | File;
// Fully typed request params
interface ApiRequestParams<
  TData extends Record<string, FormDataValue> | undefined = undefined,
  TParams extends Record<string, unknown> | undefined = undefined
> {
  url: string;
  method?: HttpMethod;
  data?: TData; // JSON or FormData-compatible object
  params?: TParams; // query params
  headers?: Record<string, string>;
  isFormData?: boolean; // flag for file uploads
  timeout?: number; // override default timeout
}

export async function apiRequest<
  TResponse = unknown,
  TData extends Record<string, FormDataValue> | undefined = undefined,
  TParams extends Record<string, unknown> | undefined = undefined
>({
  url,
  method = "GET",
  data,
  params,
  headers,
  isFormData = false,
  timeout,
}: ApiRequestParams<TData, TParams>): Promise<TResponse> {
  const config = {
    url,
    method,
    params,
    headers: {
      ...headers,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    data: isFormData && data ? buildFormData(data) : data,
    timeout,
  };
  const response = await apiClient.request<TResponse>(config);
  return response.data;
}

// Helper for FormData
function buildFormData(data: Record<string, FormDataValue>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    // Convert boolean/number to string automatically
    if (typeof value === "boolean" || typeof value === "number") {
      formData.append(key, String(value));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}