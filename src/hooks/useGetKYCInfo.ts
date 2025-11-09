import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../utils/apiClient";
import { KycGetInfo } from "../types/apiResponses";

const useGetKYCInfo = () => useQuery<KycGetInfo>({
  queryKey: ['kyc'],
  queryFn: () => apiRequest({ url: '/kyc/get-info' }),
  staleTime: Infinity,         // always fresh
  gcTime: Infinity,            // never garbage collected
  refetchOnWindowFocus: false, // disable re-fetch on focus
  refetchOnReconnect: false,
  refetchOnMount: false,
})

export default useGetKYCInfo