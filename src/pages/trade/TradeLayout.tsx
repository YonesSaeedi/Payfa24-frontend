import { Outlet } from "react-router"
import BreadcrumbNavigation from "../../Components/BreadcrumbNavigation"
import HeaderLayout from "../../layouts/HeaderLayout"
import IconWarning from "../../assets/icons/trade/IconWarning"
import TradeLayoutFAQ from "../../Components/trade/TradeLayoutFAQ"




  const FAQData = [
  {
    id: 1,
    question: "چگونه در پی‌فا24 ارز دیجیتال بفروشیم؟",
    answer: "برای فروش ارز دیجیتال در صرافی پی‌فا24، ابتدا باید هویت خود را تایید کنید. سپس به بخش خرید و فروش رفته، ارز مورد نظر را انتخاب کرده و مقدار آن را وارد کنید. در نهایت با کلیک بر روی گزینه فروش، تراکنش خود را تکمیل کنید."
  },
  {
    id: 2,
    question: "حداقل مبلغ خرید و فروش چقدر است؟",
    answer: "حداقل مبلغ خرید و فروش در پی فا 24 بسته به نوع ارز متفاوت است. برای اطلاع از حداقل مبلغ، به صفحه جزئیات هر ارز مراجعه کنید."
  },
  {
    id: 3,
    question: "آیا امکان بازگشت تراکنش‌ها وجود دارد؟",
    answer: "خیر، تراکنش‌های ارز دیجیتال غیرقابل بازگشت هستند. لطفاً قبل از تایید تراکنش، تمامی جزئیات را به دقت بررسی کنید."
  },
  {
    id: 4,
    question: "آیا میتوان جزئیات سفارش انجام شده را مشاهده کنم؟",
    answer: "بله , تمامی سفارش‌های انجام شده را میتوانید در قسمت تاریخچه تراکنش‌های حساب کاربری شما ثبت میشود و در هر لحظه میتوانید مشاهده کنید."
  },
  {
    id: 5,
    question: "اگر خرید انجام نشد و با خطا مواجه شد , باید چه کنم؟",
    answer: "در صورت مواجهه با خطا ابتدا اتصال اینترنت خود را بررسی کنید در صورتی که همچنان مشکل داشت با پشتیبانی پی‌فا24 تماس بگیرید تا بررسی شود."
  },
];





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
            <div className="lg:bg-bg2 rounded-2xl w-full lg:shadow-[0_0_12px_0_#00000029] lg:p-16 flex flex-col lg:flex-row gap-8 lg:gap-10" dir="rtl">
              {/* child pages will render here ==================================================================================================== */}
              <div className="lg:w-1/2">
                <Outlet />
              </div>
              {/* layout content ==================================================================================================== */}
              <div className="lg:w-1/2 flex flex-col" dir="rtl">
                <div className="lg:mb-4 mb-6 lg:py-6 py-4 px-4 rounded-xl lg:rounded-2xl bg-bg3 flex flex-col gap-3 lg:gap-4">
                  <div className="flex items-center gap-1">
                    <span className="icon-wrapper w-5 h-5 lg:w-6 lg:h-6 text-text3"><IconWarning /></span>
                    <h4 className="text-sm lg:text-lg font-medium text-text3">توجه داشته باشید</h4>
                  </div>
                  <ul className="font-normal text-xs lg:text-base text-text4 list-disc pr-6">
                    <li className="">سقف خرید و فروش از این بخش 5 میلیون تومان است.</li>
                    <li className="">کارمزد پی‌فا 24 برای معاملات آسان همیشه 0 است.</li>
                  </ul>
                </div>
                <h4 className="lg:hidden text-base font-bold mb-3 text-text4">سوالات متداول</h4>
                <TradeLayoutFAQ items={FAQData} />
              </div>
            </div>
          </div>
        </div>
      </HeaderLayout>
    </div>
  )
}

export default TradeLayout