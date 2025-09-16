import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : "https://api.payfa24.org/api/v4",
  timeout: 10_000, // 10 seconds default, set longer for heavier requests and set 0 to disable it.
  headers: {
    'Content-Type': 'application/json',
    'X-Device': 'android' // temporarily; to be removed later when mohandes fixed allowed domains for recaptcha
  }
})

// attaches auth token. ======================================================================================================================
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// sends the error so you can display it wherever the api is called. ==========================================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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