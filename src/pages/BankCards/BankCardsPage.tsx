import { useState, useEffect } from "react";
import EmptyState from "../../Components/BankCards/EmptyCards";
import AddBankCardModal from "../../Components/BankCards/BankCardModal/AddBankCardModal";
import BankCardSection from "../../Components/BankCards/BankCardSection";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";
import HeaderLayout from "../../layouts/HeaderLayout";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

interface RegisterCardResponse {
  status: boolean;
  msg: string;
}

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirmed" | "pending" | "rejected";
};

const BankCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [showCards, setShowCards] = useState(false); // کنترل نمایش BankCardSection

  // دریافت کارت‌ها از سرور
  const fetchCards = async (): Promise<Card[]> => {
    try {
      const response = await apiRequest<{
        status: boolean;
        msg: string;
        data: {
          bank_name: string;
          card_number: string;
          name_family: string;
          status: string;
          iban: string;
        }[];
      }>({
        url: "/api/account/credit-card/list",
        method: "GET",
      });
    console.log("لیست کارت‌ها از API:", response.data);

      if (response.status) {
        const mappedCards: Card[] = response.data.map((c) => ({
          id: Date.now() + Math.random(),
          number: c.card_number,
          holder: c.name_family,
          bankName: c.bank_name,
          status:
            c.status === "active"
              ? "confirmed"
              : c.status === "pending"
              ? "pending"
              : "rejected",
        }));
        setCards(mappedCards);
        return mappedCards;
      }
      return [];
    } catch (err) {
      console.error("خطا در دریافت کارت‌ها:", err);
      return [];
    }
  };

  // افزودن کارت جدید یا بررسی کارت تکراری
 const handleAddCard = async (cardNumber: string, bankName: string) => {
  const parsedCardNumber = cardNumber.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/\D/g, "");
  if (parsedCardNumber.length !== 16) {
    toast.error("شماره کارت باید دقیقاً ۱۶ رقم باشد.");
    return;
  }

  try {
    const registerResponse = await apiRequest<RegisterCardResponse, { CardNumber: string }>({
      url: "/api/account/credit-card",
      method: "POST",
      data: { CardNumber: parsedCardNumber },
    });

    if (registerResponse.status) {
      toast.success(registerResponse.msg);
    } else if (registerResponse.msg === "این شماره کارت قبلا ثبت شده است.") {
      toast.warning(registerResponse.msg);
    } else {
      toast.error(registerResponse.msg || "ثبت کارت با مشکل مواجه شد.");
    }

    // در همه حالات مودال بسته شود و کارت‌ها fetch شوند
    setIsModalOpen(false);
    setShowCards(true);
    const currentCards = await fetchCards();
    setCards(currentCards);

  } catch (err: any) {
    toast.error(err?.response?.data?.msg || err?.response?.data?.message || "ثبت کارت با مشکل مواجه شد.");
    setIsModalOpen(false);
    setShowCards(true);
  }
};


  return (
     <HeaderLayout>
        <div className="bg-backgroundMain min-h-screen w-full">
          <div className="container-style flex flex-col gap-8 lg:gap-12">
              <div className="mt-7 lg:mt-4">
              <BreadcrumbNavigation/>
            </div>                    <div className="">
      {/* مودال اضافه کردن کارت */}
      <AddBankCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCard}
      />

      {/* نمایش EmptyState فقط وقتی مودال بسته است و هیچ کارت وجود ندارد */}
      {!isModalOpen && !showCards && cards.length === 0 ? (
        <EmptyState onAddCard={() => setIsModalOpen(true)} />
      ):(


  <BankCardSection cards={cards} setCards={setCards} />
)}

    </div>       </div></div></HeaderLayout>

  )
};

export default BankCardsPage;
