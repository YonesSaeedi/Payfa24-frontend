// OrderSelector.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { TicketFormInputs, Order } from "../../../types/Ticket";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";
import OrderModal from "./OrderModal";
import { apiRequest } from "../../../utils/apiClient";
import type { UseFormSetValue, UseFormRegister } from "react-hook-form";

interface TicketInfoResponse {
  last_orders: { id: number; title: string }[];
}

interface OrderSelectorProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  register: UseFormRegister<TicketFormInputs>;
  setValue: UseFormSetValue<TicketFormInputs>;
}

export default function OrderSelector({
  selectedOrder,
  setSelectedOrder,
  register,
  setValue,
}: OrderSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchOrders = async () => {
      try {
        const response = (await apiRequest<TicketInfoResponse>({
          url: "/api/ticket/get-info",
          method: "GET",
        })) as TicketInfoResponse;

        if (response?.last_orders) {
          const mappedOrders: Order[] = response.last_orders.map((o) => ({
            id: String(o.id),
            coin: o.title,
            type: "خرید",
            amount: "-",
            date: "-",
            icon: <IconOrderSelection />,
          }));
          setApiOrders(mappedOrders);
        }
      } catch (error) {
        console.error("خطا در گرفتن سفارش‌ها:", error);
      }
    };

    fetchOrders();
  }, [isModalOpen]);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setValue("orderId", order.id); // <-- از props.setValue استفاده می‌کنیم
    setIsModalOpen(false);
  };

  const handleRemoveOrder = () => {
    setSelectedOrder(null);
    setValue("orderId", ""); // پاک کردن مقدار فرم
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full border rounded-lg p-5 text-sm text-right bg-gray37 flex items-center justify-between border-gray12 mt-4 mb-3"
      >
        <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
        <span className="w-4 h-4"><IconOrderSelection /></span>
      </button>

      {/* hidden input برای orderId */}
      <input type="hidden" {...register("orderId" as any)} />

      {selectedOrder && (
        <div className="mt-2 flex items-center justify-between border rounded-lg p-3 bg-gray-50">
          <div>
            <p className="text-sm font-medium">{selectedOrder.amount} {selectedOrder.coin}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">{selectedOrder.type}</span>
            <button type="button" onClick={handleRemoveOrder} className="text-gray-500 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && typeof document !== "undefined" && createPortal(
        <OrderModal orders={apiOrders} onSelectOrder={handleSelectOrder} onClose={() => setIsModalOpen(false)} />,
        document.body
      )}
    </div>
  );
}