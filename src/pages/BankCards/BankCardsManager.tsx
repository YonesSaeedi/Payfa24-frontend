
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import BankCardForm from "../../components/BankCards/BankCardModal/BankCardForm";
import SkeletonCard from "../../components/BankCards/SkeletonCard";
import EmptyCards from "../../components/BankCards/EmptyCards";
import BankCardList from "../../components/BankCards/BankCardList";
import AddBankCardModal from "../../components/BankCards/BankCardModal/AddBankCardModal";
import { AddCardApi } from "../../components/BankCards/AddCardApi";

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

function BankCardManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ status: boolean; data: any[] }>({
        url: "/account/credit-card/list",
        method: "GET",
      });

      if (response.status && Array.isArray(response.data)) {
        setCards(
          response.data.map((item, index) => ({
            id: index + 1,
            number: item.card_number,
            holder: item.name_family,
            bankName: item.bank_name,
            status: item.status === "confirm" ? "confirm" : "pending",
          }))
        );
      }
    } catch {
      setError("خطا در دریافت کارت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async (cardNumber: string) => {
    const result = await AddCardApi(cardNumber);
    if (result) {
      setIsModalOpen(false);
      await fetchCards();
    }
  };

  return (
    <HeaderLayout>
     <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
         <div className="container-style grid grid-col2 gap-8 lg:gap-12">
           <div className="mt-7 lg:mt-4">
             <BreadcrumbNavigation />
          </div>
<div className="flex flex-col lg:flex-row  gap-8 lg:gap-[62x] pb-8">

  <div className="w-full lg:w-2/5 px-4 lg:px-0">
    <BankCardForm onSave={handleAddCard} />
  </div>


  <div className="lg:w-3/5 ">
    {loading ? (
  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : cards.length === 0 ? (

      <EmptyCards onAddCard={() => setIsModalOpen(true)} />
    ) : (
 
      <BankCardList cards={cards} onAddCard={() => setIsModalOpen(true)} />
    )}
  </div>
</div>

          <AddBankCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddCard}
          />
        </div>
      </div>
    </HeaderLayout>
  );
}


export default BankCardManager;
