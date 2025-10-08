import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/apiClient"
import { GeneralInfo } from "../types/apiResponses"

const useGetUser = () => {
  return useQuery<GeneralInfo, Error>({
    queryKey: ['general'],
    queryFn: () => { return apiRequest({ url: '/api/account/get-user' }) },
    staleTime: Infinity,         // always fresh
    gcTime: Infinity,            // never garbage collected
    refetchOnWindowFocus: false, // disable re-fetch on focus
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

}

export default useGetUser