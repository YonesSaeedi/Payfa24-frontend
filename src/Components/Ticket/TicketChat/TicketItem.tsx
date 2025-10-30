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
        active ? "border-blue-500 bg-gray27" : "border-gray21 bg-gray27"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between mt-2 mb-3">
        <div className="font-medium text-black1 text-base">{ticket.title}</div>
        <div className="mt-1 text-sm">
          <StatusBadge text={statusText} /> 
        </div>
      </div>
      <div dir="rtl" className="flex justify-between mt-3 ">
        <div dir="rtl" className="font-medium text-black1 text-sm text-gray5">
          شماره پیگیری : #{ticket.id}
        </div>
        <div className="text-sm text-gray-500 mt-1n text-gray5">{ticket.date}</div>
      </div>
    </div>
  );
};

export default TicketItem;
