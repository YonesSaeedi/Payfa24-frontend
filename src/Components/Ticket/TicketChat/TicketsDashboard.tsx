import React, { useState, useEffect } from "react";
import ChatPanel from "./ChatPanel";
import TicketList from "./TicketList";
import { Ticket } from "./types";
import { apiRequest } from "../../../utils/apiClient";

const TicketsDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // گرفتن تیکت‌ها از سرور
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

      // نگه داشتن همان ساختار مورد نیاز TicketList
      const serverTickets = response.tickets.map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        date: t.updated || t.created, // همان فیلد date
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
    <div className="flex h-screen w-full gap-4 mt-4">
      <ChatPanel ticket={activeTicket} />

      <TicketList
        tickets={tickets}
        activeTicket={activeTicket}
        onSelect={setActiveTicket}
      />
    </div>
  );
};

export default TicketsDashboard;
