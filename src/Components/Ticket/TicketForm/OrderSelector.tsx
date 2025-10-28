
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { TicketFormInputs, Order } from "../../../types/Ticket";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";
import OrderModal from "./OrderModal";
import { apiRequest } from "../../../utils/apiClient";
import type { UseFormSetValue, UseFormRegister } from "react-hook-form";
import IconClose from "../../../assets/icons/Login/IconClose";

interface OrderSelectorProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  register: UseFormRegister<TicketFormInputs>;
  setValue: UseFormSetValue<TicketFormInputs>;
}

interface TicketInfoResponse {
  tickets: {
    id: number;
    title: string;
    status: string;
    created: string;
    updated: string;
  }[];
  last_orders: {
    id: number;
    type: "buy" | "sell";
    amount: number;
    date: string;
    name: string;
  }[];
}


export default function OrderSelector({
  selectedOrder,
  setSelectedOrder,
  register,
  setValue,
}: OrderSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest<TicketInfoResponse>({
          url: "/api/ticket/get-info",
          method: "GET",
        });

        if (response?.last_orders) {
          const mappedOrders: Order[] = response.last_orders.map(o => ({
            id: String(o.id),
            coin: o.name,
            type: o.type === "buy" ? "خرید" : "فروش",
            amount: String(o.amount),
            date: o.date || "-",
            icon: <IconOrderSelection />,
          }));


          setApiOrders(mappedOrders);
        }
      } catch (error) {
        console.error("خطا در گرفتن سفارش‌ها:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isModalOpen]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setValue("orderId", order.id);
    setIsModalOpen(false);
  };

  const handleRemoveOrder = () => {
    setSelectedOrder(null);
    setValue("orderId", "");
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full border rounded-lg p-5 text-sm text-right bg-gray37 flex items-center justify-between border-gray12 mt-4 mb-3  h-[56px]  pl-4 pr-4"
      >
        <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
        <span className="w-5 h-5 text-gray12"><IconOrderSelection /></span>
      </button>

      <input type="hidden" {...register("orderId")} />


      {selectedOrder && (
        <div className="mt-2 flex items-center justify-between border rounded-lg p-3 bg-gray27 h-[61px] border-gray21">
          <div>
            <p className="text-sm font-medium text-black0">{selectedOrder.amount} {selectedOrder.coin}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">{selectedOrder.type}</span>
            <button type="button" onClick={handleRemoveOrder} className="text-gray-500 hover:text-red-500 w-5 h-5">
              <IconClose />
            </button>
          </div>
        </div>
      )}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <OrderModal
          orders={apiOrders}
          isLoading={isLoading}
          onSelectOrder={handleSelectOrder}
          onClose={() => setIsModalOpen(false)}
        />,
        document.body
      )}

    </div>
  );
}
