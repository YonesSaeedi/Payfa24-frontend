import { useState } from "react";
import { X } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { TicketFormInputs, Order } from "./Types";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";

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
    register("orderId").onChange({ target: { value: order.id } }); // react-hook-form update
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">انتخاب سفارش</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="space-y-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleSelectOrder(order)}
                  className="w-full border rounded-lg p-3 flex justify-between hover:bg-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium">{order.amount} {order.coin}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                  <span className="text-blue-600 text-sm">{order.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
