import { useState } from "react";
import TicketImage from "../../../assets/images/Ticket/massegeIcon/415488451_80b31582-6997-45fb-9105-49e724faee4f 1.png"
import IconCall from "../../../assets/icons/ticket/IconCall";
import SupportCallModal from "../SupportCallModal";
import HeaderLayout from "../../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../BreadcrumbNavigation";
import { Link } from "react-router-dom";


function TicketPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    
    <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12 pt-6">
            <BreadcrumbNavigation />
      <SupportCallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
   
      />

      <div className="flex flex-col items-center justify-center flex-1 pb-5 px-4 overflow-x-hidden">
        <img src={TicketImage} alt="Empty Ticket" className="mb-6" />

        <h2 className="text-center text-[24px] font-medium text-black1 mb-4 max-w-[600px] mx-auto">
          هیچ گونه ارتباطی با پشتیبانی برقرار نکرده‌اید.
        </h2>

        <p className="text-gray5 text-right max-w-[600px] mx-auto leading-relaxed mb-6">
          تاکنون هیچ‌گونه تیکتی با پشتیبانی برقرار نکرده‌اید. تیم پشتیبانی پی‌فا۲۴ در
          تمامی ساعات شبانه‌روز در اختیار شما هستند و هرگونه سوال یا ابهامی دارید
          می‌توانید با تیم پشتیبانی ما در جریان بگذارید.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-[600px] mx-auto w-full ">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-xl border border-blue2 text-blue2"
            onClick={() => setIsModalOpen(true)}
          >
            درخواست تماس با پشتیبانی
            <span className="w-6 h-6 icon-wrapper">
              <IconCall />
            </span>
          </button>
           <Link to="/tickets/create" className="flex-1">
            <button
            className="w-full flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-blue2 text-white1 text-[18px] hover:bg-blue2 transition"
          >
            ایجاد تیکت جدید
            <span className="w-6 h-6 icon-wrapper">
              <IconCall />
            </span>
          </button></Link>
         
        </div>
      </div>
    </div>
    </div>
    </HeaderLayout>
    </div>
    
  );
}

export default TicketPanel;
