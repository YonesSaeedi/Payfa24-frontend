import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Paperclip } from "lucide-react";
import IconOrderSelection from "../../assets/icons/ticket/IconOrderSelection";

interface TicketFormInputs {
  title: string;
  orderId: string;
  description: string;
  file: FileList;
}

interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت";
  amount: string;
  date: string;
}

const orders: Order[] = [
  {
    id: "1",
    coin: "USDT",
    type: "برداشت",
    amount: "2003",
    date: "1403/05/05 | 13:00",
  },
  {
    id: "2",
    coin: "BTC",
    type: "خرید",
    amount: "2003",
    date: "1403/05/05 | 13:00",
  },
  {
    id: "3",
    coin: "USDT",
    type: "خرید",
    amount: "2003",
    date: "1403/05/05 | 13:00",
  },
];

export default function TicketForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TicketFormInputs>();

  const onSubmit = (data: TicketFormInputs) => {
    console.log("فرم ارسال شد:", data);
  };

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
    <div
      dir="rtl"
      className="w-full flex flex-col bg-gray37 shadow-md rounded-2xl p-6 h-full"
    >
      <h2 className="text-xl font-semibold mb-10 text-center text-black1 mt-6">
        ایجاد تیکت جدید
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    
        <div className="relative">
          <input
            type="text"
            {...register("title", { required: "عنوان الزامی است" })}
            id="title"
            placeholder=" "
            className="peer w-full border rounded-lg p-5 text-sm bg-gray37 outline-none border-gray12"
          />
          <label
            htmlFor="title"
            className="absolute right-3 -top-[19.75px] bg-gray33 z-1 px-1 text-gray12 text-xs transition-all
                     peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
          >
            عنوان تیکت
          </label>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

       
        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full border rounded-lg p-5 text-sm text-right bg-gray37 flex items-center justify-between  border-gray12"
          >
            <span className="text-gray12">انتخاب سفارش (اختیاری)</span>
            <span className="w-16 h-16"><IconOrderSelection/></span>
          </button>
          <input type="hidden" {...register("orderId")} />

         
          {selectedOrder && (
            <div className="mt-2 flex items-center justify-between border rounded-lg p-5 bg-gray-50">
              <div>
                <p className="text-sm font-medium">
                  {selectedOrder.amount} {selectedOrder.coin}
                </p>
                <p className="text-xs text-gray-500">{selectedOrder.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-sm">
                  {selectedOrder.type}
                </span>
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
        </div>

       
        <div className="relative">
          <textarea
            {...register("description", { required: "توضیحات الزامی است" })}
            id="description"
            placeholder=" "
            className=" w-full border rounded-lg p-3 text-sm h-28 resize-none bg-gray37 outline-none"
          />
          <label
            htmlFor="description"
            className="absolute right-3 -top-2.5 bg-gray37 px-1 text-gray12 text-xs transition-all "
          >
            توضیحات
          </label>

          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

       
        <div className="relative">
          <input
            type="file"
            id="file"
            {...register("file")}
            onChange={(e) =>
              setSelectedFile(e.target.files ? e.target.files[0] : null)
            }
            className="hidden"
          />
          <label
            htmlFor="file"
            className="peer flex items-center justify-between w-full border rounded-lg p-3 text-sm cursor-pointer bg-gray37 hover:bg-gray-100"
          >
            {selectedFile ? (
              <span className="text-gray-700">{selectedFile.name}</span>
            ) : (
              <span className="text-gray-400">
                هنوز فایلی انتخاب نکرده‌اید (اختیاری)
              </span>
            )}
            <Paperclip size={18} className="text-gray-400" />
          </label>
          <span className="absolute right-3 -top-2.5 bg-gray37 px-1 text-gray-500 text-xs">
            فایل پیوست
          </span>
        </div>

       
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          ارسال تیکت
        </button>
      </form>

     
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
                    <p className="text-sm font-medium">
                      {order.amount} {order.coin}
                    </p>
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
