// import { JSX, useEffect, useState } from "react";
// import { apiRequest } from "../../utils/apiClient";
// import TicketsDashboard from "../../components/Ticket/TicketChat/TicketsDashboard";
// import TicketPanel from "../../components/Ticket/TicketForm/TicketPanel";

// export default function TicketsRoute() {
//   const [component, setComponent] = useState<JSX.Element | null>(null);

//   useEffect(() => {
//     const checkTickets = async () => {
//       try {
//         const res = await apiRequest<{
//           tickets: any[];
//           last_orders: any[];
//         }>({
//           url: "/ticket/get-info",
//           method: "GET",
//         });

//         if (Array.isArray(res.tickets) && res.tickets.length > 0) {
//           setComponent(<TicketsDashboard />);
//         } else {
//           setComponent(<TicketPanel />);
//         }
//       } catch (err) {
//         console.error("خطا در بررسی تیکت‌ها:", err);
//         setComponent(<TicketPanel />);
//       }
//     };

//     checkTickets();
//   }, []);

//   return component;
// }
import TicketsDashboard from "../../components/Ticket/TicketChat/TicketsDashboard";

export default function TicketsRoute() {
  return <TicketsDashboard />;
}
