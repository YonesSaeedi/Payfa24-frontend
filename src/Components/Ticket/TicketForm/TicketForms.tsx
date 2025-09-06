import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import OrderSelector from "./OrderSelector";

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
  { id: "1", coin: "USDT", type: "برداشت", amount: "2003", date: "1403/05/05 | 13:00" },
  { id: "2", coin: "BTC", type: "خرید", amount: "2003", date: "1403/05/05 | 13:00" },
  { id: "3", coin: "USDT", type: "خرید", amount: "2003", date: "1403/05/05 | 13:00" },
];

export default function TicketForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<TicketFormInputs>();

  const onSubmit = (data: TicketFormInputs) => {
    console.log("فرم ارسال شد:", data);
  };

  return (
    <div dir="rtl" className="w-full h-full flex flex-col lg:bg-gray37 lg:shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-center text-black1 mt-2  flex-shrink-0 mb-12">
        ایجاد تیکت جدید
      </h2>

      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-1 gap-4 overflow-y-auto"
      >
        {/* عنوان */}
        <div className="relative flex-shrink-0">
          <input
            type="text"
            {...register("title", { required: "عنوان الزامی است" })}
            placeholder=" "
            className="peer w-full border rounded-lg p-5 text-sm bg-gray37 outline-none border-gray12"
          />
          <label className="absolute right-3 -top-[19.75px] bg-gray33 z-1 px-1 text-gray12 text-xs transition-all
                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                             peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600">
            عنوان تیکت
          </label>
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* انتخاب سفارش */}
        <OrderSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          register={register}
          orders={orders}
        />

        {/* توضیحات */}
<div className="relative w-full bg-gray37">
  <textarea
    {...register("description", { required: "توضیحات الزامی است" })}
    placeholder=" "
    className="peer border rounded-lg text-sm h-[180px] w-full border-gray-400 resize-none bg-gray37 outline-none p-3"
  />
  <label className="absolute right-3 -top-2.5 px-1 text-gray-500 text-xs bg-gray37 inline-block leading-none">
    توضیحات
  </label>
  {errors.description && (
    <p className="text-red-500 text-xs mt-1">
      {errors.description.message}
    </p>
  )}
</div>



{errors.description && (
  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
)}



        {/* آپلود فایل */}
        <FileUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          register={register}
        />

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white mb-6  py-2 px-4 rounded-lg hover:bg-blue-700 transition flex-shrink-0 mt-4"
        >
          ارسال تیکت
        </button>
      </form>
    </div>
  );
}

