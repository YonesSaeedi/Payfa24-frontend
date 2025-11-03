
import { useQuery } from "@tanstack/react-query";
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

export function UseTwoStepVerification() {
  return useQuery<VerificationInfo, Error>({
    queryKey: ['two-step-data'],
    queryFn: () => { return apiRequest({ url: '/account/2fa/get-info' }) },
    staleTime: Infinity,         // always fresh
    gcTime: Infinity,            // never garbage collected
    refetchOnWindowFocus: false, // disable re-fetch on focus
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

}
