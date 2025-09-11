import { useState, useEffect } from "react";
import EmptyState from "./EmptyCards";
import AddBankCardModal from "./AddBankCardModal";
import BankCardList from "./BankCardList";

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

  useEffect(() => {
    const savedCards = localStorage.getItem("bankCards");
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (e) {
        console.error("خطا در خواندن کارت‌ها:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bankCards", JSON.stringify(cards));
  }, [cards]);

  const handleAddCard = (cardNumber: string, bankName: string) => {
    const newCard: Card = {
      id: Date.now(),
      number: cardNumber,
      holder: "مالک کارت", // می‌تونی بعداً input اضافه کنی
      bankName: bankName,
      status: "pending", // حالت پیشفرض
    };
    setCards((prev) => [...prev, newCard]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      {cards.length === 0 && !isModalOpen ? (
        <EmptyState onAddCard={() => setIsModalOpen(true)} />
      ) : cards.length > 0 ? (
        <BankCardList cards={cards} onAddCard={() => setIsModalOpen(true)} />
      ) : null}

      <AddBankCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCard}
      />
    </div>
  );
};

export default BankCardsPage;
