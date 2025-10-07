import { useState } from "react";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import EmptyState from "../../Components/BankCards/EmptyCards";
import AddBankCardModal from "../../Components/BankCards/BankCardModal/AddBankCardModal";
import BankCardSection from "../../Components/BankCards/BankCardSection";

const BankCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCards, setShowCards] = useState(false);

  return (
    <HeaderLayout>
      <div className="bg-backgroundMain min-h-screen w-full">
        <div className="container-style flex flex-col gap-8 lg:gap-12">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>

          <div>
            {/* مودال ابتدایی برای افزودن کارت */}
            <AddBankCardModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={() => {
                // وقتی کارت ثبت شد، حالت نمایش کارت‌ها فعال می‌شود
                setIsModalOpen(false);
                setShowCards(true);
              }}
            />

            {/* نمایش حالت خالی یا کارت‌ها بر اساس state */}
            {!showCards ? (
              <EmptyState onAddCard={() => setIsModalOpen(true)} />
            ) : (
              <BankCardSection cards={[]} setCards={() => {}} />
            )}
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
};

export default BankCardsPage;
