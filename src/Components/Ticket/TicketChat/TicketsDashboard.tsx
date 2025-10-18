import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import TicketList from "./TicketList";
import { Ticket } from "./types";

const TicketsDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const tickets: Ticket[] = [
    { id: 1, title: "پیگیری سفارش خرید تتر", status: "answered", date: "1402/08/09 - 12:34" },
    { id: 2, title: "پیگیری سفارش خرید تتر", status: "closed", date: "1402/08/09 - 12:34" },
    { id: 3, title: "پیگیری سفارش خرید تتر", status: "answered", date: "1402/08/09 - 12:34" },
    { id: 4, title: "پیگیری سفارش خرید تتر", status: "pending", date: "1402/08/09 - 12:34" },
  ];

  return (
 <div className="flex h-screen w-full gap-4  mt-4">
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

