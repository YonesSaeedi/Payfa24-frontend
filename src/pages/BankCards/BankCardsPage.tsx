import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import EmptyCards from "../../Components/BankCards/EmptyCards";
import AddBankCardModal from "../../Components/BankCards/BankCardModal/AddBankCardModal";
import { apiRequest } from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";


interface AddCardResponse {
  status: boolean;
  msg: string;
}

interface AddCardRequest {
  CardNumber: string;
  BankName: string;
  [key: string]: string | number | boolean | Blob | File; // 👈 این خط اضافه شد
}

const BankCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
   const navigate = useNavigate();

const handleSaveCard = async (cardNumber: string, bankName: string) => {
  try {
    // 1️⃣ گرفتن لیست کارت‌های موجود
    const existingCardsResponse = await apiRequest<{
      status: boolean;
      msg: string;
      data: { card_number: string; bank_name: string }[];
    }, {}>({
      url: "/api/account/credit-card/list",
      method: "GET",
    });

    if (!existingCardsResponse?.status) {
      console.error("❌ خطا در دریافت کارت‌های موجود:", existingCardsResponse?.msg);
      return;
    }

    const isCardExists = existingCardsResponse.data.some(
      (card) => card.card_number === cardNumber
    );

    if (isCardExists) {
      console.warn("❌ این کارت قبلاً ثبت شده است.");
      setIsModalOpen(false); // 🔹 مودال بسته شود
      navigate(ROUTES.Cards_Manager); // 🔹 هدایت به مدیریت کارت‌ها
      return;
    }

    // 2️⃣ ثبت کارت جدید
    const response = await apiRequest<AddCardResponse, AddCardRequest>({
      url: "/api/account/credit-card",
      method: "POST",
      data: {
        CardNumber: cardNumber,
        BankName: bankName,
      },
    });

    if (response?.status) {
      console.log("✅ کارت با موفقیت ثبت شد:", response.msg);
      setIsModalOpen(false); // مودال بسته شود
    } else {
      console.error("❌ خطا در ثبت کارت:", response?.msg || "خطای نامشخص");
    }
  } catch (err: any) {
    if (err.response?.status === 400 && err.response?.data?.msg.includes("قبلا ثبت شده")) {
      console.warn("❌ این کارت قبلاً ثبت شده است (خطای سرور).");
      setIsModalOpen(false); // مودال بسته شود
      navigate(ROUTES.Cards_Manager);
    } else {
      console.error("🚨 خطا در ارتباط با سرور:", err);
    }
  }
};


  return (
    <HeaderLayout>
      <div className="bg-backgroundMain min-h-screen w-full">
        <div className="container-style flex flex-col gap-8 lg:gap-12">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>

          <div>
            <AddBankCardModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSaveCard}
            />

            <EmptyCards onAddCard={() => setIsModalOpen(true)} />
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default BankCardsPage;
