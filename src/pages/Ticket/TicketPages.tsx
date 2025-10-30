import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import TicketsDashboard from "../../components/Ticket/TicketChat/TicketsDashboard";
import TicketPanel from "../../components/Ticket/TicketForm/TicketPanel";


interface Ticket {
  id: number;
  title: string;
  status: string;
  created: string;
  updated: string;
}

interface Order {
  id: number;
  title: string;
}

interface TicketResponse {
  tickets: Ticket[];
  last_orders: Order[];
}

export default function TicketsPage() {
  const [data, setData] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await apiRequest<TicketResponse>({
          url: "/api/ticket/get-info",
          method: "GET",
        });
        setData(res);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات تیکت‌ها:", err);
        toast.error("خطا در دریافت اطلاعات تیکت‌ها");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        
        <span>در حال بارگذاری...</span>
      </div>
    );
  if (!data)
    return (
      <p className="text-center text-red-500 mt-8">
        خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.
      </p>
    );

  return (
    
    <div className=" p-6">
      {data.tickets?.length > 0 ? <TicketsDashboard/>: <TicketPanel/>  }
    </div>
  );
}
