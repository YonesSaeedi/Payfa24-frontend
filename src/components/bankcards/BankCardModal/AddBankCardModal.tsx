import IconClose from "../../../assets/icons/Login/IconClose";
import BankCardForm from "./BankCardForm";

type AddBankCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardNumber: string, bankName: string) => void;
};

const AddBankCardModal = ({
  isOpen,
  onClose,
  onSave,
}: AddBankCardModalProps) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="min-w-[500px] bg-white8 rounded-xl w-[400px] p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <IconClose />
        </button>

        <h2 className="text-lg font-medium text-right mb-4 text-black1">
          افزودن کارت بانکی
        </h2>

        <BankCardForm onSave={onSave} />
      </div>
    </div>
  );
};

export default AddBankCardModal;
