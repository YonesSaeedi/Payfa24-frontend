import { Outlet } from "react-router"
import HeaderLayout from "../../layouts/HeaderLayout"
import IconWarning from "../../assets/icons/trade/IconWarning"
import TradeLayoutFAQ from "../../Components/trade/TradeLayoutFAQ"
import { FAQData } from "../../Data/faqData"
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation"

const TradeLayout = () => {

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
            {/* bg image =================================================================================================== */}
            {/* <div className="fixed inset-0 translate-y-1/4 -z-10 hidden lg:block"><BGChart /></div> */}
            {/* breadcrumb navigation ==================================================================================================== */}
            <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation />
            </div>
            {/* content container =========================================================================================================== */}
            <div className="lg:bg-gray25 rounded-2xl w-full lg:shadow-[0_0_12px_0_#00000029] lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-10" dir="rtl">
              {/* child pages will render here ==================================================================================================== */}
              <div className="lg:w-1/2">
                <Outlet />
              </div>
              {/* layout content ==================================================================================================== */}
              <div className="lg:w-1/2 flex flex-col" dir="rtl">
                <div className="lg:mb-4 mb-6 lg:py-6 py-4 px-4 rounded-xl lg:rounded-2xl bg-orange4 flex flex-col gap-3 lg:gap-4">
                  <div className="flex items-center gap-1 text-orange1">
                    <span className="icon-wrapper w-5 h-5 lg:w-6 lg:h-6 text-text3"><IconWarning /></span>
                    <h4 className="text-sm lg:text-lg font-medium text-text3">توجه داشته باشید</h4>
                  </div>
                  <ul className="font-normal text-xs lg:text-base text-text4 list-disc pr-6">
                    <li className="">سقف خرید و فروش از این بخش 5 میلیون تومان است.</li>
                    <li className="">کارمزد پی‌فا 24 برای معاملات آسان همیشه 0 است.</li>
                  </ul>
                </div>
                <h4 className="lg:hidden text-base font-bold mb-3 text-text4">سوالات متداول</h4>
                <TradeLayoutFAQ items={FAQData.trade} />
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </div>
  )
}

export default TradeLayout