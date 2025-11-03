import React from "react";
import { Ticket } from "./types";
import StatusBadge from "../../UI/Button/StatusBadge";
import { ticketStatusMap } from "../../../utils/statusMap"; 


interface TicketItemProps {
  ticket: Ticket;
  active: boolean;
  onClick: () => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, active, onClick }) => {
 const statusText = ticketStatusMap[ticket.status] || "نامشخص";


  return (
    <div
      className={`p-3 mb-4 rounded-xl cursor-pointer border transition hover:shadow-md ${
        active ? "border-blue2 bg-gray27" : "border-gray21 bg-gray27"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between mt-2 mb-3">
        <div className=" text-black1 text-[16px] font-medium">{ticket.title}</div>
        <div className="mt-1 text-sm">
          <StatusBadge text={statusText} /> 
        </div>
      </div>
      <div dir="rtl" className="flex justify-between mt-3 ">
        <div dir="rtl" className="text-[14px] font-normal   text-gray5">
          شماره پیگیری : #{ticket.id}
        </div>
        <div className=" text-gray-500 mt-1n text-gray5 text-[14px] font-light">{ticket.date}</div>
      </div>
    </div>
  );
};

export default TicketItem;
