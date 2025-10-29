import { useEffect, useState } from "react"
import IconFullscreen from "../../assets/icons/market-view/IconFullscreen"
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation"
import HeaderLayout from "../../layouts/HeaderLayout"
import IconExitFullscreen from "../../assets/icons/market-view/IconExitFullscreen"

const MarketViewPage = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // locks the screen and prevent scrolling in fullscreen ==============================================================================================
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    } // cleanup on unmount
  }, [isFullscreen])

  return (
    <HeaderLayout>
      {/* mobile ======================================================================================================================================== */}
      <div className="lg:hidden w-full flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-4"><BreadcrumbNavigation /></div>
        <div className="flex-1 relative">
          {isLoading &&
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <div className="w-12 h-12 border-4 border-blue2 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
          <iframe src="https://app.arz8.com/api/coin360" title="Crypto market map" className="w-full h-full border-none" loading="lazy" onLoad={() => setIsLoading(false)} />
        </div>
      </div>
      {/* desktop ======================================================================================================================================= */}
      <div className="hidden lg:block w-full h-screen">
        <div className="container-style w-full h-full">
          <div className="py-4 flex flex-col gap-12 h-full">
            <BreadcrumbNavigation />
            <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-[60] ' : 'h-full'}`} dir="rtl">
              <div className="flex items-center justify-between py-4 px-6 bg-gray47">
                <h2 className="font-medium text-2xl text-black2">نمای بازار</h2>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className={`w-7 h-7 text-blue2 transition duration-200 ${isFullscreen ? 'hover:scale-90' : 'hover:scale-110'}`}
                >
                  {isFullscreen ? <IconExitFullscreen /> : < IconFullscreen />}
                </button>
              </div>
              <div className={`${isFullscreen ? 'h-full' : 'h-3/4'}`}>
                <div className="relative w-full h-full">
                  {isLoading &&
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                      <div className="w-12 h-12 border-4 border-blue2 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  }
                  <iframe
                    src="https://app.arz8.com/api/coin360"
                    title="Crypto market map"
                    className="w-full h-full border-none"
                    loading="lazy"
                    onLoad={() => setIsLoading(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  )
}

export default MarketViewPage