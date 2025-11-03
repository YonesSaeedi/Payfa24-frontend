import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { TicketFormInputs, Order } from "../../../types/Ticket";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";
import OrderModal from "./OrderModal";
import { apiRequest } from "../../../utils/apiClient";
import type { UseFormSetValue, UseFormRegister } from "react-hook-form";
import IconClose from "../../../assets/icons/Login/IconClose";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";

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

export default function OrderSelector({ selectedOrder, setSelectedOrder, register, setValue }: OrderSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapOrderType = (type: string): { text: Order["type"]; icon: React.ReactNode } => {
    switch (type) {
      case "buy":
      case "خرید":
        return { text: "خرید", icon: <ReceivedIcon /> };
      case "sell":
      case "فروش":
        return { text: "فروش", icon: <SendIcon /> };
      case "برداشت":
        return { text: "برداشت", icon: <SendIcon /> };
      case "واریز":
        return { text: "واریز", icon: <ReceivedIcon /> };
      default:
        return { text: "خرید", icon: <IconOrderSelection /> };
    }
  };

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
          const mappedOrders: Order[] = response.last_orders.map((o) => {
            const mapped = mapOrderType(o.type);
            return {
              id: String(o.id),
              coin: o.name,
              type: mapped.text,
              amount: String(o.amount),
              date: o.date || "-",
              icon: mapped.icon,
            };
          });

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
  const [isOrderFocused, setIsOrderFocused] = useState(false);
const orderDivRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orderDivRef.current && !orderDivRef.current.contains(event.target as Node)) {
        setIsOrderFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button
      ref={orderDivRef}
        type="button"
       onClick={() => {
  setIsModalOpen(true);
  setIsOrderFocused(true);
}}
       className={`w-full border rounded-lg p-5 text-sm text-right lg:bg-gray37 flex items-center justify-between  mb-3 h-[56px] pl-4 pr-4 transition-colors duration-200
  ${isOrderFocused ? "border-blue2" : "border-gray12"}`}

      >
        <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
        <span className="w-5 h-5 text-gray12">
          <IconOrderSelection />
        </span>
      </button>

      <input type="hidden" {...register("orderId")} />

      {selectedOrder && (
        <div className="mt-2 flex items-center justify-between border rounded-lg p-3 lg:bg-gray27  border-gray21">
          <div className="flex items-center">
            <div className="w-10 h-10 ml-3 bg-blue15 rounded-lg flex items-center justify-center">
              <span className="w-6 h-6 text-blue2">{mapOrderType(selectedOrder.type).icon}</span>
            </div>
            <div className="flex flex-col text-right">
              <p className="text-sm font-medium text-black1">{selectedOrder.coin}</p>
              <span className="text-gray-500 font-normal text-xs mt-1">{mapOrderType(selectedOrder.type).text}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-2">
              {selectedOrder.amount && (
                <span className="text-black0 font-medium text-[14px]">
                  {Number(selectedOrder.amount).toLocaleString("fa-IR")}
                  <span className="text-gray5 ml-1">USDT</span>
                </span>
              )}
              {selectedOrder.date && <span className="text-gray-400 text-xs mt-1">{selectedOrder.date}</span>}
            </div>

            <button type="button" onClick={handleRemoveOrder} className="text-gray-500 hover:text-red-500 w-5 h-5 mr-2 flex-shrink-0">
              <IconClose />
            </button>
          </div>
        </div>
      )}

      {isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(<OrderModal orders={apiOrders} isLoading={isLoading} onSelectOrder={handleSelectOrder} onClose={() => setIsModalOpen(false)} />, document.body)}
    </div>
  );
}
