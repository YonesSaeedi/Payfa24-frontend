
import IconClose from "../../../assets/Icons/Login/IconClose";
import { Order } from "../../../types/Ticket";
import { useEffect, useRef } from "react";

interface OrderModalProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onClose: () => void;
}

export default function OrderModal({ orders, onSelectOrder, onClose }: OrderModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

  // تشخیص کلیک خارج از مودال
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
  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div  ref={modalRef} className="bg-white8 w-full max-w-md rounded-2xl shadow-lg p-4 h-[585px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold p-4 text-black1">انتخاب سفارش</h3>
          <button onClick={onClose} className="w-6 h-6 icon-wrapper"><IconClose/></button>
        </div>

        {orders.length === 0 ? (
  <p className="text-center text-gray-500">سفارشی موجود نیست</p>
) : (

    <div
  className={`space-y-2 overflow-y-auto pl-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent ${
    orders.length > 4 ? "max-h-[450px]" : ""
  }`}
  style={{ scrollbarGutter: "stable" }}
>

        
          {orders.map((order) => (
            <button
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="w-full border rounded-lg p-3 flex justify-between bg-gray33 border-gray21 hover:border-blue2"
            >
                                 <div className="flex justify-start">
                                      <div className="w-[42px] h-[42px] ml-2 bg-blue14 rounded-[8px] flex items-center justify-center">
                                        <span className="w-6 h-6 icon-wrapper text-blue2">
                                          {order.icon}
                                        </span>
                                      </div>
                                      <div className="flex flex-col">
                                        <p className="text-sm font-medium">{order.coin}</p>
                                        <span className="text-gray3 text-sm pt-2">{order.type}</span>
                                      </div>
                                      </div>
                                     
                 
            </button>
          ))}
        </div>
)}
      </div>
    </div>
  );
}
