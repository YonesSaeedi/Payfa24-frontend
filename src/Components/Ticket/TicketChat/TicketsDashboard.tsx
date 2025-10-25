import React, { useState, useEffect } from "react";

import { Ticket } from "./types";
import { apiRequest } from "../../../utils/apiClient";
import TicketForm from "../TicketForm/TicketForms";
import ChatPanel from "./ChatPanel";
import TicketList from "./TicketList";
import SupportCallModal from "../SupportCallModal";

const TicketsDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [isSupportCallModalOpen, setIsSupportCallModalOpen] = useState(false);


  const fetchTickets = async () => {
    try {
      const response = await apiRequest<{
        tickets: {
          id: number;
          title: string;
          status: string;
          created: string;
          updated: string;
        }[];
        last_orders: any[];
      }>({
        url: "/api/ticket/get-info",
        method: "GET",
      });

     
  const serverTickets: Ticket[] = response.tickets.map(t => ({
  id: t.id,
  title: t.title,
  status: t.status as "answered" | "pending" | "closed",
  date: t.updated || t.created,
}));

setTickets(serverTickets);

    } catch (err) {
      console.error("خطا در دریافت تیکت‌ها:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

    return (
<div className="flex gap-4 mt-4 mb-12 h-[790px]"> {/* ارتفاع کل container همان TicketList */}
  {/* ستون سمت چپ: ChatPanel یا TicketForm */}
  <div className="flex-1 flex justify-center">
    {!showNewTicketForm ? (
      <ChatPanel ticket={activeTicket} />
    ) : (
      <div className="w-full lg:max-w-[543px] h-full">
        <TicketForm /> {/* h-full باعث می‌شود ارتفاع فرم با container برابر شود */}
      </div>
    )}
  </div>

  {/* ستون سمت راست همیشه TicketList */}
  <TicketList
    tickets={tickets}
    activeTicket={activeTicket}
    onSelect={setActiveTicket}
    onNewTicket={() => setShowNewTicketForm(true)}
    onSupportCall={() => setIsSupportCallModalOpen(true)}
  />

  <SupportCallModal
    isOpen={isSupportCallModalOpen}
    onClose={() => setIsSupportCallModalOpen(false)}
  />
</div>


  );
};

export default TicketsDashboard;
