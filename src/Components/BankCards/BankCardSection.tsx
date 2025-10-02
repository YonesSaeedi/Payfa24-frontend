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
    <div className="lg:flex lg:flex-row-reverse w-full min-h-screen justify-between  gap-6">
      
      <div className="">
        <BankCardForm onSave={handleAddCard} />
      </div>

      <div className="w-full lg:w-1/2 pt-10 lg:pt-0">
        <BankCardList
          cards={cards}
          onAddCard={() => {
            console.log("اینجا میشه مودال باز بشه یا فرم سمت راست استفاده شه");
          }}
        />
      </div>
    </div>
  );
}

export default BankCardSection;


