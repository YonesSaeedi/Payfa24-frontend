import React from "react";
import IconCloseButtun from "../../assets/icons/services/IconCloseButtun";

interface SupportCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { phone: string; description: string }) => void;
}

const SupportCallModal: React.FC<SupportCallModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [phone, setPhone] = React.useState("");
  const [description, setDescription] = React.useState("");

  if (!isOpen) return null; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ phone, description });
    onClose();
  };

  return (
    <div dir='rtl'  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div dir='rtl' className=" bg-white8 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-gray-600 w-6 h-6"
        >
          <IconCloseButtun/>
        </button>

      
        <h2 className="text-lg font-semibold text-black1 text- mb-4">
          درخواست تماس با پشتیبانی
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره موبایل
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white8  focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              لطفا موبایلی که درخواست تماس تلفنی با آن را دارید وارد کنید.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="درخواست تماس با پشتیبانی درباره..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white8  focus:ring-blue-500"
              rows={4}
            />
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
