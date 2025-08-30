import { useState } from "react";
import HeaderLayout from "../layouts/HeaderLayout";
import TicketImage from "../assets/images/Ticket/massegeIcon/415488451_80b31582-6997-45fb-9105-49e724faee4f 1.png";
import IconPlus from "../assets/icons/trade/IconPlus";
import IconCall from "../assets/icons/ticket/IconCall";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import SupportCallModal from "../Components/Ticket/SupportCallModal";
import TicketPanel from "../Components/Ticket/TicketPanel";

function TicketPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTicketPage, setShowTicketPage] = useState(false);

  const handleSupportSubmit = (data: { phone: string; description: string }) => {
    console.log("اطلاعات ارسال شد:", data);
  };

  return (
  <HeaderLayout>
  <SupportCallModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onSubmit={handleSupportSubmit}
  />

  <BreadcrumbNavigation />

  {showTicketPage ? (
    <TicketPanel />
  ) : (
    <div className="flex flex-col items-center justify-center flex-1 bg-white1 px-4 overflow-x-hidden">
      <img src={TicketImage} alt="Empty Ticket" className="mb-6" />

      <h2 className="text-center text-[24px] font-medium text-black1 mb-4 max-w-[600px] mx-auto">
        هیچ گونه ارتباطی با پشتیبانی برقرار نکرده‌اید.
      </h2>

      <p className="text-gray5 text-right max-w-[600px] mx-auto leading-relaxed mb-6">
        تاکنون هیچ‌گونه تیکتی با پشتیبانی برقرار نکرده‌اید. تیم پشتیبانی پی‌فا۲۴ در
        تمامی ساعات شبانه‌روز در اختیار شما هستند و هرگونه سوال یا ابهامی دارید
        می‌توانید با تیم پشتیبانی ما در جریان بگذارید.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 max-w-[600px] mx-auto w-full">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-xl border border-blue2 text-blue2"
          onClick={() => setIsModalOpen(true)}
        >
          درخواست تماس با پشتیبانی
          <span className="w-6 h-6 icon-wrapper">
            <IconCall />
          </span>
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-blue2 text-white1 text-[18px] hover:bg-blue2 transition"
          onClick={() => setShowTicketPage(true)}
        >
          ایجاد تیکت جدید
          <span className="w-6 h-6 icon-wrapper">
            <IconPlus />
          </span>
        </button>
      </div>
    </div>
  )}
</HeaderLayout>

  );
}

export default TicketPage;
