import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
import FloatingInput from "../FloatingInput/FloatingInput";



interface SupportCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SupportCallFormInputs {
  number: string;
  description: string;
}

const SupportCallModal: React.FC<SupportCallModalProps> = ({ isOpen, onClose }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<SupportCallFormInputs>();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // const onFormSubmit = async (data: SupportCallFormInputs) => {
  //   try {
  //     setLoading(true);

  //     const response = await fetch("/api/ticket/call", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (result.status) {
  //       toast.success("درخواست شما با موفقیت ثبت شد ");
  //       reset();
  //       setTimeout(() => {
  //         onClose();
  //       }, 1500);
  //     } else {
  //       toast.error("خطایی رخ داده است، لطفاً دوباره تلاش کنید ");
  //     }
  //   } catch (error) {
  //      toast.error(  error?.response?.data?.msg || "خطایی رخ داده است.");
      
  //     toast.error("ارتباط با سرور برقرار نشد ");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onFormSubmit = async (data: SupportCallFormInputs) => {
  try {
    setLoading(true);

    const response = await fetch("/api/ticket/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // اگر status مثل 400 یا 500 بود
      const errorData = await response.json();
      throw new Error(errorData?.msg || "خطایی رخ داده است.");
    }

    const result = await response.json();

    if (result.status) {
      toast.success("درخواست شما با موفقیت ثبت شد");
      reset();
      setTimeout(onClose, 1500);
    } else {
      toast.error("خطایی رخ داده است، لطفاً دوباره تلاش کنید");
    }
  } catch (err: any) {
    toast.error(err.message || "ارتباط با سرور برقرار نشد");
  } finally {
    setLoading(false);
  }
};

  return (
 
  <div
    dir="rtl"
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
    onClick={onClose} // 👈 کلیک روی پس‌زمینه مودال
  >
    <div
      dir="rtl"
      className="bg-gray43 rounded-2xl shadow-lg w-full max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()} // 👈 جلوگیری از بسته شدن هنگام کلیک داخل مودال
    >
      <button
        onClick={() => { reset(); onClose(); }}
        className="absolute top-8 left-3 text-gray-400 hover:text-gray-600 w-6 h-6"
      >
        <IconCloseButtun />
      </button>

      <h2 className="text-lg font-semibold text-black1 mb-12 pt-3">
        درخواست تماس با پشتیبانی
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-gray43">
        {/* شماره موبایل */}
        <div>
          <Controller
            name="number"
            control={control}
            rules={{ required: "شماره موبایل الزامی است" }}
            render={({ field }) => (
              <FloatingInput
                label="شماره موبایل"
                value={field.value || ""}
                onChange={field.onChange}
                type="tel"
                placeholder=""
                placeholderColor="text-black0"
                className="h-[48px] border-gray2"
              
              />
            )}
          />
          {errors.number && (
            <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            لطفا موبایلی که درخواست تماس تلفنی با آن را دارید وارد کنید.
          </p>
        </div>

        {/* توضیحات */}
        <div className="pt-8 pb-8">
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
                placeholder="درخواست تماس با پشتیبانی درباره..."
                placeholderColor="text-black0"
                className="border-gray2 h-[160px]"
              
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "در حال ارسال..." : "تایید"}
        </button>
      </form>
    </div>
  </div>
);

};

export default SupportCallModal;
