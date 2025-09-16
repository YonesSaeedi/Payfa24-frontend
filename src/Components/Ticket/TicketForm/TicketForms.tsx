import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import OrderSelector from "./OrderSelector";
import { Controller } from "react-hook-form";
import TextField from "../../InputField/TextField";
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
type LoginFormData = {
  email: string;
  password: string;
}; 

const orders: Order[] = [
  { id: "1", coin: "USDT", type: "برداشت", amount: "2003", date: "1403/05/05 | 13:00" },
  { id: "2", coin: "BTC", type: "خرید", amount: "2003", date: "1403/05/05 | 13:00" },
  { id: "3", coin: "USDT", type: "خرید", amount: "2003", date: "1403/05/05 | 13:00" },
];


 

export default function TicketForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<TicketFormInputs>();

const {
  
    control,
   
  
  } = useForm<LoginFormData>({
  }); 

  const onSubmit = (data: TicketFormInputs) => {
    console.log("فرم ارسال شد:", data);
  };

  return (
    <div dir="rtl" className="w-full h-full flex flex-col lg:bg-gray37  lg:shadow-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-center text-black1 mt-2  flex-shrink-0 mb-12">
        ایجاد تیکت جدید
      </h2>

      {/* <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-1 gap-4 overflow-y-auto"
      > */}

        <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  label="عنوان"
  
                 
                  {...field}
                  labelBgClass="bg-gray37"
                />
              )}
            />

       
        <OrderSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          register={register}
          orders={orders}
        />

     
<div className="relative w-full bg-gray37">
  {/* <textarea
    {...register("description", { required: "توضیحات الزامی است" })}
    placeholder=" "
    className="peer border rounded-lg text-sm h-[180px] w-full border-gray-400 resize-none bg-gray37 outline-none p-3"
  />
  <label className="absolute right-3 -top-2.5 px-1 text-gray-500 text-xs bg-gray37 inline-block leading-none">
    توضیحات
  </label> */}

  <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  label="توضیحات"
  
                 
                  {...field}
                  labelBgClass="bg-white4"
                />
              )}
            />

  {errors.description && (
    <p className="text-red-500 text-xs mt-1">
      {errors.description.message}
    </p>
  )}
</div>



{errors.description && (
  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
)}



      
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
      {/* </form> */}
    </div>
  );
}

