import React, { useEffect, useState } from "react";
//صفحه دو بخشیت
import { apiRequest } from "../../utils/apiClient"; // مسیرت رو تنظیم کن
import BankCardForm from "./BankCardModal/BankCardForm";
import BankCardList from "./BankCardList";
import BreadcrumbNavigation from "../BreadcrumbNavigation";
import HeaderLayout from "../../layouts/HeaderLayout";
import useGetUser from "../../hooks/useGetUser";
import SkeletonCard from "./SkeletonCard";
import { AddCardApi } from "./AddCardApi";

type Card = {
  id: number;
  number: string;
  holder: string;
  bankName: string;
  status: "confirm" | "pending" | "rejected";
};

function BankCardManager() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🎯 دریافت لیست کارت‌ها از API با apiRequest
  const fetchCards = async () => {
    try {
      setLoading(true);

      // ✅ درخواست با apiRequest
      const response = await apiRequest<{
        status: boolean;
        msg: string;
        data: {
          bank_name: string;
          card_number: string;
          iban: string;
          status: string;
          reason: string;
          name_family: string;
        }[];
      }>({
        url: "/api/account/credit-card/list",
        method: "GET",
      });

      if (response.status && Array.isArray(response.data)) {
        const mappedCards: Card[] = response.data.map((item, index) => ({
          id: index + 1,
          number: item.card_number,
          holder: item.name_family,
          bankName: item.bank_name,
          status:
            item.status === "confirm"
              ? "confirm"
              : item.status === "pending"
              ? "pending"
              : "rejected",
        }));

        setCards(mappedCards);
      } else {
        setError("دریافت کارت‌ها ناموفق بود");
      }
    } catch (err: any) {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // 📦 فراخوانی API هنگام mount شدن کامپوننت
  useEffect(() => {
    fetchCards();
  }, []);


const handleAddCard = async (cardNumber: string) => {
  const result = await AddCardApi(cardNumber);
  if (result) {
    // بعد از افزودن موفق، دوباره کل کارت‌ها رو از API بگیریم
    fetchCards();
  }
};

  const { data: userData } = useGetUser();
  console.log(userData);

  return (
    <HeaderLayout>
      <div dir="rtl" className="bg-backgroundMain min-h-[400px] w-full">
        <div className="container-style grid grid-col2 gap-8 lg:gap-12  ">
          <div className="mt-7 lg:mt-4">
            <BreadcrumbNavigation />
          </div>
          <div className=" flex flex-col lg:flex-row gap-4 lg:gap-12 pb-8">
            {/* 📋 فرم افزودن کارت */}
            <div className="w-full lg:w-2/5">
              <BankCardForm onSave={handleAddCard} />
            </div>

            {/* 💳 نمایش کارت‌ها */}
            <div className=" lg:w-3/5 pt-10 lg:pt-0 pr-4">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-500 animate-fade-in">{error}</p>
              ) : (
                <div className="p-4 lg:p-0">
                       <BankCardList
                  cards={cards}
                  onAddCard={() =>
                    console.log(
                      "اینجا می‌تونی مودال افزودن کارت یا فرم رو باز کنی"
                    )
                  }
                />
                </div>
           
              )}
            </div>
          </div>
        </div>
      </div>
    </HeaderLayout>
  );
}

export default BankCardManager;
