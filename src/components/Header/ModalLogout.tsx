
import Logout from  "../../assets/images/logout.png";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ModalLogout({ open, onClose, onConfirm }: Props) {
  if (!open) return null;

  return (
    <>
      {/* بک‌گراند تار شده که با کلیک روی آن مودال بسته میشود */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* خود مودال */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white dark:bg-gray-800 w-11/12 sm:w-96 rounded-2xl p-6 sm:p-8 text-center shadow-lg"
          onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مودال هنگام کلیک روی خود آن
          dir="rtl"
        >
          <div className="w-20 h-20 mx-auto rounded-full mb-4 flex items-center justify-center">
            <img src={Logout} alt="Logout" />
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-2">
            خروج از حساب کاربری
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-7">
            آیا از خروج از حساب کاربری خود اطمینان دارید؟
          </p>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="w-1/2 py-2 sm:py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              انصراف
            </button>

            <button
              onClick={onConfirm}
              className="w-1/2 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              خروج
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
