
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import IconClose from "../../../assets/icons/Login/IconClose";
import IconTicket from "../../../assets/icons/services/IconTicket";
import { Order } from "../../../types/Ticket";
import { useEffect, useRef } from "react";

interface OrderModalProps {
  orders: (Order & { type: "buy" | "sell" | "ticket" | string })[]; 
  isLoading: boolean;
  onSelectOrder: (order: Order) => void;
  onClose: () => void;
}

export default function OrderModal({ orders, isLoading, onSelectOrder, onClose }: OrderModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const mapOrderType = (type: string) => {
    switch (type) {
      case "buy":
        return { text: "خرید", icon: <ReceivedIcon /> };
      case "sell":
        return { text: "فروش", icon: <SendIcon /> };
      case "ticket":
        return { text: "تیکت", icon: <IconTicket /> };
      case "برداشت":
        return { text: "برداشت", icon: <SendIcon /> };
      case "واریز":
        return { text: "واریز", icon: <ReceivedIcon /> };
      default:
        return { text: type, icon: null };
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={modalRef}
        className="bg-white8 rounded-2xl shadow-lg p-4 z-10 flex flex-col"
        style={{ width: "480px", height: "585px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-gray-100 px-4 pt-4 pb-6">
          <h3 className="font-bold text-lg text-black1">انتخاب سفارش</h3>
          <button onClick={onClose} className="w-6 h-6 text-gray-400 hover:text-gray-600">
            <IconClose />
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-4"
          style={{ scrollbarGutter: "stable" }}
        >
          {isLoading
            ? [...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="w-full border rounded-xl p-3 flex justify-between items-center bg-gray33 border-gray21 animate-pulse mb-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-20 h-4 rounded-md bg-gray-200"></div>
                      <div className="w-12 h-3 rounded-md bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="w-16 h-4 rounded-md bg-gray-200"></div>
                </div>
              ))
            : orders.map((order) => {
  // نگه داشتن نوع به صورت string
  const orderType = order.type as string;

  const { text: orderTypeText, icon: orderIcon } = mapOrderType(orderType);

  return (
    <button
      key={order.id}
      onClick={() => onSelectOrder(order)}
      className="w-full border rounded-xl p-3 flex justify-between items-center bg-gray33 border-gray21 hover:border-blue-400 transition"
    >
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 ml-3 bg-blue15 rounded-lg flex items-center justify-center">
            <span className="text-blue-500 w-6 h-6">{orderIcon}</span>
          </div>
          <div className="flex flex-col text-right">
            <p className="text-sm font-medium text-black1">{order.coin}</p>
            <span className="text-gray-500 font-normal text-xs mt-1">{orderTypeText}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          {order.amount != null && orderType !== "ticket" && (
            <span className="text-black0 font-medium text-[14px]">
              {Number(order.amount).toLocaleString("fa-IR")}{" "}
              <span className="text-gray5">USDT</span>
            </span>
          )}
          {order.date && <span className="text-gray-400 text-xs mt-1">{order.date}</span>}
        </div>
      </div>
    </button>
  );
})
}
        </div>
      </div>
    </div>
  );
}
