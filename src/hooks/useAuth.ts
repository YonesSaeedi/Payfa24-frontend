import { useEffect, useState } from "react"

const useAuth = () => {
  // initialize first isAuthenticated value ======================================================================
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    const expiresAt = localStorage.getItem("expiresAt");
    return !!(access && refresh && expiresAt)
  })
  // can be updated on instances like log out or ... =====================================================================
  useEffect(() => {
    const handleStorageChange = () => {
      const access = localStorage.getItem("accessToken");
      const refresh = localStorage.getItem("refreshToken");
      const expiresAt = localStorage.getItem("expiresAt");
      setIsAuthenticated(!!(access && refresh && expiresAt))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { isAuthenticated }
}

export default useAuth