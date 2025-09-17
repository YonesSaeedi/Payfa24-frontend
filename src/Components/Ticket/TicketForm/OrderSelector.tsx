import { useState } from "react";
import { X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { TicketFormInputs, Order } from "./Types";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";
import OrderModal from "./OrderModal";

interface OrderSelectorProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  register: UseFormRegister<TicketFormInputs>;
  orders: Order[];
}

export default function OrderSelector({ selectedOrder, setSelectedOrder, register, orders }: OrderSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        className="w-full border rounded-lg p-5 text-sm text-right bg-gray37 flex items-center justify-between border-gray12 mt-3 mb-3"
      >
        <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
        <span className="w-4 h-4"><IconOrderSelection/></span>
      </button>
      <input type="hidden" {...register("orderId")} />

      {selectedOrder && (
        <div className="mt-2 flex items-center justify-between border rounded-lg p-3 bg-gray-50">
          <div>
            <p className="text-sm font-medium">{selectedOrder.amount} {selectedOrder.coin}</p>
            <p className="text-xs text-gray-500">{selectedOrder.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm">{selectedOrder.type}</span>
            <button type="button" onClick={handleRemoveOrder} className="text-gray-500 hover:text-red-500">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <OrderModal
          orders={orders}
          onSelectOrder={handleSelectOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
