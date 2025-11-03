import { useQuery } from "@tanstack/react-query"
import { apiRequest } from "../utils/apiClient"
import { SettingsInfo } from "../types/api/settings-info"

const useGetSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => { return apiRequest<SettingsInfo>({ url: '/account/settings/info' }) },
    staleTime: Infinity,         // always fresh
    gcTime: Infinity,            // never garbage collected
    refetchOnWindowFocus: false, // disable re-fetch on focus
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

}

export default useGetSettings