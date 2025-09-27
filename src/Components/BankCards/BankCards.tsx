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

  // تابع GET کارت‌ها
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
      }
    } catch (err) {
      console.error("خطا در دریافت کارت‌ها:", err);

    }
  };




  useEffect(() => {
    fetchCards();
  }, []);

  const fetchKyc = async () => {

    // const kycResponse = await apiRequest({ url: "/api/account/get-user" });
    // console.log(kycResponse);
    // const response = await apiRequest({url:'/api/kyc/basic/level2', method:'POST', data:{
    //   dateBirth:'1375/05/22',
    //   family:'tehranchi',
    //   father: 'test',
    //   name:'simin',
    //   nationalCode:'0925175171'
    // }})
    // console.log(response);
    
  };
  useEffect(() => {
    fetchKyc();
  }, []);

  const handleAddCard = async (cardNumber: string, bankName: string) => {
    // تبدیل اعداد فارسی به انگلیسی
    const parsedCardNumber = cardNumber
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/\D/g, "");

   if (parsedCardNumber.length !== 16) {
    toast.error("شماره کارت باید دقیقاً ۱۶ رقم باشد.");
    return;
  }


    try {
      const response = await apiRequest<
        RegisterCardResponse,
        { card_number: string }
      >({
        url: "/api/account/credit-card",
        method: "POST",
        data: { CardNumber: parsedCardNumber },
      });

      if (response.status) {
        const newCard: Card = {
          id: Date.now(),
          number: parsedCardNumber,
          holder: "مالک کارت",
          bankName,
          status: "pending",
        };
        setCards((prev) => [...prev, newCard]);
        setIsModalOpen(false);
        toast.success(response.msg);
      } else {
         toast.success(response.msg);
      }
    } catch (err: any) {
      console.error("خطا در ثبت کارت:", err);
      toast.error(
        err?.response?.data?.msg ||err?.response?.data?.message ||
          "ثبت کارت با مشکل مواجه شد."
      );
    }
  };

  return (
    <div className="">
      {cards.length === 0 && !isModalOpen ? (
        <EmptyState onAddCard={() => setIsModalOpen(true)} />
      ) : cards.length > 0 ? (
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
