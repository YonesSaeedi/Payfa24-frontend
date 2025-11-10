
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { apiRequest } from "../../utils/apiClient";
import BankCardForm from "../../components/BankCards/BankCardModal/BankCardForm";
import BankCardList from "../../components/BankCards/BankCardList";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import SkeletonCard from "../../components/BankCards/SkeletonCard";
import { AddCardApi } from "../../components/BankCards/AddCardApi";
import { ROUTES } from "../../routes/routes";

type Card = { id: number; number: string; holder: string; bankName: string; status: "confirm" | "pending" | "rejected"; };

function BankCardManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 
  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ status: boolean; msg: string; data: { bank_name: string; card_number: string; iban: string; status: string; reason: string; name_family: string; }[]; }>({
        url: "/account/credit-card/list",
        method: "GET",
      });

      if (response.status && Array.isArray(response.data)) {
        const mappedCards: Card[] = response.data.map((item, index) => ({
          id: index + 1,
          number: item.card_number,
          holder: item.name_family,
          bankName: item.bank_name,
          status: item.status === "confirm" ? "confirm" : item.status === "pending" ? "pending" : "rejected",
        }));
        setCards(mappedCards);

        if (mappedCards.length === 0) {
  navigate(ROUTES.BANK_CARDS_EMPTY);
}

      } else {
        setError("دریافت کارت‌ها ناموفق بود");
      }
    } catch (err: any) {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleAddCard = async (cardNumber: string) => {
    const result = await AddCardApi(cardNumber);
    if (result) fetchCards();
  };

  return (
    <HeaderLayout>
      <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
        <div className="container-style grid grid-col2 gap-8 lg:gap-12">
          <div className="mt-7 lg:mt-4"><BreadcrumbNavigation /></div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 pb-8">
            <div className="w-full lg:w-2/5 px-4 lg:px-0">
              <BankCardForm onSave={handleAddCard} />
            </div>

            <div className="lg:w-3/5 pt-10 lg:pt-0">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500 animate-fade-in">{error}</p>
              ) : (
                <BankCardList cards={cards} onAddCard={() => console.log("افزودن کارت")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}

export default BankCardManager;
