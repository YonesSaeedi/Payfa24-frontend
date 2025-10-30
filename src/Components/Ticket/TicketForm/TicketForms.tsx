import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/apiClient";
import { TicketFormInputs, TicketNewResponse } from "../../../types/Ticket";
import type { AxiosProgressEvent } from "axios";
import IconAttachFile from "../../../assets/icons/ticket/IconAttachFile";

import OrderSelector from "./OrderSelector";
import axios from "axios";
import FloatingInput from "../../FloatingInput/FloatingInput";


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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormInputs>({
    mode: "onChange", 
  });

  const watchedFields = watch(["title", "description"]);
   const fileInputRef = useRef<HTMLInputElement | null>(null);
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
      toast.error(
        "شما دو تیکت باز دارید و بیشتر از این نمی‌توانید تیکتی ایجاد کنید!"
      );
    }
  };

  
  const isFormComplete =
    watchedFields[0]?.trim() && watchedFields[1]?.trim() && selectedOrder;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="h-full flex flex-col justify-between lg:bg-gray43 lg:shadow-md rounded-2xl p-6"
    >
    
      <div className="flex flex-col">
        <h2 className="text-2xl font-medium text-center text-black1 mt-10 mb-12">
          ایجاد تیکت جدید
        </h2>
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
              className="flex flex-row mb-6 h-[56px] rounded-lg border  border-gray12 font-normal text-[14px]"
            />
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )} 

        <OrderSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          register={register}
          setValue={setValue}
        
        />

        <div className="relative w-full bg-gray37 mt-2">
      <Controller
  name="description"
  control={control}
  rules={{ required: "توضیحات الزامی است" }}
  render={({ field }) => (
    <div className="relative w-full mt-4">
      {/* Label داخل border */}
      <label className="absolute right-3 top-[-8px] text-xs text-gray12 bg-gray43 px-1 z-10">
        توضیحات
      </label>
      <textarea
        {...field}
        placeholder="توضیحات دقیق درمورد موضوع تیکت خود را وارد کنید."
        className="w-full h-[160px] px-3 pt-6 pb-3 border border-gray12 rounded-lg bg-gray43 text-black0 text-[14px] resize-none focus:outline-none focus:border-blue2"
      />
      {errors.description && (
        <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
      )}
    </div>
  )}
/>



        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}

        <div className="relative w-full mt-5">
          <label
            className={`absolute right-3 text-xs -top-2 px-1 z-40 bg-gray38 lg:bg-gray43 transition-colors duration-200 
      ${isFileFocused ? "text-blue2" : "text-gray12"}`}
          >
            فایل پیوست
          </label>

       
          <Controller
            name="file"
            control={control}
            render={({ field }) => {
             

              return (
                <div
                  onClick={() => fileInputRef.current?.click()} 
                  className={`w-full border rounded-md px-3 py-4 flex justify-between items-center cursor-pointer transition-colors duration-200 
          ${isFileFocused ? "border-blue2" : "border-gray12"}`}
                >
     
                  <div className="flex items-center gap-2 h-[36px] rounded-[10px]">
                    <span
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isFileFocused ? "text-blue2" : "text-gray-400"
                      }`}
                    >
                      <IconAttachFile />
                    </span>

                    <span
                      className={`text-sm transition-colors duration-200 ${
                        isFileFocused ? "text-blue2" : "text-gray-400"
                      }`}
                    >
                      {field.value && field.value.length > 0
                        ? field.value[0].name
                        : "هنوز فایلی انتخاب نکرده‌اید"}
                    </span>
                  </div>

                  <input
                    ref={fileInputRef} 
                    type="file"
                    className="hidden"
                    onFocus={() => setIsFileFocused(true)}
                    onBlur={() => setIsFileFocused(false)}
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </div>
              );
            }}
          />

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
        disabled={!isFormComplete || isSubmitting}
        className={`w-full mb-6 py-3 px-4 rounded-lg  transition mt-36 ${
          !isFormComplete || isSubmitting
            ? "bg-gray12 cursor-not-allowed text-white text-base font-bold"
            : "bg-blue2 hover:bg-blue-700 text-white text-base font-bold"
        }`}
      >
        {isSubmitting ? "در حال ارسال تیکت..." : "ارسال تیکت"}
      </button>
    </form>
  );
}
