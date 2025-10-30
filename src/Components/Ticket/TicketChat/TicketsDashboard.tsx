import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ اضافه شد
import { Ticket } from "./types";
import { apiRequest } from "../../../utils/apiClient";
import ChatPanel from "./ChatPanel";
import TicketList from "./TicketList";
import SupportCallModal from "../SupportCallModal";
import HeaderLayout from "../../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../BreadcrumbNavigation";

const TicketsDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSupportCallModalOpen, setIsSupportCallModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); 
  const fetchTickets = async () => {
    try {
       setLoading(true);
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

      const serverTickets: Ticket[] = response.tickets.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status as "answered" | "pending" | "closed",
        date: t.updated || t.created,
      }));

      setTickets(serverTickets);
    } catch (err) {
      console.error("خطا در دریافت تیکت‌ها:", err);
    }finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleNewTicket = () => {
    navigate("/tickets/create"); 
  };

  return (
     <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12 pt-6">
            <BreadcrumbNavigation />
    <div className="flex gap-4 mt-4 mb-12 h-[790px]">
      <div className="flex-1 flex justify-center">
        <ChatPanel ticket={activeTicket} />
      </div>

      <TicketList
        tickets={tickets}
        activeTicket={activeTicket}
        onSelect={setActiveTicket}
        onNewTicket={handleNewTicket} 
        onSupportCall={() => setIsSupportCallModalOpen(true)}
        loading={loading}
      />

      <SupportCallModal
        isOpen={isSupportCallModalOpen}
        onClose={() => setIsSupportCallModalOpen(false)}
      />
    </div>
    </div>
    </div>
    </HeaderLayout>
    </div>
  );
};

export default TicketsDashboard;
