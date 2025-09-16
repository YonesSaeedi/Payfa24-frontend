import BankCardList from "./BankCardList";
import BankCardForm from "./BankCardModal/BankCardForm";

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirmed" | "pending" | "rejected";
};

type BankCardSectionProps = {
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};

function BankCardSection({ cards, setCards }: BankCardSectionProps) {
  const handleAddCard = (cardNumber: string, bankName: string) => {
    const newCard: Card = {
      id: Date.now(),
      number: cardNumber,
      holder: "مالک کارت",
      bankName,
      status: "pending",
    };
    setCards((prev) => [...prev, newCard]);
  };

  return (
    <div className="flex w-full min-h-screen p-6 gap-6">
      {/* سمت چپ: لیست کارت‌ها */}
      <div className="w-1/2">
        <BankCardList
          cards={cards}
          onAddCard={() => {
            console.log("اینجا میشه مودال باز بشه یا فرم سمت راست استفاده شه");
          }}
        />
      </div>

      {/* سمت راست: فرم افزودن کارت */}
      <div className="w-1/2">
        <BankCardForm onSave={handleAddCard} />
      </div>
    </div>
  );
}

export default BankCardSection;
