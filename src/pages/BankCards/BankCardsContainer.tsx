// BankCardsContainer.tsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import  BankCardsPage  from "../../components/BankCards/BankcardsPage"; // کامپوننت نه صفحه
import  BankCardManager  from "../../components/BankCards/BankCardsManager"; // کامپوننت نه صفحه

export interface BankCard {
  bank_name: string;
  card_number: string;
  iban: string;
  status: "active" | "inactive" | string; // یا فقط "active" اگر فقط همین مقدار ممکن است
  reason: string;
  name_family: string;
}

export interface BankCardsResponse {
  status: boolean;
  msg: string;
  data: BankCard[];
}

export default function BankCardsContainer() {
  const [loading, setLoading] = useState(true);
  const [cardsExist, setCardsExist] = useState(false);

  useEffect(() => {
    const checkCards = async () => {
      try {
        const res = await apiRequest<BankCardsResponse>({
          url: "/api/account/credit-card/list",
          method: "GET",
        });

        if (res.status && Array.isArray(res.data) && res.data.length > 0) {
          setCardsExist(true);
        } else {
          setCardsExist(false);
        }
      } catch (error) {
        console.error("خطا در بررسی کارت‌ها:", error);
        setCardsExist(false);
      } finally {
        setLoading(false);
      }
    };

    checkCards();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-backgroundMain">
        <p className="text-gray-500">در حال بررسی اطلاعات کارت...</p>
      </div>
    );
  }

  return cardsExist ? <BankCardManager /> : <BankCardsPage />;
}
