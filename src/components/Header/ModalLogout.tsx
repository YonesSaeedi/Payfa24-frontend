
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
      {/* بک‌گراند تار */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* مودال */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white dark:bg-gray-800 w-11/12 sm:w-96 rounded-2xl p-6 sm:p-8 text-center shadow-lg"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* عکس — خودت اضافه کن */}
          <div className="w-20 h-20 mx-auto rounded-full mb-4 flex items-center justify-center">
                  <img src={Logout} alt="Logout" />
          </div>

          {/* عنوان */}
          <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-2">
            خروج از حساب کاربری
          </h2>

          {/* توضیحات */}
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-7">
            آیا از خروج از حساب کاربری خود اطمینان دارید؟ توجه داشته باشید که
            اطلاعات شما نزد ما محفوظ می‌ماند.
          </p>

          {/* دکمه‌ها */}
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
