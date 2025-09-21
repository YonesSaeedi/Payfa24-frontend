import { useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUpload";
import OrderSelector from "./OrderSelector";
import { Controller } from "react-hook-form";
import TextField from "../../InputField/TextField";
import IconMinus from "../../../assets/icons/trade/IconMinus";
import IconReceipt from "../../../assets/icons/services/IconReceipt";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import WalletMinesIcon from "../../../assets/icons/Home/WalletCardIcon/WalletMinesIcon";
import FloatingInput from "../../FloatingInput/FloatingInput";

interface TicketFormInputs {
  title: string;
  orderId: string;
  description: string;
  file: FileList;
}

interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت" | "واریز";
  amount: string;
  date: string;
  icon: React.ReactNode;
}
type LoginFormData = {
  email: string;
  password: string;
}; 

const orders: Order[] = [
  { id: "1", coin: "بیت کوین", type: "برداشت", amount: "2003", date: "1403/05/05 | 13:00",icon:<IconMinus/> },
  { id: "2", coin: "تتر", type: "خرید", amount: "2003", date: "1403/05/05 | 13:00",icon:<IconReceipt/> },
  { id: "3", coin: "سولانا", type: "واریز", amount: "2003", date: "1403/05/05 | 13:00",icon:<SendIcon/> },
   { id: "3", coin: "آلترا", type: "فروش", amount: "2003", date: "1403/05/05 | 13:00",icon:<WalletMinesIcon/> },
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
    <div
      dir="rtl"
      className="w-full h-full flex flex-col justify-between lg:bg-gray43  lg:shadow-md rounded-2xl p-6"
    >
      
     <div className="flex flex-col">
      <h2 className="text-xl font-semibold text-center text-black1 mt-2  flex-shrink-0 mb-12">
        ایجاد تیکت جدید
      </h2>
       <Controller
      name="email"   
            control={control}
            rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
            render={({ field }) => (
                <FloatingInput
                  label=" عنوان تیکت"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder=""
                  placeholderColor="text-black0"
                  borderClass="border-gray12"   
                />
            )}
          />
      <OrderSelector
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        register={register}
        orders={orders}
      />

      <div className="relative w-full bg-gray37 mt-4">
        <Controller
      name="email"   
            control={control}
            rules={{ required: "لطفا مقدار برداشت را وارد کنید" }}
            render={({ field }) => (
             
                <FloatingInput
                  label="توضیحات"
                  value={field.value}
                  onChange={field.onChange}
                  type="number"
                  placeholder="توضیحات دقیق درمورد موضوع تیکت خود را وارد کنید."
                  placeholderColor="text-black0"
                  borderClass="border-gray12"   
                  heightClass="h-[160px]"
                  
                />
            )}
          />
      </div>

      {errors.description && (
        <p className="text-red-500 text-xs mt-1">
          {errors.description.message}
        </p>
      )}

      <FileUpload
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        register={register}
      />
     </div>
    

      <button
        type="submit"
        className="w-full bg-blue2 text-white mb-6  py-3 px-4 rounded-lg hover:bg-blue-700 transition flex-shrink-0 mt-4"
      >
        ارسال تیکت
      </button>
    </div>
  );
}

