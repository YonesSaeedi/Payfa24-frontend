import React, { useEffect, useState } from "react";
import { FAQData } from "../../data/faqData";
import TicketForm from "../../components/Ticket/TicketForm/TicketForms";
import TradeLayoutFAQ from "../../components/trade/TradeLayoutFAQ";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

const CreateTicketPage: React.FC = () => {
  
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
     <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="lg:container-style flex flex-col gap-8 lg:gap-12 pt-6">
            <BreadcrumbNavigation />
    <div>
      <div className={`${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"} transition`}>
        <div className="bg-white1">
         <div className="flex flex-col lg:flex-row justify-center items-stretch gap-[40px] lg:gap-[85px] pb-4">
  <div className="order-2 lg:order-2 w-full lg:w-[652px] flex flex-col pb-14">
    <h3 className="text-lg font-semibold text-right  text-black0 pb-12 pt-2">
      سوالات متداول پیگیری سفارش
    </h3>
    <div dir="rtl" className="flex-1">
      <TradeLayoutFAQ items={FAQData.ticket} />
    </div>
  </div>

  <div className="order-1 lg:order-1 w-full lg:w-[543px] flex flex-col">
    <div className="flex lg:hidden w-full justify-center">
      <TicketForm />
    </div>
    <div className="hidden lg:flex w-full  bg-transparent">
      <TicketForm />
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
    </div>
    </div>
    </HeaderLayout>
    </div>
  );
};

export default CreateTicketPage;
