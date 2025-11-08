import React, { useEffect, useState } from "react";



import OptionSelector from "./CategorySelector";

import Icontechnical from "../../assets/icons/ticket/Icontechnical";
import IconOrderTracking from "../../assets/icons/ticket/IconOrderTracking";
import IconAuthentication from "../../assets/icons/ticket/IconAuthentication";
import IconFinanchial from "../../assets/icons/ticket/IconFinanchial";
import AuthenticationBasic from "../../pages/authentication/basic";
import TicketsDashboard from "./TicketChat/TicketsDashboard";
import TicketForm from "./TicketForm/TicketForms";
import TradeLayoutFAQ from "../trade/TradeLayoutFAQ";
import { FAQData} from "../../data/faqData"; 

const TAB_COMPONENTS: Record<string, React.ReactNode> = {
  order: <TicketsDashboard />,
  identity: <AuthenticationBasic />,
  tech: <div>صفحه پشتیبانی فنی</div>,
  finance: <div>خرید</div>,
};

const TicketPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);



  useEffect(() => {
    setIsVisible(true);
  }, []);
  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
  };




  
  if (activeTab) {
    return <>{TAB_COMPONENTS[activeTab]}</>;
  }

  
  return (

    <div className="p-6">
      <div className={`${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"} transition`}>
        <div>
          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[85px] justify-center items-stretch">

           
            <div className="w-full lg:w-[625px] flex-1 flex flex-col order-1 lg:order-2">
         
              <div dir="rtl" className="order-1">
                <h3 className="font-semibold mb-2 text-[20px] text-black1">
                  ارسال تیکت برای بخش
                </h3>
                <p className="text-[14px] font-normal text-gray5 pt-2 pb-6">
                  به منظور ارایه بهتر خدمات و راهنمای دقیق‌تر، لطفاً دسته بندی زیر
                  را انتخاب کنید تا تیم پشتیبانی سریع‌تر مشکل شما را حل کند.
                </p>

                <OptionSelector
                  options={[
                    { id: "order", label: "پیگیری سفارش", icon: <IconOrderTracking /> },
                    { id: "identity", label: "احراز هویت", icon: <span className="icon-wrapper text-black2 "><IconAuthentication /></span> },
                    { id: "tech", label: "فنی", icon: <span className="icon-wrapper text-black2 "><Icontechnical /></span> },
                    { id: "finance", label: "مالی", icon: <span className="icon-wrapper text-black2 "><IconFinanchial /></span> },
                  ]}

                  onSelect={handleTabSelect}
                />
              </div>

     
              <div className="w-full p-4 flex-1 order-2 lg:hidden">
                <TicketForm />
              </div>

      
              <div className="mt-6 flex flex-col flex-1 order-3">
                <h3 className="text-lg font-semibold text-right pt-4 text-black0 pb-6">
                  سوالات متداول پیگیری سفارش
                </h3>
                <div dir="rtl" className="w-full flex-1">
                  <TradeLayoutFAQ items={FAQData.home} />

                </div>
              </div>
            </div>

            <div className="hidden lg:block w-full h-full lg:w-[543px] p-4 flex-1 order-2 lg:order-1">
              <TicketForm />
            </div>

          </div>
        </div>
      </div>
    </div>
  )


};

export default TicketPanel;
