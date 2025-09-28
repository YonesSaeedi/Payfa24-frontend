// import { useState, useEffect } from "react";
// import EmptyState from "./EmptyCards";
// import AddBankCardModal from "./BankCardModal/AddBankCardModal";
// import BankCardSection from "./BankCardSection";
// import { apiRequest } from "../../utils/apiClient";
// import { toast } from "react-toastify";

// interface RegisterCardResponse {
//   status: boolean;
//   msg: string;
// }

// type Card = {
//   id: number;
//   number: string;
//   holder: string;
//   bankName: string;
//   status: "confirmed" | "pending" | "rejected";
// };

// const BankCardsPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [cards, setCards] = useState<Card[]>([]);
//   const [showCards, setShowCards] = useState(false);

//   // دریافت کارت‌ها از API
//   const fetchCards = async () => {
//     try {
//       const response = await apiRequest<{
//         status: boolean;
//         msg: string;
//         data: {
//           bank_name: string;
//           card_number: string;
//           name_family: string;
//           status: string;
//           iban: string;
//         }[];
//       }>({
//         url: "api/account/credit-card/list",
//         method: "GET",
//       });

//       if (response.status) {
//         const mappedCards: Card[] = response.data.map((c) => ({
//           id: Date.now() + Math.random(),
//           number: c.card_number,
//           holder: c.name_family,
//           bankName: c.bank_name,
//           status:
//             c.status === "active"
//               ? "confirmed"
//               : c.status === "pending"
//               ? "pending"
//               : "rejected",
//         }));
//         setCards(mappedCards);
//         return mappedCards;
//       }
//     } catch (err) {
//       console.error("خطا در دریافت کارت‌ها:", err);
//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchCards();
//   }, []);

//  const handleAddCard = async (cardNumber: string, bankName: string) => {
//   const parsedCardNumber = cardNumber
//     .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
//     .replace(/\D/g, "");

//   if (parsedCardNumber.length !== 16) {
//     toast.error("شماره کارت باید دقیقاً ۱۶ رقم باشد.");
//     return;
//   }

//   try {
//     // گرفتن آخرین کارت‌ها از API
//     const response = await apiRequest<{
//       status: boolean;
//       msg: string;
//       data: {
//         bank_name: string;
//         card_number: string;
//         name_family: string;
//         status: string;
//         iban: string;
//       }[];
//     }>({
//       url: "api/account/credit-card/list",
//       method: "GET",
//     });

//     let apiCards: Card[] = [];
//     if (response.status && response.data.length > 0) {
//       apiCards = response.data.map((c) => ({
//         id: Date.now() + Math.random(),
//         number: c.card_number,
//         holder: c.name_family,
//         bankName: c.bank_name,
//         status:
//           c.status === "active"
//             ? "confirmed"
//             : c.status === "pending"
//             ? "pending"
//             : "rejected",
//       }));
//     }

//     // بررسی تکراری بودن کارت
//     const isDuplicate = apiCards.some((c) => c.number === parsedCardNumber);
//     if (isDuplicate) {
//       toast.warning("این شماره کارت قبلاً ثبت شده است.");
//       setIsModalOpen(false); // بستن مودال
//       setShowCards(true);    // نمایش کارت‌ها
//       setCards(apiCards);    // state با کارت‌های API آپدیت میشه
//       return;
//     }

//     // ثبت کارت جدید
//     const registerResponse = await apiRequest<RegisterCardResponse, { card_number: string }>({
//       url: "/api/account/credit-card",
//       method: "POST",
//       data: { CardNumber: parsedCardNumber },
//     });

//     if (registerResponse.status) {
//       const newCard: Card = {
//         id: Date.now(),
//         number: parsedCardNumber,
//         holder: "مالک کارت",
//         bankName,
//         status: "pending",
//       };
//       setCards([...apiCards, newCard]); // کارت‌های قبلی + کارت جدید
//       setIsModalOpen(false);
//       setShowCards(true);
//       toast.success(registerResponse.msg);
//     } else {
//       toast.error(registerResponse.msg);
//     }
//   } catch (err: any) {
//     console.error(err);
//     toast.error(err?.response?.data?.msg || err?.response?.data?.message || "ثبت کارت با مشکل مواجه شد.");
//   }
// };


//   return (
//     <div className="">
//       {cards.length === 0 && !isModalOpen && !showCards ? (
//         <EmptyState onAddCard={() => setIsModalOpen(true)} />
//       ) : cards.length > 0 || showCards ? (
//         <BankCardSection cards={cards} setCards={setCards} />
//       ) : null}

//       <AddBankCardModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleAddCard}
//       />
//     </div>
//   );
// };

// export default BankCardsPage;
// BankCardsPage.tsx
import { useState, useEffect } from "react";
import EmptyState from "./EmptyCards";
import AddBankCardModal from "./BankCardModal/AddBankCardModal";
import BankCardSection from "./BankCardSection";
import { apiRequest } from "../../utils/apiClient";
import { toast } from "react-toastify";

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
  const [showCards, setShowCards] = useState(false);

  // دریافت کارت‌ها از API
  const fetchCards = async () => {
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
        url: "api/account/credit-card/list",
        method: "GET",
      });

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
    } catch (err) {
      console.error("خطا در دریافت کارت‌ها:", err);
      return [];
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // BankCardsPage.tsx
const handleAddCard = async (cardNumber: string, bankName: string) => {
  const parsedCardNumber = cardNumber
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/\D/g, "");

  if (parsedCardNumber.length !== 16) {
    toast.error("شماره کارت باید دقیقاً ۱۶ رقم باشد.");
    return;
  }

  try {
    const registerResponse = await apiRequest<RegisterCardResponse, { card_number: string }>({
      url: "/api/account/credit-card",
      method: "POST",
      data: { CardNumber: parsedCardNumber },
    });

    if (registerResponse.status) {
      const newCard: Card = {
        id: Date.now(),
        number: parsedCardNumber,
        holder: "مالک کارت",
        bankName,
        status: "pending",
      };
      setCards((prev) => [...prev, newCard]);
      setIsModalOpen(false);
      setShowCards(true);
      toast.success(registerResponse.msg);
    }
  } catch (err: any) {
  const msg = err?.response?.data?.msg || err?.response?.data?.message || "";
  
  // کارت تکراری
  if (msg.includes("تکراری") || err.response?.status === 400) {
    toast.warning("این شماره کارت قبلاً ثبت شده است.");

    // گرفتن کارت‌ها از API
    const response = await fetchCards();
    if (response) {
      // کارت جدید وارد شده را هم اضافه کن
      const newCard: Card = {
        id: Date.now(),
        number: parsedCardNumber,
        holder: "مالک کارت",
        bankName,
        status: "pending", // یا هر وضعیتی که دوست داری
      };
      setCards([...response, newCard]);
    }

    // نمایش BankCardSection
    setIsModalOpen(false);
    setShowCards(true);
  } else {
    toast.error(msg || "ثبت کارت با مشکل مواجه شد.");
  }
}

};



  return (
   <div className="">
    {cards.length === 0 && !isModalOpen && !showCards ? (
      <EmptyState onAddCard={() => setIsModalOpen(true)} />
    ) : cards.length > 0 || showCards ? (
      <BankCardSection cards={cards} setCards={setCards} />
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
