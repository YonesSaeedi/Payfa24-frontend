
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/apiClient";
import { TicketFormInputs, TicketNewResponse } from "../../../types/Ticket";
import type { AxiosProgressEvent } from "axios";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";
import OrderSelector from "./OrderSelector";
import axios from "axios";
import FloatingInput from "../../FloatingInput/FloatingInput";
import IconClose from "../../../assets/icons/Login/IconClose";
import ReceivedIcon from "../../../assets/icons/Home/WalletCardIcon/ReceivedIcon";
import SendIcon from "../../../assets/icons/Home/WalletCardIcon/SendIcon";
import IconOrderSelection from "../../../assets/icons/ticket/IconOrderSelection";

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

interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت" | "واریز";
  amount: string;
  date: string;
  icon: React.ReactNode;
}

export default function TicketForm() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFileFocused, setIsFileFocused] = useState(false);
  const [, setSelectedFile] = useState<File | null>(null);
  const [apiOrders, setApiOrders] = useState<Order[]>([]);
const [isOrdersLoading, setIsOrdersLoading] = useState(false);


  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInputs>({ mode: "onChange" });

  const watchedFields = watch(["title", "description", "file"]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fileDivRef.current && !fileDivRef.current.contains(event.target as Node)) {
        setIsFileFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = async (data: TicketFormInputs) => {
    try {
      const formData = new FormData();
      formData.append("subject", data.title.trim());
      formData.append("message", data.description.trim());
      if (selectedOrder?.id) formData.append("order", selectedOrder.id);
      if (data.file && data.file.length > 0) {
        formData.append("file", data.file[0]);
      }

      const response = await apiRequest<TicketNewResponse, FormData>({
        url: "/ticket/new",
        method: "POST",
        timeout:0,
        data: formData,
        isFormData: true,
        onUploadProgress: (e?: AxiosProgressEvent) => {
          if (e?.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        },
      });

      if (response?.status) {
        toast.success("تیکت با موفقیت ایجاد شد!");
        setValue("file", undefined);
        setUploadProgress(0);
      } else {
        toast.error(response.msg || "خطا در ثبت تیکت");
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
        toast.error("درخواست بیش از ۱۰ ثانیه طول کشید و لغو شد!");
        return;
      }
      toast.error("شما دو تیکت باز دارید و بیشتر از این نمی‌توانید تیکتی ایجاد کنید!");
    }
  };

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


  const isFormComplete = watchedFields[0]?.trim() || watchedFields[1]?.trim() || selectedOrder;
  useEffect(() => {
  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const response = await apiRequest<TicketInfoResponse>({
        url: "/ticket/get-info",
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
    } catch (err) {
      console.error(err);
    } finally {
      setIsOrdersLoading(false);
    }
  };
  fetchOrders();
}, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="h-full lg:w-[543px] w-full flex flex-col justify-between lg:bg-gray43 lg:shadow-md rounded-2xl lg:px-6">
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-medium lg:text-center text-right text-black1 mt-10 lg:mb-12 ">ایجاد تیکت جدید</h2>

        {/* عنوان */}
        <div className="flex flex-col gap-1">
          <Controller
            name="title"
            control={control}
            rules={{ required: "عنوان تیکت الزامی است" }}
            render={({ field }) => (
              <FloatingInput
                label="عنوان تیکت"
                value={field.value || ""}
                onChange={field.onChange}
                type="text"
                className="flex flex-row  rounded-lg border border-gray12 font-normal !text-[14px]"
              />
            )}
          />
          {errors.title && <p className="text-red-500 text-xs mt-[2px]">{errors.title.message}</p>}
        </div>
<OrderSelector
  selectedOrder={selectedOrder}
  setSelectedOrder={setSelectedOrder}
  register={register}
  setValue={setValue}
  orders={apiOrders}           // ارسال داده‌ها
  isLoading={isOrdersLoading}  // ارسال وضعیت loading
/>



        {/* توضیحات */}
        <div className="relative w-full lg:bg-gray37">
          <Controller
            name="description"
            control={control}
            rules={{ required: "توضیحات الزامی است" }}
            render={({ field }) => (
              <div className="relative w-full">
                <label className="absolute right-3 top-[-8px] text-xs text-gray12 lg:bg-gray43 bg-white1 px-1 z-10 font-normal text-[14px]">توضیحات</label>
                <textarea
                  {...field}
                  placeholder="توضیحات دقیق درمورد موضوع تیکت خود را وارد کنید."
                  className="w-full h-[160px] px-3 pt-6 border border-gray12 rounded-lg lg:bg-gray43 bg-white1 text-black0 text-[14px] resize-none focus:outline-none focus:border-blue2"
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
              </div>
            )}
          />
        </div>

        {/* فایل پیوست */}
        <div className="relative w-full">
          <label className={`absolute right-3 text-xs -top-2 px-1 z-40 bg-gray38 lg:bg-gray43 transition-colors duration-200 ${isFileFocused ? "text-blue2" : "text-gray12"}`}>
            فایل پیوست
          </label>

          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <div ref={fileDivRef}
                   onClick={() => { fileInputRef.current?.click(); setIsFileFocused(true); }}
                   className={`w-full border rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer transition-colors duration-200 ${isFileFocused ? "border-blue2" : "border-gray12"}`}>
                <div className="flex items-center gap-2 h-[36px] rounded-[10px]">
                  <span className={`w-5 h-5 ${isFileFocused ? "text-blue2" : "text-gray12"}`}><IconAttachFile /></span>
                  <span className="text-sm text-gray12">
                    {field.value && field.value.length > 0 ? field.value[0].name : "هنوز فایلی انتخاب نکرده اید (اختیاری)"}
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/mpeg"];

  if (!allowedTypes.includes(file.type)) {
    toast.error("فقط فرمت‌های jpg, jpeg, png و mp4 مجاز هستند.");
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("حجم فایل نباید بیشتر از 20 مگابایت باشد.");
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  field.onChange(e.target.files);
  setSelectedFile(file); 
  setIsFileFocused(false);
}}

                />
              </div>
            )}
          />

          {/* نمایش جزئیات فایل */}
        {watchedFields[2] && watchedFields[2].length > 0 && (
  <div className="flex items-center justify-between mt-2 text-sm text-gray12 bg-gray38 p-2 rounded-lg py-4">
    <span>
      {watchedFields[2][0].name} ({(watchedFields[2][0].size / (1024 * 1024)).toFixed(1)} MB)
    </span>
    <button
      type="button"
      onClick={() => setValue("file", undefined)}
      className=" hover:text-red-700 text-lg font-bold w-6 h-6 icon-wrapper"
    >
      <IconClose/>
    </button>
  </div>
)}

        </div>
      </div>

      {/* دکمه ارسال */}
      <button
        type="submit"
        disabled={!isFormComplete || isSubmitting}
        className={`relative w-full mb-10 py-3 px-4 rounded-lg transition lg:mt-[113px] mt-[48px] overflow-hidden ${
          !isFormComplete || isSubmitting
            ? "bg-gray12 cursor-not-allowed text-white"
            : "bg-blue2 hover:bg-blue-700 text-white"
        }`}
      >
        {isSubmitting && uploadProgress > 0 ? (
          <>
            <span className="absolute left-0 top-0 bottom-0 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            <span className="relative z-10">در حال آپلود {uploadProgress}%</span>
          </>
        ) : isSubmitting ? (
          <span>در حال ارسال تیکت...</span>
        ) : (
          <span>ارسال تیکت</span>
        )}
      </button>
    </form>
  );
}
