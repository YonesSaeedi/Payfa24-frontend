// BankCardsContainer.tsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/apiClient";
import { BankCardsPage } from "./BankCardsPage"; // کامپوننت نه صفحه
import { BankCardManager } from "./BankCardManager"; // کامپوننت نه صفحه

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

export default function BankCardsContainer() {
  const [loading, setLoading] = useState(true);
  const [cardsExist, setCardsExist] = useState(false);

  useEffect(() => {
    const checkCards = async () => {
      try {
        const res = await apiRequest<{ status: boolean; data: any[] }>({
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

  // 🔹 تصمیم‌گیری برای رندر کردن کدام کامپوننت
  return cardsExist ? <BankCardManager /> : <BankCardsPage />;
}
