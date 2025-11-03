import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
import FloatingInput from "../FloatingInput/FloatingInput";
import { apiRequest } from "../../utils/apiClient";


type FormDataValue = string | number | boolean | Blob | File;

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

 const onFormSubmit = async (data: SupportCallFormInputs) => {
  try {
    setLoading(true);

  await apiRequest<{ status: boolean; msg?: string }, Record<string, FormDataValue>>({
      url: "/api/ticket/call",
      method: "POST",
      data,
    });
  } catch (err: any) {
    toast.error(err?.response?.data?.msg || "ارتباط با سرور برقرار نشد");
  } finally {
    setLoading(false);
  }
};

  return (
 
  <div
    dir="rtl"
    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
    onClick={onClose} 
  >
    <div
      dir="rtl"
      className="bg-white8 rounded-2xl shadow-lg w-full max-w-md p-6 relative"
      onClick={(e) => e.stopPropagation()} 
    >
      <button
        onClick={() => { reset(); onClose(); }}
        className="absolute top-8 left-3 text-gray-400 hover:text-gray-600 w-6 h-6"
      >
        <IconCloseButtun />
      </button>

      <h2 className="font-bold text-lg text-black1 mb-12 pt-3">
        درخواست تماس با پشتیبانی
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 ">
      
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
                className="lg:bg-white8 border-gray2 rounded-lg"
              
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
                className="border-gray2 h-[160px] lg:bg-white8 !rounded-lg"
              
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
