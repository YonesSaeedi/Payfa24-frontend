import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/apiClient"
import { GeneralInfo } from "../types/apiResponses"

const useGetGeneralInfo = () => {
  return useQuery<GeneralInfo, Error>({
    queryKey: ['general'],
    queryFn: () => { return apiRequest({ url: '/get-general-info' }) },
    staleTime: Infinity,         // always fresh
    gcTime: Infinity,            // never garbage collected
    refetchOnWindowFocus: false, // disable re-fetch on focus
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

}

export default useGetGeneralInfo 