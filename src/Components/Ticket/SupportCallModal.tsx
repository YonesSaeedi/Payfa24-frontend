import React from "react";
import { useForm, Controller } from "react-hook-form";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";
import FloatingInput from "../FloatingInput/FloatingInput";

interface SupportCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phone: string; description: string }) => void;
}

interface SupportCallFormInputs {
  phone: string;
  description: string;
}

const SupportCallModal: React.FC<SupportCallModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<SupportCallFormInputs>();

  if (!isOpen) return null;

  const onFormSubmit = (data: SupportCallFormInputs) => {
    onSubmit(data);
    reset(); // پاک کردن فرم بعد از ارسال
    onClose();
  };

  return (
    <div dir="rtl" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div dir="rtl" className="bg-gray43 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={() => { reset(); onClose(); }}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 w-6 h-6"
        >
          <IconCloseButtun />
        </button>

        <h2 className="text-lg font-semibold text-black1 mb-4">
          درخواست تماس با پشتیبانی
        </h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-gray43 ">
          {/* شماره موبایل */}
          <div>
            <Controller
              name="phone"
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
                  borderClass="border-gray12"
                />
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              لطفا موبایلی که درخواست تماس تلفنی با آن را دارید وارد کنید.
            </p>
          </div>

          {/* توضیحات */}
          <div className="pt-4">
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
                  borderClass="border-gray12"
                  heightClass="h-[120px]"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
          >
            تایید
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportCallModal;
