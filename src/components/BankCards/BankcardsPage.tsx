
import { useEffect, useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../BreadcrumbNavigation";
import EmptyCards from "./EmptyCards";
import AddBankCardModal from "./BankCardModal/AddBankCardModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { AddCardApi } from "./AddCardApi";
import { apiRequest } from "../../utils/apiClient";

const BankCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingCards = async () => {
      try {
        const response = await apiRequest<{
          status: boolean;
          data: any[];
        }>({
          url: "/account/credit-card/list",
          method: "GET",
        });

        if (response.status && Array.isArray(response.data) && response.data.length > 0) {
         navigate(ROUTES.BANK_CARDS, { replace: true });

        }
      } catch (error) {
        console.error("❌ خطا در بررسی کارت‌های موجود:", error);
      } finally {
        setIsChecking(false); 
      }
    };

    checkExistingCards();
  }, [navigate]);

  const handleSaveCard = async (cardNumber: string) => {
    const result = await AddCardApi(cardNumber);
    if (result) {
      setIsModalOpen(false);
      navigate(ROUTES.BANK_CARDS);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-backgroundMain">
        <p className="text-gray-500">در حال بررسی اطلاعات کارت...</p>
      </div>
    );
  }

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
