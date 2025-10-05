import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { createPortal } from "react-dom"; // 👈 اضافه شده
import { TicketFormInputs, Order } from "../../../types/Ticket";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";
import OrderModal from "./OrderModal";
import { apiRequest } from "../../../utils/apiClient";

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
    title: string;
  }[];
}

interface OrderSelectorProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  register: UseFormRegister<TicketFormInputs>;
}

export default function OrderSelector({
  selectedOrder,
  setSelectedOrder,
  register,
}: OrderSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      const fetchOrders = async () => {
        try {
          const response = (await apiRequest({
            url: "/api/ticket/get-info",
            method: "GET",
          })) as TicketInfoResponse;

          if (response?.last_orders) {
            const mappedOrders: Order[] = response.last_orders.map(
              (o: { id: number; title: string }) => ({
                id: String(o.id),
                coin: o.title,
                type: "خرید",
                amount: "-",
                date: "-",
                icon: <IconOrderSelection />,
              })
            );
            setApiOrders(mappedOrders);
          }
        } catch (error) {
          console.error("خطا در گرفتن سفارش‌ها:", error);
        }
      };

      fetchOrders();
    }
  }, [isModalOpen]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    register("orderId").onChange({ target: { value: order.id } });
    setIsModalOpen(false);
  };

  const handleRemoveOrder = () => {
    setSelectedOrder(null);
    register("orderId").onChange({ target: { value: "" } });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full border rounded-lg p-5 text-sm text-right bg-gray37 flex items-center justify-between border-gray12 mt-4 mb-3"
      >
        <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
        <span className="w-4 h-4">
          <IconOrderSelection />
        </span>
      </button>

      <input type="hidden" {...register("orderId")} />

      {selectedOrder && (
        <div className="mt-2 flex items-center justify-between border rounded-lg p-3 bg-gray-50">
          <div>
            <p className="text-sm font-medium">
              {selectedOrder.amount} {selectedOrder.coin}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">{selectedOrder.type}</span>
            <button
              type="button"
              onClick={handleRemoveOrder}
              className="text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 👇 استفاده از createPortal */}
      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <OrderModal
            orders={apiOrders}
            onSelectOrder={handleSelectOrder}
            onClose={() => setIsModalOpen(false)}
          />,
          document.body
        )}
    </div>
  );
}
