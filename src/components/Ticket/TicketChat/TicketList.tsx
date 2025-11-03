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

const TicketList: React.FC<TicketListProps> = ({ tickets, activeTicket, onSelect,onNewTicket, onSupportCall, loading }) => (
<div dir="rtl" className="w-[500px] bg-white4 flex flex-col rounded-[16px] lg:h-[790px]">
  <h2 className="text-lg font-semibold mb-6 text-black1">تیکت‌های شما</h2>
  <div className="flex-1 overflow-auto relative px-2">
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
   
  <div className="mt-4 flex flex-col gap-4 ">
    <button  onClick={onNewTicket}   className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 font-bold text-base ">
      <span className="w-8 h-8 icon-wrapper">
        <Iconplus/>
      </span>
      ایجاد تیکت جدید
    </button>
    <button  onClick={onSupportCall}  className="w-full border py-2 rounded-xl hover:bg-gray-50 text-blue2 border-blue2 font-bold text-base">
      <span className="w-8 h-8 icon-wrapper pl-1">
        <IconCall/>
      </span>
      ثبت درخواست تماس با پشتیبانی
    </button>
  </div>
</div>

);

export default TicketList;

