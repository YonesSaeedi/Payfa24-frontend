import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import FileUpload from "./FileUpload";
import OrderSelector from "./OrderSelector";
import FloatingInput from "../../FloatingInput/FloatingInput";
import { toast } from "react-toastify";
import { apiRequest } from "../../../utils/apiClient";
import { TicketFormInputs, TicketNewResponse } from '../../../types/Ticket';


interface Order {
  id: string;
  coin: string;
  type: "خرید" | "فروش" | "برداشت" | "واریز";
  amount: string;
  date: string;
  icon: React.ReactNode;
}
interface TicketPayload {
  subject: string;
  message: string;
  order?: number;
  file?: File;
}
type FormDataValue = string | number | boolean | File;

export default function TicketForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm<TicketFormInputs>();

const onSubmit = async (data: TicketFormInputs) => {
  try {
    // ساخت payload با تایپ دقیق
    const payload: TicketPayload = {
      subject: data.title,
      message: data.description,
    };

    if (selectedOrder?.id) payload.order = Number(selectedOrder.id);
    if (selectedFile) payload.file = selectedFile;

    // تبدیل به Record<string, FormDataValue> برای apiRequest
    const payloadRecord: Record<string, FormDataValue> = { ...payload };

    const response = await apiRequest({
      url: "/api/ticket/new",
      method: "POST",
      data: payloadRecord,
      isFormData: !!selectedFile,
    }) as TicketNewResponse;

    toast.success("تیکت با موفقیت ایجاد شد!");
    console.log("تیکت ساخته شد:", response);

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("خطا در ساخت تیکت:", err.message);
    } else {
      console.error("خطا در ساخت تیکت:", err);
    }
    toast.error("شما دو تیکت باز دارید و بیشتر از این نمیتوانید تیکتی ایجاد کنید!");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="w-full h-full flex flex-col justify-between lg:bg-gray43 lg:shadow-md rounded-2xl p-6"
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold text-center text-black1 mt-2 flex-shrink-0 mb-12">
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
              placeholderColor="text-black0"
              borderClass="border-gray12"
            />
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}

        {/* انتخاب سفارش */}
        <OrderSelector
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          register={register}
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

        {/* آپلود فایل */}
        <FileUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          register={register}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue2 text-white mb-6 py-3 px-4 rounded-lg hover:bg-blue-700 transition flex-shrink-0 mt-4"
      >
        ارسال تیکت
      </button>
    </form>
  );
}
