import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FloatingInput from "../../FloatingInput/FloatingInput";
import OrderSelector from "./OrderSelector";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/apiClient";
import { TicketFormInputs, TicketNewResponse } from "../../../types/Ticket";
import type { AxiosProgressEvent } from "axios";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";

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
  const [isOrderSelectorOpen, setIsOrderSelectorOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInputs>();

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
        url: "/api/ticket/new",
        method: "POST",
        data: formData,
        isFormData: true,
        timeout: 60000,
        onUploadProgress: (e?: AxiosProgressEvent) => {
          if (e?.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(percent);
          }
        },
      });

      if (response.status) {
        toast.success("تیکت با موفقیت ایجاد شد!");
        setValue("file", undefined); // پاک کردن فایل انتخابی
        setUploadProgress(0);
      } else {
        toast.error(response.msg || "خطا در ثبت تیکت");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("شما دو تیکت باز دارید و بیشتر از این نمی‌توانید تیکتی ایجاد کنید!");
    }
  };

  return (
   <form
  onSubmit={handleSubmit(onSubmit)}
  dir="rtl"
  className="w-full h-full flex flex-col justify-between lg:bg-gray43 lg:shadow-md rounded-2xl p-6"
>

      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-center text-black1 mt-2 mb-12">
          ایجاد تیکت جدید
        </h2>

        {/* عنوان تیکت */}
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
              placeholder=""
              placeholderColor="gray9"
              borderClass="border-gray12"

            />
          )}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}

        {/* انتخاب سفارش */}
        <OrderSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          register={register}
          setValue={setValue}
           onClose={() => setIsOrderSelectorOpen(false)} 
        />

        {/* توضیحات */}
        <div className="relative w-full bg-gray37 mt-4">
          <Controller
            name="description"
            control={control}
            rules={{ required: "توضیحات الزامی است" }}
            render={({ field }) => (
              <FloatingInput
                label="توضیحات"
                value={field.value || ""}
                onChange={field.onChange}
                type="text"
                placeholder="توضیحات دقیق درمورد موضوع تیکت خود را وارد کنید."
                placeholderColor="text-black0"
                borderClass="border-gray12"
                heightClass="h-[160px]"
              />
            )}
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}

        {/* قسمت آپلود فایل */}
        <div className="relative w-full mt-5">
  <label className="absolute right-3 text-xs -top-2 px-1 duration-200 z-40 lg:bg-gray43 bg-gray38 text-gray12">
    فایل پیوست
  </label>

  <Controller
    name="file"
    control={control}
    render={({ field }) => (
      <div
        className="w-full border rounded-md z-10 px-3 py-4 flex justify-between items-center
          focus:outline-none focus:ring-0 border-gray12"
      >
        <label
          className="bg-secondary font-normal text-sm flex items-center gap-2 h-[36px] rounded-[10px]  cursor-pointer transition duration-200"
        >
        <span className="w-5 h-5 text-gray-400"><IconAttachFile  /></span>
          
          <span className="text-sm text-gray-400">هنوز فایلی انتخاب نکرده‌اید</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => field.onChange(e.target.files)}
          />
        </label>

        <span className="truncate text-xs text-gray-400 max-w-[150px] text-left">
          {field.value && field.value.length > 0
            ? field.value[0].name
            : ""}
        </span>
      </div>
    )}
  />



          {/* نوار پیشرفت آپلود */}
          {uploadProgress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between mb-1 text-xs text-gray-300">
                <span>در حال آپلود فایل...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-400 h-2 rounded overflow-hidden">
                <div
                  className="bg-primary h-2 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      <button
        type="submit"
        disabled={isSubmitting || (uploadProgress > 0 && uploadProgress < 100)}
        className={`w-full bg-blue2 text-white mb-6 py-3 px-4 rounded-lg mt-4 transition ${isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
      >
        {isSubmitting ? "در حال ارسال..." : "ارسال تیکت"}
      </button>
    </form>
  );
}
