// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // ✅ اضافه شد
// import { Ticket } from "./types";
// import { apiRequest } from "../../../utils/apiClient";
// import ChatPanel from "./ChatPanel";
// import TicketList from "./TicketList";
// import SupportCallModal from "../SupportCallModal";
// import HeaderLayout from "../../../layouts/HeaderLayout";
// import BreadcrumbNavigation from "../../BreadcrumbNavigation";

// const TicketsDashboard: React.FC = () => {
//   const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [isSupportCallModalOpen, setIsSupportCallModalOpen] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate(); 
//   const fetchTickets = async () => {
//     try {
//        setLoading(true);
//       const response = await apiRequest<{
//         tickets: {
//           id: number;
//           title: string;
//           status: string;
//           created: string;
//           updated: string;
//         }[];
//         last_orders: any[];
//       }>({
//         url: "/ticket/get-info",
//         method: "GET",
//       });

//       const serverTickets: Ticket[] = response.tickets.map((t) => ({
//         id: t.id,
//         title: t.title,
//         status: t.status as "answered" | "pending" | "closed",
//         date: t.updated || t.created,
//       }));

//       setTickets(serverTickets);
//     } catch (err) {
//       console.error("خطا در دریافت تیکت‌ها:", err);
//     }finally {
//     setLoading(false);
//   }
//   };

//   useEffect(() => {
//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const response = await apiRequest<{
//         tickets: {
//           id: number;
//           title: string;
//           status: string;
//           created: string;
//           updated: string;
//         }[];
//         last_orders: any[];
//       }>({
//         url: "/ticket/get-info",
//         method: "GET",
//       });

//       const serverTickets: Ticket[] = response.tickets.map((t) => ({
//         id: t.id,
//         title: t.title,
//         status: t.status as "answered" | "pending" | "closed",
//         date: t.updated || t.created,
//       }));

//       setTickets(serverTickets);

//       // 👇 اضافه شده: انتخاب خودکار اولین تیکت بعد از لود شدن
//       if (serverTickets.length > 0 && !activeTicket) {
//         setActiveTicket(serverTickets[0]);
//       }

//     } catch (err) {
//       console.error("خطا در دریافت تیکت‌ها:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTickets();
// }, []);


//   const handleNewTicket = () => {
//     navigate("/tickets/create"); 
//   };

//   return (
//      <div className="h-full">
//       <HeaderLayout>
//         <div className="w-full">
//           <div className="lg:container-style flex flex-col gap-8 lg:gap-12 pt-6">
//             <BreadcrumbNavigation />
//     <div className="flex gap-[38px] mx-4 lg:mx-0 mt-4 mb-12 lg:h-[790px] justify-center items-center lg:items-start lg:justify-between">
//   <div className="block lg:hidden w-full flex justify-center">
//     {!activeTicket ? (
//       <TicketList
//         tickets={tickets}
//         activeTicket={activeTicket}
//         onSelect={setActiveTicket}
//         onNewTicket={handleNewTicket}
//         onSupportCall={() => setIsSupportCallModalOpen(true)}
//         loading={loading}
//       />
//     ) : (
//       <div className="w-full">
//         <div className="flex justify-end">
//   <button
//     onClick={() => setActiveTicket(null)}
//     className="mb-4 text-blue-600 font-medium pb-4"
//   >
//     نمایش لیست تیکت ها
//   </button>
// </div>

//         <ChatPanel ticket={activeTicket} />
//       </div>
//     )}
//   </div>

//   <div className="hidden lg:flex flex-1 justify-center">
//     <ChatPanel ticket={activeTicket} />
//   </div>

//   <div className="hidden lg:block">
//     <TicketList
//       tickets={tickets}
//       activeTicket={activeTicket}
//       onSelect={setActiveTicket}
//       onNewTicket={handleNewTicket}
//       onSupportCall={() => setIsSupportCallModalOpen(true)}
//       loading={loading}
//     />
//   </div>

//   <SupportCallModal
//     isOpen={isSupportCallModalOpen}
//     onClose={() => setIsSupportCallModalOpen(false)}
//   />
// </div>

//     </div>
//     </div>
//     </HeaderLayout>
//     </div>
//   );
// };

// export default TicketsDashboard;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket } from "./types";
import { apiRequest } from "../../../utils/apiClient";
import ChatPanel from "./ChatPanel";
import TicketList from "./TicketList";
import SupportCallModal from "../SupportCallModal";
import HeaderLayout from "../../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../BreadcrumbNavigation";
import TicketPanel from "../TicketForm/TicketPanel"; // 👈 اضافه شد

const TicketsDashboard: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isSupportCallModalOpen, setIsSupportCallModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
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
          url: "/ticket/get-info",
          method: "GET",
        });

        const serverTickets: Ticket[] = response.tickets.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status as "answered" | "pending" | "closed",
          date: t.updated || t.created,
        }));

        setTickets(serverTickets);

        if (serverTickets.length > 0 && !activeTicket) {
          setActiveTicket(serverTickets[0]);
        }
      } catch (err) {
        console.error("خطا در دریافت تیکت‌ها:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleNewTicket = () => {
    navigate("/tickets/create");
  };

  // 👈 شرط اضافه: اگر هیچ تیکتی نبود، TicketPanel نمایش داده شود
  if (!loading && tickets.length === 0) {
    return <TicketPanel />;
  }

  return (
    <div className="h-full">
      <HeaderLayout>
        <div className="w-full">
          <div className="lg:container-style flex flex-col gap-8 lg:gap-12 pt-6 px-[15px]">
            <BreadcrumbNavigation />
            <div className="flex gap-[38px] mx-4 lg:mx-0 mt-4 mb-12 lg:h-[790px] justify-center items-center lg:items-start lg:justify-between">
              <div className="block lg:hidden w-full flex justify-center">
                {!activeTicket ? (
                  <TicketList
                    tickets={tickets}
                    activeTicket={activeTicket}
                    onSelect={setActiveTicket}
                    onNewTicket={handleNewTicket}
                    onSupportCall={() => setIsSupportCallModalOpen(true)}
                    loading={loading}
                  />
                ) : (
                  <div className="w-full">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveTicket(null)}
                        className="mb-4 text-blue-600 font-medium pb-4"
                      >
                        نمایش لیست تیکت ها
                      </button>
                    </div>
                    <ChatPanel ticket={activeTicket} />
                  </div>
                )}
              </div>

              <div className="hidden lg:flex flex-1 justify-center">
                <ChatPanel ticket={activeTicket} />
              </div>

              <div className="hidden lg:block">
                <TicketList
                  tickets={tickets}
                  activeTicket={activeTicket}
                  onSelect={setActiveTicket}
                  onNewTicket={handleNewTicket}
                  onSupportCall={() => setIsSupportCallModalOpen(true)}
                  loading={loading}
                />
              </div>

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
