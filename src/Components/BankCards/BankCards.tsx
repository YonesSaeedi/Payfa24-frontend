import { useState, useEffect } from "react";
import EmptyState from "./EmptyCards";
import AddBankCardModal from "./AddBankCardModal";
import BankCardList from "./BankCardList";

type Card = {
  id: number;
  number: string;
};

const BankCardsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cards, setCards] = useState<Card[]>([]);

  // بارگذاری اولیه فقط یک بار
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

  // ذخیره کارت‌ها وقتی که تغییر کنن
  useEffect(() => {
    // فقط وقتی چیزی هست ذخیره کن
    if (cards.length > 0) {
      localStorage.setItem("bankCards", JSON.stringify(cards));
    }
  }, [cards]);

  const handleAddCard = (cardNumber: string) => {
    const newCard: Card = {
      id: Date.now(),
      number: cardNumber,
    };
    setCards((prev) => {
      const updated = [...prev, newCard];
      localStorage.setItem("bankCards", JSON.stringify(updated)); // اینجا مستقیم ذخیره میکنیم
      return updated;
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      {cards.length === 0 && !isModalOpen ? (
        <EmptyState onAddCard={() => setIsModalOpen(true)} />
      ) : cards.length > 0 ?<BankCardList cards={cards} onAddCard={() => setIsModalOpen(true)} /> : null}

      <AddBankCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCard}
      />
    </div>
  );
};

export default BankCardsPage;
