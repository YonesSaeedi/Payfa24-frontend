import React from "react";
import TicketItem from "./TicketItem";
import { Ticket } from "./types";
import Iconplus from "../../../assets/icons/ticket/Iconplus";
import IconCall from "../../../assets/icons/ticket/IconCall";
import TicketItemSkeleton from "./TicketItemSkelton";

interface TicketListProps {
  tickets: Ticket[];
  activeTicket: Ticket | null;
  onSelect: (ticket: Ticket) => void;
  onNewTicket: () => void;
  onSupportCall: () => void;
    loading?: boolean
}





const TicketList: React.FC<TicketListProps> = ({
  tickets,
  activeTicket,
  onSelect,
  onNewTicket,
  onSupportCall,
  loading,
}) => (
  <div
    dir="rtl"
    className="w-[500px] bg-white4 flex flex-col rounded-[16px] lg:h-[790px] h-full"
  >
    <h2 className="text-lg font-semibold mb-6 text-black1">تیکت‌های شما</h2>

    {/* لیست تیکت‌ها */}
    <div className="flex-1 overflow-auto relative px-2 mb-4 lg:mb-0">
      {loading ? (
        Array.from({ length: 4 }).map((_, i) => <TicketItemSkeleton key={i} />)
      ) : tickets.length > 0 ? (
        tickets.map((ticket) => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            active={activeTicket?.id === ticket.id}
            onClick={() => onSelect(ticket)}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">تیکتی یافت نشد.</div>
      )}
    </div>

    {/* دکمه‌ها: موبایل ثابت، دسکتاپ عادی */}
   {/* دکمه‌ها: موبایل ثابت، دسکتاپ عادی */}
<div
  className="
    flex flex-col gap-4 items-center
    lg:mt-4 lg:relative
    fixed bottom-0 left-0 w-full px-4 py-4 bg-white4 shadow-inner
    lg:shadow-none lg:fixed-auto lg:w-auto
  "
>
  <button
    onClick={onNewTicket}
    className="max-w-[500px] w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 font-bold text-base flex items-center justify-center gap-2"
  >
    <span className="w-8 h-8 icon-wrapper">
      <Iconplus />
    </span>
    ایجاد تیکت جدید
  </button>

  <button
    onClick={onSupportCall}
    className="max-w-[500px] w-full border py-2 rounded-xl hover:bg-gray-100 text-blue-600 border-blue-600 font-bold text-base flex items-center justify-center gap-2"
  >
    <span className="w-8 h-8 icon-wrapper pl-1">
      <IconCall />
    </span>
    ثبت درخواست تماس با پشتیبانی
  </button>
</div>

  </div>
);


export default TicketList;

